// lib/websocket.js
let listeners = [];
let intervalId = null;

export function connect() {
  if (intervalId) return;

  // Mock real-time updates every 30s
  intervalId = setInterval(() => {
    const activities = [
      {
        id: Date.now().toString(),
        type: "payment_confirmed",
        message: "Payment confirmed for invoice #1023494",
        timestamp: new Date().toISOString(),
        user: {
          name: "System",
          avatar:
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face",
        },
        invoiceId: "1023494",
      },
      {
        id: (Date.now() + 1).toString(),
        type: "created",
        message: "Created invoice #1023495",
        timestamp: new Date().toISOString(),
        user: {
          name: "You",
          avatar:
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face",
        },
        invoiceId: "1023495",
      },
    ];

    const randomActivity =
      activities[Math.floor(Math.random() * activities.length)];

    notifyListeners(randomActivity);
  }, 30000);
}

export function disconnect() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

export function onActivity(callback) {
  listeners.push(callback);

  // cleanup
  return () => {
    listeners = listeners.filter((listener) => listener !== callback);
  };
}

function notifyListeners(activity) {
  listeners.forEach((listener) => listener(activity));
}

// Mock method to simulate sending invoice updates
export function sendInvoiceUpdate(invoiceId, status) {
  const activity = {
    id: Date.now().toString(),
    type: "updated",
    message: `Invoice #${invoiceId} status updated to ${status}`,
    timestamp: new Date().toISOString(),
    user: {
      name: "You",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face",
    },
    invoiceId,
  };

  notifyListeners(activity);
}
