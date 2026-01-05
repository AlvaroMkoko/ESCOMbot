import { NextResponse } from 'next/server';

export async function POST() {
    try {
        // Crear respuesta que limpia la cookie
        const response = NextResponse.json({ success: true });
        
        // Limpiar cookie del lado del servidor
        response.cookies.set('userId', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 0,
            path: '/',
        });

        return response;
    } catch (error) {
        console.error('Logout error:', error);
        return NextResponse.json({ error: 'Logout failed' }, { status: 500 });
    }
}
