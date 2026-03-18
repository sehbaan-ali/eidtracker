"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Order } from "@/types"
import { calculateDashboardStats } from "@/lib/calculations"

interface RemainingItemsProps {
  orders: Order[]
}

export function RemainingItems({ orders }: RemainingItemsProps) {
  // Only count items from pending orders (not yet collected)
  const pendingOrders = orders.filter(order => order.delivery_status === 'pending')
  const stats = calculateDashboardStats(pendingOrders)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Remaining Items for Collection</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Full Mutton Savan:</span>
            <span className="font-semibold text-lg">{stats.fullMuttonCount}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Half Mutton Savan:</span>
            <span className="font-semibold text-lg">{stats.halfMuttonCount}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Full Chicken Savan:</span>
            <span className="font-semibold text-lg">{stats.fullChickenCount}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Half Chicken Savan:</span>
            <span className="font-semibold text-lg">{stats.halfChickenCount}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Extra Chicken:</span>
            <span className="font-semibold text-lg">{stats.extraChickenCount}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Extra Wattalpam:</span>
            <span className="font-semibold text-lg">{stats.extraWattalpamCount}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
