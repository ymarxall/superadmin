package repository

import (
	"database/sql"
	"godesaapps/model"
)

type wargaRepositoryImpl struct {
	db *sql.DB
}

func NewWargaRepository(db *sql.DB) WargaRepository {
	return &wargaRepositoryImpl{db: db}
}

func (r *wargaRepositoryImpl) InsertWarga(warga model.Warga) error {
	query := `INSERT INTO warga (nik, nama_lengkap, alamat, jenis_surat, keterangan, file_upload, no_hp, created_at, updated_at) 
			  VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`
	_, err := r.db.Exec(query, warga.NIK, warga.NamaLengkap, warga.Alamat, warga.JenisSurat, warga.Keterangan, warga.FileUpload, warga.NoHP)
	return err
}
