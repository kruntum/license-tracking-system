'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { LogIn, Mail, Lock } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push('/admin');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[rgb(var(--bg-secondary))] px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center">
            <LogIn className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-[rgb(var(--text-primary))]">
            เข้าสู่ระบบ
          </h2>
          <p className="mt-2 text-sm text-[rgb(var(--text-secondary))]">
            LicenseGuard Admin Panel
          </p>
        </div>

        <form className="mt-8 space-y-6 bg-[rgb(var(--bg-primary))] p-8 rounded-xl shadow-lg border border-[rgb(var(--border-color))]" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[rgb(var(--text-primary))] mb-2">
                อีเมล
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[rgb(var(--text-tertiary))]" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 w-full px-4 py-3 border border-[rgb(var(--border-color))] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-[rgb(var(--bg-secondary))] text-[rgb(var(--text-primary))] placeholder-[rgb(var(--text-tertiary))]"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[rgb(var(--text-primary))] mb-2">
                รหัสผ่าน
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[rgb(var(--text-tertiary))]" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 w-full px-4 py-3 border border-[rgb(var(--border-color))] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-[rgb(var(--bg-secondary))] text-[rgb(var(--text-primary))] placeholder-[rgb(var(--text-tertiary))]"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
          </button>

          <div className="text-center">
            <a href="/" className="text-sm text-[rgb(var(--accent))] hover:text-[rgb(var(--accent-hover))]">
              ← กลับไปหน้าหลัก
            </a>
          </div>
        </form>

        <div className="text-center text-sm text-[rgb(var(--text-tertiary))]">
          <p>สำหรับการทดสอบ ใช้ Supabase Auth</p>
          <p className="mt-1">สร้างผู้ใช้ใน Supabase Dashboard</p>
        </div>
      </div>
    </div>
  );
}