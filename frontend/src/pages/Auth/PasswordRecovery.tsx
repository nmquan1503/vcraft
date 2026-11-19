import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { authApi } from '@/api';
import { clearTokens } from '@/utils/tokenStorage';
import AuthLayout from './sections/AuthLayout';
import AuthInput from './sections/AuthInput';
export default function PasswordRecovery({ reset = false }: {reset?: boolean}) {
  const [params] = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const token = params.get('token') || '';
  async function submit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault(); setError(''); setMessage('');
    if (reset && (!/^[A-Za-z0-9_-]{43}$/.test(token) || password.length < 6 || new TextEncoder().encode(password).length > 72)) {
      setError('Liên kết không hợp lệ hoặc mật khẩu cần ít nhất 6 ký tự, tối đa 72 byte.'); return;
    }
    if (reset && password !== confirmation) {setError('Mật khẩu xác nhận không khớp.'); return;}
    setBusy(true);
    try {
      const result = reset ? await authApi.resetPassword({token, newPassword:password}) : await authApi.forgotPassword({email:email.trim()});
      if (reset) clearTokens();
      setMessage(result.message);
    } catch (ex) {setError(ex instanceof Error ? ex.message : 'Không thể xử lý yêu cầu.');}
    finally {setBusy(false);}
  }
  return <AuthLayout eyebrow="Tài khoản" title={reset ? 'Đặt lại mật khẩu.' : 'Quên mật khẩu?'} subtitle={reset ? 'Liên kết chỉ dùng một lần và hết hạn sau 15 phút.' : 'Nhập email để nhận hướng dẫn đặt lại mật khẩu.'}>
    <form onSubmit={submit} className="space-y-6">
      {reset ? <>
        <AuthInput id="new-password" label="Mật khẩu mới" type="password" value={password} onChange={e=>setPassword(e.target.value)} required autoComplete="new-password" disabled={busy}/>
        <AuthInput id="confirm-password" label="Xác nhận mật khẩu" type="password" value={confirmation} onChange={e=>setConfirmation(e.target.value)} required autoComplete="new-password" disabled={busy}/>
      </> : <AuthInput id="email" label="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required autoComplete="email" disabled={busy}/>}
      {error && <p role="alert" className="text-red-700 text-sm">{error}</p>}
      {message && <p role="status" className="text-green-800 text-sm">{message}</p>}
      <button disabled={busy} className="w-full rounded-full bg-[#1f1b18] py-3 text-[#f6f1ea] disabled:opacity-50">{busy?'Đang xử lý…':reset?'Lưu mật khẩu mới':'Gửi hướng dẫn'}</button>
      <Link className="block text-sm underline" to="/login">Về đăng nhập</Link>
    </form>
  </AuthLayout>;
}
