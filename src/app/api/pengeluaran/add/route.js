import { NextResponse } from 'next/server'
import { API_ENDPOINTS } from '@/config/api'

export async function POST(request) {
  try {
    const data = await request.json()
    const token = request.headers.get('Authorization')

    if (!token) {
      return NextResponse.json({ success: false, message: 'Token tidak ditemukan' }, { status: 401 })
    }

    const response = await fetch(`${API_ENDPOINTS.PENDUDUK_ADD}`, {
      method: 'POST',
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true'
      },
      body: JSON.stringify(data)
    })

    const responseData = await response.json()
    if (!response.ok) {
      return NextResponse.json({ success: false, message: responseData.message || 'Gagal menambah penduduk' }, { status: response.status })
    }

    return NextResponse.json({ success: true, message: 'Penduduk berhasil ditambahkan', data: responseData.data })
  } catch (error) {
    console.error('Error adding penduduk:', error)
    return NextResponse.json({ success: false, message: 'Terjadi kesalahan' }, { status: 500 })
  }
}