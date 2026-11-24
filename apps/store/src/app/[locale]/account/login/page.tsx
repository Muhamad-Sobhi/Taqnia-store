import { notFound } from "next/navigation";

import { LoginForm } from "@/components/features/auth/login-form";
import { isLocale } from "@/lib/locale";

type LoginPageProps = Readonly<{
  params: Promise<{ locale: string }>;
}>;

export default async function LoginPage({ params }: LoginPageProps) {
  const { locale: value } = await params;
  if (!isLocale(value)) {
    notFound();
  }

  return (
    <main id="main-content" className="page-shell">
      <LoginForm locale={value} />
    </main>
  );
}
