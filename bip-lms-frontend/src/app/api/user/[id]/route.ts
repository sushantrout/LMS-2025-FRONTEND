import { ServiceApiPath } from '@/types/constants/service-api-path';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: {params: {id: string}}) {
    const { id } = params;
    let baseURL = process.env.NEXT_PUBLIC_BASE_URL;
    const isDomain = (process.env.NEXT_PUBLIC_ENVIRONMENT === 'prod' || process.env.NEXT_PUBLIC_ENVIRONMENT === 'qa');
    let token = request.cookies.get("token")?.value;
    let url = isDomain ? `${process.env.NEXT_PUBLIC_GATEWAY_SERVICE_URL}` : baseURL;

    const response = await fetch(`${url}/${ServiceApiPath.IDENTITY}/user/image/${id}`, {
        cache:'no-store',
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    });

    if (!response.ok) {
        return NextResponse.json({ message: 'Failed to fetch the image' }, { status: response.status });
    }

    const imageBuffer = await response.arrayBuffer();
    return new NextResponse(imageBuffer, {
        headers: {
            'Content-Type': response.headers.get('Content-Type') || 'image/png',
        }
    });
}