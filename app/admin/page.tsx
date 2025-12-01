'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LicenseForm } from '@/components/LicenseForm';
import { LicenseTable } from '@/components/LicenseTable';
import { Plus, LogOut, Home, Settings } from 'lucide-react';
import Link from 'next/link';
import { ComputedLicenseData } from '@/types';

export default function AdminPage() {
    const { user, loading: authLoading, signOut } = useAuth();
    const router = useRouter();
    const [licenses, setLicenses] = useState<ComputedLicenseData[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingLicense, setEditingLicense] = useState<ComputedLicenseData | null>(null);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        if (user) {
            fetchLicenses();
        }
    }, [user]);

    const fetchLicenses = async () => {
        try {
            const response = await fetch('/api/licenses');
            const data = await response.json();
            setLicenses(data);
        } catch (error) {
            console.error('Error fetching licenses:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('คุณแน่ใจหรือไม่ที่จะลบใบอนุญาตนี้?')) return;

        try {
            const response = await fetch(`/api/licenses/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                fetchLicenses();
            }
        } catch (error) {
            console.error('Error deleting license:', error);
        }
    };

    const handleEdit = (license: ComputedLicenseData) => {
        setEditingLicense(license);
        setShowForm(true);
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setEditingLicense(null);
    };

    const handleLogout = async () => {
        await signOut();
        router.push('/');
    };

    if (authLoading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[rgb(var(--bg-primary))]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[rgb(var(--bg-secondary))]">
            {/* Navbar */}
            <nav className="bg-[rgb(var(--bg-primary))] shadow-sm border-b border-[rgb(var(--border-color))]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center gap-4">
                            <h1 className="text-xl font-bold text-[rgb(var(--text-primary))]">
                                Admin Dashboard
                            </h1>
                            <Link
                                href="/"
                                className="flex items-center gap-2 text-sm text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--accent))]"
                            >
                                <Home size={18} />
                                Dashboard
                            </Link>
                            <Link
                                href="/admin/settings"
                                className="flex items-center gap-2 text-sm text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--accent))]"
                            >
                                <Settings size={18} />
                                จัดการข้อมูลหลัก
                            </Link>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-[rgb(var(--text-secondary))]">
                                {user.email}
                            </span>
                            <ThemeToggle />
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                            >
                                <LogOut size={18} />
                                ออกจากระบบ
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-6 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-[rgb(var(--text-primary))]">
                        จัดการใบอนุญาต
                    </h2>
                    <button
                        onClick={() => setShowForm(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Plus size={20} />
                        เพิ่มใบอนุญาตใหม่
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    <div className="bg-[rgb(var(--bg-primary))] rounded-lg shadow overflow-hidden border border-[rgb(var(--border-color))]">
                        <LicenseTable
                            data={licenses}
                            groupBy="none"
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    </div>
                )}
            </div>

            {/* License Form Modal */}
            {showForm && (
                <LicenseForm
                    onClose={handleCloseForm}
                    onSuccess={fetchLicenses}
                    editData={editingLicense}
                />
            )}
        </div>
    );
}
