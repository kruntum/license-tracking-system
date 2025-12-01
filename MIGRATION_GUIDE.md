# คู่มือการ Migrate Database

## ขั้นตอนที่ 1: รันคำสั่ง Migration

1. เข้าไปที่ **Supabase Dashboard** (https://app.supabase.com)
2. เลือก Project ของคุณ
3. ไปที่เมนู **SQL Editor** (ที่แถบด้านซ้าย)
4. คลิก **New Query**
5. Copy โค้ดจากไฟล์ `migrations/01_normalization.sql` ทั้งหมด
6. Paste ลงใน SQL Editor
7. คลิก **Run** หรือกด `Ctrl+Enter`

## ขั้นตอนที่ 2: ตรวจสอบผลลัพธ์

หลังจากรัน SQL สำเร็จแล้ว ให้ตรวจสอบว่าตารางใหม่ถูกสร้างขึ้นแล้ว:

```sql
SELECT * FROM companies LIMIT 5;
SELECT * FROM tags LIMIT 5;
SELECT * FROM scopes LIMIT 5;
```

## ขั้นตอนที่ 3: ตรวจสอบความถูกต้อง

ตรวจสอบว่า Foreign Keys ถูก Update ถูกต้อง:

```sql
SELECT 
  l.id,
  l.registration_no,
  c.name AS company_name,
  t.name AS tag_name,
  s.standard_code,
  s.description
FROM licenses l
LEFT JOIN companies c ON l.company_id = c.id
LEFT JOIN tags t ON l.tag_id = t.id
LEFT JOIN scopes s ON l.scope_id = s.id
LIMIT 10;
```

## ขั้นตอนที่ 4: (Optional) ลบ Columns เก่า

**⚠️ คำเตือน:** ทำขั้นตอนนี้เฉพาะเมื่อคุณแน่ใจว่าระบบทำงานถูกต้องแล้ว!

```sql
ALTER TABLE licenses DROP COLUMN company;
ALTER TABLE licenses DROP COLUMN tag;
ALTER TABLE licenses DROP COLUMN standard_scope;
ALTER TABLE licenses DROP COLUMN criteria_scope;
```

## สิ่งที่ต้องทำหลัง Migration

1. ✅ API Routes ถูกอัปเดตแล้ว (`/api/licenses`, `/api/companies`, `/api/tags`, `/api/scopes`)
2. ✅ Settings Page สำหรับจัดการ Master Data พร้อมใช้งาน
3. ⏳ Dashboard Page ต้องอัปเดตให้ใช้ API ใหม่ (ผมจะช่วยทำให้)

## หากเกิดปัญหา

หากมีข้อผิดพลาด คุณสามารถ Rollback ได้โดย:

```sql
-- ลบ Foreign Key Columns
ALTER TABLE licenses DROP COLUMN company_id;
ALTER TABLE licenses DROP COLUMN tag_id;
ALTER TABLE licenses DROP COLUMN scope_id;

-- ลบตารางใหม่
DROP TABLE IF EXISTS companies CASCADE;
DROP TABLE IF EXISTS tags CASCADE;
DROP TABLE IF EXISTS scopes CASCADE;
```
