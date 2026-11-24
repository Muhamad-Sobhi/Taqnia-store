import type { Locale } from "@/lib/locale";

export type AdminQuoteCopy = Readonly<{
  title: string;
  prototypeWarning: string;
  temporaryChanges: string;
  noPersistence: string;
  overview: string;
  quoteRequests: string;
  all: string;
  new: string;
  underReview: string;
  waitingCustomer: string;
  approved: string;
  rejected: string;
  archived: string;
  converted: string;
  totalQuotes: string;
  recentActivity: string;
  statusDistribution: string;
  searchPlaceholder: string;
  status: string;
  date: string;
  sort: string;
  newest: string;
  oldest: string;
  reference: string;
  customer: string;
  productCount: string;
  quantity: string;
  displayedTotal: string;
  confirmedTotal: string;
  assignee: string;
  created: string;
  view: string;
  previous: string;
  next: string;
  noQuotes: string;
  quoteDetails: string;
  backToQuotes: string;
  quoteInformation: string;
  customerInformation: string;
  requestedProducts: string;
  pricingReview: string;
  statusActivity: string;
  communicationHistory: string;
  internalNotes: string;
  conversionPreview: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  product: string;
  sku: string;
  requestedQuantity: string;
  displayedUnitPrice: string;
  displayedSubtotal: string;
  confirmedUnitPrice: string;
  confirmedSubtotal: string;
  saveTemporary: string;
  displayedTotalLabel: string;
  confirmedTotalLabel: string;
  priceDifference: string;
  temporaryWarning: string;
  currentStatus: string;
  nextTransitions: string;
  employee: string;
  changeStatus: string;
  statusHistory: string;
  channel: string;
  dateTime: string;
  outcome: string;
  summary: string;
  addNotePlaceholder: string;
  addTemporaryNote: string;
  noteWarning: string;
  conversionProducts: string;
  conversionCustomer: string;
  conversionEligibility: string;
  conversionDisabled: string;
  eligible: string;
  blocked: string;
  customerApprovalRequired: string;
  alreadyConverted: string;
  noConfirmedPrices: string;
  salesOrderReference: string;
  mockDataLabel: string;
  phoneCall: string;
  whatsapp: string;
  emailChannel: string;
}>;

