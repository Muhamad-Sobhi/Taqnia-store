import type { Locale } from "@/lib/locale";

export type StorefrontContent = Readonly<{
  text: string;
  status: "approved" | "placeholder";
}>;

export type StorefrontCopy = {
  storeName: string;
  homeLabel: string;
  accountLabel: string;
  signInTitle: string;
  registerTitle: string;
  fullNameLabel: string;
  emailLabel: string;
  phoneLabel: string;
  passwordLabel: string;
  signInAction: string;
  registerAction: string;
  noAccountLabel: string;
  hasAccountLabel: string;
  authValidationError: string;
  authUnavailableError: string;
  duplicateAccountError: string;
  invalidCredentialsError: string;
  logoutAction: string;
  accountWelcome: string;
  passwordResetLabel: string;
  passwordResetUnavailable: string;
  searchLabel: string;
  searchPlaceholder: string;
  searchAction: string;
  navigationLabel: string;
  categoriesLabel: string;
  switchToArabic: string;
  switchToEnglish: string;
  heroEyebrow: string;
  heroTitle: string;
  heroDescription: StorefrontContent;
  heroAction: string;
  categoriesTitle: string;
  categoriesDescription: string;
  productsTitle: string;
  catalogEmptyState: Readonly<{
    title: StorefrontContent;
    description: StorefrontContent;
  }>;
  productsEmpty: StorefrontContent;
  categoryProductsTitle: string;
  categoryProductsEmpty: StorefrontContent;
  searchTitle: string;
  searchCategoriesTitle: string;
  searchProductsTitle: string;
  searchProductsEmpty: StorefrontContent;
  searchEnterQuery: string;
  searchNoResults: string;
  quotePageTitle: StorefrontContent;
  quoteUnavailableMessage: StorefrontContent;
  productPriceLabel: string;
  productImagePending: string;
  aboutTaqnia: string;
  skipToContent: string;
  copyright: string;
};

