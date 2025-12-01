import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    const supabase = await createClient();

    try {
        const { data, error } = await supabase
            .from('scopes')
            .select('*')
            .order('standard_code', { ascending: true });

        if (error) throw error;

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching scopes:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const supabase = await createClient();
    try {
        const body = await request.json();
        const { data, error } = await supabase
            .from('scopes')
            .insert([body])
            .select()
            .single();

        if (error) throw error;
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error creating scope:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
