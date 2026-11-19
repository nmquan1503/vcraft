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
  const [submitState, setSubmitState] = useState<'idle' | 'loading' | 'success'>('idle');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (getAccessToken()) navigate('/', { replace: true });
  }, [navigate]);

  const update = (k: keyof typeof form, v: string) => {
    setForm((p) => ({ ...p, [k]: v }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitState !== 'idle') return;
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

    setSubmitState('loading');
    try {
      await authApi.registerBuyer({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        phone: form.phone.trim() || undefined,
      });
      setSubmitState('success');
      window.setTimeout(() => navigate('/', { replace: true }), 700);
    } catch (err) {
      setSubmitState('idle');
      setError(err instanceof Error ? err.message : 'Đăng ký thất bại.');
    }
  };

  return (
    <AuthLayout
      eyebrow="Đăng ký"
      title="Tạo tài khoản khách hàng."
      subtitle="Đặt mua sản phẩm độc bản, tạo yêu cầu báo giá sỉ, và theo dõi đơn hàng của bạn."
      quote="Mỗi lô gốm có một câu chuyện riêng."
    >
      <form onSubmit={handleSubmit} className="auth-stagger space-y-6" noValidate>
        <div style={{ ['--i' as string]: 3 }}>
          <AuthInput
            id="name"
            name="name"
            label="Họ tên"
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            autoComplete="name"
            autoFocus
            disabled={submitState !== 'idle'}
          />
        </div>

        <div style={{ ['--i' as string]: 4 }}>
          <AuthInput
            id="email"
            name="email"
            type="email"
            label="Email"
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            autoComplete="email"
            disabled={submitState !== 'idle'}
          />
        </div>

        <div style={{ ['--i' as string]: 5 }}>
          <AuthInput
            id="phone"
            name="phone"
            type="tel"
            label="Số điện thoại (tuỳ chọn)"
            value={form.phone}
            onChange={(e) => update('phone', e.target.value)}
            autoComplete="tel"
            disabled={submitState !== 'idle'}
          />
        </div>

        <div style={{ ['--i' as string]: 6 }}>
          <AuthInput
            id="password"
            name="password"
            type="password"
            label="Mật khẩu"
            hint="Ít nhất 6 ký tự"
            value={form.password}
            onChange={(e) => update('password', e.target.value)}
            autoComplete="new-password"
            disabled={submitState !== 'idle'}
          />
        </div>

        <div style={{ ['--i' as string]: 7 }}>
          <AuthInput
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            label="Xác nhận mật khẩu"
            value={form.confirmPassword}
            onChange={(e) => update('confirmPassword', e.target.value)}
            autoComplete="new-password"
            disabled={submitState !== 'idle'}
          />
        </div>

        {error && (
          <p role="alert" className="auth-error" style={{ ['--i' as string]: 8 }}>
            <span aria-hidden="true">⚠</span>
            <span>{error}</span>
          </p>
        )}

        <button
          type="submit"
          disabled={submitState !== 'idle'}
          className="auth-btn"
          style={{ ['--i' as string]: 9 }}
        >
          <span className="auth-btn__content">
            {submitState === 'loading' && <span className="auth-btn__spinner" />}
            {submitState === 'success' && (
              <svg className="auth-btn__check" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M7 12l3.5 3.5L17 9" />
              </svg>
            )}
            {submitState === 'idle' && 'Tạo tài khoản'}
            {submitState === 'loading' && 'Đang tạo tài khoản…'}
            {submitState === 'success' && 'Thành công'}
          </span>
        </button>

        <div className="text-center text-sm text-[#1f1b18]/55 pt-2" style={{ ['--i' as string]: 10 }}>
          Đã có tài khoản?{' '}
          <Link to="/login" className="text-[#b45f3c] hover:underline font-medium">
            Đăng nhập
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}