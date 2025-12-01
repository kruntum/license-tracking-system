-- Create licenses table
CREATE TABLE IF NOT EXISTS licenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_no TEXT NOT NULL,
  company TEXT NOT NULL,
  tag TEXT,
  standard_scope TEXT,
  criteria_scope TEXT,
  certification_authority TEXT,
  effective_date DATE,
  valid_until DATE NOT NULL,
  status TEXT,
  remark TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_licenses_valid_until ON licenses(valid_until);
CREATE INDEX IF NOT EXISTS idx_licenses_company ON licenses(company);
CREATE INDEX IF NOT EXISTS idx_licenses_tag ON licenses(tag);

-- Insert mock data
INSERT INTO licenses (registration_no, company, tag, standard_scope, criteria_scope, certification_authority, effective_date, valid_until, status) VALUES
('SG-20-013', 'บริษัท เอเชีย ไทย อิมพอร์ต แอนด์ เอ็กซ์พอร์ต จำกัด', 'SG', 'สมพ.๑๒', 'ส่งออกผักและผลไม้', 'กรมวิชาการเกษตร', '2020-03-31', '2022-03-30', 'หมดอายุ'),
('DOA 45000 99 130213', 'บริษัท ซัดเซส อิมพอร์ต แอนด์ เอ็กซ์พอร์ต จำกัด', 'DOA', 'กมพ.๒๑', 'การขึ้นทะเบียนโรงงานผลิตสินค้าพืช', 'กรมวิชาการเกษตร', '2022-12-09', '2024-12-08', 'หมดอายุ'),
('JP-21-050', 'บริษัท ซัดเซส อิมพอร์ต แอนด์ เอ็กซ์พอร์ต จำกัด', 'JP', 'สมพ.๑๒', 'ส่งออกผักและผลไม้', 'กรมวิชาการเกษตร', '2023-10-05', '2025-10-04', 'ใช้งาน'),
('DOA 45000 02 133216', 'นายอุทัย วิริยะพานิชภักดี', 'DOA', 'กมพ.๒๑', 'การขึ้นทะเบียนโรงงานผลิตสินค้าพืช', 'กรมวิชาการเกษตร', '2024-01-19', '2026-01-18', 'ใช้งาน'),
('ACFS90460200097', 'บริษัท ซัดเซส อิมพอร์ต แอนด์ เอ็กซ์พอร์ต จำกัด', 'MOKORSOR2FROZENDURIAN', 'มกษ.2', 'ผู้ผลิตทุเรียนแช่เยือกแข็ง', 'กรมวิชาการเกษตร', '2023-02-28', '2026-02-27', 'ใช้งาน'),
('DU-1-48-089', 'บริษัท ซันมูน อิมพอร์ต แอนด์ เอ็กซ์พอร์ต จำกัด', 'DU', 'กมพ.๒๗', 'ส่งออกทุเรียนสด', 'กรมวิชาการเกษตร', '2024-04-12', '2026-04-11', 'ใช้งาน'),
('CN1572', 'บริษัท ซัดเซส อิมพอร์ต แอนด์ เอ็กซ์พอร์ต จำกัด', 'CN', 'สมพ.๑๒', 'ส่งออกผักและผลไม้', 'กรมวิชาการเกษตร', '2025-08-15', '2027-08-14', 'ใช้งาน'),
('ACFS10040400004', 'บริษัท ซัดเซส อิมพอร์ต แอนด์ เอ็กซ์พอร์ต จำกัด', 'MOKORSOR4SULFURDIOXIDE', 'มกษ.4', 'ผู้ผลิตผลไม้สดรมด้วยก๊าซซัลเฟอร์ไดออกไซด์', 'กรมวิชาการเกษตร', '2068-05-04', '2028-05-03', 'ใช้งาน'),
('EU-08-029', 'บริษัท ซัดเซส อิมพอร์ต แอนด์ เอ็กซ์พอร์ต จำกัด', 'EU', 'สมพ.๑๒', 'ส่งออกผักและผลไม้', 'กรมวิชาการเกษตร', '2023-08-18', '2025-08-17', 'หมดอายุ'),
('JP-21-052', 'บริษัท มิลเลี่ยน ฟรุ๊ต จำกัด', 'JP', 'สมพ.๑๒', 'ส่งออกผักและผลไม้', 'กรมวิชาการเกษตร', '2025-11-14', '2027-11-13', 'ใช้งาน');

-- Enable Row Level Security (optional, for multi-user scenarios)
-- ALTER TABLE licenses ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations for now (adjust based on your auth requirements)
-- CREATE POLICY "Allow all operations" ON licenses FOR ALL USING (true);
