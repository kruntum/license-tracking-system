import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    const supabase = await createClient();
    try {
        const body = await request.json();
        const { error } = await supabase
            .from('scopes')
            .update(body)
            .eq('id', params.id);

        if (error) throw error;
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating scope:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    const supabase = await createClient();
    try {
        const { error } = await supabase
            .from('scopes')
            .delete()
            .eq('id', params.id);

        if (error) throw error;
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting scope:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
