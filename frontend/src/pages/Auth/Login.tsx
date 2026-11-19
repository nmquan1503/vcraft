import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { authApi } from '@/api';
import { getAccessToken } from '@/utils/tokenStorage';
import AuthLayout from './sections/AuthLayout';
import AuthInput from './sections/AuthInput';

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Nếu đã login → redirect luôn
  useEffect(() => {
    if (getAccessToken()) {
      navigate(redirect, { replace: true });
    }
  }, [navigate, redirect]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError('Vui lòng nhập đầy đủ email và mật khẩu.');
      return;
    }

    setLoading(true);
    try {
      await authApi.login({ email: email.trim(), password });
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
      <form onSubmit={handleSubmit} className="space-y-6">
        <AuthInput
          id="email"
          type="email"
          label="Email"
          placeholder="ban@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
          disabled={loading}
        />

        <AuthInput
          id="password"
          type="password"
          label="Mật khẩu"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
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
          {loading ? 'Đang đăng nhập…' : 'Đăng nhập'}
        </button>

        <div className="text-center text-xs text-[#1f1b18]/50 pt-2">
          Chưa có tài khoản?{' '}
          <Link to="/register" className="text-[#b45f3c] hover:underline">
            Đăng ký ngay
          </Link>
        </div>

        <div className="text-center text-xs text-[#1f1b18]/50">
          Bạn là nghệ nhân?{' '}
          <Link to="/register/artisan" className="text-[#b45f3c] hover:underline">
            Đăng ký xưởng
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}