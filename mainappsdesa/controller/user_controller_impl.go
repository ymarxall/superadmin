package controller

import (
	"encoding/json"
	// "fmt"
	"godesaapps/dto"
	"godesaapps/service"
	"godesaapps/util"
	"net/http"

	"github.com/dgrijalva/jwt-go"
	"github.com/julienschmidt/httprouter"
)

type userControllerImpl struct {
	UserService service.UserService
}

func NewUserControllerImpl(userService service.UserService) UserController {
	return &userControllerImpl{
		UserService: userService,
	}
}

func (controller *userControllerImpl) CreateUser(writer http.ResponseWriter, request *http.Request, _ httprouter.Params) {
	requestCreate := dto.CreateUserRequest{}
	util.ReadFromRequestBody(request, &requestCreate)

	// Ceknik yang samaaa
	existingUser, err := controller.UserService.FindByNIK(request.Context(), requestCreate.Nikadmin)
	if err == nil && existingUser != nil {
		response := dto.ResponseList{
			Code:    http.StatusBadRequest,
			Status:  "Bad Request",
			Message: "NIK sudah terdaftar",
		}

		writer.Header().Set("Content-Type", "application/json")
		writer.WriteHeader(http.StatusBadRequest)
		util.WriteToResponseBody(writer, response)
		return
	}

	responseDTO := controller.UserService.CreateUser(request.Context(), requestCreate)
	response := dto.ResponseList{
		Code:    http.StatusOK,
		Status:  "OK",
		Data:    responseDTO,
		Message: "User berhasil dibuat",
	}

	writer.Header().Set("Content-Type", "application/json")
	util.WriteToResponseBody(writer, response)
}


func (controller *userControllerImpl) LoginUser(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
    var loginRequest dto.LoginUserRequest

    err := json.NewDecoder(r.Body).Decode(&loginRequest)
    if err != nil {
        response := dto.ResponseList{
            Code:    http.StatusBadRequest,
            Status:  "FAILED",
            Message: "Invalid input",
        }
        w.Header().Set("Content-Type", "application/json")
        w.WriteHeader(http.StatusBadRequest)
        util.WriteToResponseBody(w, response)
        return
    }

    token, err := controller.UserService.LoginUser(r.Context(), loginRequest)
    if err != nil {
        response := dto.ResponseList{
            Code:    http.StatusUnauthorized,
            Status:  "FAILED",
            Message: err.Error(),
        }
        w.Header().Set("Content-Type", "application/json")
        w.WriteHeader(http.StatusUnauthorized)
        util.WriteToResponseBody(w, response)
        return
    }

    response := dto.ResponseList{
        Code:    http.StatusOK,
        Status:  "OK",
        Data:    token,
        Message: "Token generated successfully",
    }

    w.Header().Set("Content-Type", "application/json")
    util.WriteToResponseBody(w, response)
}

func (controller *userControllerImpl) GetUserInfo(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	authHeader := r.Header.Get("Authorization")
    // log.Println("Authorization Header:", authHeader)
	if authHeader == "" || len(authHeader) < 8 {
		http.Error(w, "Missing or Invalid Authorization Header", http.StatusUnauthorized)
		return
	}

	tokenString := authHeader[7:]
	claims := &service.Claims{}

	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		return []byte("secret_key"), nil
	})
	if err != nil || !token.Valid {
		http.Error(w, "Invalid or Expired Token", http.StatusUnauthorized)
		return
	}

	if claims.Nikadmin == "" {
		http.Error(w, "Invalid token claims", http.StatusUnauthorized)
		return
	}

	userResponse, err := controller.UserService.GetUserInfoByNikAdmin(r.Context(), claims.Nikadmin)
	if err != nil {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}

	response := dto.ResponseList{
		Code:    http.StatusOK,
		Status:  "OK",
		Data: dto.UserResponse{ 
			Nikadmin:    userResponse.Nikadmin,
			Email:       userResponse.Email,
			NamaLengkap: userResponse.NamaLengkap,
			Role_id:     userResponse.Role_id,
		},
		Message: "Success fetching user information",
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	util.WriteToResponseBody(w, response)
}


func (controller *userControllerImpl) ForgotPassword(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
    var req dto.ForgotPasswordRequest
    if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
        response := dto.ResponseList{
            Code:    http.StatusBadRequest,
            Status:  "Bad Request",
            Message: "Invalid request body",
        }
        w.Header().Set("Content-Type", "application/json")
        util.WriteToResponseBody(w, response)
        return
    }

    err := controller.UserService.ForgotPassword(req)
    if err != nil {
        response := dto.ResponseList{
            Code:    http.StatusBadRequest, 
            Status:  "Bad Request",
            Message: err.Error(),
        }
        w.Header().Set("Content-Type", "application/json")
        util.WriteToResponseBody(w, response)
        return
    }

    response := dto.ResponseList{
        Code:    http.StatusOK,
        Status:  "OK",
        Message: "Reset link dikirim ke email",
        Data:    nil,
    }
    w.Header().Set("Content-Type", "application/json")
    util.WriteToResponseBody(w, response)
}

func (controller *userControllerImpl) ResetPassword(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
    queryParams := r.URL.Query()
    token := queryParams.Get("token")

    if token == "" {
        response := map[string]interface{}{
            "code":    http.StatusBadRequest,
            "status":  "error",
            "message": "Token tidak ditemukan",
        }
        w.Header().Set("Content-Type", "application/json")
        w.WriteHeader(http.StatusBadRequest)
        json.NewEncoder(w).Encode(response)
        return
    }

    var req dto.ResetPasswordRequest
    if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
        response := map[string]interface{}{
            "code":    http.StatusBadRequest,
            "status":  "error",
            "message": "Request tidak valid",
        }
        w.Header().Set("Content-Type", "application/json")
        w.WriteHeader(http.StatusBadRequest)
        json.NewEncoder(w).Encode(response)
        return
    }

    req.Token = token
    err := controller.UserService.ResetPassword(req)
    if err != nil {
        response := map[string]interface{}{
            "code":    http.StatusBadRequest,
            "status":  "error",
            "message": err.Error(),
        }
        w.Header().Set("Content-Type", "application/json")
        w.WriteHeader(http.StatusBadRequest)
        json.NewEncoder(w).Encode(response)
        return
    }

    response := map[string]interface{}{
        "code":    http.StatusOK,
        "status":  "ok",
        "message": "Password berhasil direset",
    }

    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusOK)
    json.NewEncoder(w).Encode(response)
}