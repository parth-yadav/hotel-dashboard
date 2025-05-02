"use client"

import { useState } from "react"
import { format } from "date-fns"
import { CalendarIcon, Check, Clock, FileText, Mail, MapPin, Phone, Search, User } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

// Sample data for bookings
const bookings = [
  {
    id: "B001",
    name: "John Smith",
    profileImage: "/placeholder.svg?height=40&width=40",
    status: "confirmed",
    registrationNumber: "REG-2023-001",
    checkIn: new Date(2023, 4, 15),
    checkOut: new Date(2023, 4, 20),
    email: "john.smith@example.com",
    phone: "+1 (555) 123-4567",
    bookingDate: new Date(2023, 3, 10),
    docs: "received",
    guests: { male: 2, female: 1 },
    roomNumber: "101",
    totalCharge: 1250.0,
    pendingCharge: 0,
  },
  {
    id: "B002",
    name: "Sarah Johnson",
    profileImage: "/placeholder.svg?height=40&width=40",
    status: "pending",
    registrationNumber: "REG-2023-002",
    checkIn: new Date(2023, 4, 18),
    checkOut: new Date(2023, 4, 25),
    email: "sarah.j@example.com",
    phone: "+1 (555) 987-6543",
    bookingDate: new Date(2023, 4, 5),
    docs: "pending",
    guests: { male: 1, female: 2 },
    roomNumber: "205",
    totalCharge: 1750.0,
    pendingCharge: 1750.0,
  },
  {
    id: "B003",
    name: "Michael Chen",
    profileImage: "/placeholder.svg?height=40&width=40",
    status: "cancelled",
    registrationNumber: "REG-2023-003",
    checkIn: new Date(2023, 4, 20),
    checkOut: new Date(2023, 4, 27),
    email: "michael.c@example.com",
    phone: "+1 (555) 456-7890",
    bookingDate: new Date(2023, 4, 2),
    docs: "received",
    guests: { male: 1, female: 1 },
    roomNumber: "310",
    totalCharge: 1400.0,
    pendingCharge: 0,
  },
  {
    id: "B004",
    name: "Emily Rodriguez",
    profileImage: "/placeholder.svg?height=40&width=40",
    status: "confirmed",
    registrationNumber: "REG-2023-004",
    checkIn: new Date(2023, 4, 22),
    checkOut: new Date(2023, 4, 29),
    email: "emily.r@example.com",
    phone: "+1 (555) 234-5678",
    bookingDate: new Date(2023, 4, 8),
    docs: "received",
    guests: { male: 2, female: 2 },
    roomNumber: "402",
    totalCharge: 2100.0,
    pendingCharge: 0,
  },
  {
    id: "B005",
    name: "David Kim",
    profileImage: "/placeholder.svg?height=40&width=40",
    status: "pending",
    registrationNumber: "REG-2023-005",
    checkIn: new Date(2023, 5, 1),
    checkOut: new Date(2023, 5, 7),
    email: "david.k@example.com",
    phone: "+1 (555) 876-5432",
    bookingDate: new Date(2023, 4, 15),
    docs: "pending",
    guests: { male: 1, female: 0 },
    roomNumber: "115",
    totalCharge: 1050.0,
    pendingCharge: 525.0,
  },
  {
    id: "B006",
    name: "Jessica Taylor",
    profileImage: "/placeholder.svg?height=40&width=40",
    status: "confirmed",
    registrationNumber: "REG-2023-006",
    checkIn: new Date(2023, 5, 5),
    checkOut: new Date(2023, 5, 12),
    email: "jessica.t@example.com",
    phone: "+1 (555) 345-6789",
    bookingDate: new Date(2023, 4, 20),
    docs: "received",
    guests: { male: 1, female: 1 },
    roomNumber: "220",
    totalCharge: 1400.0,
    pendingCharge: 0,
  },
]

// Status badge component
function StatusBadge({ status }: { status: string }) {
  const statusConfig = {
    confirmed: { variant: "success", label: "Confirmed" },
    pending: { variant: "warning", label: "Pending" },
    cancelled: { variant: "destructive", label: "Cancelled" },
  } as const

  const config = statusConfig[status as keyof typeof statusConfig]

  return (
    <Badge variant={config.variant as any} className="capitalize">
      {config.label}
    </Badge>
  )
}

