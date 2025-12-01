import { LicenseData, ComputedLicenseData, LicenseStatus } from '../types';

export const parseDate = (dateStr: string): Date => {
  const [day, month, year] = dateStr.split('/').map(Number);
  // Assuming year is AD. If BE (Thai year), subtract 543. 
  // Based on screenshot (2020, 2026), it looks like AD.
  return new Date(year, month - 1, day);
};

export const calculateDaysRemaining = (validUntil: string): number => {
  const targetDate = parseDate(validUntil);
  const today = new Date();
  // Reset hours to compare dates only
  targetDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  
  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export const getStatus = (days: number): LicenseStatus => {
  if (days < 0) return 'Expired';
  if (days <= 90) return 'Expiring Soon'; // Warn 3 months ahead
  return 'Active';
};

export const processLicenseData = (data: LicenseData[]): ComputedLicenseData[] => {
  return data.map(item => {
    const days = calculateDaysRemaining(item.validUntil);
    return {
      ...item,
      daysRemaining: days,
      computedStatus: getStatus(days),
      validUntilDateObj: parseDate(item.validUntil)
    };
  }).sort((a, b) => a.daysRemaining - b.daysRemaining); // Sort by urgency
};