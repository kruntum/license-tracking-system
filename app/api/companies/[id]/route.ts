import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// แก้ไข Type ของ params ให้เป็น Promise
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const supabase = await createClient();
    try {
        // เพิ่มบรรทัดนี้เพื่อ await ค่า params
        const { id } = await params;

        const body = await request.json();
        const { error } = await supabase
            .from('companies')
            .update(body)
            .eq('id', id); // ใช้ id ที่ await มาแล้ว

        if (error) throw error;
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating company:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// แก้ไข Type ของ params ให้เป็น Promise
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const supabase = await createClient();
    try {
        // เพิ่มบรรทัดนี้เพื่อ await ค่า params
        const { id } = await params;

        const { error } = await supabase
            .from('companies')
            .delete()
            .eq('id', id); // ใช้ id ที่ await มาแล้ว

        if (error) throw error;
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting company:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}