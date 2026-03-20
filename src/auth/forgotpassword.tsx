import React, { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setMessage('');
    setError('');

    if (!email) {
      setError('Vui lòng nhập email.');
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError('Địa chỉ email không hợp lệ.');
      return;
    }

    // Gọi API reset password ở đây
    setMessage('Một email đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra hộp thư đến.');

    setTimeout(() => {
      navigate(`/opt-forgot-password?email=${encodeURIComponent(email)}`);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-indigo-50 to-violet-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-8">
        <div className="flex items-center justify-between mb-6">
          <Link to="/" className="inline-flex items-center gap-2 text-primary font-extrabold text-lg hover:text-indigo-600">
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center text-white">
              <span className="material-symbols-outlined">school</span>
            </div>
            Edu<span className="text-white bg-primary px-1 rounded-sm">Flow</span>
          </Link>
          <button onClick={() => navigate('/login')} className="text-sm font-semibold text-primary hover:underline">
            Quay lại đăng nhập
          </button>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Quên mật khẩu</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Nhập email để nhận liên kết đặt lại mật khẩu.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700 dark:border-red-500/40 dark:bg-red-900/30 dark:text-red-200">
              {error}
            </div>
          )}
          {message && (
            <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-2 text-sm text-green-700 dark:border-green-500/40 dark:bg-green-900/30 dark:text-green-200">
              {message}
            </div>
          )}

          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              placeholder="email@domain.com"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-primary px-4 py-3 font-semibold text-white transition hover:brightness-95"
          >
            Gửi yêu cầu đặt lại mật khẩu
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
