'use client'

import { useState, useEffect } from 'react'
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Box,
  Typography, Card, CardContent, IconButton, Tooltip, Divider, Alert, Fade,
  CircularProgress, MenuItem
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import PeopleIcon from '@mui/icons-material/People'
import { styled } from '@mui/material/styles'

const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: '#ffffff',
  borderRadius: '16px',
  boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)',
  overflow: 'hidden'
}))

const HeaderBox = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
  padding: '24px',
  color: 'white',
  borderRadius: '16px',
  marginBottom: '24px',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  boxShadow: '0 4px 20px 0 rgba(0,0,0,0.1)'
}))

const AddButton = styled(Button)(({ theme }) => ({
  backgroundColor: 'white',
  color: '#1a237e',
  borderRadius: '12px',
  textTransform: 'none',
  fontWeight: 600,
  padding: '12px 24px',
  '&:hover': {
    backgroundColor: 'rgba(255,255,255,0.9)',
    boxShadow: '0 8px 16px 0 rgba(0,0,0,0.1)'
  }
}))

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: '16px',
  boxShadow: 'none',
  '& .MuiTableCell-head': {
    backgroundColor: '#f8f9fa',
    fontWeight: 600,
    color: '#1a237e'
  }
}))

export default function DataPenduduk() {
  const [rows, setRows] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    nik: '',
    nama: '',
    tempatLahir: '',
    tanggalLahir: '',
    jenisKelamin: '',
    pendidikan: '',
    pekerjaan: ''
  })
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [alertType, setAlertType] = useState('success')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = () => {
    setLoading(true)
    // Ambil data dari localStorage
    const storedData = localStorage.getItem('pendudukData')
    const data = storedData ? JSON.parse(storedData) : []
    setRows(data)
    setLoading(false)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleAdd = () => {
    setEditingId(null)
    setFormData({
      nik: '',
      nama: '',
      tempatLahir: '',
      tanggalLahir: '',
      jenisKelamin: '',
      pendidikan: '',
      pekerjaan: ''
    })
    setShowModal(true)
  }

  const handleEdit = (row) => {
    setEditingId(row.id)
    setFormData({
      nik: row.nik,
      nama: row.nama,
      tempatLahir: row.tempatLahir,
      tanggalLahir: row.tanggalLahir,
      jenisKelamin: row.jenisKelamin,
      pendidikan: row.pendidikan,
      pekerjaan: row.pekerjaan
    })
    setShowModal(true)
  }

  const handleDelete = (id) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus data penduduk dengan NIK ${id}?`)) {
      return
    }
    setLoading(true)
    const storedData = JSON.parse(localStorage.getItem('pendudukData') || '[]')
    const updatedData = storedData.filter(row => row.id !== id)
    localStorage.setItem('pendudukData', JSON.stringify(updatedData))
    fetchData()
    showAlertMessage('Data penduduk berhasil dihapus', 'success')
    setLoading(false)
  }

  const showAlertMessage = (message, type) => {
    setAlertMessage(message)
    setAlertType(type)
    setShowAlert(true)
    setTimeout(() => setShowAlert(false), 3000)
  }

  const handleSave = () => {
    if (!formData.nik || !formData.nama || !formData.tempatLahir || !formData.tanggalLahir || 
        !formData.jenisKelamin || !formData.pendidikan || !formData.pekerjaan) {
      showAlertMessage('Semua field harus diisi', 'error')
      return
    }

    if (!/^\d{16}$/.test(formData.nik)) {
      showAlertMessage('NIK harus 16 digit angka', 'error')
      return
    }

    setLoading(true)
    const storedData = JSON.parse(localStorage.getItem('pendudukData') || '[]')
    
    if (editingId) {
      const updatedData = storedData.map(row => 
        row.id === editingId ? { ...formData, id: editingId } : row
      )
      localStorage.setItem('pendudukData', JSON.stringify(updatedData))
      showAlertMessage('Data penduduk berhasil diperbarui', 'success')
    } else {
      const newData = { 
        ...formData, 
        id: formData.nik // Gunakan NIK sebagai ID sementara
      }
      storedData.push(newData)
      localStorage.setItem('pendudukData', JSON.stringify(storedData))
      showAlertMessage('Data penduduk berhasil ditambahkan', 'success')
    }
    
    setShowModal(false)
    fetchData()
    setLoading(false)
  }

  const calculateAge = (tanggalLahir) => {
    const birthDate = new Date(tanggalLahir)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  // Sisanya (return JSX) sama seperti kode Anda sebelumnya
  return (
    <Box sx={{ padding: '24px', mt: '-20px' }}>
      <Fade in={showAlert}>
        <Alert 
          severity={alertType}
          sx={{ position: 'fixed', top: 24, right: 24, zIndex: 9999 }}
        >
          {alertMessage}
        </Alert>
      </Fade>

      <HeaderBox>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Data Penduduk
        </Typography>
        <AddButton
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAdd}
        >
          Tambah Data Penduduk
        </AddButton>
      </HeaderBox>

      <StyledCard>
        <CardContent>
          <StyledTableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>NIK</TableCell>
                  <TableCell>Nama</TableCell>
                  <TableCell>Tempat Lahir</TableCell>
                  <TableCell>Tgl Lahir (Umur)</TableCell>
                  <TableCell>Jenis Kelamin</TableCell>
                  <TableCell>Pendidikan</TableCell>
                  <TableCell>Pekerjaan</TableCell>
                  <TableCell align="center">Aksi</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      <PeopleIcon sx={{ fontSize: 48, color: '#ccc', mb: 2 }} />
                      <Typography variant="body1" color="textSecondary">
                        Belum ada data penduduk
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.map((row) => (
                    <TableRow key={row.nik}>
                      <TableCell>{row.nik}</TableCell>
                      <TableCell>{row.nama}</TableCell>
                      <TableCell>{row.tempatLahir}</TableCell>
                      <TableCell>{row.tanggalLahir} ({calculateAge(row.tanggalLahir)})</TableCell>
                      <TableCell>{row.jenisKelamin}</TableCell>
                      <TableCell>{row.pendidikan}</TableCell>
                      <TableCell>{row.pekerjaan}</TableCell>
                      <TableCell align="center">
                        <Tooltip title="Edit">
                          <IconButton onClick={() => handleEdit(row)}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Hapus">
                          <IconButton onClick={() => handleDelete(row.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </StyledTableContainer>
        </CardContent>
      </StyledCard>

      <Dialog open={showModal} onClose={() => setShowModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingId ? 'Edit Data Penduduk' : 'Tambah Data Penduduk'}</DialogTitle>
        <DialogContent>
          <TextField
            label="NIK"
            name="nik"
            value={formData.nik}
            onChange={handleInputChange}
            fullWidth
            required
            margin="normal"
            inputProps={{ maxLength: 16, pattern: '[0-9]*' }}
          />
          <TextField
            label="Nama Lengkap"
            name="nama"
            value={formData.nama}
            onChange={handleInputChange}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Tempat Lahir"
            name="tempatLahir"
            value={formData.tempatLahir}
            onChange={handleInputChange}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Tanggal Lahir"
            name="tanggalLahir"
            type="date"
            value={formData.tanggalLahir}
            onChange={handleInputChange}
            fullWidth
            required
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Jenis Kelamin"
            name="jenisKelamin"
            select
            value={formData.jenisKelamin}
            onChange={handleInputChange}
            fullWidth
            required
            margin="normal"
          >
            <MenuItem value="Laki-laki">Laki-laki</MenuItem>
            <MenuItem value="Perempuan">Perempuan</MenuItem>
          </TextField>
          <TextField
            label="Pendidikan"
            name="pendidikan"
            value={formData.pendidikan}
            onChange={handleInputChange}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Pekerjaan"
            name="pekerjaan"
            value={formData.pekerjaan}
            onChange={handleInputChange}
            fullWidth
            required
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowModal(false)}>Batal</Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Simpan'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}