export const adminQuoteCopy: Record<Locale, AdminQuoteCopy> = {
  en: {
    title: "Quote Management",
    prototypeWarning: "Mock prototype only",
    temporaryChanges: "Temporary changes are not saved",
    noPersistence: "This prototype uses in-memory data only.",
    overview: "Overview",
    quoteRequests: "Quote requests",
    all: "All",
    new: "New",
    underReview: "Under review",
    waitingCustomer: "Awaiting customer",
    approved: "Approved",
    rejected: "Rejected",
    archived: "Archived",
    converted: "Converted",
    totalQuotes: "Total quotes",
    recentActivity: "Recent activity",
    statusDistribution: "Status distribution",
    searchPlaceholder: "Search reference or customer",
    status: "Status",
    date: "Date",
    sort: "Sort",
    newest: "Newest first",
    oldest: "Oldest first",
    reference: "Quote reference",
    customer: "Customer",
    productCount: "Products",
    quantity: "Quantity",
    displayedTotal: "Displayed total",
    confirmedTotal: "Confirmed total",
    assignee: "Assignee",
    created: "Created",
    view: "View",
    previous: "Previous",
    next: "Next",
    noQuotes: "No quote requests match these filters.",
    quoteDetails: "Quote details",
    backToQuotes: "Back to quote requests",
    quoteInformation: "Quote information",
    customerInformation: "Customer information",
    requestedProducts: "Requested products",
    pricingReview: "Pricing review",
    statusActivity: "Status and activity",
    communicationHistory: "Communication history",
    internalNotes: "Internal notes",
    conversionPreview: "Sales Order conversion preview",
    name: "Full name",
    email: "Email",
    phone: "Phone",
    company: "Company",
    product: "Product",
    sku: "SKU",
    requestedQuantity: "Requested quantity",
    displayedUnitPrice: "Displayed unit price",
    displayedSubtotal: "Displayed subtotal",
    confirmedUnitPrice: "Confirmed unit price",
    confirmedSubtotal: "Confirmed subtotal",
    saveTemporary: "Apply temporary prices",
    displayedTotalLabel: "Historical displayed total",
    confirmedTotalLabel: "Simulated confirmed total",
    priceDifference: "Difference",
    temporaryWarning: "These price edits are temporary and are not sent or saved.",
    currentStatus: "Current status",
    nextTransitions: "Available transitions",
    employee: "Employee",
    changeStatus: "Change status",
    statusHistory: "Status history",
    channel: "Channel",
    dateTime: "Date and time",
    outcome: "Outcome",
    summary: "Summary",
    addNotePlaceholder: "Add a temporary internal note",
    addTemporaryNote: "Add temporary note",
    noteWarning: "New notes remain in memory and are not saved.",
    conversionProducts: "Products and quantities",
    conversionCustomer: "Customer",
    conversionEligibility: "Conversion eligibility",
    conversionDisabled: "Conversion action unavailable in prototype",
    eligible: "Eligible in this mock preview",
    blocked: "Blocked",
    customerApprovalRequired: "Explicit customer approval is required.",
    alreadyConverted: "This quote already has a mock Sales Order reference.",
    noConfirmedPrices: "All requested lines need confirmed prices.",
    salesOrderReference: "Mock Sales Order reference",
    mockDataLabel: "Fictional mock data",
    phoneCall: "Phone",
    whatsapp: "WhatsApp",
    emailChannel: "Email",
  },
  ar: {
    title: "إدارة عروض الأسعار",
    prototypeWarning: "نموذج تجريبي ببيانات وهمية",
    temporaryChanges: "التغييرات المؤقتة غير محفوظة",
    noPersistence: "يستخدم هذا النموذج بيانات داخل الذاكرة فقط.",
    overview: "نظرة عامة",
    quoteRequests: "طلبات عروض الأسعار",
    all: "الكل",
    new: "جديد",
    underReview: "قيد المراجعة",
    waitingCustomer: "بانتظار العميل",
    approved: "معتمد",
    rejected: "مرفوض",
    archived: "مؤرشف",
    converted: "محول",
    totalQuotes: "إجمالي الطلبات",
    recentActivity: "النشاط الأخير",
    statusDistribution: "توزيع الحالات",
    searchPlaceholder: "البحث بالمرجع أو اسم العميل",
    status: "الحالة",
    date: "التاريخ",
    sort: "الترتيب",
    newest: "الأحدث أولاً",
    oldest: "الأقدم أولاً",
    reference: "مرجع عرض السعر",
    customer: "العميل",
    productCount: "المنتجات",
    quantity: "الكمية",
    displayedTotal: "الإجمالي المعروض",
    confirmedTotal: "الإجمالي المؤكد",
    assignee: "الموظف المكلف",
    created: "تاريخ الإنشاء",
    view: "عرض",
    previous: "السابق",
    next: "التالي",
    noQuotes: "لا توجد طلبات تطابق عوامل التصفية.",
    quoteDetails: "تفاصيل عرض السعر",
    backToQuotes: "العودة إلى طلبات عروض الأسعار",
    quoteInformation: "معلومات عرض السعر",
    customerInformation: "معلومات العميل",
    requestedProducts: "المنتجات المطلوبة",
    pricingReview: "مراجعة التسعير",
    statusActivity: "الحالة والنشاط",
    communicationHistory: "سجل التواصل",
    internalNotes: "الملاحظات الداخلية",
    conversionPreview: "معاينة تحويل أمر المبيعات",
    name: "الاسم الكامل",
    email: "البريد الإلكتروني",
    phone: "الهاتف",
    company: "الشركة",
    product: "المنتج",
    sku: "رمز المنتج",
    requestedQuantity: "الكمية المطلوبة",
    displayedUnitPrice: "سعر الوحدة المعروض",
    displayedSubtotal: "الإجمالي المعروض للمنتج",
    confirmedUnitPrice: "سعر الوحدة المؤكد",
    confirmedSubtotal: "الإجمالي المؤكد للمنتج",
    saveTemporary: "تطبيق الأسعار مؤقتًا",
    displayedTotalLabel: "الإجمالي التاريخي المعروض",
    confirmedTotalLabel: "الإجمالي المؤكد التجريبي",
    priceDifference: "الفرق",
    temporaryWarning: "تعديلات الأسعار مؤقتة ولا يتم إرسالها أو حفظها.",
    currentStatus: "الحالة الحالية",
    nextTransitions: "الانتقالات المتاحة",
    employee: "الموظف",
    changeStatus: "تغيير الحالة",
    statusHistory: "سجل الحالات",
    channel: "القناة",
    dateTime: "التاريخ والوقت",
    outcome: "النتيجة",
    summary: "ملخص",
    addNotePlaceholder: "إضافة ملاحظة داخلية مؤقتة",
    addTemporaryNote: "إضافة ملاحظة مؤقتة",
    noteWarning: "الملاحظات الجديدة تبقى مؤقتة في الذاكرة ولا يتم حفظها.",
    conversionProducts: "المنتجات والكميات",
    conversionCustomer: "العميل",
    conversionEligibility: "أهلية التحويل",
    conversionDisabled: "إجراء التحويل غير متاح في النموذج",
    eligible: "مؤهل في المعاينة التجريبية",
    blocked: "ممنوع",
    customerApprovalRequired: "يلزم موافقة العميل الصريحة.",
    alreadyConverted: "لعرض السعر هذا مرجع أمر مبيعات تجريبي بالفعل.",
    noConfirmedPrices: "يجب تأكيد أسعار جميع المنتجات المطلوبة.",
    salesOrderReference: "مرجع أمر المبيعات التجريبي",
    mockDataLabel: "بيانات وهمية للاختبار",
    phoneCall: "هاتف",
    whatsapp: "واتساب",
    emailChannel: "البريد الإلكتروني",
  },
};
