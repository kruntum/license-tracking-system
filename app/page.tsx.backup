'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { AlertTriangle, CheckCircle2, Clock, ListFilter, HelpCircle, Bell } from 'lucide-react';
import { StatsCard } from '@/components/StatsCard';
import { LicenseTable } from '@/components/LicenseTable';
import ArchitectureAdvice from '@/components/ArchitectureAdvice';
import { ComputedLicenseData } from '@/types';

import { ThemeToggle } from '@/components/ThemeToggle';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { LogIn, Settings } from 'lucide-react';

export default function Home() {
    const [showAdvice, setShowAdvice] = useState(false);
    const [filter, setFilter] = useState<'all' | 'expired' | 'warning' | 'active'>('all');
    const [groupBy, setGroupBy] = useState<'none' | 'company' | 'tag'>('none');
    const [notificationStatus, setNotificationStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
    const [allData, setAllData] = useState<ComputedLicenseData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();

    // Fetch data from API
    useEffect(() => {
        const fetchLicenses = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/licenses');

                if (!response.ok) {
                    throw new Error('Failed to fetch licenses');
                }

                const data = await response.json();
                setAllData(data);
                setError(null);
            } catch (err) {
                console.error('Error fetching licenses:', err);
                setError('Failed to load license data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchLicenses();
    }, []);

    // Calculate Stats
    const stats = useMemo(() => {
        return {
            total: allData.length,
            expired: allData.filter(d => d.computedStatus === 'Expired').length,
            warning: allData.filter(d => d.computedStatus === 'Expiring Soon').length,
            active: allData.filter(d => d.computedStatus === 'Active').length,
        };
    }, [allData]);

    // Filter Data
    const filteredData = useMemo(() => {
        return allData.filter(item => {
            if (filter === 'expired') return item.computedStatus === 'Expired';
            if (filter === 'warning') return item.computedStatus === 'Expiring Soon';
            if (filter === 'active') return item.computedStatus === 'Active';
            return true;
        });
    }, [allData, filter]);

    const handleSimulateNotification = () => {
        setNotificationStatus('sending');
        setTimeout(() => {
            setNotificationStatus('sent');
            setTimeout(() => setNotificationStatus('idle'), 3000);
            alert(`[จำลอง] ส่งแจ้งเตือนไปยัง LINE OA เรียบร้อยแล้ว!\n\nรายการแจ้งเตือน:\n- หมดอายุ: ${stats.expired} รายการ\n- ใกล้หมด: ${stats.warning} รายการ`);
        }, 1500);
    };

    return (
        <div className="min-h-screen pb-12 bg-[rgb(var(--bg-primary))]">
            {/* Navbar */}
            <nav className="bg-[rgb(var(--bg-primary))] shadow-sm border-b border-[rgb(var(--border-color))] sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-600 p-2 rounded-lg text-white">
                                <ListFilter size={24} />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-[rgb(var(--text-primary))]">LicenseGuard</h1>
                                <p className="text-xs text-[rgb(var(--text-secondary))]">ระบบติดตามใบอนุญาต</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <ThemeToggle />
                            {user ? (
                                <Link
                                    href="/admin"
                                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                                >
                                    <Settings size={18} />
                                    Admin
                                </Link>
                            ) : (
                                <Link
                                    href="/login"
                                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--accent))] border border-[rgb(var(--border-color))] hover:bg-[rgb(var(--bg-secondary))] rounded-lg transition-colors"
                                >
                                    <LogIn size={18} />
                                    เข้าสู่ระบบ
                                </Link>
                            )}
                            <button
                                onClick={() => setShowAdvice(true)}
                                className="flex items-center gap-2 text-sm font-medium text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--accent))] px-3 py-2 rounded-md hover:bg-[rgb(var(--bg-secondary))] transition-colors"
                            >
                                <HelpCircle size={18} />
                                คำแนะนำ Tech Stack
                            </button>
                            <button
                                onClick={handleSimulateNotification}
                                disabled={notificationStatus !== 'idle'}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium transition-all ${notificationStatus === 'sent' ? 'bg-green-500' :
                                    notificationStatus === 'sending' ? 'bg-gray-400' : 'bg-[#00B900] hover:bg-[#009900]'
                                    }`}
                            >
                                <Bell size={18} />
                                {notificationStatus === 'sending' ? 'Sending...' : notificationStatus === 'sent' ? 'Sent!' : 'Notify LINE'}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

                {/* Welcome Banner */}
                <div className="bg-gradient-to-r from-blue-700 to-blue-900 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
                    <div className="absolute right-0 top-0 h-full w-1/3 bg-white opacity-5 skew-x-12 transform translate-x-12"></div>
                    <h2 className="text-3xl font-bold mb-2">ภาพรวมใบอนุญาต</h2>
                    <p className="text-blue-100 max-w-2xl">
                        ตรวจสอบสถานะวันหมดอายุของใบอนุญาต (Registration), แยกตามบริษัท และแจ้งเตือนอัตโนมัติ ข้อมูลอัปเดตล่าสุด: {new Date().toLocaleDateString('th-TH')}
                    </p>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                        <p className="font-semibold">Error</p>
                        <p>{error}</p>
                    </div>
                )}

                {/* Data Display - Only show when not loading and no error */}
                {!loading && !error && (
                    <>
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <StatsCard
                                title="ใบอนุญาตทั้งหมด"
                                count={stats.total}
                                icon={<ListFilter className="text-blue-600" size={24} />}
                                colorClass="bg-blue-100"
                                isActive={filter === 'all'}
                                onClick={() => setFilter('all')}
                            />
                            <StatsCard
                                title="หมดอายุแล้ว"
                                count={stats.expired}
                                icon={<AlertTriangle className="text-red-600" size={24} />}
                                colorClass="bg-red-100"
                                isActive={filter === 'expired'}
                                onClick={() => setFilter('expired')}
                            />
                            <StatsCard
                                title="ใกล้หมดอายุ (90 วัน)"
                                count={stats.warning}
                                icon={<Clock className="text-yellow-600" size={24} />}
                                colorClass="bg-yellow-100"
                                isActive={filter === 'warning'}
                                onClick={() => setFilter('warning')}
                            />
                            <StatsCard
                                title="ใช้งานปกติ"
                                count={stats.active}
                                icon={<CheckCircle2 className="text-green-600" size={24} />}
                                colorClass="bg-green-100"
                                isActive={filter === 'active'}
                                onClick={() => setFilter('active')}
                            />
                        </div>

                        {/* Controls */}
                        <div className="flex flex-col sm:flex-row justify-between items-center bg-[rgb(var(--bg-primary))] p-4 rounded-lg shadow-sm border border-[rgb(var(--border-color))] gap-4">
                            <div className="flex items-center gap-4 w-full sm:w-auto">
                                <span className="text-sm font-medium text-[rgb(var(--text-primary))] whitespace-nowrap">Group By:</span>
                                <div className="flex rounded-md shadow-sm w-full sm:w-auto" role="group">
                                    <button
                                        type="button"
                                        onClick={() => setGroupBy('none')}
                                        className={`px-4 py-2 text-sm font-medium rounded-l-lg border transition-colors ${groupBy === 'none'
                                            ? 'bg-blue-600 text-white border-blue-600'
                                            : 'bg-[rgb(var(--bg-secondary))] text-[rgb(var(--text-primary))] border-[rgb(var(--border-color))] hover:bg-[rgb(var(--bg-tertiary))]'
                                            }`}
                                    >
                                        None
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setGroupBy('company')}
                                        className={`px-4 py-2 text-sm font-medium border-t border-b transition-colors ${groupBy === 'company'
                                            ? 'bg-blue-600 text-white border-blue-600'
                                            : 'bg-[rgb(var(--bg-secondary))] text-[rgb(var(--text-primary))] border-[rgb(var(--border-color))] hover:bg-[rgb(var(--bg-tertiary))]'
                                            }`}
                                    >
                                        Company
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setGroupBy('tag')}
                                        className={`px-4 py-2 text-sm font-medium rounded-r-lg border transition-colors ${groupBy === 'tag'
                                            ? 'bg-blue-600 text-white border-blue-600'
                                            : 'bg-[rgb(var(--bg-secondary))] text-[rgb(var(--text-primary))] border-[rgb(var(--border-color))] hover:bg-[rgb(var(--bg-tertiary))]'
                                            }`}
                                    >
                                        Tag
                                    </button>
                                </div>
                            </div>

                            <div className="text-sm text-[rgb(var(--text-secondary))]">
                                แสดงข้อมูล {filteredData.length} รายการ จากทั้งหมด {allData.length}
                            </div>
                        </div>

                        {/* Main Table Content */}
                        <LicenseTable data={filteredData} groupBy={groupBy} />
                    </>
                )}

            </main>

            {/* Tech Stack Modal  {showAdvice && <ArchitectureAdvice onClose={() => setShowAdvice(false)} />}*/}

        </div>
    );
}
