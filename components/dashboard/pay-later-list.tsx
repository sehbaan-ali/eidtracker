"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Order } from "@/types"
import { formatCurrency } from "@/lib/calculations"

interface PayLaterListProps {
  orders: Order[]
  onOrderClick: (order: Order) => void
}

export function PayLaterList({ orders, onOrderClick }: PayLaterListProps) {
  const payLaterOrders = orders
    .filter((order) => order.payment_status === 'pay-later')
    .sort((a, b) => b.amount_remaining - a.amount_remaining)

  if (payLaterOrders.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Pay Later Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            No outstanding payments 🎉
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          Pay Later Orders ({payLaterOrders.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-[300px] overflow-y-auto">
          {payLaterOrders.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/70 transition-colors cursor-pointer"
              onClick={() => onOrderClick(order)}
            >
              <div className="flex-1">
                <p className="font-medium">{order.customer_name}</p>
                <p className="text-sm text-muted-foreground">
                  Order #{order.order_number}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-destructive">
                  {formatCurrency(order.amount_remaining)}
                </p>
                <p className="text-xs text-muted-foreground">
                  of {formatCurrency(order.total_amount)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
