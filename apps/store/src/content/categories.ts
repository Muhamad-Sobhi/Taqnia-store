import type { Locale } from "@/lib/locale";

export type StoreCategory = {
  slug: string;
  name: Record<Locale, string>;
};

export const categories: readonly StoreCategory[] = [
  { slug: "routers", name: { en: "Routers", ar: "أجهزة التوجيه" } },
  {
    slug: "wireless-access-points",
    name: { en: "Wireless Access Points", ar: "نقاط الوصول اللاسلكية" },
  },
  { slug: "network-switches", name: { en: "Network Switches", ar: "محولات الشبكة" } },
  {
    slug: "network-cables-accessories",
    name: { en: "Network Cables & Accessories", ar: "كابلات الشبكات وملحقاتها" },
  },
  {
    slug: "fiber-optic-equipment",
    name: { en: "Fiber Optic Equipment", ar: "معدات الألياف الضوئية" },
  },
  {
    slug: "sfp-transceivers",
    name: { en: "SFP Modules & Transceivers", ar: "وحدات ومحولات الإرسال والاستقبال SFP" },
  },
  {
    slug: "servers-computer-hardware",
    name: { en: "Servers & Computer Hardware", ar: "الخوادم ومكونات الحاسوب" },
  },
  {
    slug: "network-security",
    name: { en: "Network Security Equipment", ar: "معدات أمن الشبكات" },
  },
  {
    slug: "racks-patch-panels",
    name: { en: "Racks & Patch Panels", ar: "الرفوف ولوحات التوصيل" },
  },
  {
    slug: "structured-cabling",
    name: { en: "Structured Cabling Solutions", ar: "حلول الكابلات المنظمة" },
  },
  {
    slug: "other-it-infrastructure",
    name: { en: "Other IT Infrastructure Products", ar: "منتجات البنية التحتية التقنية الأخرى" },
  },
];
