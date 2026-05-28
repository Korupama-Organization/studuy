# SEed Frontend

SEed là ứng dụng frontend cho hệ thống tuyển dụng, viết bằng React + TypeScript và build bằng Vite. Ứng dụng hiện có các luồng chính cho ứng viên và nhà tuyển dụng, bao gồm đăng nhập/đăng ký, dashboard ứng viên, trang việc làm, quản lý hồ sơ và các màn hình quản trị dành cho recruiter.

## Tính năng chính

- Đăng nhập, đăng ký HR và quản lý session bằng token.
- Dashboard ứng viên lấy dữ liệu thật từ API.
- Trang việc làm của ứng viên với danh sách ứng tuyển và bộ lọc.
- Cụm màn hình recruiter: dashboard, jobs, management, candidates, company.
- Header dùng chung cho các trang candidate, tự lấy tên người dùng từ session.
- Tự động điều hướng về `/login` khi token hết hạn hoặc không hợp lệ.
- Giao diện và thông báo đã được Việt hóa theo ngữ cảnh của ứng dụng.

## Yêu cầu môi trường

- Node.js 18 trở lên
- npm 9 trở lên

Kiểm tra nhanh:

```bash
node -v
npm -v
```

## Cài đặt và chạy

1. Cài dependencies:

```bash
npm install
```

2. Chạy môi trường phát triển:

```bash
npm run dev
```

3. Mở ứng dụng tại địa chỉ Vite hiển thị trong terminal, mặc định là:

```text
http://localhost:5173
```

## Biến môi trường

Tạo file `.env` ở thư mục gốc nếu chưa có:

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_UIT_AUTH_SECRET=your-secret-here
VITE_INTERVIEW_BASE_URL=https://seed-interview.vercel.app
```

- `VITE_API_BASE_URL` trỏ đến backend API.
- `VITE_UIT_AUTH_SECRET` chỉ cần nếu bạn dùng luồng đăng nhập UIT.

Khi deploy lên Vercel, hãy đặt `VITE_API_BASE_URL` thành origin thật của backend để các request `/api/...` đi đúng server.

## Scripts

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

- `npm run dev`: chạy ứng dụng ở chế độ phát triển.
- `npm run build`: tạo bản build production trong `dist/`.
- `npm run preview`: chạy thử bản build production.
- `npm run lint`: kiểm tra code bằng ESLint.

## Cấu trúc dự án

```text
src/
├── app/                  # Root app và router
├── components/           # Component dùng chung
├── contexts/             # React contexts
├── hooks/                # Custom hooks
├── pages/                # Các màn hình theo route
├── services/             # API và logic auth
├── assets/               # Ảnh và tài nguyên tĩnh
├── index.css             # Global styles
└── main.tsx              # Entry point
public/                   # Static files
```

## Công nghệ sử dụng

- React 19
- Vite 7
- TypeScript 5
- React Router
- TanStack React Query
- ESLint 9
- Tailwind CSS 4 tooling

## Ghi chú triển khai

- Các request API phụ thuộc vào `VITE_API_BASE_URL`.
- Session được lưu bằng `accessToken`, `refreshToken` và `currentUser` trong `localStorage`.
- Header candidate sẽ ưu tiên dữ liệu user từ session, nên không còn phụ thuộc vào tên hardcode.

## Kiểm tra nhanh

Nếu muốn xác nhận project vẫn ổn sau khi chỉnh README, chạy:

```bash
npm run build
```