// Date range picker component
function DateRangePicker({
  dateRange,
  onDateRangeChange,
}: {
  dateRange: { from: Date | undefined; to: Date | undefined }
  onDateRangeChange: (range: { from: Date | undefined; to: Date | undefined }) => void
}) {
  return (
    <div className="grid gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn("w-full justify-start text-left font-normal", !dateRange.from && "text-muted-foreground")}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                </>
              ) : (
                format(dateRange.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange.from}
            selected={{ from: dateRange.from, to: dateRange.to }}
            onSelect={(range) => onDateRangeChange({ from: range?.from, to: range?.to })}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default function BookingDashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  })

  // Filter bookings based on search, status, and date range
  const filteredBookings = bookings.filter((booking) => {
    // Filter by name search
    const nameMatch = booking.name.toLowerCase().includes(searchQuery.toLowerCase())

    // Filter by status
    const statusMatch = statusFilter === "all" || booking.status === statusFilter

    // Filter by date range
    let dateMatch = true
    if (dateRange.from && dateRange.to) {
      dateMatch = booking.checkIn >= dateRange.from && booking.checkOut <= dateRange.to
    }

    return nameMatch && statusMatch && dateMatch
  })

  return (
    <div className=" bg-black  p-6">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Booking Dashboard</h1>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
            <TabsList className="mb-4 md:mb-0">
              <TabsTrigger value="all" onClick={() => setStatusFilter("all")}>
                All Bookings
              </TabsTrigger>
              <TabsTrigger value="confirmed" onClick={() => setStatusFilter("confirmed")}>
                Confirmed
              </TabsTrigger>
              <TabsTrigger value="pending" onClick={() => setStatusFilter("pending")}>
                Pending
              </TabsTrigger>
              <TabsTrigger value="cancelled" onClick={() => setStatusFilter("cancelled")}>
                Cancelled
              </TabsTrigger>
            </TabsList>

            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search by name..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <DateRangePicker dateRange={dateRange} onDateRangeChange={setDateRange} />
            </div>
          </div>

          <TabsContent value="all" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredBookings.length > 0 ? (
                filteredBookings.map((booking) => (
                  <Card key={booking.id} className=" text-white bg-black overflow-hidden">
                    <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage src={booking.profileImage || "/placeholder.svg"} alt={booking.name} />
                          <AvatarFallback>{booking.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{booking.name}</h3>
                          <p className="text-sm text-muted-foreground">{booking.registrationNumber}</p>
                        </div>
                      </div>
                      <StatusBadge status={booking.status} />
                    </CardHeader>

                    <CardContent className="p-4 pt-2 grid gap-3">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                          <span>Check-in:</span>
                        </div>
                        <span>{format(booking.checkIn, "MMM dd, yyyy")}</span>

                        <div className="flex items-center gap-2">
                          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                          <span>Check-out:</span>
                        </div>
                        <span>{format(booking.checkOut, "MMM dd, yyyy")}</span>

                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span>Email:</span>
                        </div>
                        <span className="truncate" title={booking.email}>
                          {booking.email}
                        </span>

                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>Phone:</span>
                        </div>
                        <span>{booking.phone}</span>

                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>Booked on:</span>
                        </div>
                        <span>{format(booking.bookingDate, "MMM dd, yyyy")}</span>

                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span>Documents:</span>
                        </div>
                        <Badge variant={booking.docs === "received" ? "outline" : "secondary"} className="capitalize">
                          {booking.docs}
                        </Badge>
                      </div>

                      <Separator />

                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4 text-blue-500" />
                            <span className="text-sm">{booking.guests.male}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4 text-pink-500" />
                            <span className="text-sm">{booking.guests.female}</span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="h-8 text-black gap-1">
                          <MapPin className="h-3.5 w-3.5 text-black" />
                          Room {booking.roomNumber}
                        </Button>
                      </div>
                    </CardContent>

                    <CardFooter className="p-4 pt-0 flex justify-between border-t">
                      <div>
                        <p className="text-sm font-medium">Total: ${booking.totalCharge.toFixed(2)}</p>
                        {booking.pendingCharge > 0 && (
                          <p className="text-sm text-muted-foreground">Pending: ${booking.pendingCharge.toFixed(2)}</p>
                        )}
                      </div>
                      {booking.pendingCharge > 0 ? (
                        <Badge variant="outline" className="gap-1 text-red-400">
                          <Clock className="h-3.5 w-3.5" /> Payment Due
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="gap-1 border-green-200 bg-green-50 text-green-700">
                          <Check className="h-3.5 w-3.5" /> Paid
                        </Badge>
                      )}
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="col-span-full flex justify-center items-center h-40">
                  <p className="text-muted-foreground">No bookings found matching your filters.</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="confirmed" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* This content will be shown when the "Confirmed" tab is active */}
              {/* The filtering is already handled by the status filter */}
            </div>
          </TabsContent>

          <TabsContent value="pending" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* This content will be shown when the "Pending" tab is active */}
              {/* The filtering is already handled by the status filter */}
            </div>
          </TabsContent>

          <TabsContent value="cancelled" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* This content will be shown when the "Cancelled" tab is active */}
              {/* The filtering is already handled by the status filter */}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
