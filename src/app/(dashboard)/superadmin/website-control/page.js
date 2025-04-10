// superadmin/src/app/(dashboard)/superadmin/website-control/page.js
'use client';

import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { API_ENDPOINTS, getHeaders } from '@/config/api';
import Cookies from 'js-cookie';

export default function WebsiteControl() {
  const [settings, setSettings] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ key_name: '', value: '', type: 'text', description: '' });

  useEffect(() => {
    const fetchSettings = async () => {
      const token = Cookies.get('authToken');
      const res = await fetch(API_ENDPOINTS.SETTINGS, { headers: getHeaders(token) });
      const data = await res.json();
      setSettings(data);
    };
    fetchSettings();
  }, []);

  const handleOpen = (setting = null) => {
    setOpen(true);
    setFormData(setting || { key_name: '', value: '', type: 'text', description: '' });
  };

  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const token = Cookies.get('authToken');
    const url = formData.id ? `${API_ENDPOINTS.SETTINGS}/${formData.id}` : API_ENDPOINTS.SETTINGS;
    const method = formData.id ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: getHeaders(token),
      body: JSON.stringify(formData),
    });
    if (res.ok) {
      const updatedSetting = await res.json();
      setSettings((prev) =>
        formData.id ? prev.map((s) => (s.id === updatedSetting.id ? updatedSetting : s)) : [...prev, updatedSetting]
      );
      handleClose();
    }
  };

  return (
    <div>
      <Button variant="contained" onClick={() => handleOpen()} sx={{ mb: 3 }}>Tambah Pengaturan</Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nama Kunci</TableCell>
              <TableCell>Nilai</TableCell>
              <TableCell>Tipe</TableCell>
              <TableCell>Aksi</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {settings.map((setting) => (
              <TableRow key={setting.id}>
                <TableCell>{setting.key_name}</TableCell>
                <TableCell>{setting.value}</TableCell>
                <TableCell>{setting.type}</TableCell>
                <TableCell>
                  <Button variant="contained" color="warning" onClick={() => handleOpen(setting)}>Edit</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{formData.id ? 'Edit Pengaturan' : 'Tambah Pengaturan'}</DialogTitle>
        <DialogContent>
          <TextField margin="dense" label="Nama Kunci" name="key_name" value={formData.key_name} onChange={handleChange} fullWidth disabled={!!formData.id} />
          <TextField margin="dense" label="Nilai" name="value" value={formData.value} onChange={handleChange} fullWidth />
          <TextField
            margin="dense"
            label="Tipe"
            name="type"
            select
            value={formData.type}
            onChange={handleChange}
            fullWidth
            SelectProps={{ native: true }}
          >
            <option value="text">Teks</option>
            <option value="image">Gambar</option>
            <option value="html">HTML</option>
          </TextField>
          <TextField margin="dense" label="Deskripsi" name="description" value={formData.description} onChange={handleChange} fullWidth />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Batal</Button>
          <Button onClick={handleSubmit} variant="contained">Simpan</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}