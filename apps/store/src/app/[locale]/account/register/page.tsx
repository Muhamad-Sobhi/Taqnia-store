import { notFound } from "next/navigation";

import { RegistrationForm } from "@/components/features/auth/registration-form";
import { isLocale } from "@/lib/locale";

type RegisterPageProps = Readonly<{
  params: Promise<{ locale: string }>;
}>;

export default async function RegisterPage({ params }: RegisterPageProps) {
  const { locale: value } = await params;
  if (!isLocale(value)) {
    notFound();
  }

  return (
    <main id="main-content" className="page-shell">
      <RegistrationForm locale={value} />
    </main>
  );
}
