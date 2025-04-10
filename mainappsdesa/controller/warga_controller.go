package controller

import (
	"net/http"

	"github.com/julienschmidt/httprouter"
)


type WargaController interface {
	RegisterWarga(writer http.ResponseWriter, request *http.Request, params httprouter.Params)
}
