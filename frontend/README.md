# vCraft frontend

React 19 + TypeScript + Vite, kết nối backend Spring Boot trong root repo.

Dùng Node 24 LTS. Trong thư mục này:

```bash
npm ci
npm run dev
```

Website http://localhost:3000, API proxy `/api/v1` → http://localhost:8080. Mặc định dùng backend thật. File `.env.example` chỉ là mẫu, không cần copy để chạy default.

```bash
npm run lint
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

Browser test cần backend, PostgreSQL và Mailpit thử nghiệm đang chạy. Xem [hướng dẫn fullstack](../FULLSTACK.md) cho Docker, cấu hình E2E, SMTP, tài khoản demo và phạm vi kiểm chứng.

Frontend gốc: https://github.com/nmquan1503/vcraft tại commit `9e898435cf32ecf3acb5f2a2449c8e92b110680e`.
