import React from 'react';

interface StatusBadgeProps {
    daysRemaining: number;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ daysRemaining }) => {
    if (daysRemaining < 0) {
        return (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-600 text-white">
                หมดอายุ ({Math.abs(daysRemaining)} วัน)
            </span>
        );
    } else if (daysRemaining <= 90) {
        return (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-orange-600 text-white">
                ใกล้หมด ({daysRemaining} วัน)
            </span>
        );
    } else {
        return (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-600 text-white">
                ใช้งาน ({daysRemaining} วัน)
            </span>
        );
    }
};
