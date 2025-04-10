package controller

import (
	"net/http"

	"github.com/julienschmidt/httprouter"
)

type UserController interface {
	CreateUser(writer http.ResponseWriter, request *http.Request, params httprouter.Params)
	LoginUser(writer http.ResponseWriter, request *http.Request, params httprouter.Params)
	GetUserInfo(writer http.ResponseWriter, request *http.Request, params httprouter.Params)
	ForgotPassword(writer http.ResponseWriter, request *http.Request, params httprouter.Params)
	ResetPassword(writer http.ResponseWriter, request *http.Request, params httprouter.Params)
}
