"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { OrderFilter, PaymentFilter, DeliveryFilter } from "@/types"

interface OrderFiltersProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  orderFilter: OrderFilter
  onOrderFilterChange: (value: OrderFilter) => void
  paymentFilter: PaymentFilter
  onPaymentFilterChange: (value: PaymentFilter) => void
  deliveryFilter: DeliveryFilter
  onDeliveryFilterChange: (value: DeliveryFilter) => void
}

export function OrderFilters({
  searchTerm,
  onSearchChange,
  orderFilter,
  onOrderFilterChange,
  paymentFilter,
  onPaymentFilterChange,
  deliveryFilter,
  onDeliveryFilterChange,
}: OrderFiltersProps) {
  return (
    <div className="flex flex-col gap-4 bg-card border border-border rounded-lg p-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Search by name, phone, or order number..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 text-base h-12"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3">
        {/* Order Type Tabs */}
        <Tabs value={orderFilter} onValueChange={(v) => onOrderFilterChange(v as OrderFilter)}>
          <TabsList className="grid w-full grid-cols-4 h-auto">
            <TabsTrigger value="all" className="text-[11px] sm:text-sm px-1 sm:px-3 py-2 whitespace-nowrap">
              All
            </TabsTrigger>
            <TabsTrigger value="mutton" className="text-[11px] sm:text-sm px-1 sm:px-3 py-2 whitespace-nowrap">
              Mutton
            </TabsTrigger>
            <TabsTrigger value="chicken" className="text-[11px] sm:text-sm px-1 sm:px-3 py-2 whitespace-nowrap">
              Chicken
            </TabsTrigger>
            <TabsTrigger value="deliveries" className="text-[11px] sm:text-sm px-1 sm:px-3 py-2 whitespace-nowrap">
              Delivery
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex gap-3">
          {/* Status Filter */}
          <Select value={deliveryFilter} onValueChange={(v) => onDeliveryFilterChange(v as DeliveryFilter)}>
            <SelectTrigger className="flex-1 text-sm">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="collected">Collected</SelectItem>
            </SelectContent>
          </Select>

          {/* Payment Filter */}
          <Select value={paymentFilter} onValueChange={(v) => onPaymentFilterChange(v as PaymentFilter)}>
            <SelectTrigger className="flex-1 text-sm">
              <SelectValue placeholder="Payment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Payments</SelectItem>
              <SelectItem value="unpaid">Unpaid</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="pay-later">Pay Later</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
