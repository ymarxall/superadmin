import { API_BASE_URL, getHeaders } from '@/config/api'
import Cookies from 'js-cookie'

export const pendudukService = {
  getAllPenduduk: async () => {
    try {
      const token = Cookies.get('authToken')
      if (!token) throw new Error('Token tidak ditemukan')

      const response = await fetch(`${API_BASE_URL}/penduduk/getall`, {
        method: 'GET',
        headers: getHeaders(token)
      })
      if (!response.ok) throw new Error('Gagal mengambil data penduduk')
      const data = await response.json()
      return data.data || []
    } catch (error) {
      console.error('Error fetching penduduk:', error)
      throw error
    }
  },

  addPenduduk: async (data) => {
    try {
      const token = Cookies.get('authToken')
      if (!token) throw new Error('Token tidak ditemukan')

      const response = await fetch(`${API_BASE_URL}/penduduk/add`, {
        method: 'POST',
        headers: {
          ...getHeaders(token),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      if (!response.ok) throw new Error('Gagal menambah data penduduk')
      return await response.json()
    } catch (error) {
      console.error('Error adding penduduk:', error)
      throw error
    }
  },

  updatePenduduk: async (id, data) => {
    try {
      const token = Cookies.get('authToken')
      if (!token) throw new Error('Token tidak ditemukan')

      const response = await fetch(`${API_BASE_URL}/penduduk/update/${id}`, {
        method: 'PUT',
        headers: {
          ...getHeaders(token),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      if (!response.ok) throw new Error('Gagal memperbarui data penduduk')
      return await response.json()
    } catch (error) {
      console.error('Error updating penduduk:', error)
      throw error
    }
  },

  deletePenduduk: async (id) => {
    try {
      const token = Cookies.get('authToken')
      if (!token) throw new Error('Token tidak ditemukan')

      const response = await fetch(`${API_BASE_URL}/penduduk/delete/${id}`, {
        method: 'DELETE',
        headers: getHeaders(token)
      })
      if (!response.ok) throw new Error('Gagal menghapus data penduduk')
      return await response.json()
    } catch (error) {
      console.error('Error deleting penduduk:', error)
      throw error
    }
  }
}