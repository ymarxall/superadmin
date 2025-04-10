package service

import (
	"errors"
	"godesaapps/model"
	"godesaapps/repository"
)

type wargaServiceImpl struct {
	repo repository.WargaRepository
}

func NewWargaService(repo repository.WargaRepository) WargaService {
	return &wargaServiceImpl{repo: repo}
}

func (s *wargaServiceImpl) RegisterWarga(warga model.Warga) error {
	if warga.NIK == "" || warga.NamaLengkap == "" || warga.Alamat == "" || warga.JenisSurat == "" || warga.NoHP == "" {
		return errors.New("semua field wajib diisi")
	}
	return s.repo.InsertWarga(warga)
}