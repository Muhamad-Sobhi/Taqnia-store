import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound, redirect } from "next/navigation";

import { SkipLink } from "@/components/ui/skip-link";
import { AdminNavigation } from "@/components/features/admin/admin-navigation";
import { getLocaleProperties, isLocale } from "@/lib/locale";
import { getCurrentSession } from "@/server/auth/current-user";
import "../../../globals.css";

type AdminLayoutProps = Readonly<{
  params: Promise<{ locale: string }>;
  children: ReactNode;
}>;

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children, params }: AdminLayoutProps) {
  const { locale: value } = await params;
  if (!isLocale(value)) {
    notFound();
  }

  const session = await getCurrentSession();
  if (!session) {
    redirect(`/${value}/account/login`);
  }
  if (!session.roles.includes("admin")) {
    notFound();
  }

  const localeProperties = getLocaleProperties(value);

  return (
    <html lang={localeProperties.lang} dir={localeProperties.dir}>
      <body>
        <SkipLink locale={value} />
        <AdminNavigation locale={value} />
        {children}
      </body>
    </html>
  );
}
