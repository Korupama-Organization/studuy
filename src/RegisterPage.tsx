import React, { useEffect, useState } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000';

type Status = { type: 'idle' | 'success' | 'error'; message?: string };

const inputClass = 'mt-2 w-full rounded-2xl border border-[#F1F5F9] bg-slate-50 px-4 py-3 text-sm focus:border-primary focus:bg-white focus:outline-none placeholder:text-slate-400/70 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed';

const RegisterPage: React.FC = () => {
    const [formValues, setFormValues] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        role: 'student' as 'student',
        otp: '',
    });
    const [status, setStatus] = useState<Status>({ type: 'idle' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isRequestingOtp, setIsRequestingOtp] = useState(false);
    const [otpCooldown, setOtpCooldown] = useState(0);
    const [otpRequested, setOtpRequested] = useState(false);

    useEffect(() => {
        if (otpCooldown <= 0) {
            return undefined;
        }
        const timer = window.setInterval(() => {
            setOtpCooldown((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, [otpCooldown]);

    const handleChange = (field: keyof typeof formValues) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormValues((prev) => ({ ...prev, [field]: event.target.value }));
    };

    const handleRoleSelect = (role: 'student' | 'teacher') => {
        if (otpRequested) {
            return;
        }
        setFormValues((prev) => ({ ...prev, role }));
    };

    const handleRequestOtp = async () => {
        if (isRequestingOtp || otpCooldown > 0) {
            return;
        }

        if (!formValues.fullName.trim() || !formValues.email.trim() || !formValues.phone.trim() || !formValues.password.trim()) {
            setStatus({ type: 'error', message: 'Please complete all fields before requesting an OTP.' });
            return;
        }

        setIsRequestingOtp(true);
        setStatus({ type: 'idle' });

        const endpoint = otpRequested ? '/api/auth/resend-verify-email-otp' : '/api/auth/register';
        const payload = otpRequested
            ? { email: formValues.email }
            : {
                fullName: formValues.fullName,
                email: formValues.email,
                phone: formValues.phone,
                password: formValues.password,
                role: formValues.role,
            };

        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Unable to send OTP. Please try again later.');
            }

            setStatus({
                type: 'success',
                message: otpRequested
                    ? data.message || 'A new OTP has been sent to your inbox.'
                    : 'OTP sent! Please check your inbox and enter the code below.',
            });
            setOtpCooldown(60);
            if (!otpRequested) {
                setOtpRequested(true);
            }
        } catch (error: any) {
            setStatus({ type: 'error', message: error.message || 'Unable to send OTP. Please try again later.' });
        } finally {
            setIsRequestingOtp(false);
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!otpRequested) {
            setStatus({ type: 'error', message: 'Please request an OTP before completing registration.' });
            return;
        }
        if (!formValues.otp.trim()) {
            setStatus({ type: 'error', message: 'Please enter the OTP sent to your email.' });
            return;
        }

        setIsSubmitting(true);
        setStatus({ type: 'idle' });

        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/verify-email`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formValues.email,
                    otp: formValues.otp,
                }),
            });

            const payload = await response.json();
            if (!response.ok) {
                throw new Error(payload.error || 'OTP verification failed.');
            }

            setStatus({ type: 'success', message: payload.message || 'Email verified! Your account is ready.' });
            setFormValues({ fullName: '', email: '', phone: '', password: '', role: 'student', otp: '' });
            setOtpRequested(false);
            setOtpCooldown(0);
        } catch (error: any) {
            setStatus({ type: 'error', message: error.message || 'Could not verify OTP. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#F7F9FC] via-white to-[#EEF2FF] text-slate-900 font-['Inter']">
            <header className="flex items-center justify-between px-6 lg:px-12 py-6">
                <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-primary text-white shadow-lg shadow-indigo-200 flex items-center justify-center">
                        <span className="material-symbols-outlined">school</span>
                    </div>
                    <div>
                        <p className="text-lg font-semibold">EduFlow</p>
                    </div>
                </div>
                <a className="text-sm font-semibold text-slate-500 hover:text-primary transition-colors flex items-center gap-2" href="#">
                    <span className="material-symbols-outlined text-base">arrow_back</span>
                    Back to site
                </a>
            </header>

            <main className="px-4 pb-16 flex justify-center">
                <div className="w-full max-w-xl">
                    <div className="relative rounded-[32px] border border-[#F1F5F9] bg-white shadow-[0_25px_80px_rgba(15,23,42,0.08)] px-6 py-8 lg:px-10 lg:py-10">
                        <div className="text-center mb-8">
                            <div className="flex justify-center gap-10 text-sm font-semibold text-slate-400">
                                <button className="pb-2 border-b-2 border-transparent hover:text-primary transition-colors">Sign In</button>
                                <button className="pb-2 border-b-2 border-primary text-primary">Create Account</button>
                            </div>
                            <h1 className="text-2xl lg:text-3xl font-extrabold mt-6 mb-2">Create your account</h1>
                            <p className="text-sm text-slate-500">Join our community of learners and educators.</p>
                        </div>

                        <div className="mb-6">
                            <p className="text-xs font-semibold text-slate-400 mb-3">I AM JOINING BECAUSE...</p>
                            <div className="flex rounded-2xl border border-[#F1F5F9] bg-slate-50 p-1">
                                <button
                                    className={`flex-1 px-4 py-2 text-sm font-semibold rounded-2xl transition-colors ${formValues.role === 'student'
                                        ? 'bg-[#6366F1] text-white shadow-sm shadow-indigo-200'
                                        : 'text-slate-500 hover:text-slate-700'
                                    } ${otpRequested ? 'opacity-60 cursor-not-allowed' : ''}`}
                                    type="button"
                                    onClick={() => handleRoleSelect('student')}
                                    disabled={otpRequested}
                                >
                                    I am a student
                                </button>
                                <button
                                    className={`flex-1 px-4 py-2 text-sm font-semibold rounded-2xl transition-colors ${formValues.role === 'teacher'
                                        ? 'bg-[#6366F1] text-white shadow-sm shadow-indigo-200'
                                        : 'text-slate-500 hover:text-slate-700'
                                    } ${otpRequested ? 'opacity-60 cursor-not-allowed' : ''}`}
                                    type="button"
                                    onClick={() => handleRoleSelect('teacher')}
                                    disabled={otpRequested}
                                >
                                    I am a teacher
                                </button>
                            </div>
                        </div>

                        <form className="space-y-5" onSubmit={handleSubmit}>
                            <div>
                                <label className="text-xs font-semibold text-slate-500 tracking-wide">FULL NAME</label>
                                <input className={inputClass} placeholder="John Doe" type="text" value={formValues.fullName} onChange={handleChange('fullName')} required disabled={otpRequested} />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-slate-500 tracking-wide">EMAIL ADDRESS</label>
                                <input className={inputClass} placeholder="name@email.com" type="email" value={formValues.email} onChange={handleChange('email')} required disabled={otpRequested} />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-slate-500 tracking-wide">PHONE NUMBER</label>
                                <input className={inputClass} placeholder="+1 (555) 000-0000" type="tel" value={formValues.phone} onChange={handleChange('phone')} required disabled={otpRequested} />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-slate-500 tracking-wide">CREATE PASSWORD</label>
                                <input className={inputClass} placeholder="Min. 8 characters" type="password" value={formValues.password} onChange={handleChange('password')} minLength={6} required disabled={otpRequested} />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-slate-500 tracking-wide">EMAIL OTP</label>
                                <div className="mt-2 flex items-center gap-3">
                                    <input
                                        className={`${inputClass} flex-1 mt-0`}
                                        placeholder="6-digit code"
                                        type="text"
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        value={formValues.otp}
                                        onChange={handleChange('otp')}
                                    />
                                    <button
                                        className="text-xs font-semibold text-primary hover:text-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed"
                                        type="button"
                                        onClick={handleRequestOtp}
                                        disabled={isRequestingOtp || otpCooldown > 0}
                                    >
                                        {isRequestingOtp
                                            ? 'Sending…'
                                            : otpCooldown > 0
                                                ? `Retry in ${otpCooldown}s`
                                                : otpRequested
                                                    ? 'Resend OTP'
                                                    : 'Get OTP'}
                                    </button>
                                </div>
                            </div>

                            {status.type !== 'idle' && status.message && (
                                <div
                                    className={`rounded-2xl border px-4 py-3 text-sm ${status.type === 'success'
                                        ? 'border-emerald-200 bg-emerald-50 text-emerald-600'
                                        : 'border-rose-200 bg-rose-50 text-rose-600'
                                    }`}
                                    role="alert"
                                    aria-live="assertive"
                                >
                                    {status.message}
                                </div>
                            )}

                            <button
                                className="w-full rounded-2xl py-4 text-sm font-semibold text-white bg-[#6366F1] shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-shadow disabled:opacity-70 disabled:cursor-not-allowed"
                                type="submit"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Creating account…' : otpRequested ? 'Complete Registration' : 'Create Account'}
                            </button>
                            <p className="text-[11px] text-center text-slate-400">
                                By signing up, you agree to our <a className="text-primary font-semibold" href="#">Terms</a> &amp; <a className="text-primary font-semibold" href="#">Privacy Policy</a>.
                            </p>
                        </form>

                        <div className="mt-8">
                            <div className="flex items-center gap-3 text-xs text-slate-400">
                                <div className="h-px flex-1 bg-[#F1F5F9]" />
                                OR CONTINUE WITH
                                <div className="h-px flex-1 bg-[#F1F5F9]" />
                            </div>
                            <div className="mt-4 grid grid-cols-2 gap-3">
                                <button className="rounded-2xl border border-[#F1F5F9] bg-white py-3 text-sm font-semibold text-slate-500 hover:border-primary transition-colors" type="button">
                                    <span className="flex items-center justify-center gap-2">
                                        <img src="/google.svg" alt="Google" className="w-5 h-5" />
                                        Google
                                    </span>
                                </button>
                                <button className="rounded-2xl border border-[#F1F5F9] bg-white py-3 text-sm font-semibold text-slate-500 hover:border-primary transition-colors" type="button">
                                    <span className="flex items-center justify-center gap-2">
                                        <img src="/linkedin.svg" alt="LinkedIn" className="w-5 h-5" />
                                        LinkedIn
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="text-center text-xs text-slate-400 mt-8 flex flex-col gap-2">
                        <div className="flex justify-center gap-6">
                            <a className="hover:text-primary" href="#">Help Center</a>
                            <a className="hover:text-primary" href="#">Privacy</a>
                            <a className="hover:text-primary" href="#">Support</a>
                        </div>
                        <p>© 2024 EduFlow LMS. All rights reserved.</p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default RegisterPage;
