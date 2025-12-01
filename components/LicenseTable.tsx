import React from 'react';
import { ComputedLicenseData } from '../types';
import { StatusBadge } from './StatusBadge';
import { Edit, Trash2 } from 'lucide-react';

interface LicenseTableProps {
  data: ComputedLicenseData[];
  groupBy: 'none' | 'company' | 'tag';
  onEdit?: (license: ComputedLicenseData) => void;
  onDelete?: (id: string) => void;
}

export const LicenseTable: React.FC<LicenseTableProps> = ({ data, groupBy, onEdit, onDelete }) => {

  const renderTable = (items: ComputedLicenseData[]) => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-[rgb(var(--border-color))]">
        <thead className="bg-[rgb(var(--bg-secondary))]">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[rgb(var(--text-secondary))] uppercase tracking-wider">Registration No.</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[rgb(var(--text-secondary))] uppercase tracking-wider">Company</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[rgb(var(--text-secondary))] uppercase tracking-wider">Tag / Scope</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[rgb(var(--text-secondary))] uppercase tracking-wider">Dates</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[rgb(var(--text-secondary))] uppercase tracking-wider">Status</th>
            {(onEdit || onDelete) && (
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-[rgb(var(--text-secondary))] uppercase tracking-wider">Actions</th>
            )}
          </tr>
        </thead>
        <tbody className="bg-[rgb(var(--bg-primary))] divide-y divide-[rgb(var(--border-color))]">
          {items.map((item) => (
            <tr key={item.id} className="hover:bg-[rgb(var(--bg-secondary))] transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-blue-600 dark:text-blue-400">{item.registrationNo}</div>
                <div className="text-xs text-[rgb(var(--text-tertiary))]">{item.certificationAuthority}</div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-[rgb(var(--text-primary))]">{item.company}</div>
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-col gap-1">
                  <span className="inline-flex w-fit items-center px-2 py-0.5 rounded text-xs font-medium bg-[rgb(var(--bg-secondary))] text-[rgb(var(--text-primary))] border border-[rgb(var(--border-color))]">
                    {item.tag}
                  </span>
                  <span className="text-xs text-[rgb(var(--text-tertiary))]">{item.standardScope} - {item.criteriaScope}</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-[rgb(var(--text-primary))]">Valid: {item.validUntil}</div>
                <div className="text-xs text-[rgb(var(--text-tertiary))]">Effective: {item.effectiveDate}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <StatusBadge daysRemaining={item.daysRemaining} />
              </td>
              {(onEdit || onDelete) && (
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {onEdit && (
                    <button
                      onClick={() => onEdit(item)}
                      className="text-blue-600 hover:text-blue-900 dark:hover:text-blue-400 mr-4"
                      title="แก้ไข"
                    >
                      <Edit size={18} />
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => onDelete(item.id)}
                      className="text-red-600 hover:text-red-900 dark:hover:text-red-400"
                      title="ลบ"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  if (groupBy === 'none') {
    return <div className="bg-[rgb(var(--bg-primary))] shadow rounded-lg overflow-hidden border border-[rgb(var(--border-color))]">{renderTable(data)}</div>;
  }

  // Grouping Logic
  const grouped = data.reduce((acc, item) => {
    const key = groupBy === 'company' ? item.company : item.tag;
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {} as Record<string, ComputedLicenseData[]>);

  return (
    <div className="space-y-8">
      {Object.entries(grouped).map(([groupTitle, items]) => (
        <div key={groupTitle} className="bg-[rgb(var(--bg-primary))] shadow rounded-lg overflow-hidden border border-[rgb(var(--border-color))]">
          <div className="bg-[rgb(var(--bg-secondary))] px-6 py-3 border-b border-[rgb(var(--border-color))] flex justify-between items-center">
            <h3 className="font-bold text-[rgb(var(--text-primary))] flex items-center gap-2">
              {groupBy === 'company' ? '🏢' : '🏷️'} {groupTitle}
            </h3>
            <span className="bg-[rgb(var(--bg-primary))] px-2 py-1 rounded text-xs text-[rgb(var(--text-secondary))] border border-[rgb(var(--border-color))] shadow-sm">{(items as ComputedLicenseData[]).length} items</span>
          </div>
          {renderTable(items as ComputedLicenseData[])}
        </div>
      ))}
    </div>
  );
};