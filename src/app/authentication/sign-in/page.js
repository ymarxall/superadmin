// superadmin/src/app/authentication/sign-in/page.js
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  Alert,
  InputAdornment,
  IconButton,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import Image from 'next/image';

export default function SignIn() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [openForgotDialog, setOpenForgotDialog] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotMessage, setForgotMessage] = useState('');
  const router = useRouter();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value.trim() }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.username || !formData.password) {
      setError('NIK dan password harus diisi');
      return;
    }

    setLoading(true);

    try {
      const result = await login(formData.username, formData.password);
      if (result.success) {
        const { role } = result.data.user;
        switch (role) {
          case 'superadmin':
            router.push('/superadmin/dashboard');
            break;
          case 'sekretaris':
            router.push('/sekretaris/dashboard');
            break;
          case 'bendahara':
            router.push('/bendahara/dashboard');
            break;
          default:
            setError('Role tidak valid');
        }
      } else {
        setError(result.error || 'Login gagal. Silakan coba lagi.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Terjadi kesalahan saat login. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordOpen = () => setOpenForgotDialog(true);
  const handleForgotPasswordClose = () => {
    setOpenForgotDialog(false);
    setForgotEmail('');
    setForgotMessage('');
  };

  const handleForgotPasswordSubmit = async () => {
    if (!forgotEmail) {
      setForgotMessage('Masukkan email Anda.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail }),
      });

      if (res.ok) {
        setForgotMessage('Link reset password telah dikirim ke email Anda.');
      } else {
        const errorData = await res.json();
        setForgotMessage(errorData.message || 'Gagal mengirim permintaan reset password.');
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      setForgotMessage('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Paper elevation={3} sx={{ p: 4, width: '100%', borderRadius: '16px', backgroundColor: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
            <Image src="/image.png" alt="Logo" width={80} height={80} style={{ marginBottom: '16px', borderRadius: '50%' }} priority />
            <Typography component="h1" variant="h5" sx={{ fontWeight: 600, color: '#1a237e', textAlign: 'center' }}>
              Selamat Datang
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1, textAlign: 'center' }}>
              Silakan login untuk melanjutkan
            </Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="NIK"
              name="username"
              autoComplete="username"
              autoFocus
              value={formData.username}
              onChange={handleChange}
              disabled={loading}
              error={!!error}
              helperText="Masukkan NIK yang terdaftar"
              sx={{ mb: 2 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              error={!!error}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      disabled={loading}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />
            <Box sx={{ textAlign: 'right', mb: 2 }}>
              <Button
                variant="text"
                size="small"
                onClick={handleForgotPasswordOpen}
                disabled={loading}
                sx={{ textTransform: 'none', color: '#1a237e' }}
              >
                Lupa Password?
              </Button>
            </Box>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{ mt: 2, mb: 2, py: 1.5, backgroundColor: '#1a237e', '&:hover': { backgroundColor: '#0d47a1' } }}
            >
              {loading ? (
                <>
                  <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                  Memproses...
                </>
              ) : (
                'Login'
              )}
            </Button>
          </Box>
        </Paper>
      </Box>

      {/* Dialog untuk Lupa Password */}
      <Dialog open={openForgotDialog} onClose={handleForgotPasswordClose} maxWidth="sm" fullWidth>
        <DialogTitle>Lupa Password</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Masukkan email Anda untuk menerima link reset password.
          </Typography>
          <TextField
            label="Email"
            type="email"
            value={forgotEmail}
            onChange={(e) => setForgotEmail(e.target.value)}
            fullWidth
            required
            disabled={loading}
            helperText="Masukkan email yang terkait dengan akun Anda"
          />
          {forgotMessage && (
            <Alert severity={forgotMessage.includes('berhasil') ? 'success' : 'error'} sx={{ mt: 2 }}>
              {forgotMessage}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleForgotPasswordClose} disabled={loading}>
            Batal
          </Button>
          <Button onClick={handleForgotPasswordSubmit} variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Kirim'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}