export const storefrontCopy: Record<Locale, StorefrontCopy> = {
  en: {
    storeName: "Taqnia Store",
    homeLabel: "Home",
    accountLabel: "Account",
    signInTitle: "Sign in",
    registerTitle: "Create an account",
    fullNameLabel: "Full name",
    emailLabel: "Email address",
    phoneLabel: "Phone number",
    passwordLabel: "Password",
    signInAction: "Sign in",
    registerAction: "Create account",
    noAccountLabel: "New to Taqnia Store?",
    hasAccountLabel: "Already have an account?",
    authValidationError: "Please review the information and try again.",
    authUnavailableError: "Account access is temporarily unavailable. Please try again later.",
    duplicateAccountError: "An account with this email address or phone number already exists.",
    invalidCredentialsError: "The email address or password is incorrect.",
    logoutAction: "Sign out",
    accountWelcome: "Your account",
    passwordResetLabel: "Forgot password?",
    passwordResetUnavailable:
      "Password reset is not available until the store email delivery service is configured.",
    searchLabel: "Search products",
    searchPlaceholder: "Search products and categories",
    searchAction: "Search",
    navigationLabel: "Store navigation",
    categoriesLabel: "Categories",
    switchToArabic: "العربية",
    switchToEnglish: "English",
    heroEyebrow: "Taqnia Store",
    heroTitle: "Discover IT and networking equipment",
    heroDescription: {
      text: "Explore technology and networking equipment by category.",
      status: "placeholder",
    },
    heroAction: "Explore categories",
    categoriesTitle: "Shop by category",
    categoriesDescription: "Browse technology and infrastructure categories.",
    productsTitle: "Products",
    catalogEmptyState: {
      title: { text: "Catalog coming soon", status: "placeholder" },
      description: {
        text: "No products are available to browse right now.",
        status: "placeholder",
      },
    },
    productsEmpty: { text: "No products are listed here yet.", status: "placeholder" },
    categoryProductsTitle: "Products in this category",
    categoryProductsEmpty: {
      text: "No products are currently listed in this category.",
      status: "placeholder",
    },
    searchTitle: "Search the store",
    searchCategoriesTitle: "Matching categories",
    searchProductsTitle: "Matching products",
    searchProductsEmpty: { text: "No products matched your search.", status: "placeholder" },
    searchEnterQuery: "Enter a product or category to begin your search.",
    searchNoResults: "No products or categories matched your search.",
    quotePageTitle: { text: "Request a quote", status: "placeholder" },
    quoteUnavailableMessage: {
      text: "Quote requests are temporarily unavailable.",
      status: "placeholder",
    },
    productPriceLabel: "Price",
    productImagePending: "Product image will be added after catalog approval.",
    aboutTaqnia: "About Taqnia",
    skipToContent: "Skip to main content",
    copyright: "Copyright © Taqnia. All Rights Reserved.",
  },
  ar: {
    storeName: "متجر تقنية",
    homeLabel: "الرئيسية",
    accountLabel: "الحساب",
    signInTitle: "تسجيل الدخول",
    registerTitle: "إنشاء حساب",
    fullNameLabel: "الاسم الكامل",
    emailLabel: "البريد الإلكتروني",
    phoneLabel: "رقم الهاتف",
    passwordLabel: "كلمة المرور",
    signInAction: "دخول",
    registerAction: "إنشاء الحساب",
    noAccountLabel: "مستخدم جديد في متجر تقنية؟",
    hasAccountLabel: "لديك حساب بالفعل؟",
    authValidationError: "يرجى مراجعة البيانات والمحاولة مرة أخرى.",
    authUnavailableError: "خدمة الحسابات غير متاحة مؤقتًا. يُرجى المحاولة مرة أخرى لاحقًا.",
    duplicateAccountError: "يوجد حساب بهذا البريد الإلكتروني أو رقم الهاتف.",
    invalidCredentialsError: "البريد الإلكتروني أو كلمة المرور غير صحيحة.",
    logoutAction: "تسجيل الخروج",
    accountWelcome: "حسابك",
    passwordResetLabel: "هل نسيت كلمة المرور؟",
    passwordResetUnavailable: "ستتاح استعادة كلمة المرور بعد إعداد خدمة إرسال البريد الإلكتروني.",
    searchLabel: "ابحث عن المنتجات",
    searchPlaceholder: "ابحث عن المنتجات والفئات",
    searchAction: "بحث",
    navigationLabel: "التنقل في المتجر",
    categoriesLabel: "الفئات",
    switchToArabic: "العربية",
    switchToEnglish: "English",
    heroEyebrow: "متجر تقنية",
    heroTitle: "اكتشف معدات تقنية المعلومات والشبكات",
    heroDescription: {
      text: "استكشف معدات تقنية المعلومات والشبكات حسب الفئة.",
      status: "placeholder",
    },
    heroAction: "استكشف الفئات",
    categoriesTitle: "تسوق حسب الفئة",
    categoriesDescription: "تصفح فئات التقنية والبنية التحتية.",
    productsTitle: "المنتجات",
    catalogEmptyState: {
      title: { text: "الكتالوج قريبًا", status: "placeholder" },
      description: {
        text: "لا تتوفر منتجات للتصفح حاليًا.",
        status: "placeholder",
      },
    },
    productsEmpty: { text: "لا توجد منتجات معروضة هنا حتى الآن.", status: "placeholder" },
    categoryProductsTitle: "منتجات هذه الفئة",
    categoryProductsEmpty: {
      text: "لا توجد منتجات معروضة في هذه الفئة حاليًا.",
      status: "placeholder",
    },
    searchTitle: "ابحث في المتجر",
    searchCategoriesTitle: "الفئات المطابقة",
    searchProductsTitle: "المنتجات المطابقة",
    searchProductsEmpty: { text: "لا توجد منتجات مطابقة لبحثك.", status: "placeholder" },
    searchEnterQuery: "أدخل اسم منتج أو فئة لبدء البحث.",
    searchNoResults: "لم يتم العثور على منتجات أو فئات مطابقة لبحثك.",
    quotePageTitle: { text: "طلب عرض سعر", status: "placeholder" },
    quoteUnavailableMessage: {
      text: "طلبات عروض الأسعار غير متاحة مؤقتًا.",
      status: "placeholder",
    },
    productPriceLabel: "السعر",
    productImagePending: "ستُضاف صورة المنتج بعد اعتماد بيانات الكتالوج.",
    aboutTaqnia: "عن تقنية",
    skipToContent: "انتقل إلى المحتوى الرئيسي",
    copyright: "Copyright © Taqnia. All Rights Reserved.",
  },
};

export function getStorefrontCopy(locale: Locale): StorefrontCopy {
  return storefrontCopy[locale];
}
