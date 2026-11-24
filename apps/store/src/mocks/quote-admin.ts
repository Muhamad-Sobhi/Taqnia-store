export type QuoteStatus =
  "new" | "under_review" | "waiting_customer" | "approved" | "rejected" | "archived";

export type QuoteCommunication = Readonly<{
  id: string;
  channel: "phone" | "whatsapp" | "email";
  dateTime: string;
  employee: string;
  summary: string;
  outcome: string;
}>;

export type QuoteStatusHistory = Readonly<{
  status: QuoteStatus;
  dateTime: string;
  employee: string;
  note: string;
}>;

export type QuoteLine = Readonly<{
  productName: string;
  sku: string;
  quantity: number;
  displayedUnitMinor: number;
  confirmedUnitMinor: number | null;
}>;

export type QuoteNote = Readonly<{
  id: string;
  dateTime: string;
  employee: string;
  text: string;
}>;

export type MockQuote = Readonly<{
  reference: string;
  customerName: string;
  companyName: string;
  email: string;
  phone: string;
  status: QuoteStatus;
  createdAt: string;
  assignee: string;
  lines: readonly QuoteLine[];
  communications: readonly QuoteCommunication[];
  statusHistory: readonly QuoteStatusHistory[];
  notes: readonly QuoteNote[];
  customerApproved: boolean;
  mockSalesOrderReference: string | null;
}>;

