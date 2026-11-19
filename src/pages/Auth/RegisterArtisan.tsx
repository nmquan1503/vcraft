import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '@/api';
import { getAccessToken } from '@/utils/tokenStorage';
import AuthLayout from './sections/AuthLayout';
import AuthInput from './sections/AuthInput';
import AuthTextarea from './sections/AuthTextarea';

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
    if (getAccessToken()) navigate('/', { replace: true });
  }, [navigate]);

  const update = (k: keyof typeof form, v: string) => {
    setForm((p) => ({ ...p, [k]: v }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setError(null);

    if (!form.workshopName.trim() || !form.ownerName.trim() || !form.email.trim() || !form.address.trim()) {
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
        ownerName: form.ownerName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
        address: form.address.trim(),
        description: form.description.trim() || undefined,
        password: form.password,
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
        title="Hồ sơ đang chờ duyệt."
        subtitle="Hồ sơ xưởng của bạn đã được gửi tới Ban quản lý làng nghề. Vui lòng chờ xác nhận qua email."
        quote="Nghề trong máu, chuyện kể qua từng thớ đất."
      >
        <div className="auth-stagger space-y-5">
          <div
            className="flex items-start gap-3 px-4 py-4 border-l-2 border-green-600 bg-green-50 text-green-900 text-sm leading-relaxed"
            style={{ ['--i' as string]: 3 }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5">
              <circle cx="12" cy="12" r="10" />
              <path d="M8 12l3 3 5-5" />
            </svg>
            <span>
              Ban quản lý sẽ xem xét hồ sơ trong vòng 2–3 ngày làm việc. Khi được duyệt, bạn có thể đăng nhập và bắt đầu đăng tải sản phẩm.
            </span>
          </div>

          <Link
            to="/login"
            className="auth-btn inline-flex items-center justify-center"
            style={{ ['--i' as string]: 4 }}
          >
            <span className="auth-btn__content">Về trang đăng nhập</span>
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
      <form onSubmit={handleSubmit} className="auth-stagger space-y-5" noValidate>
        <div className="flex items-center gap-3 pb-1" style={{ ['--i' as string]: 3 }}>
          <span className="text-[11px] uppercase tracking-[0.28em] text-[#b45f3c] font-semibold">01 — Nghệ nhân</span>
          <span className="flex-1 h-px bg-[#1f1b18]/10" />
        </div>

        <div style={{ ['--i' as string]: 4 }}>
          <AuthInput
            id="ownerName"
            name="ownerName"
            label="Họ tên nghệ nhân *"
            value={form.ownerName}
            onChange={(e) => update('ownerName', e.target.value)}
            autoComplete="name"
            autoFocus
            disabled={loading}
          />
        </div>

        <div style={{ ['--i' as string]: 5 }}>
          <AuthInput
            id="email"
            name="email"
            type="email"
            label="Email *"
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            autoComplete="email"
            disabled={loading}
          />
        </div>

        <div style={{ ['--i' as string]: 6 }}>
          <AuthInput
            id="phone"
            name="phone"
            type="tel"
            label="Số điện thoại (tuỳ chọn)"
            value={form.phone}
            onChange={(e) => update('phone', e.target.value)}
            autoComplete="tel"
            disabled={loading}
          />
        </div>

        <div className="flex items-center gap-3 pt-3 pb-1" style={{ ['--i' as string]: 7 }}>
          <span className="text-[11px] uppercase tracking-[0.28em] text-[#b45f3c] font-semibold">02 — Xưởng</span>
          <span className="flex-1 h-px bg-[#1f1b18]/10" />
        </div>

        <div style={{ ['--i' as string]: 8 }}>
          <AuthInput
            id="workshopName"
            name="workshopName"
            label="Tên xưởng *"
            value={form.workshopName}
            onChange={(e) => update('workshopName', e.target.value)}
            disabled={loading}
          />
        </div>

        <div style={{ ['--i' as string]: 9 }}>
          <AuthInput
            id="address"
            name="address"
            label="Địa chỉ xưởng *"
            value={form.address}
            onChange={(e) => update('address', e.target.value)}
            autoComplete="street-address"
            disabled={loading}
          />
        </div>

        <div style={{ ['--i' as string]: 10 }}>
          <AuthTextarea
            id="description"
            name="description"
            label="Mô tả xưởng"
            hint="Lịch sử gia đình, dòng men, kỹ thuật đặc trưng…"
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
            rows={3}
            disabled={loading}
          />
        </div>

        <div className="flex items-center gap-3 pt-3 pb-1" style={{ ['--i' as string]: 11 }}>
          <span className="text-[11px] uppercase tracking-[0.28em] text-[#b45f3c] font-semibold">03 — Bảo mật</span>
          <span className="flex-1 h-px bg-[#1f1b18]/10" />
        </div>

        <div style={{ ['--i' as string]: 12 }}>
          <AuthInput
            id="password"
            name="password"
            type="password"
            label="Mật khẩu *"
            hint="Ít nhất 6 ký tự"
            value={form.password}
            onChange={(e) => update('password', e.target.value)}
            autoComplete="new-password"
            disabled={loading}
          />
        </div>

        <div style={{ ['--i' as string]: 13 }}>
          <AuthInput
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            label="Xác nhận mật khẩu *"
            value={form.confirmPassword}
            onChange={(e) => update('confirmPassword', e.target.value)}
            autoComplete="new-password"
            disabled={loading}
          />
        </div>

        {error && (
          <p role="alert" className="auth-error" style={{ ['--i' as string]: 14 }}>
            <span aria-hidden="true">⚠</span>
            <span>{error}</span>
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="auth-btn"
          style={{ ['--i' as string]: 15 }}
        >
          <span className="auth-btn__content">
            {loading && <span className="auth-btn__spinner" />}
            {loading ? 'Đang gửi hồ sơ…' : 'Gửi hồ sơ đăng ký'}
          </span>
        </button>

        <p className="text-[10px] text-[#1f1b18]/40 leading-relaxed text-center" style={{ ['--i' as string]: 16 }}>
          Hồ sơ sẽ được Ban quản lý làng nghề xem xét trước khi kích hoạt.
        </p>

        <div className="text-center text-sm text-[#1f1b18]/55" style={{ ['--i' as string]: 17 }}>
          Đã có tài khoản?{' '}
          <Link to="/login" className="text-[#b45f3c] hover:underline font-medium">
            Đăng nhập
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}