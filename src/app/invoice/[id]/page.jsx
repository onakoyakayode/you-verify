"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Check } from "lucide-react";
import {
  invoiceService,
  getInvoice,
  updateInvoiceStatus,
} from "@/lib/invoices";
import { formatCurrency, formatDate } from "@/lib/utils";
import Image from "next/image";

export default function InvoiceDetails({ id }) {
  const [invoice, setInvoice] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activities] = useState([
    {
      id: "1",
      type: "created",
      message: "Created invoice #1023494",
      timestamp: new Date(Date.now() - 3600000),
      user: {
        name: "You",
        avatar: "/image13.png",
      },
    },
    {
      id: "2",
      type: "sent",
      message: "Sent invoice #1023494 to Olaniyi Ojo Adewale",
      timestamp: new Date(Date.now() - 7200000),
      user: {
        name: "You",
        avatar: "/image13.png",
      },
    },
    {
      id: "3",
      type: "payment_confirmed",
      message: "Payment confirmed for invoice #1023494",
      timestamp: new Date(Date.now() - 10800000),
      user: { name: "System", avatar: "/image13.png" },
    },
  ]);

  useEffect(() => {
    if (id) {
      loadInvoice(id);
    }
  }, [id]);

  const loadInvoice = async (invoiceId) => {
    try {
      setIsLoading(true);
      const invoiceData = await getInvoice(invoiceId);
      setInvoice(invoiceData);
    } catch (error) {
      console.error("Failed to load invoice:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    const link = document.createElement("a");
    link.href = "#";
    link.download = `invoice-${invoice?.number}.pdf`;
    link.click();
  };

  const handleSendInvoice = async () => {
    if (invoice) {
      await updateInvoiceStatus(invoice.id, "sent");
      setInvoice({ ...invoice, status: "sent" });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen max-w-full bg-gray-50 p-6">
        <div className="max-w-screen mx-auto">
          <Skeleton className="h-8 w-32 mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-48" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Skeleton key={i} className="h-4 w-full" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            <div>
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Invoice not found
          </h2>
          <p className="text-gray-600 mb-4">
            The invoice you're looking for doesn't exist.
          </p>
          <Button onClick={() => navigate("/")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const statusColors = {
    paid: "bg-green-100 text-green-800",
    sent: "bg-blue-100 text-blue-800",
    draft: "bg-gray-100 text-gray-800 text-xs",
    overdue: "bg-red-100 text-red-800",
  };

  const subtotal = invoice.items.reduce((sum, item) => sum + item.amount, 0);
  const total = subtotal;

  return (
    <div className="min-h-screen !w-full bg-white">
      {/* Header */}
      <div className="bg-white border-b px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-lg sm:text-2xl font-bold mb-1">
              Invoice - {invoice.number} - 2304
            </h1>
            <p className="text-xs sm:text-sm text-gray-600">
              View the details and activity of this invoice
            </p>
            <Badge className="mt-2 bg-blue-100 text-blue-700 font-semibold rounded-2xl py-1 px-3 text-[10px] sm:text-xs">
              PARTIAL PAYMENT
            </Badge>
          </div>

          <div className="flex flex-wrap items-center space-x-2">
            <Button
              variant="outline"
              onClick={handleDownloadPDF}
              className="text-blue-700 font-semibold bg-white h-12 rounded-full border px-4 sm:px-8 py-2 text-xs sm:text-sm"
            >
              DOWNLOAD AS PDF
            </Button>
            <Button
              onClick={handleSendInvoice}
              className="bg-blue-700 font-semibold text-white h-12 rounded-full border px-4 sm:px-8 py-2 text-xs sm:text-sm"
            >
              SEND INVOICE
            </Button>
            <Button
              variant="outline"
              className="text-black font-semibold bg-white h-12 rounded-full border px-4 py-2 text-xs sm:text-sm"
            >
              MORE
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center border border-[#E3E6EF] rounded-2xl p-4 sm:p-6 gap-3 text-xs sm:text-sm">
          <h1 className="uppercase text-gray-500 text-[10px] sm:text-xs">
            Reminders
          </h1>
          <div className="flex flex-wrap gap-2 font-semibold">
            <div className="bg-green-100 py-2 px-3 rounded-2xl text-xs flex items-center gap-2">
              <p className="text-gray-600">14 days before due date</p>
              <Check className="w-3 h-3 sm:w-4 sm:h-4" color="#22c55e" />
            </div>
            <div className="bg-green-100 py-2 px-3 rounded-2xl text-xs flex items-center gap-2">
              <p className="text-gray-600">7 days before due date</p>
              <Check className="w-3 h-3 sm:w-4 sm:h-4" color="#22c55e" />
            </div>
            <div className="border py-2 px-3 rounded-2xl text-xs">
              <p className="text-gray-600">3 days before due date</p>
            </div>
            <div className="border py-2 px-3 rounded-2xl text-xs">
              <p className="text-gray-600">On the due date</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6">
        <div className="max-w-screen mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Invoice Details */}
          <div className="lg:col-span-2 ">
            <Card className="rounded-4xl border border-[#E3E6EF] shadow-none">
              <CardContent className="p-4 sm:p-8">
                {/* Sender and Customer Info */}
                <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-[#FCDDEC] rounded-4xl">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h3 className="font-semibold text-xs text-gray-500 mb-4">
                        SENDER
                      </h3>
                      <div className="flex justify-start gap-4">
                        <Image
                          src="/Logo_Frame.png"
                          alt="you-verify-logo"
                          width={60}
                          height={60}
                          className="w-12 h-12 sm:w-16 sm:h-16 object-cover"
                        />
                        <div className="space-y-1">
                          <p className="font-medium text-sm sm:text-base text-[#1F1F23]">
                            {invoice.sender.name}
                          </p>
                          <p className="text-[#697598] text-xs">
                            +386 989 271 3115
                          </p>
                          <p className="text-xs text-[#697598]">
                            {invoice.sender.email}
                          </p>
                          <p className="text-xs text-[#697598]">
                            {invoice.sender.address}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="ml-0 lg:ml-auto">
                      <h3 className="font-semibold text-xs text-gray-500 mb-4">
                        CUSTOMER
                      </h3>
                      <div className="space-y-1">
                        <p className="font-medium text-sm sm:text-base text-[#1F1F23]">
                          {invoice.customer.name}
                        </p>
                        <p className="text-xs text-[#697598]">
                          +386 989 271 3115
                        </p>
                        <p className="text-xs text-[#697598]">
                          {invoice.customer.email}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="">
                    <h2 className="text-gray-500 uppercase text-xs font-semibold mb-2">
                      Invoice Details
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs sm:text-sm">
                      <div>
                        <p className="text-gray-500 text-[10px] mb-1">
                          INVOICE NO
                        </p>
                        <p className="font-medium text-[#1F1F23] text-xs">
                          1023902390
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-[10px] mb-1">
                          ISSUE DATE
                        </p>
                        <p className="font-medium text-xs">
                          {formatDate(invoice.date)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-[10px] mb-1">
                          DUE DATE
                        </p>
                        <p className="font-medium text-xs">
                          {formatDate(invoice.dueDate)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-[10px] mb-1">
                          BILLING CURRENCY
                        </p>
                        <p className="font-medium text-xs">USD ($)</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Invoice Details */}
                <div className="flex justify-start items-center gap-6 mb-6">
                  <h3 className="font-semibold text-sm sm:text-base">Items</h3>
                  <div className="w-full h-px bg-gray-200" />
                </div>

                {/* Items */}
                <div className="mb-8">
                  <div className="space-y-4">
                    {invoice.items.map((item) => (
                      <div
                        key={item.id}
                        className="grid grid-cols-2 sm:grid-cols-12 gap-3 items-center"
                      >
                        <p className="col-span-2 sm:col-span-4 font-medium">
                          {item.description}
                        </p>
                        <p className="text-center col-span-1 sm:col-span-2">
                          {item.quantity}
                        </p>
                        <p className="text-right col-span-1 sm:col-span-2">
                          {formatCurrency(item.rate)}
                        </p>
                        <p className="text-right font-semibold col-span-2 sm:col-span-4">
                          {formatCurrency(item.amount)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Totals */}
                <div className="space-y-2 text-left sm:text-right">
                  <div className="flex justify-between lg:justify-end gap-0 lg:gap-40 items-center mb-5 text-xs sm:text-sm">
                    <span className="text-gray-400 text-sm">SUBTOTAL</span>
                    <span className="font-normal text-gray-500 w-25 text-right">
                      {formatCurrency(subtotal)}
                    </span>
                  </div>

                  <div className="flex justify-between lg:justify-end gap-0 lg:gap-40 items-center mb-5 text-xs sm:text-sm">
                    <span className="text-gray-400">DISCOUNT (2.5%)</span>
                    <span className="font-normal text-gray-500 lg:w-25">
                      {formatCurrency(167430)}
                    </span>
                  </div>

                  <div className="flex justify-between sm:justify-end sm:gap-20 items-center font-semibold text-sm sm:text-xl">
                    <span className="w-full">TOTAL AMOUNT DUE</span>
                    <span className="w-24 lg:w-40">$6,529,770.00</span>
                  </div>
                </div>

                {/* Payment Information */}
                <div className="mt-8 p-4 border border-[#E3E6EF] rounded-3xl">
                  <h4 className="font-semibold mb-2 text-xs text-gray-500">
                    PAYMENT INFORMATION
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600 text-[10px] mb-1">
                        ACCOUNT NAME
                      </p>
                      <p className="text-xs font-medium text-black">
                        1020000000
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-[10px] mb-1">
                        ACCOUNT NUMBER
                      </p>
                      <p className="text-xs font-medium text-black">
                        March 30th, 2023
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-[10px] mb-1">
                        ACH ROUTING NO.
                      </p>
                      <p className="text-xs font-medium text-black">
                        May 30th, 2023
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-[10px] mb-1">
                        BANK NAME
                      </p>
                      <p className="text-xs font-medium text-black">USD ($)</p>
                    </div>
                    <div className="">
                      <p className="text-gray-600 text-[10px] mb-1">
                        BANK ADDRESS
                      </p>
                      <p className="text-xs font-medium text-black">
                        1020000000
                      </p>
                    </div>
                    <div className="">
                      <p className="text-gray-600 text-[10px] mb-1">
                        PAYMENT REFERENCE
                      </p>
                      <p className="text-xs font-medium text-black">
                        1020000000
                      </p>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {invoice.notes && (
                  <div className="mt-6 bg-gray-100 rounded-2xl py-4 px-6">
                    <h5 className="text-xs sm:text-sm text-gray-400 font-normal mb-1">
                      NOTE
                    </h5>
                    <p className="text-xs sm:text-base text-gray-600">
                      {invoice.notes}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Activity Sidebar */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm sm:text-base">
                  Invoice Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activities.map((activity, index) => (
                    <div
                      key={activity.id}
                      className="flex items-start space-x-3"
                    >
                      <div className="relative">
                        <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                          <AvatarImage src={activity.user.avatar} />
                          <AvatarFallback>
                            {activity.user.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        {index !== activities.length - 1 && (
                          <span className="absolute top-10 left-1/2 -translate-x-1/2 w-px h-12 bg-gray-300"></span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-semibold">
                          {activity.user.name}
                        </p>
                        <p className="text-[10px] sm:text-xs text-gray-500">
                          {formatDate(activity.timestamp)}
                        </p>
                        <p className="text-xs sm:text-sm bg-gray-100 p-3 rounded-xl text-gray-600">
                          {activity.message}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
