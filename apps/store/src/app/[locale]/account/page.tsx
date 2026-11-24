import { notFound, redirect } from "next/navigation";

import { getStorefrontCopy } from "@/content/storefront";
import { logoutAction } from "@/server/auth/actions";
import { getCurrentSession } from "@/server/auth/current-user";
import { isLocale } from "@/lib/locale";

type AccountPageProps = Readonly<{
  params: Promise<{ locale: string }>;
}>;

export default async function AccountPage({ params }: AccountPageProps) {
  const { locale: value } = await params;
  if (!isLocale(value)) {
    notFound();
  }

  const session = await getCurrentSession();
  if (!session?.customerId || !session.roles.includes("customer")) {
    redirect(`/${value}/account/login`);
  }

  const copy = getStorefrontCopy(value);

  return (
    <main id="main-content" className="page-shell">
      <section className="account-panel" aria-labelledby="account-title">
        <h1 id="account-title">{copy.accountWelcome}</h1>
        <p>{session.fullName}</p>
        <dl className="account-details">
          <div>
            <dt>{copy.emailLabel}</dt>
            <dd dir="ltr">{session.email}</dd>
          </div>
          <div>
            <dt>{copy.phoneLabel}</dt>
            <dd dir="ltr">{session.phone}</dd>
          </div>
        </dl>
        <form action={logoutAction}>
          <input type="hidden" name="locale" value={value} />
          <button className="button button--secondary" type="submit">
            {copy.logoutAction}
          </button>
        </form>
      </section>
    </main>
  );
}
