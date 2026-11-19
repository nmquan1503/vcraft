# Tích hợp frontend + backend — 19/11/2026

## Nguồn và cách ghép

- Backend: `huwnghoangf/vcraft_backend`, nhánh **fix/backend-review**, commit nền `69afd2cea520ea86a00895779f32197a92011b97`.
- Frontend: `nmquan1503/vcraft`, nhánh main, commit `9e898435cf32ecf3acb5f2a2449c8e92b110680e`.
- Frontend đặt trong `frontend/`. Root vẫn là project Maven backend. Lịch sử của cả hai repo được giữ qua merge có hai parent; nội dung FE nhập vào prefix thay vì ghi đè root.
- Không tạo thêm nhánh. Git bundle bàn giao mang nhánh **fix/backend-review** và toàn bộ project/lịch sử.
- Việc không đụng đường dẫn root giải quyết xung đột file; tính tương thích API được kiểm tra và sửa riêng, không suy ra chỉ từ việc Git merge thành công.

## Đã sửa khi kết nối thật

| Điểm không khớp | Cách xử lý |
|---|---|
| FE example mặc định dùng mock | Mặc định backend thật; `.env.example` đặt `VITE_USE_MOCK=false` |
| URL API cố định localhost:8080 | Dùng `/api/v1`; Vite/Nginx proxy `/api` và `/uploads` |
| Refresh chỉ lưu access token | Lưu cả refresh token mới; gom các yêu cầu refresh đồng thời; đã thử gia hạn hai lần liên tiếp |
| Chốt giá xong không có bước ACCEPTED → IN_PRODUCTION | Thêm API client và nút Bắt đầu sản xuất cho xưởng thắng thầu |
| Chưa có điều phối/tổng tiến độ trên FE | Bổ sung client, form chia số lượng nhiều bid và hiển thị các phần con/tiến độ |
| Trạng thái ALLOCATED thiếu trong type/filter | Thêm type, nhãn và bộ lọc tương ứng |
| Upload ảnh sản phẩm gọi API ảnh xưởng | Tạo/cập nhật sản phẩm rồi upload qua `/products/{id}/images`; giữ productId để retry không tạo lại sản phẩm |
| Trường mô tả/lịch sử trả null | Type nullable và giá trị form mặc định; đã thử lưu hồ sơ mới |
| Hiển thị danh sách lô như dữ liệu công khai | Route lô riêng được bảo vệ cho artisan, lấy đúng API lô của mình |
| Bộ lọc incoming chỉ lọc trên 10 phần tử đã tải | Gửi status/page/limit về backend và thêm điều hướng trang |
| Backend bỏ qua sort name_asc | Bổ sung sort theo tên để khớp lựa chọn FE |
| Link reset và quản trị thiếu route | Bổ sung trang forgot/reset mật khẩu, dashboard BQL duyệt hồ sơ và xem yêu cầu gần đây |
| Menu không phản ánh đăng nhập/vai trò | Menu theo vai trò, có đăng xuất, link xưởng/BQL; guard từ chối phiên thiếu user |
| API lỗi bị nuốt thành danh sách rỗng | Giữ fallback của FE gốc nhưng thêm thông báo lỗi hiển thị cho người dùng |
| Form thiếu liên kết label/control | Thêm htmlFor/id cho các form chính |
| Mốc thời gian local được khởi tạo bằng UTC | Khởi tạo datetime-local theo múi giờ trình duyệt |
| Lint React 19 báo reset loading trong effect | Loading suy ra từ query key; kết quả cũ bị bỏ qua sau khi query thay đổi; không tắt rule đó |
| Bundle JS lớn | Lazy-load các trang, map tách chunk |
| Runtime file permissions khác nhau theo umask | JAR đọc được bởi user non-root; static assets đọc được bởi Nginx worker |

## Chạy nhanh bằng Docker

Yêu cầu Docker Desktop ở chế độ Linux containers. Trong root project:

```powershell
docker compose -f docker-compose.yml -f docker-compose.fullstack.yml -f docker-compose.mail.yml up --build -d
```

- Website: http://localhost:3000
- Swagger backend: http://localhost:8080/swagger-ui.html
- Mailpit nội bộ: http://localhost:8025
- Admin demo: `admin@vcraft.vn` / `uet123456`
- Artisan demo đã duyệt: `artisan@vcraft.vn` / `uet123456`
- Buyer: đăng ký qua `/register`.

Frontend đợi health check backend. Lần đầu Docker cần tải image và thư viện. Nếu cần xem lỗi:

```powershell
docker compose -f docker-compose.yml -f docker-compose.fullstack.yml -f docker-compose.mail.yml logs --tail=100 backend frontend
```

Không dùng `down -v` nếu muốn giữ database/ảnh. Mailpit giữ thư trong môi trường thử, không gửi email ra ngoài. Khi cấu hình SMTP thật dùng hướng dẫn backend trong README và bỏ overlay mail.

Nếu thay cổng frontend hoặc mở từ điện thoại, đặt `FRONTEND_PORT` và `PUBLIC_FRONTEND_URL` khớp địa chỉ thực (ví dụ URL IP LAN), rồi recreate container. URL QR/email/ảnh dùng địa chỉ public này; `localhost` trên điện thoại là điện thoại, không phải máy chạy backend.

