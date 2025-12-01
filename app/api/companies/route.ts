import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    const supabase = await createClient();

    try {
        const { data, error } = await supabase
            .from('companies')
            .select('*')
            .order('name', { ascending: true });

        if (error) throw error;

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching companies:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const supabase = await createClient();
    try {
        const body = await request.json();
        const { data, error } = await supabase
            .from('companies')
            .insert([body])
            .select()
            .single();

        if (error) throw error;
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error creating company:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
