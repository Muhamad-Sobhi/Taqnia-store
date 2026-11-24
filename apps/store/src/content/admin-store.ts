import type { Locale } from "@/lib/locale";

export type AdminStoreCopy = Readonly<{
  admin: string;
  overview: string;
  products: string;
  orders: string;
  quotes: string;
  dashboard: string;
  newProduct: string;
  editProduct: string;
  productNameEn: string;
  productNameAr: string;
  slug: string;
  descriptionEn: string;
  descriptionAr: string;
  priceEgp: string;
  sku: string;
  category: string;
  brand: string;
  noBrand: string;
  status: string;
  draft: string;
  published: string;
  archived: string;
  save: string;
  cancel: string;
  searchProducts: string;
  noProducts: string;
  product: string;
  created: string;
  actions: string;
  edit: string;
  productSaved: string;
  invalidProduct: string;
  invalidPrice: string;
  ordersTitle: string;
  orderNumber: string;
  customer: string;
  total: string;
  shippingStatus: string;
  paymentStatus: string;
  paymentMethod: string;
  createdAt: string;
  noOrders: string;
  orderDetails: string;
  orderItems: string;
  quantity: string;
  unitPrice: string;
  subtotal: string;
  shippingFee: string;
  finalTotal: string;
  contact: string;
  deliveryAddress: string;
  deliveryNotes: string;
  shippingMethod: string;
  estimatedDelivery: string;
  updateShipping: string;
  updatePayment: string;
  verificationNotes: string;
  paymentReference: string;
  adminNotes: string;
  addNote: string;
  orderStatusHistory: string;
  paymentStatusHistory: string;
  paymentCod: string;
  paymentWallet: string;
  paymentInstapay: string;
  pendingPayment: string;
  awaitingVerification: string;
  paid: string;
  failed: string;
  refunded: string;
  cashOnDelivery: string;
  pendingConfirmation: string;
  shippingDetailsConfirmed: string;
  processing: string;
  shipped: string;
  delivered: string;
  cancelled: string;
  saveChanges: string;
  back: string;
  notFound: string;
  noPermission: string;
  orderUpdated: string;
  updateFailed: string;
  invalidLocale: string;
  view: string;
  filterStatus: string;
  allStatuses: string;
  allCategories: string;
  allProducts: string;
  name: string;
  email: string;
  phone: string;
  governorate: string;
  cityArea: string;
  street: string;
  notePlaceholder: string;
  catalogManagement: string;
  orderManagement: string;
  previousPage: string;
  nextPage: string;
  pageOf: string;
}>;