## Chạy dev bằng hai terminal

Yêu cầu **JDK 21**, **Node 24 LTS** (hoặc 22.12+ thuộc nhánh 22), PostgreSQL. Chỉ cần Docker cho database khi chạy dev.

Terminal backend ở root:

```powershell
docker compose up -d postgres
$env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-21.0.13.9-hotspot"
$env:Path = "$env:JAVA_HOME\bin;$env:Path"
$env:FRONTEND_URL = "http://localhost:3000"
$env:PASSWORD_RESET_URL = "http://localhost:3000/reset-password"
.\mvnw.cmd spring-boot:run
```

Điền đúng đường dẫn JDK của máy bạn. Nếu đã chạy backend bằng Docker trên cổng 8080 thì không khởi chạy thêm backend host trên cùng cổng. Database mặc định localhost:5432; tùy chỉnh bằng `.env` nếu dùng cổng/tài khoản khác.

Terminal frontend:

```powershell
cd frontend
npm ci
npm run dev
```

Mở http://localhost:3000. Không cần file `.env` ở frontend để chạy mặc định. Nếu tạo, dùng `frontend/.env.example`, giữ `VITE_USE_MOCK=false`. `BACKEND_URL` chỉ dùng cho Vite dev proxy, không phải biến bí mật được đưa vào browser. Đừng dùng mock mode để kết luận đã tích hợp backend.

Muốn thử SMTP khi chạy backend host: chạy Mailpit riêng hoặc overlay Docker, đặt `MAIL_ENABLED=true`, `SMTP_HOST=localhost`, `SMTP_PORT=1025` tương ứng cổng đã publish, `SMTP_STARTTLS=false` chỉ cho SMTP nội bộ. Overlay mail mặc định không publish cổng SMTP ra host, chỉ publish hộp thư HTTP. Cách đơn giản là dùng toàn bộ stack Docker ở trên.

## Chạy kiểm thử

Backend, từ root:

```powershell
.\mvnw.cmd clean verify
.\mvnw.cmd -Pintegration clean verify
```

Lệnh thứ hai cần Docker và tự tạo DB/SMTP test riêng. Frontend:

```powershell
cd frontend
npm ci
npm run lint
npm test
npm run build
npx playwright install chromium
```

Để chạy đủ browser E2E, dùng backend + frontend + Mailpit thử nghiệm, không dùng API/database production. Nếu toàn bộ stack Docker chạy ở các URL mặc định:

```powershell
$env:E2E_API_URL = "http://localhost:8080"
$env:E2E_BASE_URL = "http://localhost:3000"
$env:E2E_MAILPIT_URL = "http://localhost:8025"
npm run test:e2e
```

Playwright mặc định có thể khởi tạo Vite trên 3000; nếu website đã chạy tại 3000 sẽ tái sử dụng. Các test tạo user, xưởng, sản phẩm và báo giá có ID ngẫu nhiên. Test reset đọc thư từ Mailpit; backend phải cấu hình gửi vào hộp thư đó. Trên Windows không đặt `PLAYWRIGHT_CHROMIUM_EXECUTABLE`; biến này chỉ phục vụ môi trường đã có sẵn Chromium như nơi kiểm tra bản bàn giao.

CI `.github/workflows/backend.yml` chạy cả Maven, frontend lint/unit/build và browser E2E trên nhánh cũ. Chưa xác nhận remote CI vì gói được bàn giao để người dùng push bằng tài khoản của mình.

## Kết quả và giới hạn

- Backend: **89 unit/API-slice + 11 integration test** đạt.
- Frontend: **lint không lỗi/cảnh báo**, TypeScript/production build đạt, **6 unit test** đạt.
- Browser: **8 kịch bản** đạt trên Nginx phục vụ build production, backend JAR non-root, PostgreSQL 15 và Mailpit trong Docker network.
- Đã kiểm tra deep links, proxy API và đọc JPEG đã upload qua Nginx. Compose ba file được validate.
- Runtime production được dựng từ JAR/dist đã build và test. Chưa chạy lại toàn bộ hai multi-stage Dockerfile qua `docker compose up --build` trong môi trường này; mạng/registry lúc build trên máy người dùng có thể cần cấu hình riêng.
- Ảnh nền bản đồ cần kết nối OpenStreetMap. Kiểm thử bản đồ xác nhận dữ liệu ghim, popup/widget và lọc; không chứng nhận mạng bên ngoài luôn sẵn sàng.
- Dashboard BQL mới tập trung duyệt hồ sơ và danh sách yêu cầu. FE gốc chưa có đầy đủ giao diện giỏ hàng/checkout, quản trị tin tức, quản lý các mốc nhật ký sau khi tạo lô. API backend vẫn có; bản này không tuyên bố hoàn tất toàn bộ frontend theo đề bài.
- Quy trình tạo sản phẩm/lô và upload là nhiều HTTP request. Đã giữ ID để tránh tạo lại entity khi retry lỗi thường gặp; chưa có khóa idempotency cho trường hợp server xử lý thành công nhưng client mất response.
- Gói không chứa `.env`, node_modules, target, dist, database hay uploads thực tế. Kết quả kiểm chứng: `verification/fullstack-2026-11-19.json`.
