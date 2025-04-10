package model

import "time"

type User struct {
	Id       	string
	Email    	string
	Nikadmin 	string
	Password 	string
	NamaLengkap string
	Role_id		string
	ResetToken  string
	ResetExpiry int64  
}

type Warga struct {
	ID              int       `json:"id"`
	NIK             string    `json:"nik"`
	NamaLengkap     string    `json:"nama_lengkap"`
	Alamat          string    `json:"alamat"`
	JenisSurat      string    `json:"jenis_surat"`
	Keterangan      string    `json:"keterangan"`
	FileUpload      string    `json:"file_upload"`
	NoHP            string    `json:"no_hp"`
	CreatedAt       time.Time `json:"created_at"`
	UpdatedAt       time.Time `json:"updated_at"`
}

