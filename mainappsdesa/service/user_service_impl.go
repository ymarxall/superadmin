package service

import (
	"context"
	"crypto/rand"
	"database/sql"
	"encoding/base64"
	"errors"
	"fmt"
	"godesaapps/dto"
	"godesaapps/model"
	"godesaapps/repository"
	"godesaapps/util"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

var jwtKey = []byte("secret_key")

type userServiceImpl struct {
	UserRepository repository.UserRepository
	DB             *sql.DB
}

func NewUserServiceImpl(userRepository repository.UserRepository, db *sql.DB) UserService {
	return &userServiceImpl{
		UserRepository: userRepository,
		DB:             db,
	}
}

// Fungsi untuk mengonversi role_id menjadi nama jabatan
func convertRoleID(roleID string) string {
	switch roleID {
	case "ROLE001":
		return "sekretaris"
	case "ROLE002":
		return "bendahara"
	default:
		return "tidak diketahui" // Fallback jika role_id tidak dikenali
	}
}

func (service *userServiceImpl) GetUserInfoByNikAdmin(ctx context.Context, nikadmin string) (dto.UserResponse, error) {
	tx, err := service.DB.BeginTx(ctx, nil)
	if err != nil {
		return dto.UserResponse{}, err
	}
	defer tx.Rollback()

	user, err := service.UserRepository.FindByNik(ctx, tx, nikadmin)
	if err != nil {
		return dto.UserResponse{}, err
	}

	if err := tx.Commit(); err != nil {
		return dto.UserResponse{}, err
	}

	// Konversi role_id menjadi nama jabatan
	roleName := convertRoleID(user.Role_id)

	return dto.UserResponse{
		Id:          user.Id,
		Email:       user.Email,
		Nikadmin:    user.Nikadmin,
		NamaLengkap: user.NamaLengkap,
		Role_id:     roleName, // Mengembalikan nama jabatan, bukan kode
	}, nil
}

func hashPassword(password string) (string, error) {
	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	return string(hash), nil
}

func verifyPassword(storedHash, password string) bool {
	return bcrypt.CompareHashAndPassword([]byte(storedHash), []byte(password)) == nil
}

func (service *userServiceImpl) CreateUser(ctx context.Context, userRequest dto.CreateUserRequest) dto.UserResponse {
	tx, err := service.DB.Begin()
	util.SentPanicIfError(err)
	defer util.CommitOrRollBack(tx)

	hashedPass, err := hashPassword(userRequest.Pass)
	util.SentPanicIfError(err)

	user := model.User{
		Id:          uuid.New().String(),
		Email:       userRequest.Email,
		Nikadmin:    userRequest.Nikadmin,
		Password:    hashedPass,
		NamaLengkap: userRequest.NamaLengkap,
		Role_id:     userRequest.Role_id,
	}

	createUser, errSave := service.UserRepository.CreateUser(ctx, tx, user)
	util.SentPanicIfError(errSave)

	return convertToResponseDTO(createUser)
}

func convertToResponseDTO(user model.User) dto.UserResponse {
	return dto.UserResponse{
		Id:       user.Id,
		Email:    user.Email,
		Nikadmin: user.Nikadmin,
		Pass:     user.Password,
	}
}


type Claims struct {
	Email    string `json:"email"`
	Nikadmin string `json:"nikadmin"` 
	jwt.StandardClaims
}

func (service *userServiceImpl) GenerateJWT(email, nikadmin string) (string, error) {
	expirationTime := time.Now().Add(5 * time.Minute)

	claims := &Claims{
		Email: email,
		Nikadmin: nikadmin,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: expirationTime.Unix(),
			Issuer:    "go-auth-example",
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	return token.SignedString(jwtKey)
}

func (service *userServiceImpl) LoginUser(ctx context.Context, loginRequest dto.LoginUserRequest) (string, error) {
	tx, err := service.DB.Begin()
	if err != nil {
		return "", fmt.Errorf("failed to start transaction: %v", err)
	}
	defer util.CommitOrRollBack(tx)

	user, err := service.UserRepository.FindByNik(ctx, tx, loginRequest.Nikadmin)
	if err != nil {
		return "", fmt.Errorf("invalid nikadmin")
	}

	if !verifyPassword(user.Password, loginRequest.Pass) {
		return "", fmt.Errorf("invalid password")
	}

	token, err := service.GenerateJWT(user.Email, user.Nikadmin)
	if err != nil {
		return "", fmt.Errorf("failed to generate token: %v", err)
	}

	return token, nil
}

func (service *userServiceImpl) FindByNIK(ctx context.Context, nik string) (*dto.UserResponse, error) {
    tx, err := service.DB.Begin()
    if err != nil {
        return nil, err
    }
    defer tx.Rollback()

    user, err := service.UserRepository.FindByNik(ctx, tx, nik)
    if err != nil {
        return nil, err
    }

    response := dto.UserResponse{
        Id:				user.Id,
        Nikadmin:		user.Nikadmin,
        Email:			user.Email,
        Pass:			user.Password,
    }
    
    tx.Commit()
    return &response, nil
}


func (service *userServiceImpl) ForgotPassword(request dto.ForgotPasswordRequest) error {
    user, err := service.UserRepository.FindByEmail(request.Email)
	if err != nil {
        return errors.New("email tidak ditemukan")
    }

    token := generateToken(32)
    expiry := time.Now().Add(15 * time.Minute)

    err = service.UserRepository.UpdateResetToken(user.Email, token, expiry)
    if err != nil {
        return fmt.Errorf("gagal menyimpan token reset: %w", err)
    }

	resetURL := fmt.Sprintf("http://localhost:3000/authentication/forget-password/reset?token=%s", token)
	
    emailBody := fmt.Sprintf(`
        <html>
        <body>
            <p>Halo <strong>%s</strong>,</p>
            <p>Klik tombol di bawah ini untuk mengatur ulang password Anda:</p>
            <a href="%s">Reset Password</a>
            <p>Link ini akan kedaluwarsa dalam 15 menit.</p>
        </body>
        </html>
    `, user.Email, resetURL)

    return util.SendEmail(user.Email, "Reset Password", emailBody)
}

func (service *userServiceImpl) ResetPassword(request dto.ResetPasswordRequest) error {
    if request.Token == "" {
        return errors.New("token tidak ditemukan")
    }

    user, err := service.UserRepository.FindByResetToken(request.Token)
    if err != nil {
        return errors.New("token tidak valid atau sudah kadaluarsa")
    }

    hashedPass, err := hashPassword(request.Password)
    if err != nil {
        return errors.New("gagal mengenkripsi password")
    }

    err = service.UserRepository.UpdatePassword(user.Email, hashedPass)
    if err != nil {
        return errors.New("gagal mengubah password")
    }

    return nil
}

func generateToken(length int) string {
	bytes := make([]byte, length)
	rand.Read(bytes)
	return base64.URLEncoding.EncodeToString(bytes)
}