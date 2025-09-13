const API_BASE = 'http://127.0.0.1:8000/api/photos'

export const PHOTO_API = {
  list: `${API_BASE}`,
  create: `${API_BASE}`,
  get: (id: string) => `${API_BASE}/${id}`,
//   restore: (id: string) => `${API_BASE}/${id}/restore`,
  update: (id: string) => `${API_BASE}/${id}`,
  delete: (id: string) => `${API_BASE}/${id}`
}
