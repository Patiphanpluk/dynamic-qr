# Dynamic QR (Vite + React + Firebase)

## Setup
1. `git clone <repo>`
2. `npm install`
3. แก้ `src/firebase.js` ใส่ firebaseConfig ของคุณ (จาก Firebase Console)
4. สร้าง Firestore collection ชื่อ `qr_links` (โหมด test ในช่วง dev)
5. `npm run dev` — เปิด `http://localhost:5173`

## Deploy (GitHub Pages)
- ติดตั้ง build แล้วอัปโฟลเดอร์ `dist` ขึ้น GitHub Pages หรือใช้ GitHub Actions / gh-pages package
- ใช้ `HashRouter` (ที่ผมตั้ง) — จะไม่เจอ 404 บน GitHub Pages
