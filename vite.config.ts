import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages用: リポジトリ名に合わせて変更してください
  // 例: base: '/camp-checklist/'
  base: process.env.NODE_ENV === 'production' ? '/camp-checklist/' : '/',
})
