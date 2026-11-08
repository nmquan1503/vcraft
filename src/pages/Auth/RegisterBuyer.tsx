import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '@/api';
import { getAccessToken } from '@/utils/tokenStorage';
import AuthLayout from './sections/AuthLayout';
import AuthInput from './sections/AuthInput';

export default function RegisterBuyer() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

    if (!form.name.trim() || !form.email.trim()) {
      setError('Vui lòng điền đầy đủ họ tên và email.');
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
      await authApi.registerBuyer({
        name: form.name.trim(),                    // ← name
        email: form.email.trim(),
        password: form.password,
        phone: form.phone.trim() || undefined,     // ← optional
      });
      navigate('/', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đăng ký thất bại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      eyebrow="Đăng ký"
      title="Tạo tài khoản khách hàng."
      subtitle="Đặt mua sản phẩm độc bản, tạo yêu cầu báo giá sỉ, và theo dõi đơn hàng của bạn."
      quote="Mỗi lô gốm có một câu chuyện riêng."
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <AuthInput
          id="name"
          label="Họ tên"
          placeholder="Nguyễn Văn A"
          value={form.name}
          onChange={(e) => update('name', e.target.value)}
          required
          disabled={loading}
        />

        <AuthInput
          id="email"
          type="email"
          label="Email"
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
          autoComplete="tel"
          disabled={loading}
        />

        <AuthInput
          id="password"
          type="password"
          label="Mật khẩu"
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
          label="Xác nhận mật khẩu"
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
          {loading ? 'Đang tạo tài khoản…' : 'Tạo tài khoản'}
        </button>

        <div className="text-center text-xs text-[#1f1b18]/50 pt-2">
          Đã có tài khoản?{' '}
          <Link to="/login" className="text-[#b45f3c] hover:underline">
            Đăng nhập
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}