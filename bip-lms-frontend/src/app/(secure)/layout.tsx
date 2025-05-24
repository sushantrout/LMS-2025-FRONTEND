import LayoutWrapper from '@/components/layouts/layout-wrapper';
import { AuthProvider } from '@/contexts/auth-provider';
import ClientIdProviders from '@/contexts/client-id-provider';
import ClientQueryProviders from '@/contexts/client-query-provider';
import React, { Suspense } from 'react'

export default function SecureRootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ClientQueryProviders>
            <Suspense fallback={<div>Loading...</div>}>
                <ClientIdProviders>
                    <AuthProvider>
                        <LayoutWrapper>
                            {children}
                        </LayoutWrapper>
                    </AuthProvider>
                </ClientIdProviders>
            </Suspense>
        </ClientQueryProviders>
    )
}
