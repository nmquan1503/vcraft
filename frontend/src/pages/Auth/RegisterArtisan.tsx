import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '@/api';
import { getAccessToken } from '@/utils/tokenStorage';
import AuthLayout from './sections/AuthLayout';
import AuthInput from './sections/AuthInput';

export default function RegisterArtisan() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    workshopName: '',
    ownerName: '',
    email: '',
    phone: '',
    address: '',
    description: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (getAccessToken()) {
      navigate('/', { replace: true });
    }
  }, [navigate]);

  const update = (k: keyof typeof form, v: string) =>
    setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (
      !form.workshopName.trim() ||
      !form.ownerName.trim() ||
      !form.email.trim() ||
      !form.address.trim()
    ) {
      setError('Vui lòng điền đầy đủ các trường bắt buộc.');
      return;
    }
    if (form.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }

    setLoading(true);
    try {
      await authApi.registerArtisan({
        workshopName: form.workshopName.trim(),
        ownerName: form.ownerName.trim(),          // ← ownerName
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,     // ← optional
        address: form.address.trim(),
        description: form.description.trim() || undefined,
        password: form.password,
        // KHÔNG có district, lat, lng, certificates
      });
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đăng ký thất bại.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <AuthLayout
        eyebrow="Đã gửi đăng ký"
        title="Chờ duyệt."
        subtitle="Hồ sơ xưởng của bạn đã được gửi tới Ban quản lý làng nghề. Vui lòng chờ xác nhận qua email."
      >
        <div className="space-y-4">
          <div className="border-l-2 border-[#b45f3c] pl-4 py-3 bg-[#b45f3c]/5">
            <p className="text-sm text-[#1f1b18]/70 leading-relaxed">
              Ban quản lý sẽ xem xét hồ sơ trong vòng 2–3 ngày làm việc. Khi
              được duyệt, bạn có thể đăng nhập và bắt đầu đăng tải sản phẩm.
            </p>
          </div>
          <Link
            to="/login"
            className="w-full inline-flex items-center justify-center bg-[#1f1b18] text-[#f6f1ea] rounded-full py-3 text-xs uppercase tracking-widest hover:bg-[#b45f3c] transition-colors"
          >
            Về trang đăng nhập
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      eyebrow="Đăng ký xưởng"
      title="Mở gian hàng của bạn."
      subtitle="Chia sẻ câu chuyện gia đình, nhật ký sản xuất và tác phẩm độc bản của xưởng bạn tới du khách gần xa."
      quote="Nghề trong máu, chuyện kể qua từng thớ đất."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <p className="text-[10px] uppercase tracking-[0.25em] text-[#1f1b18]/40 pt-2">
          Thông tin nghệ nhân
        </p>

        <AuthInput
          id="ownerName"
          label="Họ tên nghệ nhân *"
          placeholder="Nguyễn Văn A"
          value={form.ownerName}
          onChange={(e) => update('ownerName', e.target.value)}
          required
          disabled={loading}
        />

        <AuthInput
          id="email"
          type="email"
          label="Email *"
          placeholder="ban@example.com"
          value={form.email}
          onChange={(e) => update('email', e.target.value)}
          autoComplete="email"
          required
          disabled={loading}
        />

        <AuthInput
          id="phone"
          type="tel"
          label="Số điện thoại (tuỳ chọn)"
          placeholder="0912 345 678"
          value={form.phone}
          onChange={(e) => update('phone', e.target.value)}
          disabled={loading}
        />

        <p className="text-[10px] uppercase tracking-[0.25em] text-[#1f1b18]/40 pt-4">
          Thông tin xưởng
        </p>

        <AuthInput
          id="workshopName"
          label="Tên xưởng *"
          placeholder="Xưởng gốm Phạm Văn A"
          value={form.workshopName}
          onChange={(e) => update('workshopName', e.target.value)}
          required
          disabled={loading}
        />

        <AuthInput
          id="address"
          label="Địa chỉ xưởng *"
          placeholder="Xóm 3, Bát Tràng, Gia Lâm, Hà Nội"
          value={form.address}
          onChange={(e) => update('address', e.target.value)}
          required
          disabled={loading}
        />

        <div>
          <label
            htmlFor="description"
            className="block text-[10px] uppercase tracking-[0.25em] text-[#1f1b18]/50 mb-2"
          >
            Mô tả xưởng
          </label>
          <textarea
            id="description"
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
            placeholder="Lịch sử gia đình, dòng men, kỹ thuật đặc trưng…"
            rows={3}
            disabled={loading}
            className="w-full bg-transparent border-b border-[#1f1b18]/20 py-2 text-sm placeholder:text-[#1f1b18]/25 focus:outline-none focus:border-[#b45f3c] transition-colors resize-none"
          />
        </div>

        <p className="text-[10px] uppercase tracking-[0.25em] text-[#1f1b18]/40 pt-4">
          Mật khẩu
        </p>

        <AuthInput
          id="password"
          type="password"
          label="Mật khẩu *"
          placeholder="Ít nhất 6 ký tự"
          value={form.password}
          onChange={(e) => update('password', e.target.value)}
          autoComplete="new-password"
          required
          disabled={loading}
        />

        <AuthInput
          id="confirmPassword"
          type="password"
          label="Xác nhận mật khẩu *"
          placeholder="Nhập lại mật khẩu"
          value={form.confirmPassword}
          onChange={(e) => update('confirmPassword', e.target.value)}
          autoComplete="new-password"
          required
          disabled={loading}
        />

        {error && (
          <p className="text-xs text-red-600 bg-red-50 px-3 py-2 border-l-2 border-red-500">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#1f1b18] text-[#f6f1ea] rounded-full py-3 text-xs uppercase tracking-widest hover:bg-[#b45f3c] disabled:opacity-50 disabled:hover:bg-[#1f1b18] transition-colors"
        >
          {loading ? 'Đang gửi hồ sơ…' : 'Gửi hồ sơ đăng ký'}
        </button>

        <p className="text-[10px] text-[#1f1b18]/40 leading-relaxed text-center pt-2">
          Hồ sơ sẽ được Ban quản lý làng nghề xem xét trước khi kích hoạt.
        </p>

        <div className="text-center text-xs text-[#1f1b18]/50">
          Đã có tài khoản?{' '}
          <Link to="/login" className="text-[#b45f3c] hover:underline">
            Đăng nhập
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}