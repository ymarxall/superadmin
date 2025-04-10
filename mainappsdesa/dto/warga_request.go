package dto

type WargaRequest struct {
	NIK         string `json:"nik"`
	NamaLengkap string `json:"nama_lengkap"`
	Alamat      string `json:"alamat"`
	JenisSurat  string `json:"jenis_surat"`
	Keterangan  string `json:"keterangan"`
	FileUpload  string `json:"file_upload"`
	NoHP        string `json:"no_hp"`
}