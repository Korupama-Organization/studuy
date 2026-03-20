import React, { useState, useRef, FormEvent, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const OptForgotPasswordPage: React.FC = () => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const navigate = useNavigate();
  const query = useQuery();
  const email = query.get('email') ?? 'example@gmail.com';

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  const handleCodeChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < inputsRef.current.length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace' && !code[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setMessage('');

    if (code.some(d => d === '')) {
      setError('Vui lòng nhập đầy đủ mã 6 chữ số.');
      return;
    }

    const submittedCode = code.join('');
    if (submittedCode !== '123456') {
      setError('Mã xác thực không hợp lệ. Vui lòng thử lại.');
      return;
    }

    setMessage('Xác thực thành công! Bạn sẽ được chuyển đến đặt mật khẩu mới.');

    setTimeout(() => {
      navigate('/login');
    }, 900);
  };

  const resendCode = () => {
    setIsSending(true);
    setMessage('');
    setError('');
    setTimeout(() => {
      setIsSending(false);
      setMessage(`Mã đã được gửi lại tới ${email}. Vui lòng kiểm tra email.`);
      setCode(['', '', '', '', '', '']);
      inputsRef.current[0]?.focus();
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900 p-4">
      <div className="w-full max-w-3xl bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-8 sm:p-12">
        <div className="flex items-center justify-between mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-2xl font-extrabold text-slate-800 dark:text-white">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white">
              <span className="material-symbols-outlined">school</span>
            </div>
            EduFlow
          </Link>
          <Link to="/login" className="text-sm font-medium text-primary hover:underline">
            Quay lại đăng nhập
          </Link>
        </div>

        <h1 className="text-center text-3xl font-bold text-slate-800 dark:text-white">Verify Your Email</h1>
        <p className="mt-3 text-center text-slate-500 dark:text-slate-300">
          Please enter the 6-digit code we sent to your email{' '}
          <span className="font-semibold text-primary">{email}</span>
        </p>

        <div className="mt-8 bg-slate-50 dark:bg-slate-900 rounded-2xl p-6 sm:p-8">
          <div className="grid grid-cols-6 gap-3 sm:gap-4">
            {code.map((digit, idx) => (
              <input
                key={idx}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={e => handleCodeChange(idx, e.target.value)}
                onKeyDown={e => handleKeyDown(idx, e)}
                ref={el => (inputsRef.current[idx] = el)}
                className="h-14 text-center text-lg font-bold rounded-xl border border-slate-300 bg-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
              />
            ))}
          </div>
          {error && <p className="mt-4 text-center text-sm text-red-600 dark:text-red-400">{error}</p>}
          {message && <p className="mt-4 text-center text-sm text-green-600 dark:text-green-300">{message}</p>}

          <button
            onClick={handleSubmit}
            className="mt-6 w-full rounded-xl bg-primary px-6 py-3 text-white font-semibold hover:bg-indigo-600 transition"
          >
            Verify
          </button>

          <div className="mt-4 text-center text-sm text-slate-600 dark:text-slate-400">
            Didn’t receive the code?{' '}
            <button onClick={resendCode} disabled={isSending} className="font-semibold text-primary hover:underline">
              {isSending ? 'Sending...' : 'Resend'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OptForgotPasswordPage;
