"use client"

import { useState } from "react"
import { DollarSign, Package, AlertCircle, TrendingUp, Info, Eye, EyeOff } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import type { Order } from "@/types"
import { calculateDashboardStats, formatCurrency } from "@/lib/calculations"

interface StatsCardsProps {
  orders: Order[]
}

export function StatsCards({ orders }: StatsCardsProps) {
  const stats = calculateDashboardStats(orders)
  const [showRevenue, setShowRevenue] = useState(false)

  // Calculate smart totals for item breakdown
  const fullSavanCount = stats.fullMuttonCount + stats.fullChickenCount
  const halfSavanCount = stats.halfMuttonCount + stats.halfChickenCount

  const chickenCount =
    (stats.fullMuttonCount * 1) +
    (stats.fullChickenCount * 2) +
    (stats.halfMuttonCount * 0.5) +
    (stats.halfChickenCount * 1) +
    stats.extraChickenCount

  const wattalpamCount =
    (fullSavanCount * 1) +
    (halfSavanCount * 0.5) +
    stats.extraWattalpamCount

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Orders */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Orders
          </CardTitle>
          <Package className="h-5 w-5 text-primary/50" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.totalOrders}</div>
        </CardContent>
      </Card>

      {/* Total Revenue */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Revenue
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setShowRevenue(!showRevenue)}
              title={showRevenue ? "Hide revenue" : "Show revenue"}
            >
              {showRevenue ? (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Eye className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
            <DollarSign className="h-5 w-5 text-primary/50" />
          </div>
        </CardHeader>
        <CardContent>
          <div className={`text-3xl font-bold text-primary/60 transition-all ${!showRevenue ? 'blur-md select-none' : ''}`}>
            {formatCurrency(stats.totalRevenue)}
          </div>
          {stats.customItemsRevenue > 0 && (
            <p className={`text-xs text-muted-foreground mt-1 transition-all ${!showRevenue ? 'blur-sm select-none' : ''}`}>
              +{formatCurrency(stats.customItemsRevenue)} from custom items
            </p>
          )}
        </CardContent>
      </Card>

      {/* Paid Revenue */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Paid
          </CardTitle>
          <TrendingUp className="h-5 w-5 text-green-400/60" />
        </CardHeader>
        <CardContent>
          <div className={`text-3xl font-bold text-green-400/80 transition-all ${!showRevenue ? 'blur-md select-none' : ''}`}>
            {formatCurrency(stats.paidRevenue)}
          </div>
        </CardContent>
      </Card>

      {/* Outstanding */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Outstanding
          </CardTitle>
          <AlertCircle className="h-5 w-5 text-destructive/60" />
        </CardHeader>
        <CardContent>
          <div className={`text-3xl font-bold text-destructive/80 transition-all ${!showRevenue ? 'blur-md select-none' : ''}`}>
            {formatCurrency(stats.outstandingRevenue)}
          </div>
        </CardContent>
      </Card>

      {/* Item Counts */}
      <Card className="md:col-span-2 lg:col-span-4">
        <CardHeader>
          <CardTitle className="text-lg">Total Items Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="flex items-center gap-1.5">
                <p className="text-sm text-muted-foreground">Full Savan</p>
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="hover:bg-muted/50 p-0.5 rounded transition-colors">
                      <Info className="h-3.5 w-3.5 text-muted-foreground" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-3" side="top">
                    <div className="space-y-1 text-xs">
                      <div className="flex gap-2">
                        <span>Mutton:</span>
                        <span className="font-semibold">{stats.fullMuttonCount}</span>
                      </div>
                      <div className="flex gap-2">
                        <span>Chicken:</span>
                        <span className="font-semibold">{stats.fullChickenCount}</span>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              <p className="text-2xl font-bold">{fullSavanCount}</p>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <p className="text-sm text-muted-foreground">Half Savan</p>
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="hover:bg-muted/50 p-0.5 rounded transition-colors">
                      <Info className="h-3.5 w-3.5 text-muted-foreground" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-3" side="top">
                    <div className="space-y-1 text-xs">
                      <div className="flex gap-2">
                        <span>Mutton:</span>
                        <span className="font-semibold">{stats.halfMuttonCount}</span>
                      </div>
                      <div className="flex gap-2">
                        <span>Chicken:</span>
                        <span className="font-semibold">{stats.halfChickenCount}</span>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              <p className="text-2xl font-bold">{halfSavanCount}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Chicken</p>
              <p className="text-2xl font-bold">{chickenCount}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Wattalpam</p>
              <p className="text-2xl font-bold">{wattalpamCount}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
