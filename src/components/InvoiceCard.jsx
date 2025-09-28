"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";

const statusColors = {
  paid: "bg-green-100 text-green-800",
  sent: "bg-blue-100 text-blue-800",
  draft: "bg-gray-100 text-gray-800",
  overdue: "bg-red-100 text-red-800",
};

const statusLabels = {
  paid: "PAID",
  sent: "SENT",
  draft: "DRAFT",
  overdue: "OVERDUE",
};

export function InvoiceCard({ invoice, onClick }) {
  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="font-medium">Invoice - {invoice.number}</p>
            <p className="text-sm text-muted-foreground">
              Due Date: {formatDate(invoice.dueDate)}
            </p>
          </div>
          <Badge className={statusColors[invoice.status]}>
            {statusLabels[invoice.status]}
          </Badge>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Customer</p>
            <p className="font-medium">{invoice.customer.name}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Amount</p>
            <p className="font-bold text-lg">
              {formatCurrency(invoice.amount)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
