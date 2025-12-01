import React from 'react';
import { Server, Database, Bell, Layout, Zap, DollarSign } from 'lucide-react';

const ArchitectureAdvice: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">คำแนะนำ: Tech Stack ฟรีและตอบโจทย์</h2>
            <p className="text-sm text-gray-500">สำหรับระบบแจ้งเตือนใบอนุญาตผ่าน LINE</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <div className="p-6 space-y-8">

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <h3 className="font-bold text-blue-800 flex items-center gap-2">
              <Zap size={20} />
              สรุปโซลูชันที่แนะนำ (ฟรี 100%)
            </h3>
            <p className="text-blue-700 mt-2">
              เพื่อสร้างระบบที่มี Dashboard ดูข้อมูล + แจ้งเตือนอัตโนมัติทุกวัน โดยไม่มีค่าใช้จ่าย ผมแนะนำชุดเครื่องมือนี้ครับ:
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* 1. Hosting & Backend */}
            <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
              <div className="bg-gray-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Layout className="text-gray-700" />
              </div>
              <h4 className="font-bold text-lg mb-2">1. Frontend & Hosting</h4>
              <p className="font-semibold text-black">Vercel (Free Tier)</p>
              <ul className="text-sm text-gray-600 mt-2 list-disc pl-4 space-y-1">
                <li>โฮสต์หน้าเว็บ React/Next.js ฟรี</li>
                <li>มี HTTPS ให้ฟรี</li>
                <li><strong>จุดเด่น:</strong> มี Vercel Cron Jobs (ฟรี 1 ครั้ง/วัน) ใช้ยิงคำสั่งตรวจสอบวันหมดอายุได้</li>
              </ul>
            </div>

            {/* 2. Database */}
            <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Database className="text-green-700" />
              </div>
              <h4 className="font-bold text-lg mb-2">2. Database</h4>
              <p className="font-semibold text-black">Supabase (Free Tier)</p>
              <ul className="text-sm text-gray-600 mt-2 list-disc pl-4 space-y-1">
                <li>ฐานข้อมูล PostgreSQL ฟรี 500MB</li>
                <li>ใช้ง่ายกว่า Firebase สำหรับข้อมูลตาราง (Relational)</li>
                <li>มี API ให้เรียกใช้ได้เลย ไม่ต้องเขียน Backend เยอะ</li>
              </ul>
            </div>

            {/* 3. Notification */}
            <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
              <div className="bg-green-500 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Bell className="text-white" />
              </div>
              <h4 className="font-bold text-lg mb-2">3. Notification</h4>
              <p className="font-semibold text-black">LINE Notify</p>
              <ul className="text-sm text-gray-600 mt-2 list-disc pl-4 space-y-1">
                <li>ฟรี ไม่จำกัดจำนวนข้อความ</li>
                <li>ตั้งค่าง่ายกว่า LINE OA (Messaging API)</li>
                <li>เหมาะสำหรับแจ้งเตือนเข้ากลุ่มทีมงาน</li>
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-xl text-gray-800 border-b pb-2">ขั้นตอนการทำงานของระบบ (Workflow)</h3>
            <div className="relative">
              <div className="absolute left-4 top-0 h-full w-0.5 bg-gray-200"></div>

              <div className="relative pl-10 pb-6">
                <div className="absolute left-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
                <h4 className="font-bold">Database (Supabase)</h4>
                <p className="text-gray-600 text-sm">เก็บข้อมูล License ทั้งหมด (Excel ที่คุณมี นำมา import เข้าที่นี่)</p>
              </div>

              <div className="relative pl-10 pb-6">
                <div className="absolute left-0 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
                <h4 className="font-bold">Scheduled Check (Vercel Cron)</h4>
                <p className="text-gray-600 text-sm">
                  ตั้งเวลา 09:00 น. ทุกวัน &rarr; Vercel จะเรียก API ภายในโปรเจคของคุณ (Serverless Function)
                </p>
              </div>

              <div className="relative pl-10 pb-6">
                <div className="absolute left-0 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-sm">3</div>
                <h4 className="font-bold">Logic Processing</h4>
                <p className="text-gray-600 text-sm">
                  Code จะดึงข้อมูลจาก Supabase &rarr; หา License ที่ <code>days_remaining &lt;= 30</code>
                </p>
              </div>

              <div className="relative pl-10">
                <div className="absolute left-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">4</div>
                <h4 className="font-bold">Notification (LINE Notify)</h4>
                <p className="text-gray-600 text-sm">
                  หากพบรายการใกล้หมดอายุ &rarr; ยิง HTTP POST ไปที่ LINE Notify API &rarr; เด้งเข้ามือถือทันที
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-bold text-gray-700 mb-2">ทำไมไม่ใช่ Firebase?</h4>
            <p className="text-sm text-gray-600">
              Firebase ดีมากครับ แต่ Free Tier (Spark Plan) <strong>บล็อกการส่งข้อมูลออกไปภายนอก</strong> (เช่นยิงไป LINE API) คุณต้องผูกบัตรเครดิตเพื่อใช้ Blaze Plan ถึงจะทำได้ แม้จะฟรีถ้าใช้น้อย แต่ Vercel + Supabase ยืดหยุ่นกว่าในเรื่องนี้สำหรับโปรเจคฟรี 100%
            </p>
          </div>

        </div>
        <div className="p-4 border-t bg-gray-50 text-right">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            เข้าใจแล้ว เริ่มใช้งาน Demo
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArchitectureAdvice;