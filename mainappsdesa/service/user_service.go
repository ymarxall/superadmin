package service

import (
	"context"
	"godesaapps/dto"
)

type UserService interface {
	CreateUser(ctx context.Context, userRequest dto.CreateUserRequest) dto.UserResponse
	LoginUser(ctx context.Context, loginRequest dto.LoginUserRequest) (string, error)
	GenerateJWT(email string, nikadmin string) (string, error)
	GetUserInfoByNikAdmin(ctx context.Context, email string) (dto.UserResponse, error)
	ForgotPassword(request dto.ForgotPasswordRequest) error
	ResetPassword(request dto.ResetPasswordRequest) error
	FindByNIK(ctx context.Context, nik string) (*dto.UserResponse, error)
}