export const adminStoreCopy: Record<Locale, AdminStoreCopy> = {
  en: {
    admin: "Store administration",
    overview: "Overview",
    products: "Products",
    orders: "Orders",
    quotes: "Quotes",
    dashboard: "Administration dashboard",
    newProduct: "Add product",
    editProduct: "Edit product",
    productNameEn: "Product name (English)",
    productNameAr: "Product name (Arabic)",
    slug: "URL slug",
    descriptionEn: "Description (English)",
    descriptionAr: "Description (Arabic)",
    priceEgp: "Price (EGP)",
    sku: "SKU",
    category: "Categories",
    brand: "Brand",
    noBrand: "No brand",
    status: "Status",
    draft: "Draft",
    published: "Published",
    archived: "Archived",
    save: "Save product",
    cancel: "Cancel",
    searchProducts: "Search products by name, slug, or SKU",
    noProducts: "No products match these filters.",
    product: "Product",
    created: "Last updated",
    actions: "Actions",
    edit: "Edit",
    productSaved: "Product saved.",
    invalidProduct: "Check the product details and try again.",
    invalidPrice: "Enter a valid EGP amount with up to two decimal places.",
    ordersTitle: "Order management",
    orderNumber: "Order number",
    customer: "Customer",
    total: "Total",
    shippingStatus: "Shipping status",
    paymentStatus: "Payment status",
    paymentMethod: "Payment method",
    createdAt: "Created",
    noOrders: "There are no orders to display.",
    orderDetails: "Order details",
    orderItems: "Ordered products",
    quantity: "Quantity",
    unitPrice: "Unit price",
    subtotal: "Subtotal",
    shippingFee: "Agreed shipping fee",
    finalTotal: "Final total",
    contact: "Customer contact",
    deliveryAddress: "Delivery address",
    deliveryNotes: "Delivery notes",
    shippingMethod: "Shipping method",
    estimatedDelivery: "Estimated delivery",
    updateShipping: "Shipping update",
    updatePayment: "Payment update",
    verificationNotes: "Verification notes",
    paymentReference: "Payment reference",
    adminNotes: "Internal administration notes",
    addNote: "Add note",
    orderStatusHistory: "Shipping status history",
    paymentStatusHistory: "Payment status history",
    paymentCod: "Cash on delivery",
    paymentWallet: "Electronic wallet",
    paymentInstapay: "InstaPay",
    pendingPayment: "Pending payment",
    awaitingVerification: "Awaiting verification",
    paid: "Paid",
    failed: "Failed",
    refunded: "Refunded",
    cashOnDelivery: "Cash on delivery",
    pendingConfirmation: "Pending confirmation",
    shippingDetailsConfirmed: "Shipping details confirmed",
    processing: "Processing",
    shipped: "Shipped",
    delivered: "Delivered",
    cancelled: "Cancelled",
    saveChanges: "Save changes",
    back: "Back to list",
    notFound: "Record not found.",
    noPermission: "You do not have permission to access this section.",
    orderUpdated: "Order update saved.",
    updateFailed: "The update could not be completed. Review the submitted information.",
    invalidLocale: "The selected language is invalid.",
    view: "View",
    filterStatus: "Filter by status",
    allStatuses: "All statuses",
    allCategories: "All categories",
    allProducts: "All products",
    name: "Name",
    email: "Email",
    phone: "Phone",
    governorate: "Governorate",
    cityArea: "City / area",
    street: "Street address",
    notePlaceholder: "Internal note",
    catalogManagement: "Catalog management",
    orderManagement: "Order management",
    previousPage: "Previous",
    nextPage: "Next",
    pageOf: "Page",
  },
  ar: {
    admin: "إدارة المتجر",
    overview: "نظرة عامة",
    products: "المنتجات",
    orders: "الطلبات",
    quotes: "عروض الأسعار",
    dashboard: "لوحة إدارة المتجر",
    newProduct: "إضافة منتج",
    editProduct: "تعديل المنتج",
    productNameEn: "اسم المنتج بالإنجليزية",
    productNameAr: "اسم المنتج بالعربية",
    slug: "معرّف الرابط",
    descriptionEn: "الوصف بالإنجليزية",
    descriptionAr: "الوصف بالعربية",
    priceEgp: "السعر بالجنيه المصري",
    sku: "رمز المنتج",
    category: "الفئات",
    brand: "العلامة التجارية",
    noBrand: "بدون علامة تجارية",
    status: "الحالة",
    draft: "مسودة",
    published: "منشور",
    archived: "مؤرشف",
    save: "حفظ المنتج",
    cancel: "إلغاء",
    searchProducts: "البحث عن المنتجات بالاسم أو الرابط أو الرمز",
    noProducts: "لا توجد منتجات تطابق عوامل التصفية.",
    product: "المنتج",
    created: "آخر تحديث",
    actions: "الإجراءات",
    edit: "تعديل",
    productSaved: "تم حفظ المنتج.",
    invalidProduct: "يرجى مراجعة بيانات المنتج والمحاولة مجددًا.",
    invalidPrice: "أدخل سعرًا صحيحًا بالجنيه المصري وبحد أقصى منزلتين عشريتين.",
    ordersTitle: "إدارة الطلبات",
    orderNumber: "رقم الطلب",
    customer: "العميل",
    total: "الإجمالي",
    shippingStatus: "حالة الشحن",
    paymentStatus: "حالة الدفع",
    paymentMethod: "طريقة الدفع",
    createdAt: "تاريخ الإنشاء",
    noOrders: "لا توجد طلبات لعرضها.",
    orderDetails: "تفاصيل الطلب",
    orderItems: "المنتجات المطلوبة",
    quantity: "الكمية",
    unitPrice: "سعر الوحدة",
    subtotal: "المجموع الفرعي",
    shippingFee: "رسوم الشحن المتفق عليها",
    finalTotal: "الإجمالي النهائي",
    contact: "بيانات التواصل",
    deliveryAddress: "عنوان التوصيل",
    deliveryNotes: "ملاحظات التوصيل",
    shippingMethod: "طريقة الشحن",
    estimatedDelivery: "موعد التوصيل المتوقع",
    updateShipping: "تحديث الشحن",
    updatePayment: "تحديث الدفع",
    verificationNotes: "ملاحظات التحقق",
    paymentReference: "مرجع الدفع",
    adminNotes: "ملاحظات الإدارة الداخلية",
    addNote: "إضافة ملاحظة",
    orderStatusHistory: "سجل حالات الشحن",
    paymentStatusHistory: "سجل حالات الدفع",
    paymentCod: "الدفع عند الاستلام",
    paymentWallet: "محفظة إلكترونية",
    paymentInstapay: "إنستا باي",
    pendingPayment: "بانتظار الدفع",
    awaitingVerification: "بانتظار التحقق",
    paid: "مدفوع",
    failed: "فشل الدفع",
    refunded: "مسترد",
    cashOnDelivery: "الدفع عند الاستلام",
    pendingConfirmation: "بانتظار التأكيد",
    shippingDetailsConfirmed: "تم تأكيد تفاصيل الشحن",
    processing: "قيد التجهيز",
    shipped: "تم الشحن",
    delivered: "تم التوصيل",
    cancelled: "ملغي",
    saveChanges: "حفظ التغييرات",
    back: "العودة للقائمة",
    notFound: "السجل غير موجود.",
    noPermission: "ليس لديك صلاحية الوصول إلى هذا القسم.",
    orderUpdated: "تم حفظ تحديث الطلب.",
    updateFailed: "تعذر إتمام التحديث. راجع البيانات المدخلة.",
    invalidLocale: "اللغة المحددة غير صحيحة.",
    view: "عرض",
    filterStatus: "التصفية حسب الحالة",
    allStatuses: "كل الحالات",
    allCategories: "كل الفئات",
    allProducts: "كل المنتجات",
    name: "الاسم",
    email: "البريد الإلكتروني",
    phone: "الهاتف",
    governorate: "المحافظة",
    cityArea: "المدينة / المنطقة",
    street: "عنوان الشارع",
    notePlaceholder: "ملاحظة داخلية",
    catalogManagement: "إدارة الكتالوج",
    orderManagement: "إدارة الطلبات",
    previousPage: "السابق",
    nextPage: "التالي",
    pageOf: "صفحة",
  },
};

export function getAdminStatusLabel(locale: Locale, status: string | null): string {
  if (!status) return "—";
  const labels: Readonly<Record<string, keyof AdminStoreCopy>> = {
    pending_payment: "pendingPayment",
    awaiting_verification: "awaitingVerification",
    paid: "paid",
    failed: "failed",
    refunded: "refunded",
    cash_on_delivery: "cashOnDelivery",
    pending_confirmation: "pendingConfirmation",
    shipping_details_confirmed: "shippingDetailsConfirmed",
    processing: "processing",
    shipped: "shipped",
    delivered: "delivered",
    cancelled: "cancelled",
    cod: "paymentCod",
    wallet: "paymentWallet",
    instapay: "paymentInstapay",
    draft: "draft",
    published: "published",
    archived: "archived",
  };
  const labelKey = labels[status];
  return labelKey ? adminStoreCopy[locale][labelKey] : status;
}
