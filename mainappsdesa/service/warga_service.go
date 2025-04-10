package service

import "godesaapps/model"


type WargaService interface {
	RegisterWarga(warga model.Warga) error
}