"use client"

import { useState, useEffect } from "react"
import { Edit2, Trash2, CheckCircle, Package, DollarSign, Truck, FileText } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Order, AppSettings } from "@/types"
import { deleteOrder, updateDeliveryStatus, updatePaymentStatus } from "@/lib/orders"
import { formatCurrency } from "@/lib/calculations"
import { toast } from "sonner"

interface OrderTableProps {
  orders: Order[]
  pricing: AppSettings['pricing']
  settings: AppSettings
  onOrderAdded?: (order: Order) => void
  onOrderUpdate: (updatedOrder: Order) => void
  onDeleteOrder: () => void
  onEditOrder: (order: Order) => void
  orderFilter?: 'all' | 'mutton' | 'chicken' | 'deliveries'
}

export function OrderTable({
  orders,
  pricing,
  settings,
  onOrderAdded,
  onOrderUpdate,
  onDeleteOrder,
  onEditOrder,
  orderFilter = 'all'
}: OrderTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  async function handleDelete(id: string, customerName: string) {
    if (!confirm(`Are you sure you want to delete order for ${customerName}?`)) {
      return
    }

    try {
      setDeletingId(id)
      await deleteOrder(id)
      onDeleteOrder()
    } catch (error) {
      toast.error('Failed to delete order')
    } finally {
      setDeletingId(null)
    }
  }

  async function handleToggleDelivery(order: Order) {
    if (updatingId === order.id) return // Prevent rapid clicks

    try {
      setUpdatingId(order.id)
      const newStatus = order.delivery_status === 'pending' ? 'collected' : 'pending'
      const updatedOrder = await updateDeliveryStatus(order.id, newStatus)
      toast.dismiss() // Dismiss any existing toasts
      toast.success(`Marked as ${newStatus}`)
      onOrderUpdate(updatedOrder)
    } catch (error) {
      toast.dismiss()
      toast.error('Failed to update delivery status')
    } finally {
      // Small delay to prevent rapid re-clicks
      setTimeout(() => setUpdatingId(null), 300)
    }
  }

  async function handlePaymentChange(orderId: string, status: 'unpaid' | 'paid' | 'pay-later', totalAmount: number) {
    if (updatingId === orderId) return // Prevent rapid clicks

    try {
      setUpdatingId(orderId)
      const updatedOrder = await updatePaymentStatus(orderId, status, totalAmount)
      toast.dismiss() // Dismiss any existing toasts
      toast.success(`Payment: ${status}`)
      onOrderUpdate(updatedOrder)
    } catch (error) {
      toast.dismiss()
      toast.error('Failed to update payment status')
    } finally {
      setTimeout(() => setUpdatingId(null), 300)
    }
  }

  if (orders.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-12 text-center">
        <p className="text-muted-foreground text-lg">
          No orders found. Click "New Order" to create one.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden h-full flex flex-col">
      <div className="overflow-x-auto overflow-y-auto flex-1">
        <table className="w-full caption-bottom text-sm min-w-[1300px]">
          <TableHeader>
            <TableRow>
              <TableHead className="sticky top-0 z-10 bg-card w-[70px]">#</TableHead>
              <TableHead className="sticky top-0 z-10 bg-card min-w-[120px]">Name</TableHead>
              <TableHead className="sticky top-0 z-10 bg-card min-w-[100px]">Phone</TableHead>
              {orderFilter === 'deliveries' && <TableHead className="sticky top-0 z-10 bg-card min-w-[150px]">Address</TableHead>}
              {orderFilter !== 'chicken' && <TableHead className="sticky top-0 z-10 bg-card text-center w-[70px]">M.Full</TableHead>}
              {orderFilter !== 'chicken' && <TableHead className="sticky top-0 z-10 bg-card text-center w-[70px]">M.Half</TableHead>}
              {orderFilter !== 'mutton' && <TableHead className="sticky top-0 z-10 bg-card text-center w-[70px]">C.Full</TableHead>}
              {orderFilter !== 'mutton' && <TableHead className="sticky top-0 z-10 bg-card text-center w-[70px]">C.Half</TableHead>}
              <TableHead className="sticky top-0 z-10 bg-card text-center w-[80px]">Chicken</TableHead>
              <TableHead className="sticky top-0 z-10 bg-card text-center w-[90px]">Wattalpam</TableHead>
              <TableHead className="sticky top-0 z-10 bg-card text-center w-[80px]">Custom</TableHead>
              <TableHead className="sticky top-0 z-10 bg-card text-center w-[70px]">Notes</TableHead>
              <TableHead className="sticky top-0 z-10 bg-card text-right w-[90px]">Total</TableHead>
              <TableHead className="sticky top-0 z-10 bg-card w-[100px]">Status</TableHead>
              <TableHead className="sticky top-0 z-10 bg-card w-[120px]">Payment</TableHead>
              <TableHead className="sticky top-0 z-10 bg-card text-right w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Existing Orders */}
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">#{order.order_number}</TableCell>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {order.is_delivery && (
                      <Truck className="h-4 w-4 text-primary/60 flex-shrink-0" aria-label="Delivery Order" />
                    )}
                    <span>{order.customer_name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{order.phone_number}</TableCell>
                {orderFilter === 'deliveries' && (
                  <TableCell>
                    {order.delivery_address ? (
                      <Popover>
                        <PopoverTrigger asChild>
                          <button className="text-left text-sm text-muted-foreground hover:text-foreground transition-colors max-w-[200px] truncate block">
                            {order.delivery_address}
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto max-w-[300px] p-3" side="top">
                          <div className="text-sm whitespace-pre-wrap">
                            {order.delivery_address}
                          </div>
                        </PopoverContent>
                      </Popover>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                )}
                {orderFilter !== 'chicken' && (
                  <TableCell className="text-center">
                    {order.full_mutton_savan || '-'}
                  </TableCell>
                )}
                {orderFilter !== 'chicken' && (
                  <TableCell className="text-center">
                    {order.half_mutton_savan || '-'}
                  </TableCell>
                )}
                {orderFilter !== 'mutton' && (
                  <TableCell className="text-center">
                    {order.full_chicken_savan || '-'}
                  </TableCell>
                )}
                {orderFilter !== 'mutton' && (
                  <TableCell className="text-center">
                    {order.half_chicken_savan || '-'}
                  </TableCell>
                )}
                <TableCell className="text-center">
                  {order.extra_chicken || '-'}
                </TableCell>
                <TableCell className="text-center">
                  {order.extra_wattalpam || '-'}
                </TableCell>
                <TableCell className="text-center">
                  {order.custom_extras && order.custom_extras.length > 0 ? (
                    <Popover>
                      <PopoverTrigger asChild>
                        <button className="cursor-pointer">
                          <Badge variant="secondary">{order.custom_extras.length} items</Badge>
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-3" side="top">
                        <div className="space-y-1">
                          {order.custom_extras.map((extra) => (
                            <div key={extra.id} className="text-sm">
                              {extra.quantity}x {extra.name} ({formatCurrency(extra.subtotal)})
                            </div>
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>
                  ) : (
                    '-'
                  )}
                </TableCell>
                <TableCell className="text-center">
                  {order.extra_notes ? (
                    <Popover>
                      <PopoverTrigger asChild>
                        <button className="inline-flex items-center justify-center text-primary/70 hover:text-primary transition-colors">
                          <FileText className="h-4 w-4" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto max-w-[300px] p-3" side="top">
                        <div className="text-sm whitespace-pre-wrap">
                          {order.extra_notes}
                        </div>
                      </PopoverContent>
                    </Popover>
                  ) : (
                    '-'
                  )}
                </TableCell>
                <TableCell className="text-right font-semibold">
                  {formatCurrency(order.total_amount)}
                </TableCell>
                <TableCell>
                  <Button
                    variant={order.delivery_status === 'collected' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleToggleDelivery(order)}
                    disabled={updatingId === order.id}
                    className={order.delivery_status === 'collected' ? 'bg-green-500/15 text-green-400/90 border-green-500/40 hover:bg-green-500/25' : ''}
                  >
                    <Package className="h-4 w-4 mr-1" />
                    {order.delivery_status === 'collected' ? 'Collected' : 'Pending'}
                  </Button>
                </TableCell>
                <TableCell>
                  <Select
                    value={order.payment_status}
                    onValueChange={(value: 'unpaid' | 'paid' | 'pay-later') =>
                      handlePaymentChange(order.id, value, order.total_amount)
                    }
                    disabled={updatingId === order.id}
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unpaid">Unpaid</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="pay-later">Pay Later</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1 justify-end">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEditOrder(order)}
                      title="Edit order"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(order.id, order.customer_name)}
                      disabled={deletingId === order.id}
                      title="Delete order"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </table>
      </div>
    </div>
  )
}
