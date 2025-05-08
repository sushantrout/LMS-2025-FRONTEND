import React from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    if(process.env.NEXT_PUBLIC_ROLE !== 'admin') {
        return <>Not Authorized</>
    }
  return <>{children}</>;
}
