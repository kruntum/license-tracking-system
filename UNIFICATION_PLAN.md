# แผนการรวมระบบและ Migration

## สถานะปัจจุบัน
- ✅ Database Schema ใหม่สร้างเสร็จ (companies, tags, scopes)
- ✅ API Routes สำหรับ normalized data พร้อมใช้งาน
- ✅ Admin Dashboard + Settings page พร้อมใช้งาน
- ⏳ Dashboard ยังใช้โครงสร้างเดิม (ต้องอัปเดต)

## ขั้นตอนที่ต้องทำ

### Phase 1: Migration Database ✨
1. รัน SQL Script จาก `migrations/01_normalization.sql` ใน Supabase
2. ตรวจสอบว่าข้อมูลถูก migrate ถูกต้อง
3. (Optional) ลบ columns เก่าออก

### Phase 2: ปรับ Dashboard Components 🔧
1. อัปเดต `types.ts` ให้สอดคล้องกัน
2. แก้ไข Dashboard page ให้ใช้ API แทน Supabase Client
3. แก้ไข LicenseFormModal ให้ใช้ dropdowns สำหรับ Company/Tag/Scope
4. อัปเดต LicenseDetailsModal

### Phase 3: Cleanup & Testing 🧹
1. ลบโค้ดที่ไม่ใช้แล้ว
2. ทดสอบทุก flow (Create, Read, Update, Delete)
3. ตรวจสอบ Settings page

## ไฟล์ที่ต้องแก้ไข

### Core Files
- [x] `migrations/01_normalization.sql` - พร้อมแล้ว
- [x] `app/api/licenses/route.ts` - พร้อมแล้ว
- [x] `app/api/companies/*` - พร้อมแล้ว
- [x] `app/api/tags/*` - พร้อมแล้ว
- [x] `app/api/scopes/*` - พร้อมแล้ว
- [x] `app/admin/settings/page.tsx` - พร้อมแล้ว

### Dashboard Files (ต้องอัปเดต)
- [ ] `app/dashboard/page.tsx` - ใช้ API แทน direct query
- [ ] `components/LicenseFormModal.tsx` - เปลี่ยนเป็น dropdowns
- [ ] `types.ts` - รวม types ให้เป็นมาตรฐานเดียว

## คำแนะนำ
1. **Backup ข้อมูลก่อน**: Export data จาก Supabase ก่อนรัน migration
2. **Test ใน Development**: ทดสอบใน local/staging ก่อน production
3. **Migration Strategy**: ใช้ dual-write ระหว่างเปลี่ยนผ่าน (เขียนทั้ง old/new columns)
