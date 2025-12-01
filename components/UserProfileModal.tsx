import React, { useState } from 'react';
import { X, Lock, Save, User as UserIcon } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose, userEmail }) => {
  const supabase = createClient();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  if (!isOpen) return null;

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: "รหัสผ่านไม่ตรงกัน (Passwords do not match)" });
      return;
    }

    if (password.length < 6) {
      setMessage({ type: 'error', text: "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร" });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;

      setMessage({ type: 'success', text: "เปลี่ยนรหัสผ่านสำเร็จแล้ว!" });
      setPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        onClose();
        setMessage(null);
      }, 1500);

    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-xl max-w-sm w-full overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <UserIcon size={20} className="text-blue-600" />
            จัดการบัญชีผู้ใช้
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-3">
              <UserIcon size={32} className="text-blue-600" />
            </div>
            <p className="text-sm text-gray-500">เข้าสู่ระบบโดย</p>
            <p className="font-medium text-gray-900">{userEmail}</p>
          </div>

          <form onSubmit={handleUpdatePassword} className="space-y-4">
            {message && (
              <div className={`p-3 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {message.text}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">เปลี่ยนรหัสผ่านใหม่</label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 text-gray-400" size={16} />
                <input
                  type="password"
                  required
                  placeholder="New Password"
                  className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 text-gray-400" size={16} />
                <input
                  type="password"
                  required
                  placeholder="Confirm New Password"
                  className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-gray-900 hover:bg-black text-white py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              {loading ? 'Processing...' : (
                <>
                  <Save size={16} /> Update Password
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
