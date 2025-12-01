import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const supabase = await createClient();

        const { error } = await supabase
            .from('licenses')
            .delete()
            .eq('id', params.id);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to delete license' },
            { status: 500 }
        );
    }
}

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const supabase = await createClient();

        const { data: license, error } = await supabase
            .from('licenses')
            .select(`
                *,
                companies (id, name),
                tags (id, name),
                scopes (id, standard_code, description)
            `)
            .eq('id', params.id)
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // Transform to match ComputedLicenseData
        const transformedLicense = {
            id: license.id,
            registrationNo: license.registration_no,
            company: license.companies?.name || license.company || 'Unknown',
            tag: license.tags?.name || license.tag || '-',
            standardScope: license.scopes?.standard_code || license.standard_scope || '-',
            criteriaScope: license.scopes?.description || license.criteria_scope || '-',
            certificationAuthority: license.certification_authority || '-',
            effectiveDate: license.effective_date,
            validUntil: license.valid_until,
            status: license.status,
            remark: license.remark,

            // IDs for editing
            companyId: license.companies?.id,
            tagId: license.tags?.id,
            scopeId: license.scopes?.id
        };

        return NextResponse.json(transformedLicense);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch license' },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const supabase = await createClient();
        const body = await request.json();

        const { error } = await supabase
            .from('licenses')
            .update(body)
            .eq('id', params.id);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to update license' },
            { status: 500 }
        );
    }
}
