import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { authApi } from '@/api';
import { useAuth } from '@/context/AuthContext';
import AuthLayout from './sections/AuthLayout';
import AuthInput from './sections/AuthInput';

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';
  const { isAuthenticated, login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirect, { replace: true });
    }
  }, [isAuthenticated, navigate, redirect]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError('Vui lòng nhập đầy đủ email và mật khẩu.');
      return;
    }

    setLoading(true);
    try {
      const res = await authApi.login({ email: email.trim(), password });
      login(res);
      navigate(redirect, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đăng nhập thất bại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      eyebrow="Đăng nhập"
      title="Chào mừng trở lại."
      subtitle="Đăng nhập để tạo yêu cầu báo giá, theo dõi đơn hàng, và kết nối với các xưởng gốm Bát Tràng."
      quote="Đất không vội. Lửa không vội. Người làm gốm cũng không vội."
    >
      <form onSubmit={handleSubmit} className="auth-stagger space-y-4" noValidate>
        <div style={{ ['--i' as string]: 3 }}>
          <AuthInput
            id="email"
            name="email"
            type="email"
            label="Email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); if (error) setError(null); }}
            autoComplete="email"
            autoFocus
            disabled={loading}
          />
        </div>

        <div style={{ ['--i' as string]: 4 }}>
          <AuthInput
            id="password"
            name="password"
            type="password"
            label="Mật khẩu"
            value={password}
            onChange={(e) => { setPassword(e.target.value); if (error) setError(null); }}
            autoComplete="current-password"
            disabled={loading}
          />
        </div>

        <div className="flex items-center justify-between text-sm" style={{ ['--i' as string]: 5 }}>
          <label className="inline-flex items-center gap-2.5 cursor-pointer text-[#1f1b18]/65 select-none">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="w-4 h-4 accent-[#b45f3c]"
            />
            Ghi nhớ đăng nhập
          </label>
          <Link to="/forgot-password" className="text-[#b45f3c] hover:underline inline-flex items-center gap-1 group font-medium">
            Quên mật khẩu?
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>

        {error && (
          <p role="alert" className="auth-error" style={{ ['--i' as string]: 6 }}>
            <span aria-hidden="true">⚠</span>
            <span>{error}</span>
          </p>
        )}

        <button type="submit" disabled={loading} className="auth-btn" style={{ ['--i' as string]: 7 }}>
          <span className="auth-btn__content">
            {loading && <span className="auth-btn__spinner" />}
            {loading ? 'Đang đăng nhập…' : 'Đăng nhập'}
          </span>
        </button>

        <div className="text-center text-sm text-[#1f1b18]/55" style={{ ['--i' as string]: 8 }}>
          Chưa có tài khoản?{' '}
          <Link to="/register" className="text-[#b45f3c] hover:underline font-medium">Đăng ký ngay</Link>
        </div>

        <div className="text-center text-sm text-[#1f1b18]/55" style={{ ['--i' as string]: 9 }}>
          Bạn là nghệ nhân?{' '}
          <Link to="/register/artisan" className="text-[#b45f3c] hover:underline font-medium">Đăng ký xưởng</Link>
        </div>
      </form>
    </AuthLayout>
  );
}