// lib/invoices.js

// Mock invoice data
let invoices = [
  {
    id: "1",
    number: "1023494",
    status: "paid",
    date: "2023-03-30",
    dueDate: "2023-04-30",
    amount: 6529770,
    customer: {
      name: "Olaniyi Ojo Adewale",
      email: "olaniyi@example.com",
      address: "123 Business St, City, State 12345",
    },
    sender: {
      name: "Fabulous Enterprises",
      email: "hello@fabulous.com",
      address: "456 Company Ave, Business City, BC 67890",
    },
    items: [
      {
        id: "1",
        description: "Email Marketing",
        quantity: 10,
        rate: 1500,
        amount: 15000,
      },
      {
        id: "2",
        description: "Video looping effect",
        quantity: 6,
        rate: 1110500,
        amount: 6663000,
      },
      {
        id: "3",
        description: "Graphic design for emails",
        quantity: 7,
        rate: 2750,
        amount: 19250,
      },
    ],
    notes: "Thank you for your patronage",
    createdAt: new Date("2023-03-30").toISOString(),
    updatedAt: new Date("2023-04-15").toISOString(),
  },
  {
    id: "2",
    number: "1023495",
    status: "sent",
    date: "2023-04-01",
    dueDate: "2023-05-01",
    amount: 2500,
    customer: {
      name: "Tech Solutions Inc",
      email: "contact@techsolutions.com",
      address: "789 Tech Park, Innovation City, IC 11111",
    },
    sender: {
      name: "Fabulous Enterprises",
      email: "hello@fabulous.com",
      address: "456 Company Ave, Business City, BC 67890",
    },
    items: [
      {
        id: "1",
        description: "Web Development",
        quantity: 1,
        rate: 2500,
        amount: 2500,
      },
    ],
    createdAt: new Date("2023-04-01").toISOString(),
    updatedAt: new Date("2023-04-01").toISOString(),
  },
  {
    id: "3",
    number: "1023496",
    status: "overdue",
    date: "2023-02-15",
    dueDate: "2023-03-15",
    amount: 1800,
    customer: {
      name: "Creative Agency",
      email: "hello@creative.com",
      address: "321 Design St, Art City, AC 22222",
    },
    sender: {
      name: "Fabulous Enterprises",
      email: "hello@fabulous.com",
      address: "456 Company Ave, Business City, BC 67890",
    },
    items: [
      {
        id: "1",
        description: "Logo Design",
        quantity: 1,
        rate: 1800,
        amount: 1800,
      },
    ],
    createdAt: new Date("2023-02-15").toISOString(),
    updatedAt: new Date("2023-02-15").toISOString(),
  },
];

// Get all invoices
export async function getInvoices() {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return [...invoices];
}

// Get a single invoice by id
export async function getInvoice(id) {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return invoices.find((inv) => inv.id === id) || null;
}

// Get invoice stats
export async function getInvoiceStats() {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const stats = {
    total: { amount: 0, count: 0 },
    paid: { amount: 0, count: 0 },
    pending: { amount: 0, count: 0 },
    overdue: { amount: 0, count: 0 },
  };

  invoices.forEach((invoice) => {
    stats.total.amount += invoice.amount;
    stats.total.count += 1;

    switch (invoice.status) {
      case "paid":
        stats.paid.amount += invoice.amount;
        stats.paid.count += 1;
        break;
      case "sent":
        stats.pending.amount += invoice.amount;
        stats.pending.count += 1;
        break;
      case "overdue":
        stats.overdue.amount += invoice.amount;
        stats.overdue.count += 1;
        break;
    }
  });

  return stats;
}

// Create a new invoice
export async function createInvoice(invoice) {
  await new Promise((resolve) => setTimeout(resolve, 800));

  const newInvoice = {
    ...invoice,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  invoices.unshift(newInvoice);
  return newInvoice;
}

// Update invoice status
export async function updateInvoiceStatus(id, status) {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const invoice = invoices.find((inv) => inv.id === id);
  if (invoice) {
    invoice.status = status;
    invoice.updatedAt = new Date().toISOString();
    return invoice;
  }
  return null;
}
