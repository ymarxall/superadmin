// superadmin/src/app/(dashboard)/pemasukan/page.js
'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { API_ENDPOINTS, getHeaders } from '@/config/api';
import Cookies from 'js-cookie';

export default function Pemasukan() {
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState([]); // Menyimpan daftar pengguna
  const [formData, setFormData] = useState({
    nik: '',
    email: '',
    name: '',
    password: '',
    role: 'bendahara',
  });

  // Ambil daftar pengguna saat halaman dimuat
  useEffect(() => {
    const fetchUsers = async () => {
      const token = Cookies.get('authToken');
      if (!token) return;

      try {
        const res = await fetch(API_ENDPOINTS.ADMIN, {
          headers: getHeaders(token),
        });
        if (res.ok) {
          const data = await res.json();
          setUsers(data);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setFormData({ nik: '', email: '', name: '', password: '', role: 'bendahara' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const token = Cookies.get('authToken');
    if (!token) {
      alert('Silakan login terlebih dahulu');
      return;
    }

    try {
      const res = await fetch(API_ENDPOINTS.ADMIN_REGISTER, {
        method: 'POST',
        headers: getHeaders(token),
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const newUser = await res.json();
        // Tambahkan pengguna baru ke daftar tanpa refresh
        setUsers((prevUsers) => [...prevUsers, newUser]);
        alert('Pengguna berhasil ditambahkan!');
        handleClose();
      } else {
        const errorData = await res.json();
        alert(errorData.message || 'Gagal menambah pengguna');
      }
    } catch (error) {
      console.error('Error menambah pengguna:', error);
      alert('Terjadi kesalahan saat menambah pengguna');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Manajemen Pengguna
      </Typography>
      <Button variant="contained" onClick={handleOpen} sx={{ mb: 3 }}>
        Tambah Pengguna Baru
      </Button>

      {/* Tabel untuk menampilkan daftar pengguna */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>NIK</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Nama Lengkap</TableCell>
              <TableCell>Role</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.nik}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.role}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog untuk form tambah pengguna */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Tambah Pengguna Baru</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="NIK"
            name="nik"
            value={formData.nik}
            onChange={handleChange}
            fullWidth
            required
            inputProps={{ maxLength: 16 }}
            helperText="Masukkan 16 digit NIK"
          />
          <TextField
            margin="dense"
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            required
            helperText="Masukkan alamat email yang valid"
          />
          <TextField
            margin="dense"
            label="Nama Lengkap"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            required
            helperText="Masukkan nama lengkap pengguna"
          />
          <TextField
            margin="dense"
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            fullWidth
            required
            helperText="Minimal 8 karakter"
            inputProps={{ minLength: 8 }}
          />
          <TextField
            margin="dense"
            label="Role"
            name="role"
            select
            value={formData.role}
            onChange={handleChange}
            fullWidth
            required
          >
            <MenuItem value="superadmin">Superadmin</MenuItem>
            <MenuItem value="sekretaris">Sekretaris</MenuItem>
            <MenuItem value="bendahara">Bendahara</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Batal</Button>
          <Button onClick={handleSubmit} variant="contained">
            Simpan
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 