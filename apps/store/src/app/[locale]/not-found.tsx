import Link from "next/link";

export default function StoreNotFound() {
  return (
    <main id="main-content" className="page-shell not-found-page">
      <h1>Page not found / الصفحة غير موجودة</h1>
      <p lang="en" dir="ltr">
        This product or page is not published or could not be found.
      </p>
      <p lang="ar" dir="rtl">
        هذا المنتج أو الصفحة غير منشورة أو غير موجودة.
      </p>
      <Link className="button button--primary" href="/en">
        Back to Taqnia Store
      </Link>
    </main>
  );
}
