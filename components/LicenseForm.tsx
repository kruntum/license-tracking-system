'use client';

import { useState, useEffect } from 'react';
import { X, Plus } from 'lucide-react';
import { Company, Tag, Scope, ComputedLicenseData } from '@/types';

interface LicenseFormProps {
    onClose: () => void;
    onSuccess: () => void;
    editData?: ComputedLicenseData | null;
}

export function LicenseForm({ onClose, onSuccess, editData }: LicenseFormProps) {
    const [loading, setLoading] = useState(false);
    const [companies, setCompanies] = useState<Company[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);
    const [scopes, setScopes] = useState<Scope[]>([]);

    // Helper to convert date from DD/MM/YYYY to YYYY-MM-DD
    const convertToDateInput = (dateStr: string) => {
        if (!dateStr) return '';
        if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) return dateStr;
        const parts = dateStr.split('/');
        if (parts.length === 3) {
            return `${parts[2]}-${parts[1]}-${parts[0]}`;
        }
        return '';
    };

    const [formData, setFormData] = useState({
        registration_no: editData?.registrationNo || '',
        company_id: editData?.companyId || '',
        tag_id: editData?.tagId || '',
        scope_id: editData?.scopeId || '',
        certification_authority: editData?.certificationAuthority || '',
        effective_date: convertToDateInput(editData?.effectiveDate || ''),
        valid_until: convertToDateInput(editData?.validUntil || ''),
        status: editData?.status || 'Active',
        remark: '', // Remark is not currently in ComputedLicenseData but in DB
    });

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const [companiesRes, tagsRes, scopesRes] = await Promise.all([
                    fetch('/api/companies'),
                    fetch('/api/tags'),
                    fetch('/api/scopes')
                ]);

                if (companiesRes.ok) setCompanies(await companiesRes.json());
                if (tagsRes.ok) setTags(await tagsRes.json());
                if (scopesRes.ok) setScopes(await scopesRes.json());
            } catch (error) {
                console.error('Error fetching options:', error);
            }
        };

        fetchOptions();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const url = editData
                ? `/api/licenses/${editData.id}`
                : '/api/licenses/create';

            const method = editData ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                onSuccess();
                onClose();
            } else {
                const errorData = await response.json();
                alert(`เกิดข้อผิดพลาด: ${errorData.error || 'กรุณาลองใหม่อีกครั้ง'}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-[rgb(var(--bg-primary))] rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-[rgb(var(--bg-primary))] border-b border-[rgb(var(--border-color))] px-6 py-4 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-[rgb(var(--text-primary))]">
                        {editData ? 'แก้ไขใบอนุญาต' : 'เพิ่มใบอนุญาตใหม่'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--text-primary))]"
                    >
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-[rgb(var(--text-primary))] mb-1">
                                เลขทะเบียน *
                            </label>
                            <input
                                type="text"
                                name="registration_no"
                                required
                                value={formData.registration_no}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-[rgb(var(--border-color))] rounded-lg bg-[rgb(var(--bg-secondary))] text-[rgb(var(--text-primary))] focus:ring-2 focus:ring-blue-500"
                                placeholder="SG-20-013"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[rgb(var(--text-primary))] mb-1">
                                บริษัท *
                            </label>
                            <select
                                name="company_id"
                                required
                                value={formData.company_id}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-[rgb(var(--border-color))] rounded-lg bg-[rgb(var(--bg-secondary))] text-[rgb(var(--text-primary))] focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">เลือกบริษัท</option>
                                {companies.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[rgb(var(--text-primary))] mb-1">
                                Tag *
                            </label>
                            <select
                                name="tag_id"
                                required
                                value={formData.tag_id}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-[rgb(var(--border-color))] rounded-lg bg-[rgb(var(--bg-secondary))] text-[rgb(var(--text-primary))] focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">เลือก Tag</option>
                                {tags.map(t => (
                                    <option key={t.id} value={t.id}>{t.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[rgb(var(--text-primary))] mb-1">
                                หน่วยรับรอง *
                            </label>
                            <input
                                type="text"
                                name="certification_authority"
                                required
                                value={formData.certification_authority}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-[rgb(var(--border-color))] rounded-lg bg-[rgb(var(--bg-secondary))] text-[rgb(var(--text-primary))] focus:ring-2 focus:ring-blue-500"
                                placeholder="กรมวิชาการเกษตร"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-[rgb(var(--text-primary))] mb-1">
                                Scope (Standard & Criteria) *
                            </label>
                            <select
                                name="scope_id"
                                required
                                value={formData.scope_id}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-[rgb(var(--border-color))] rounded-lg bg-[rgb(var(--bg-secondary))] text-[rgb(var(--text-primary))] focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">เลือก Scope</option>
                                {scopes.map(s => (
                                    <option key={s.id} value={s.id}>{s.standard_code} - {s.description}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[rgb(var(--text-primary))] mb-1">
                                วันที่เริ่มต้น *
                            </label>
                            <input
                                type="date"
                                name="effective_date"
                                required
                                value={formData.effective_date}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-[rgb(var(--border-color))] rounded-lg bg-[rgb(var(--bg-secondary))] text-[rgb(var(--text-primary))] focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[rgb(var(--text-primary))] mb-1">
                                วันหมดอายุ *
                            </label>
                            <input
                                type="date"
                                name="valid_until"
                                required
                                value={formData.valid_until}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-[rgb(var(--border-color))] rounded-lg bg-[rgb(var(--bg-secondary))] text-[rgb(var(--text-primary))] focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[rgb(var(--text-primary))] mb-1">
                                สถานะ *
                            </label>
                            <select
                                name="status"
                                required
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-[rgb(var(--border-color))] rounded-lg bg-[rgb(var(--bg-secondary))] text-[rgb(var(--text-primary))] focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                                <option value="Pending">Pending</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[rgb(var(--text-primary))] mb-1">
                            หมายเหตุ
                        </label>
                        <textarea
                            name="remark"
                            value={formData.remark}
                            onChange={handleChange}
                            rows={3}
                            className="w-full px-3 py-2 border border-[rgb(var(--border-color))] rounded-lg bg-[rgb(var(--bg-secondary))] text-[rgb(var(--text-primary))] focus:ring-2 focus:ring-blue-500"
                            placeholder="หมายเหตุเพิ่มเติม..."
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-[rgb(var(--border-color))]">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-[rgb(var(--text-secondary))] bg-[rgb(var(--bg-secondary))] hover:bg-[rgb(var(--bg-tertiary))] rounded-lg transition-colors"
                        >
                            ยกเลิก
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
                        >
                            {loading ? 'กำลังบันทึก...' : editData ? 'บันทึกการแก้ไข' : 'เพิ่มใบอนุญาต'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