export const mockQuotes: readonly MockQuote[] = [
  {
    reference: "QT-TEST-1001",
    customerName: "Example Customer One",
    companyName: "Fictional Systems LLC",
    email: "customer-one@example.invalid",
    phone: "+20 555 010 0001",
    status: "under_review",
    createdAt: "2026-11-24T08:30:00Z",
    assignee: "Fictional Employee A",
    lines: [
      {
        productName: "Test Network Router",
        sku: "TEST-RTR-001",
        quantity: 3,
        displayedUnitMinor: 875000,
        confirmedUnitMinor: 850000,
      },
      {
        productName: "Test Fiber Transceiver",
        sku: "TEST-SFP-002",
        quantity: 8,
        displayedUnitMinor: 295000,
        confirmedUnitMinor: 280000,
      },
    ],
    communications: [
      {
        id: "comm-1001-1",
        channel: "phone",
        dateTime: "2026-11-24T09:15:00Z",
        employee: "Fictional Employee A",
        summary: "Confirmed the requested quantities.",
        outcome: "Follow-up required",
      },
    ],
    statusHistory: [
      {
        status: "new",
        dateTime: "2026-11-24T08:30:00Z",
        employee: "System",
        note: "Test request created.",
      },
      {
        status: "under_review",
        dateTime: "2026-11-24T09:05:00Z",
        employee: "Fictional Employee A",
        note: "Pricing review started.",
      },
    ],
    notes: [
      {
        id: "note-1001-1",
        dateTime: "2026-11-24T09:20:00Z",
        employee: "Fictional Employee A",
        text: "Fictional availability check completed.",
      },
    ],
    customerApproved: false,
    mockSalesOrderReference: null,
  },
  {
    reference: "QT-TEST-1002",
    customerName: "Example Customer Two",
    companyName: "Sample Integration Ltd",
    email: "customer-two@example.invalid",
    phone: "+20 555 010 0002",
    status: "waiting_customer",
    createdAt: "2026-11-23T13:10:00Z",
    assignee: "Fictional Employee B",
    lines: [
      {
        productName: "Test Managed Switch",
        sku: "TEST-SW-101",
        quantity: 2,
        displayedUnitMinor: 1245000,
        confirmedUnitMinor: 1199000,
      },
      {
        productName: "Test Patch Panel",
        sku: "TEST-PNL-330",
        quantity: 4,
        displayedUnitMinor: 180000,
        confirmedUnitMinor: null,
      },
    ],
    communications: [
      {
        id: "comm-1002-1",
        channel: "whatsapp",
        dateTime: "2026-11-23T15:30:00Z",
        employee: "Fictional Employee B",
        summary: "Shared the simulated confirmed offer.",
        outcome: "Awaiting customer reply",
      },
      {
        id: "comm-1002-2",
        channel: "email",
        dateTime: "2026-11-24T10:00:00Z",
        employee: "Fictional Employee B",
        summary: "Sent a fictional follow-up summary.",
        outcome: "No reply yet",
      },
    ],
    statusHistory: [
      {
        status: "new",
        dateTime: "2026-11-23T13:10:00Z",
        employee: "System",
        note: "Test request created.",
      },
      {
        status: "under_review",
        dateTime: "2026-11-23T14:00:00Z",
        employee: "Fictional Employee B",
        note: "Confirmed quantities and prices.",
      },
      {
        status: "waiting_customer",
        dateTime: "2026-11-23T15:35:00Z",
        employee: "Fictional Employee B",
        note: "Waiting for fictional customer response.",
      },
    ],
    notes: [],
    customerApproved: false,
    mockSalesOrderReference: null,
  },
  {
    reference: "QT-TEST-1003",
    customerName: "Example Customer Three",
    companyName: "Prototype Networks",
    email: "customer-three@example.invalid",
    phone: "+20 555 010 0003",
    status: "approved",
    createdAt: "2026-11-22T11:20:00Z",
    assignee: "Fictional Employee A",
    lines: [
      {
        productName: "Test Wireless Access Point",
        sku: "TEST-WAP-410",
        quantity: 6,
        displayedUnitMinor: 640000,
        confirmedUnitMinor: 615000,
      },
    ],
    communications: [
      {
        id: "comm-1003-1",
        channel: "phone",
        dateTime: "2026-11-22T16:10:00Z",
        employee: "Fictional Employee A",
        summary: "Recorded fictional customer approval.",
        outcome: "Approved",
      },
    ],
    statusHistory: [
      {
        status: "new",
        dateTime: "2026-11-22T11:20:00Z",
        employee: "System",
        note: "Test request created.",
      },
      {
        status: "under_review",
        dateTime: "2026-11-22T12:00:00Z",
        employee: "Fictional Employee A",
        note: "Confirmed line pricing.",
      },
      {
        status: "waiting_customer",
        dateTime: "2026-11-22T14:00:00Z",
        employee: "Fictional Employee A",
        note: "Offer sent for review.",
      },
      {
        status: "approved",
        dateTime: "2026-11-22T16:10:00Z",
        employee: "Fictional Employee A",
        note: "Fictional customer approval recorded.",
      },
    ],
    notes: [
      {
        id: "note-1003-1",
        dateTime: "2026-11-22T16:15:00Z",
        employee: "Fictional Employee A",
        text: "Approval is sample data only.",
      },
    ],
    customerApproved: true,
    mockSalesOrderReference: null,
  },
  {
    reference: "QT-TEST-1004",
    customerName: "Example Customer Four",
    companyName: "Demo Fiber Services",
    email: "customer-four@example.invalid",
    phone: "+20 555 010 0004",
    status: "approved",
    createdAt: "2026-11-21T10:00:00Z",
    assignee: "Fictional Employee B",
    lines: [
      {
        productName: "Test Fiber Patch Cable",
        sku: "TEST-CBL-220",
        quantity: 12,
        displayedUnitMinor: 12500,
        confirmedUnitMinor: 12000,
      },
    ],
    communications: [
      {
        id: "comm-1004-1",
        channel: "email",
        dateTime: "2026-11-21T13:00:00Z",
        employee: "Fictional Employee B",
        summary: "Recorded approval in the fictional workflow.",
        outcome: "Approved",
      },
    ],
    statusHistory: [
      {
        status: "approved",
        dateTime: "2026-11-21T13:00:00Z",
        employee: "Fictional Employee B",
        note: "Fictional approved quote.",
      },
    ],
    notes: [],
    customerApproved: true,
    mockSalesOrderReference: "SO-TEST-5004",
  },
  {
    reference: "QT-TEST-1005",
    customerName: "Example Customer Five",
    companyName: "Unverified Test Group",
    email: "customer-five@example.invalid",
    phone: "+20 555 010 0005",
    status: "rejected",
    createdAt: "2026-11-20T09:45:00Z",
    assignee: "Fictional Employee A",
    lines: [
      {
        productName: "Test Server Platform",
        sku: "TEST-SRV-770",
        quantity: 1,
        displayedUnitMinor: 9850000,
        confirmedUnitMinor: 9600000,
      },
    ],
    communications: [],
    statusHistory: [
      {
        status: "new",
        dateTime: "2026-11-20T09:45:00Z",
        employee: "System",
        note: "Test request created.",
      },
      {
        status: "rejected",
        dateTime: "2026-11-20T12:10:00Z",
        employee: "Fictional Employee A",
        note: "Fictional customer declined.",
      },
    ],
    notes: [],
    customerApproved: false,
    mockSalesOrderReference: null,
  },
  {
    reference: "QT-TEST-1006",
    customerName: "Example Customer Six",
    companyName: "Archived Test Office",
    email: "customer-six@example.invalid",
    phone: "+20 555 010 0006",
    status: "archived",
    createdAt: "2026-11-18T15:00:00Z",
    assignee: "Fictional Employee B",
    lines: [
      {
        productName: "Test Network Rack",
        sku: "TEST-RACK-900",
        quantity: 2,
        displayedUnitMinor: 1100000,
        confirmedUnitMinor: 1050000,
      },
    ],
    communications: [],
    statusHistory: [
      {
        status: "archived",
        dateTime: "2026-11-18T15:00:00Z",
        employee: "Fictional Employee B",
        note: "Fictional archived record.",
      },
    ],
    notes: [],
    customerApproved: false,
    mockSalesOrderReference: null,
  },
  {
    reference: "QT-TEST-1007",
    customerName: "Example Customer Seven",
    companyName: "New Demo Branch",
    email: "customer-seven@example.invalid",
    phone: "+20 555 010 0007",
    status: "new",
    createdAt: "2026-11-24T11:45:00Z",
    assignee: "Unassigned",
    lines: [
      {
        productName: "Test Structured Cable",
        sku: "TEST-CAB-500",
        quantity: 20,
        displayedUnitMinor: 45000,
        confirmedUnitMinor: null,
      },
      {
        productName: "Test Patch Cable",
        sku: "TEST-CAB-501",
        quantity: 40,
        displayedUnitMinor: 15000,
        confirmedUnitMinor: null,
      },
    ],
    communications: [],
    statusHistory: [
      {
        status: "new",
        dateTime: "2026-11-24T11:45:00Z",
        employee: "System",
        note: "Test request created.",
      },
    ],
    notes: [],
    customerApproved: false,
    mockSalesOrderReference: null,
  },
];

export function getNextStatuses(status: QuoteStatus): readonly QuoteStatus[] {
  const transitions: Record<QuoteStatus, readonly QuoteStatus[]> = {
    new: ["under_review", "rejected", "archived"],
    under_review: ["waiting_customer", "approved", "rejected", "archived"],
    waiting_customer: ["under_review", "approved", "rejected", "archived"],
    approved: ["archived"],
    rejected: ["archived"],
    archived: [],
  };
  return transitions[status];
}
