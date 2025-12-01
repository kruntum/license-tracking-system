import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// แก้ไข Type params เป็น Promise
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const supabase = await createClient();
    try {
        // await ค่า params ก่อนใช้งาน
        const { id } = await params;

        const body = await request.json();
        const { error } = await supabase
            .from('tags')
            .update(body)
            .eq('id', id); // ใช้ id ที่ await มาแล้ว

        if (error) throw error;
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating tag:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// แก้ไข Type params เป็น Promise
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const supabase = await createClient();
    try {
        // await ค่า params ก่อนใช้งาน
        const { id } = await params;

        const { error } = await supabase
            .from('tags')
            .delete()
            .eq('id', id); // ใช้ id ที่ await มาแล้ว

        if (error) throw error;
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting tag:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}