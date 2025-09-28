"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Sidebar } from "@/components/SideBar";
import { Bell, ChevronDown } from "lucide-react";
import {
  login,
  logout,
  signup,
  onAuthStateChanged,
  getCurrentUser,
} from "@/lib/auth";
import { getInvoices, getInvoiceStats } from "@/lib/invoices";
import { onActivity, connect, disconnect } from "@/lib/websocket";
import { formatCurrency, formatDate } from "@/lib/utils";
import InvoiceDetails from "./invoice/[id]/page";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import { Menu, X } from "lucide-react";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged((user) => {
      if (!user) {
        router.push("/login");
      } else {
        setUser(user);
      }
    });

    return unsubscribe;
  }, [router]);

  useEffect(() => {
    if (user) {
      loadData();
      connect();

      const unsubscribe = onActivity((activity) => {
        setActivities((prev) => [activity, ...prev.slice(0, 4)]);
      });

      return () => {
        unsubscribe();
        disconnect();
      };
    }
  }, [user]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [invoicesData, statsData] = await Promise.all([
        getInvoices(),
        getInvoiceStats(),
      ]);

      setInvoices(invoicesData);
      setStats(statsData);

      setActivities([
        {
          id: "1",
          type: "created",
          message: "Created invoice #1023494",
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          user: { name: "You", avatar: "/image13.png" },
        },
        {
          id: "2",
          type: "payment_confirmed",
          message: "Payment confirmed for invoice #1023494",
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          user: { name: "System", avatar: "/image13.png" },
        },
        {
          id: "3",
          type: "payment_confirmed",
          message: "Payment confirmed for invoice #1023494",
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          user: { name: "System", avatar: "/image13.png" },
        },
        {
          id: "4",
          type: "payment_confirmed",
          message: "Payment confirmed for invoice #1023494",
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          user: { name: "System", avatar: "/image13.png" },
        },
        {
          id: "5",
          type: "payment_confirmed",
          message: "Payment confirmed for invoice #1023494",
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          user: { name: "System", avatar: "/image13.png" },
        },
      ]);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const handleSignup = async () => {
    try {
      await signup("new@user.com", "pass123", "New User");
    } catch (err) {
      alert(err.message);
    }
  };

  if (!user) return null;

  const handleOpenInvoice = (invoiceId) => {
    setSelectedInvoice(invoiceId);
  };

  console.log(user.name);

  return (
    <div className="flex h-screen bg-gray-50 flex-col md:flex-row">
      {/* <Sidebar className="w-full md:w-64" /> */}

      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 md:static md:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-gray-50 border-b px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
          <div className="flex items-center justify-start flex-wrap gap-4 w-full">
            <div>
              <h1 className="text-xl md:text-3xl font-medium text-gray-900 uppercase">
                Invoice
              </h1>
            </div>

            <div className="flex items-center space-x-2 md:space-x-4 ml-auto">
              <Button
                variant="ghost"
                size="icon"
                className="bg-white p-3 border rounded-full"
              >
                <Bell className="h-5 w-5" />
              </Button>

              <div className="flex justify-center items-center gap-1 px-2 py-1 md:p-2 rounded-full">
                <Avatar className="h-8 w-8 md:h-10 md:w-10 bg-blue-600">
                  <AvatarImage src={user.avata} />
                  <AvatarFallback
                    className={"bg-blue-600 text-white font-bold p-1"}
                  >
                    K.O
                  </AvatarFallback>
                </Avatar>
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
            <div className="ml-2">
              <button
                className="md:hidden p-2 rounded-md hover:bg-gray-100"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                {isSidebarOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Invoice</h1>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Button className="bg-white text-gray-400 rounded-full sm:w-auto px-6 md:px-20 h-12 border">
                SEE WHAT'S NEW
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700  rounded-full w-full sm:w-auto px-6 md:px-20 h-12">
                CREATE
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
            {/* Left Column */}
            <div className="lg:col-span-3 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {isLoading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <Card key={i}>
                      <CardContent className="p-4">
                        <Skeleton className="h-4 w-16 mb-2" />
                        <Skeleton className="h-8 w-24" />
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <>
                    {/* Total Paid */}
                    <Card>
                      <CardContent className="px-4 md:p-4">
                        <div className="flex items-center space-x-2 mb-4">
                          <div className="flex justify-start items-center gap-6">
                            <h3 className="text-xs md:text-sm uppercase text-gray-600">
                              Total Paid
                            </h3>
                            <p className="text-[10px] md:text-xs text-gray-500 !bg-[#b6fdd2] rounded-2xl py-1 px-2">
                              {stats?.overdue.count.toString().padStart(2, "0")}
                            </p>
                          </div>
                        </div>
                        <p className="text-2xl md:text-3xl font-semibold">
                          {formatCurrency(stats?.total.amount || 0)}
                        </p>
                      </CardContent>
                    </Card>

                    {/* Total Overdue */}
                    <Card>
                      <CardContent className="px-4 md:p-4">
                        <div className="flex items-center space-x-2 mb-4">
                          <div className="flex justify-start items-center gap-6">
                            <h3 className="text-xs uppercase text-gray-600">
                              Total Overdue
                            </h3>
                            <p className="text-xs text-gray-500 bg-[#ffb7bd]  rounded-2xl py-2 px-3">
                              {stats?.overdue.count.toString().padStart(2, "0")}
                            </p>
                          </div>
                        </div>
                        <p className="text-3xl font-semibold">
                          {formatCurrency(stats?.overdue.amount || 0)}
                        </p>
                      </CardContent>
                    </Card>

                    {/* Total Draft */}
                    <Card>
                      <CardContent className="px-4 md:p-4">
                        <div className="flex items-center space-x-2 mb-4">
                          <div className="flex justify-start items-center gap-6">
                            <h3 className="text-xs uppercase text-gray-600">
                              Total Draft
                            </h3>
                            <p className="text-xs  !bg-[#d9d9e0] rounded-2xl py-2 px-3">
                              08
                            </p>
                          </div>
                        </div>
                        <p className="text-3xl font-semibold">
                          {formatCurrency(stats?.pending.amount || 0)}
                        </p>{" "}
                      </CardContent>
                    </Card>

                    {/* Total Unpaid */}
                    <Card>
                      <CardContent className="px-4 md:p-4">
                        <div className="flex items-center space-x-2 mb-4">
                          <div className="flex justify-start items-center gap-6">
                            <h3 className="text-xs uppercase text-gray-600">
                              Total Unpaid
                            </h3>
                            <p className="text-xs  !bg-[#f8e39b] rounded-2xl py-2 px-3">
                              08
                            </p>
                          </div>
                        </div>
                        <p className="text-3xl font-semibold">
                          {formatCurrency(stats?.overdue.amount || 0)}
                        </p>
                      </CardContent>
                    </Card>
                  </>
                )}
              </div>
              <h1 className="mb-3 text-base md:text-lg lg:text-xl font-medium">
                Invoice Actions
              </h1>
              {/* Invoice Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ">
                <Card className="cursor-pointer hover:shadow-md transition-shadow  text-white h-auto p-0">
                  <CardContent className="p-6 !bg-[#003EFF] h-full rounded-2xl">
                    <div className="flex flex-col items-start h-full space-x-3">
                      <Image
                        src="/money.png"
                        alt="you-verify"
                        width={100}
                        height={100}
                        className="w-15 h-15 lg:w-25 lg:h-25 object-cover"
                      />
                      <div className=" mt-4">
                        <h3 className="text-lg md:text-xl lg:text-2xl font-semibold mb-1">
                          Create New Invoice
                        </h3>
                        <p className="text-sm md:text-base opacity-90">
                          Create new invoice easily
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="cursor-pointer hover:shadow-md transition-shadow  text-white h-auto p-0">
                  <CardContent className="p-6 !bg-white h-full rounded-2xl">
                    <div className="flex flex-col items-start h-full space-x-3">
                      <Image
                        src="/setting.png"
                        alt="you-verify"
                        width={100}
                        height={100}
                        className="w-15 h-15 lg:w-25 lg:h-25 object-cover"
                      />
                      <div className=" text-[#373B47] mt-4">
                        <h3 className="text-lg md:text-xl lg:text-3xl font-semibold mb-1 ">
                          Change Invoice settings
                        </h3>
                        <p className="text-sm md:text-base opacity-90">
                          Customize your invoice
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="cursor-pointer hover:shadow-md transition-shadow  text-white h-auto p-0">
                  <CardContent className="p-6 !bg-white h-full rounded-2xl">
                    <div className="flex flex-col items-start h-full space-x-3">
                      <Image
                        src="/profile-2user.png"
                        alt="you-verify"
                        width={100}
                        height={100}
                        className="w-15 h-15 lg:w-25 lg:h-25 object-cover"
                      />
                      <div className=" text-[#373B47] mt-4">
                        <h3 className="text-lg md:text-xl lg:text-2xl font-semibold mb-1 ">
                          Manage Customer list
                        </h3>
                        <p className="text-sm md:text-base opacity-90">
                          Add and remove customers
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
            {/* Recent Invoices */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base md:text-lg lg:text-xl">
                      Recent Invoices
                    </CardTitle>
                    <Button className="text-blue-700 font-medium bg-white rounded-full border h-15 !py-2 md:!py-3 px-6 md:px-10 text-xs md:text-sm">
                      VIEW ALL INVOICES
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="uppercase text-xs md:text-sm font-medium text-[#1F1F23] mb-4">
                    today - 27th November, 2022
                  </p>

                  {isLoading ? (
                    <div className="space-y-4">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-4 rounded-lg"
                        >
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-24" />
                          </div>
                          <Skeleton className="h-6 w-16" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <>
                      {/* First batch */}
                      <div className="space-y-3 w-full mb-6">
                        {invoices.slice(0, 5).map((invoice) => (
                          <div
                            key={invoice.id}
                            className="flex items-center justify-between p-0 sm:p-4 rounded-lg hover:bg-gray-50 cursor-pointer"
                            onClick={() => handleOpenInvoice(invoice.id)}
                          >
                            <div className="w-full text-xs md:text-base">
                              <p className="font-medium">
                                Invoice - {invoice.number}
                              </p>
                            </div>
                            <div className="flex flex-col items-center sm:items-start w-full">
                              <p className="text-[10px] md:text-xs text-gray-800 uppercase mb-0 sm:mb-1">
                                Due Date:
                              </p>
                              <h3 className="text-xs md:text-base text-gray-600">
                                {formatDate(invoice.dueDate)}
                              </h3>
                            </div>
                            <div className="text-right w-full">
                              <p className="font-bold text-xs sm:text-lg md:text-xl mb-2">
                                {formatCurrency(invoice.amount)}
                              </p>
                              <Badge
                                variant="secondary"
                                className={`text-[9px] md:text-[11px] ${
                                  invoice.status === "paid"
                                    ? "bg-green-100 text-green-800"
                                    : invoice.status === "sent"
                                    ? "bg-blue-100 text-blue-800"
                                    : invoice.status === "overdue"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {invoice.status.toUpperCase()}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Second batch (continuation) */}
                      <div className="space-y-3 w-full">
                        <p className="uppercase text-xs md:text-sm font-medium text-[#1F1F23] my-4">
                          8th december, 2022
                        </p>
                        {invoices.slice(0, 5).map((invoice) => (
                          <div
                            key={invoice.id}
                            className="flex items-center justify-between p-0 sm:p-4 rounded-lg hover:bg-gray-50 cursor-pointer"
                            onClick={() => handleOpenInvoice(invoice.id)}
                          >
                            <div className="w-full text-xs md:text-base">
                              <p className="font-medium ">
                                Invoice - {invoice.number}
                              </p>
                            </div>
                            <div className="flex flex-col items-center sm:items-start w-full">
                              <p className="text-[10px] md:text-xs text-gray-800 uppercase mb-0 sm:mb-1">
                                Due Date:
                              </p>
                              <h3 className="text-xs md:text-base text-gray-600">
                                {formatDate(invoice.dueDate)}
                              </h3>
                            </div>
                            <div className="text-right w-full">
                              <p className="font-bold text-xs sm:text-lg md:text-xl md:mb-2">
                                {formatCurrency(invoice.amount)}
                              </p>
                              <Badge
                                variant="secondary"
                                className={`text-[9px] md:text-[11px] ${
                                  invoice.status === "paid"
                                    ? "bg-green-100 text-green-800"
                                    : invoice.status === "sent"
                                    ? "bg-blue-100 text-blue-800"
                                    : invoice.status === "overdue"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {invoice.status.toUpperCase()}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
            {/* Right Column - Activities */}
            <div className="space-y-6 col-span-1">
              <Card>
                <CardHeader className={`flex justify-between items-center`}>
                  <CardTitle className="text-base md:text-lg lg:text-xl">
                    Recent Activities
                  </CardTitle>
                  <Button className="text-blue-700 font-medium bg-white rounded-full border h-12 !py-2 md:!py-3 px-6 md:px-10 text-xs md:text-sm">
                    VIEW ALL
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6 w-full">
                    {activities.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-start space-x-3"
                      >
                        <Avatar className="h-10 w-10 md:h-12 md:w-12">
                          <AvatarImage src={activity.user.avatar} />
                          <AvatarFallback>
                            {activity.user.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>

                        <div className="w-full">
                          <div className="mb-2">
                            <h2 className="text-sm md:text-base lg:text-lg font-medium">
                              Invoice Creation
                            </h2>
                            <p className="text-xs md:text-sm text-gray-500">
                              {formatDate(activity.timestamp)}
                            </p>
                          </div>
                          <div className="flex-1 min-w-0 bg-gray-100 p-3 rounded-2xl">
                            <p className="text-xs md:text-sm text-gray-600 mb-2">
                              {activity.message}
                            </p>
                            <p className="text-xs md:text-sm font-medium">
                              {activity.user.name}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
        <Dialog
          open={!!selectedInvoice}
          onOpenChange={() => setSelectedInvoice(null)}
        >
          <DialogContent className="w-full max-w-[95vw] md:max-w-3xl lg:max-w-6xl max-h-[90vh] overflow-y-auto p-0 md:p-6">
            <DialogHeader>
              <DialogTitle>{""}</DialogTitle>
            </DialogHeader>
            {selectedInvoice && <InvoiceDetails id={selectedInvoice} />}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
