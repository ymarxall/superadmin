// superadmin/src/app/(dashboard)/superadmin/penduduk/page.js
'use client';

import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { API_ENDPOINTS, getHeaders } from '@/config/api';
import Cookies from 'js-cookie';

export default function Penduduk() {
  const [penduduk, setPenduduk] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ nik: '', nama: '', tempat_lahir: '', tanggal_lahir: '', jenis_kelamin: '', alamat: '' });

  useEffect(() => {
    const fetchPenduduk = async () => {
      const token = Cookies.get('authToken');
      const res = await fetch(API_ENDPOINTS.PENDUDUK_GET_ALL, { headers: getHeaders(token) });
      const data = await res.json();
      setPenduduk(data);
    };
    fetchPenduduk();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setFormData({ nik: '', nama: '', tempat_lahir: '', tanggal_lahir: '', jenis_kelamin: '', alamat: '' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const token = Cookies.get('authToken');
    const res = await fetch(API_ENDPOINTS.PENDUDUK_ADD, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(formData),
    });
    if (res.ok) {
      const newPenduduk = await res.json();
      setPenduduk([...penduduk, newPenduduk]);
      handleClose();
    }
  };

  return (
    <div>
      <Button variant="contained" onClick={handleOpen} sx={{ mb: 3 }}>Tambah Penduduk</Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>NIK</TableCell>
              <TableCell>Nama</TableCell>
              <TableCell>Alamat</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {penduduk.map((p) => (
              <TableRow key={p.id}>
                <TableCell>{p.nik}</TableCell>
                <TableCell>{p.nama}</TableCell>
                <TableCell>{p.alamat}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Tambah Penduduk</DialogTitle>
        <DialogContent>
          <TextField margin="dense" label="NIK" name="nik" value={formData.nik} onChange={handleChange} fullWidth />
          <TextField margin="dense" label="Nama" name="nama" value={formData.nama} onChange={handleChange} fullWidth />
          <TextField margin="dense" label="Tempat Lahir" name="tempat_lahir" value={formData.tempat_lahir} onChange={handleChange} fullWidth />
          <TextField margin="dense" label="Tanggal Lahir" name="tanggal_lahir" type="date" value={formData.tanggal_lahir} onChange={handleChange} fullWidth InputLabelProps={{ shrink: true }} />
          <TextField
            margin="dense"
            label="Jenis Kelamin"
            name="jenis_kelamin"
            select
            value={formData.jenis_kelamin}
            onChange={handleChange}
            fullWidth
            SelectProps={{ native: true }}
          >
            <option value="">Pilih</option>
            <option value="L">Laki-laki</option>
            <option value="P">Perempuan</option>
          </TextField>
          <TextField margin="dense" label="Alamat" name="alamat" value={formData.alamat} onChange={handleChange} fullWidth multiline rows={3} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Batal</Button>
          <Button onClick={handleSubmit} variant="contained">Simpan</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}