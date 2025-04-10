'use client'

import { useState, useEffect } from 'react'
import { 
  Box, Typography, TextField, Button, Dialog, DialogTitle, DialogContent, 
  DialogActions, Card, CardContent, Grid, IconButton
} from '@mui/material'
import { styled } from '@mui/material/styles'
import EditIcon from '@mui/icons-material/Edit'
import ImageIcon from '@mui/icons-material/Image'

// Styled Components
const ContentCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
  borderRadius: '20px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  padding: '16px',
  marginBottom: '24px',
}))

const HeaderBox = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
  padding: '20px',
  color: 'white',
  borderRadius: '20px',
  marginBottom: '24px',
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
}))

const SaveButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#1a237e',
  color: 'white',
  borderRadius: '12px',
  padding: '10px 20px',
  textTransform: 'none',
  fontWeight: 600,
  '&:hover': {
    backgroundColor: '#0d47a1',
  },
}))

export default function Laporan() {
  const [content, setContent] = useState({
    home: {
      title: 'Selamat Datang di Desa Bonto Ujung',
      description: 'Desa Bonto Ujung adalah desa yang terletak di Kecamatan Tarowang, Kabupaten Jeneponto.',
      image: '/images/default-home.jpg',
    },
    dashboard: {
      title: 'Dashboard Superadmin',
      subtitle: 'Sistem Informasi Desa Bonto Ujung',
    },
    dataPenduduk: {
      title: 'Data Penduduk',
    },
    users: {
      title: 'Manajemen Pengguna',
    },
    global: {
      logo: '/images/default-logo.png',
    },
  })
  const [showModal, setShowModal] = useState(false)
  const [selectedSection, setSelectedSection] = useState('')
  const [formData, setFormData] = useState({})
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const storedContent = JSON.parse(localStorage.getItem('websiteContent') || '{}')
    const mergedContent = {
      ...content,
      ...storedContent,
      global: { ...content.global, ...(storedContent.global || {}) },
    }
    console.log('Initial content loaded:', mergedContent)
    setContent(mergedContent)
  }, [])

  const handleEdit = (section) => {
    setSelectedSection(section)
    setFormData({ ...content[section] }) // Salin data awal ke formData
    setShowModal(true)
    console.log('Opening modal for section:', section, 'with data:', content[section])
  }

  const handleSave = () => {
    if (!selectedSection) return
    const updatedContent = {
      ...content,
      [selectedSection]: { ...formData }, // Pastikan formData diterapkan
    }
    try {
      console.log('Saving content:', updatedContent) // Log sebelum menyimpan
      localStorage.setItem('websiteContent', JSON.stringify(updatedContent))
      setContent(updatedContent) // Perbarui state
      console.log('Content saved and state updated:', updatedContent) // Log setelah menyimpan
      setShowModal(false)
      setErrorMessage('')
    } catch (e) {
      setErrorMessage('Gagal menyimpan: ' + (e.name === 'QuotaExceededError' ? 'Penyimpanan penuh.' : e.message))
      console.error('Save error:', e)
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 1024 * 1024) { // Batasi 1MB
        setErrorMessage('Gambar terlalu besar! Maksimum 1MB.')
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData((prev) => {
          const newFormData = { ...prev, image: reader.result }
          console.log('Image updated in formData:', newFormData)
          return newFormData
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleLogoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 1024 * 1024) { // Batasi 1MB
        setErrorMessage('Logo terlalu besar! Maksimum 1MB.')
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData((prev) => {
          const newFormData = { ...prev, logo: reader.result }
          console.log('Logo updated in formData:', newFormData)
          return newFormData
        })
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <Box sx={{ padding: '20px', mt: '40px', bgcolor: '#f4f6f8', minHeight: 'calc(100vh - 40px)' }}>
      {/* Header */}
      <HeaderBox>
        <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
          Pengelolaan Konten Website
        </Typography>
        <Typography variant="subtitle1" sx={{ opacity: 0.8 }}>
          Kontrol semua tulisan dan gambar/logo
        </Typography>
      </HeaderBox>

      {/* Pesan Error */}
      {errorMessage && (
        <Typography variant="body1" color="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Typography>
      )}

      {/* Konten Saat Ini */}
      <ContentCard>
        <CardContent>
          {/* Global Section */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>Global (Logo)</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <img 
                  src={content.global.logo} 
                  alt="Logo Website" 
                  style={{ maxWidth: '150px', maxHeight: '150px', borderRadius: '8px' }} 
                  onError={(e) => (e.target.src = '/images/fallback-logo.png')}
                />
              </Grid>
              <Grid item xs={12} sm={6} sx={{ textAlign: 'right' }}>
                <IconButton onClick={() => handleEdit('global')} color="primary">
                  <EditIcon />
                </IconButton>
              </Grid>
            </Grid>
          </Box>

          {/* Home Section */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>Halaman Utama</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography>Judul: {content.home.title}</Typography>
                <Typography>Deskripsi: {content.home.description}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <img 
                  src={content.home.image} 
                  alt="Gambar Utama" 
                  style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px' }} 
                  onError={(e) => (e.target.src = '/images/fallback-home.jpg')}
                />
              </Grid>
              <Grid item xs={12} sm={6} sx={{ textAlign: 'right' }}>
                <IconButton onClick={() => handleEdit('home')} color="primary">
                  <EditIcon />
                </IconButton>
              </Grid>
            </Grid>
          </Box>

          {/* Dashboard Section */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>Dashboard</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography>Judul: {content.dashboard.title}</Typography>
                <Typography>Subjudul: {content.dashboard.subtitle}</Typography>
              </Grid>
              <Grid item xs={12} sx={{ textAlign: 'right' }}>
                <IconButton onClick={() => handleEdit('dashboard')} color="primary">
                  <EditIcon />
                </IconButton>
              </Grid>
            </Grid>
          </Box>

          {/* Data Penduduk Section */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>Data Penduduk</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography>Judul: {content.dataPenduduk.title}</Typography>
              </Grid>
              <Grid item xs={12} sx={{ textAlign: 'right' }}>
                <IconButton onClick={() => handleEdit('dataPenduduk')} color="primary">
                  <EditIcon />
                </IconButton>
              </Grid>
            </Grid>
          </Box>

          {/* Users Section */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>Manajemen Pengguna</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography>Judul: {content.users.title}</Typography>
              </Grid>
              <Grid item xs={12} sx={{ textAlign: 'right' }}>
                <IconButton onClick={() => handleEdit('users')} color="primary">
                  <EditIcon />
                </IconButton>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </ContentCard>

      {/* Modal Edit Konten */}
      <Dialog open={showModal} onClose={() => setShowModal(false)}>
        <DialogTitle>
          Edit Konten - {selectedSection ? (selectedSection === 'global' ? 'Global' : selectedSection.charAt(0).toUpperCase() + selectedSection.slice(1)) : 'Tidak Dipilih'}
        </DialogTitle>
        <DialogContent>
          {selectedSection === 'global' ? (
            <>
              <Typography variant="body1" sx={{ mb: 1 }}>Logo Website</Typography>
              <Button variant="contained" component="label" startIcon={<ImageIcon />}>
                Unggah Logo
                <input type="file" accept="image/*" hidden onChange={handleLogoChange} />
              </Button>
              {formData.logo && (
                <Box sx={{ mt: 2 }}>
                  <img src={formData.logo} alt="Preview Logo" style={{ maxWidth: '150px', maxHeight: '150px' }} />
                </Box>
              )}
            </>
          ) : selectedSection ? (
            <>
              <TextField
                label="Judul"
                value={formData.title || ''}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                fullWidth
                margin="normal"
              />
              {selectedSection === 'home' && (
                <>
                  <TextField
                    label="Deskripsi"
                    value={formData.description || ''}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    fullWidth
                    multiline
                    rows={4}
                    margin="normal"
                  />
                  <Box sx={{ mt: 2 }}>
                    <Button variant="contained" component="label" startIcon={<ImageIcon />}>
                      Unggah Gambar
                      <input type="file" accept="image/*" hidden onChange={handleImageChange} />
                    </Button>
                    {formData.image && (
                      <Box sx={{ mt: 2 }}>
                        <img src={formData.image} alt="Preview Gambar" style={{ maxWidth: '100%', maxHeight: '200px' }} />
                      </Box>
                    )}
                  </Box>
                </>
              )}
              {selectedSection === 'dashboard' && (
                <TextField
                  label="Subjudul"
                  value={formData.subtitle || ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, subtitle: e.target.value }))}
                  fullWidth
                  margin="normal"
                />
              )}
            </>
          ) : (
            <Typography>Pilih bagian untuk mengedit.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowModal(false)}>Batal</Button>
          <SaveButton onClick={handleSave}>Simpan</SaveButton>
        </DialogActions>
      </Dialog>
    </Box>
  )
}