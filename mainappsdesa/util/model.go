package util

import (
	"godesaapps/dto"
	"godesaapps/model"
)

func ToUserResponse(user model.User) dto.UserResponse {
	return dto.UserResponse{
		Id:        user.Id,
		Nikadmin:  user.Nikadmin,
		Email:     user.Email,
	}
}

func ToUserListResponse(users []model.User) []dto.UserResponse {
    var userResponses []dto.UserResponse
    for _, user := range users {
        userResponses = append(userResponses, dto.UserResponse{
            Id:       user.Id,
            Nikadmin: user.Nikadmin,
            Email:    user.Email,
        })
    }
    return userResponses
}

func ToUserModel(request dto.CreateUserRequest) model.User {
	return model.User{
		Nikadmin: request.Nikadmin,
		Email:    request.Email,
		Password: request.Pass,
		NamaLengkap: request.NamaLengkap,
	}
}
