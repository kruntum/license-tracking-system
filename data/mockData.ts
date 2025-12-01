import { LicenseData } from '../types';

export const mockLicenses: LicenseData[] = [
  {
    id: '1',
    registrationNo: 'SG-20-013',
    company: 'บริษัท เอเชีย ไทย อิมพอร์ต แอนด์ เอ็กซ์พอร์ต จำกัด',
    tag: 'SG',
    standardScope: 'สมพ.๑๒',
    criteriaScope: 'ส่งออกผักและผลไม้',
    certificationAuthority: 'กรมวิชาการเกษตร',
    effectiveDate: '31/3/2020',
    validUntil: '30/3/2022', // Expired
    status: 'หมดอายุ'
  },
  {
    id: '2',
    registrationNo: 'DOA 45000 99 130213',
    company: 'บริษัท ซัดเซส อิมพอร์ต แอนด์ เอ็กซ์พอร์ต จำกัด',
    tag: 'DOA',
    standardScope: 'กมพ.๒๑',
    criteriaScope: 'การขึ้นทะเบียนโรงงานผลิตสินค้าพืช',
    certificationAuthority: 'กรมวิชาการเกษตร',
    effectiveDate: '9/12/2022',
    validUntil: '8/12/2024', // Near expiry or expired depending on current date
    status: 'หมดอายุ'
  },
  {
    id: '3',
    registrationNo: 'JP-21-050',
    company: 'บริษัท ซัดเซส อิมพอร์ต แอนด์ เอ็กซ์พอร์ต จำกัด',
    tag: 'JP',
    standardScope: 'สมพ.๑๒',
    criteriaScope: 'ส่งออกผักและผลไม้',
    certificationAuthority: 'กรมวิชาการเกษตร',
    effectiveDate: '5/10/2023',
    validUntil: '4/10/2025', // Active
    status: 'ใช้งาน'
  },
  {
    id: '4',
    registrationNo: 'DOA 45000 02 133216',
    company: 'นายอุทัย วิริยะพานิชภักดี',
    tag: 'DOA',
    standardScope: 'กมพ.๒๑',
    criteriaScope: 'การขึ้นทะเบียนโรงงานผลิตสินค้าพืช',
    certificationAuthority: 'กรมวิชาการเกษตร',
    effectiveDate: '19/1/2024',
    validUntil: '18/1/2026',
    status: 'ใช้งาน'
  },
  {
    id: '5',
    registrationNo: 'ACFS90460200097',
    company: 'บริษัท ซัดเซส อิมพอร์ต แอนด์ เอ็กซ์พอร์ต จำกัด',
    tag: 'MOKORSOR2FROZENDURIAN',
    standardScope: 'มกษ.2',
    criteriaScope: 'ผู้ผลิตทุเรียนแช่เยือกแข็ง',
    certificationAuthority: 'กรมวิชาการเกษตร',
    effectiveDate: '28/2/2023',
    validUntil: '27/2/2026',
    status: 'ใช้งาน'
  },
  {
    id: '6',
    registrationNo: 'DU-1-48-089',
    company: 'บริษัท ซันมูน อิมพอร์ต แอนด์ เอ็กซ์พอร์ต จำกัด',
    tag: 'DU',
    standardScope: 'กมพ.๒๗',
    criteriaScope: 'ส่งออกทุเรียนสด',
    certificationAuthority: 'กรมวิชาการเกษตร',
    effectiveDate: '12/4/2024',
    validUntil: '11/4/2026',
    status: 'ใช้งาน'
  },
  {
    id: '7',
    registrationNo: 'CN1572',
    company: 'บริษัท ซัดเซส อิมพอร์ต แอนด์ เอ็กซ์พอร์ต จำกัด',
    tag: 'CN',
    standardScope: 'สมพ.๑๒',
    criteriaScope: 'ส่งออกผักและผลไม้',
    certificationAuthority: 'กรมวิชาการเกษตร',
    effectiveDate: '15/8/2025',
    validUntil: '14/8/2027',
    status: 'ใช้งาน'
  },
  {
    id: '8',
    registrationNo: 'ACFS10040400004',
    company: 'บริษัท ซัดเซส อิมพอร์ต แอนด์ เอ็กซ์พอร์ต จำกัด',
    tag: 'MOKORSOR4SULFURDIOXIDE',
    standardScope: 'มกษ.4',
    criteriaScope: 'ผู้ผลิตผลไม้สดรมด้วยก๊าซซัลเฟอร์ไดออกไซด์',
    certificationAuthority: 'กรมวิชาการเกษตร',
    effectiveDate: '4/5/2068', // Future/Error checking
    validUntil: '3/5/2028',
    status: 'ใช้งาน'
  },
  {
    id: '9',
    registrationNo: 'EU-08-029',
    company: 'บริษัท ซัดเซส อิมพอร์ต แอนด์ เอ็กซ์พอร์ต จำกัด',
    tag: 'EU',
    standardScope: 'สมพ.๑๒',
    criteriaScope: 'ส่งออกผักและผลไม้',
    certificationAuthority: 'กรมวิชาการเกษตร',
    effectiveDate: '18/8/2023',
    validUntil: '17/8/2025',
    status: 'หมดอายุ'
  },
  {
    id: '10',
    registrationNo: 'JP-21-052',
    company: 'บริษัท มิลเลี่ยน ฟรุ๊ต จำกัด',
    tag: 'JP',
    standardScope: 'สมพ.๑๒',
    criteriaScope: 'ส่งออกผักและผลไม้',
    certificationAuthority: 'กรมวิชาการเกษตร',
    effectiveDate: '14/11/2025',
    validUntil: '13/11/2027',
    status: 'ใช้งาน'
  }
];