package controller

import (
	"fmt"
	"godesaapps/dto"
	"godesaapps/model"
	"godesaapps/service"
	"godesaapps/util"
	"io"
	"net/http"
	"os"
	"github.com/julienschmidt/httprouter"
)

type wargaControllerImpl struct {
	WargaService service.WargaService
}

func NewWargaController(wargaService service.WargaService) WargaController {
	return &wargaControllerImpl{
		WargaService: wargaService,
	}
}

func (controller *wargaControllerImpl) RegisterWarga(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	err := r.ParseMultipartForm(10 << 20)
	if err != nil {
		http.Error(w, "Gagal membaca form data", http.StatusBadRequest)
		return
	}

	// data warga body
	var wargaRequest dto.WargaRequest
	wargaRequest.NIK = r.FormValue("nik")
	wargaRequest.NamaLengkap = r.FormValue("nama_lengkap")
	wargaRequest.Alamat = r.FormValue("alamat")
	wargaRequest.JenisSurat = r.FormValue("jenis_surat")
	wargaRequest.Keterangan = r.FormValue("keterangan")
	wargaRequest.NoHP = r.FormValue("no_hp")

	// ambl file
	file, handler, err := r.FormFile("file_upload")
	if err != nil {
		http.Error(w, "File tidak ditemukan atau salah", http.StatusBadRequest)
		return
	}
	defer file.Close()

	// smpn file
	filePath := fmt.Sprintf("filewarga/%s", handler.Filename)
	dst, err := os.Create(filePath)
	if err != nil {
		http.Error(w, "Gagal menyimpan file", http.StatusInternalServerError)
		return
	}
	defer dst.Close()

	if _, err := io.Copy(dst, file); err != nil {
		http.Error(w, "Gagal menyimpan file", http.StatusInternalServerError)
		return
	}

	wargaRequest.FileUpload = filePath

	wargaModel := model.Warga{
		NIK:         wargaRequest.NIK,
		NamaLengkap: wargaRequest.NamaLengkap,
		Alamat:      wargaRequest.Alamat,
		JenisSurat:  wargaRequest.JenisSurat,
		Keterangan:  wargaRequest.Keterangan,
		FileUpload:  wargaRequest.FileUpload,
		NoHP:        wargaRequest.NoHP,
	}

	// Simpan data
	err = controller.WargaService.RegisterWarga(wargaModel)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Responseeee wargaaa
	response := dto.ResponseList{
		Code:    http.StatusOK,
		Status:  "OK",
		Message: "Warga berhasil didaftarkan dan file berhasil diunggah",
	}

	w.Header().Set("Content-Type", "application/json")
	util.WriteToResponseBody(w, response)
}
