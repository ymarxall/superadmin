// superadmin/src/app/(dashboard)/superadmin/users/page.js
'use client';

import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { API_ENDPOINTS, getHeaders } from '@/config/api';
import Cookies from 'js-cookie';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ nik: '', name: '', password: '', role: 'bendahara' });

  useEffect(() => {
    const fetchUsers = async () => {
      const token = Cookies.get('authToken');
      const res = await fetch(API_ENDPOINTS.ADMIN, { headers: getHeaders(token) });
      const data = await res.json();
      setUsers(data);
    };
    fetchUsers();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setFormData({ nik: '', name: '', password: '', role: 'bendahara' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const token = Cookies.get('authToken');
    const res = await fetch(API_ENDPOINTS.ADMIN_REGISTER, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(formData),
    });
    if (res.ok) {
      const newUser = await res.json();
      setUsers([...users, newUser]);
      handleClose();
    }
  };

  return (
    <div>
      <Button variant="contained" onClick={handleOpen} sx={{ mb: 3 }}>Tambah Pengguna</Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>NIK</TableCell>
              <TableCell>Nama</TableCell>
              <TableCell>Role</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.nik}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.role}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Tambah Pengguna</DialogTitle>
        <DialogContent>
          <TextField margin="dense" label="NIK" name="nik" value={formData.nik} onChange={handleChange} fullWidth />
          <TextField margin="dense" label="Nama" name="name" value={formData.name} onChange={handleChange} fullWidth />
          <TextField margin="dense" label="Password" name="password" type="password" value={formData.password} onChange={handleChange} fullWidth />
          <TextField
            margin="dense"
            label="Role"
            name="role"
            select
            value={formData.role}
            onChange={handleChange}
            fullWidth
            SelectProps={{ native: true }}
          >
            <option value="superadmin">Superadmin</option>
            <option value="sekretaris">Sekretaris</option>
            <option value="bendahara">Bendahara</option>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Batal</Button>
          <Button onClick={handleSubmit} variant="contained">Simpan</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}