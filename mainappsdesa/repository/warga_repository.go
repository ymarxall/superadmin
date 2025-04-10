package repository

import "godesaapps/model"

type WargaRepository interface {
	InsertWarga(warga model.Warga) error
}