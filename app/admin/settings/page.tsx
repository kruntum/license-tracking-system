'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { Company, Tag, Scope } from '@/types';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState<'companies' | 'tags' | 'scopes'>('companies');
    const [companies, setCompanies] = useState<Company[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);
    const [scopes, setScopes] = useState<Scope[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingItem, setEditingItem] = useState<any>(null);
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
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
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string, type: 'companies' | 'tags' | 'scopes') => {
        if (!confirm('คุณแน่ใจหรือไม่ที่จะลบข้อมูลนี้?')) return;

        try {
            const res = await fetch(`/api/${type}/${id}`, { method: 'DELETE' });
            if (res.ok) {
                fetchData();
            } else {
                alert('ไม่สามารถลบข้อมูลได้ (อาจมีการใช้งานอยู่)');
            }
        } catch (error) {
            console.error('Error deleting:', error);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        const type = activeTab;
        const isEdit = !!editingItem?.id;
        const url = isEdit ? `/api/${type}/${editingItem.id}` : `/api/${type}`;
        const method = isEdit ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editingItem),
            });

            if (res.ok) {
                setEditingItem(null);
                setIsAdding(false);
                fetchData();
            } else {
                alert('เกิดข้อผิดพลาดในการบันทึก');
            }
        } catch (error) {
            console.error('Error saving:', error);
        }
    };

    const renderTable = (data: any[], columns: { key: string; label: string }[]) => (
        <div className="bg-[rgb(var(--bg-primary))] rounded-lg shadow overflow-hidden border border-[rgb(var(--border-color))]">
            <table className="min-w-full divide-y divide-[rgb(var(--border-color))]">
                <thead className="bg-[rgb(var(--bg-secondary))]">
                    <tr>
                        {columns.map((col) => (
                            <th key={col.key} className="px-6 py-3 text-left text-xs font-medium text-[rgb(var(--text-secondary))] uppercase tracking-wider">
                                {col.label}
                            </th>
                        ))}
                        <th className="px-6 py-3 text-right text-xs font-medium text-[rgb(var(--text-secondary))] uppercase tracking-wider">
                            จัดการ
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-[rgb(var(--bg-primary))] divide-y divide-[rgb(var(--border-color))]">
                    {data.map((item) => (
                        <tr key={item.id}>
                            {columns.map((col) => (
                                <td key={col.key} className="px-6 py-4 whitespace-nowrap text-sm text-[rgb(var(--text-primary))]">
                                    {item[col.key]}
                                </td>
                            ))}
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button
                                    onClick={() => { setEditingItem(item); setIsAdding(false); }}
                                    className="text-blue-600 hover:text-blue-900 dark:hover:text-blue-400 mr-4"
                                >
                                    <Edit size={18} />
                                </button>
                                <button
                                    onClick={() => handleDelete(item.id, activeTab)}
                                    className="text-red-600 hover:text-red-900 dark:hover:text-red-400"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    const renderForm = () => {
        const fields = activeTab === 'companies'
            ? [
                { name: 'name', label: 'ชื่อบริษัท' },
                { name: 'address', label: 'ที่อยู่' },
                { name: 'contact_person', label: 'ผู้ติดต่อ' },
                { name: 'email', label: 'อีเมล' },
                { name: 'phone', label: 'เบอร์โทร' }
            ]
            : activeTab === 'tags'
                ? [
                    { name: 'name', label: 'ชื่อ Tag' },
                    { name: 'description', label: 'คำอธิบาย' }
                ]
                : [
                    { name: 'standard_code', label: 'Standard Code' },
                    { name: 'description', label: 'Description' }
                ];

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-[rgb(var(--bg-primary))] rounded-lg shadow-xl max-w-md w-full">
                    <div className="p-6">
                        <h3 className="text-lg font-bold mb-4 text-[rgb(var(--text-primary))]">
                            {editingItem?.id ? 'แก้ไขข้อมูล' : 'เพิ่มข้อมูลใหม่'}
                        </h3>
                        <form onSubmit={handleSave} className="space-y-4">
                            {fields.map((field) => (
                                <div key={field.name}>
                                    <label className="block text-sm font-medium text-[rgb(var(--text-primary))] mb-1">
                                        {field.label}
                                    </label>
                                    <input
                                        type="text"
                                        required={field.name === 'name' || field.name === 'standard_code'}
                                        value={editingItem?.[field.name] || ''}
                                        onChange={(e) => setEditingItem({ ...editingItem, [field.name]: e.target.value })}
                                        className="w-full px-3 py-2 border border-[rgb(var(--border-color))] rounded-lg bg-[rgb(var(--bg-secondary))] text-[rgb(var(--text-primary))]"
                                    />
                                </div>
                            ))}
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => { setEditingItem(null); setIsAdding(false); }}
                                    className="px-4 py-2 text-sm text-[rgb(var(--text-secondary))]"
                                >
                                    ยกเลิก
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                                >
                                    บันทึก
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-[rgb(var(--text-primary))]">จัดการข้อมูลหลัก (Master Data)</h1>
                <button
                    onClick={() => { setEditingItem({}); setIsAdding(true); }}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus size={20} />
                    <span>เพิ่มข้อมูล</span>
                </button>
            </div>

            <div className="mb-6 border-b border-[rgb(var(--border-color))]">
                <nav className="-mb-px flex space-x-8">
                    {['companies', 'tags', 'scopes'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`
                whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm capitalize
                ${activeTab === tab
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--text-primary))] hover:border-[rgb(var(--border-color))]'}
              `}
                        >
                            {tab}
                        </button>
                    ))}
                </nav>
            </div>

            {loading ? (
                <div className="text-center py-10">Loading...</div>
            ) : (
                <>
                    {activeTab === 'companies' && renderTable(companies, [
                        { key: 'name', label: 'ชื่อบริษัท' },
                        { key: 'contact_person', label: 'ผู้ติดต่อ' },
                        { key: 'phone', label: 'เบอร์โทร' }
                    ])}
                    {activeTab === 'tags' && renderTable(tags, [
                        { key: 'name', label: 'ชื่อ Tag' },
                        { key: 'description', label: 'คำอธิบาย' }
                    ])}
                    {activeTab === 'scopes' && renderTable(scopes, [
                        { key: 'standard_code', label: 'Standard Code' },
                        { key: 'description', label: 'Description' }
                    ])}
                </>
            )}

            {(editingItem || isAdding) && renderForm()}
        </div>
    );
}
