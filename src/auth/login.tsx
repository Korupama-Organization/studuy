import React, { useState, FormEvent } from 'react';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Vui lòng nhập email và mật khẩu.');
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError('Địa chỉ email không hợp lệ.');
      return;
    }

    // Tại đây bạn có thể gọi API đăng nhập
    console.log({ email, password, remember });
    alert('Đăng nhập thành công (mô phỏng)');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-indigo-50 to-violet-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Đăng nhập</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Chào mừng bạn quay lại EduFlow</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700 dark:border-red-500/40 dark:bg-red-900/30 dark:text-red-200">
              {error}
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

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Mật khẩu
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              placeholder="Nhập mật khẩu"
              required
            />
          </div>

          <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={remember}
                onChange={e => setRemember(e.target.checked)}
                className="rounded border-slate-300 text-primary focus:ring-primary dark:border-slate-500"
              />
              Nhớ đăng nhập
            </label>
            <button type="button" className="font-medium text-primary hover:underline">
              Quên mật khẩu?
            </button>
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-primary px-4 py-3 font-semibold text-white transition hover:brightness-95"
          >
            Đăng nhập
          </button>

          <div className="text-center text-sm text-slate-500 dark:text-slate-400">
            Chưa có tài khoản?{' '}
            <button type="button" className="font-semibold text-primary hover:underline">
              Đăng ký ngay
            </button>
          </div>
        </form>

        <div className="mt-6 border-t border-slate-200 dark:border-slate-700 pt-5 text-center text-sm text-slate-500 dark:text-slate-400">
          Hoặc đăng nhập bằng
          <div className="mt-4 flex items-center justify-center gap-3">
            <button className="rounded-xl border border-slate-300 px-4 py-2 text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">
              Google
            </button>
            <button className="rounded-xl border border-slate-300 px-4 py-2 text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">
              GitHub
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
