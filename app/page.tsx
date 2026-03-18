"use client"

import { useEffect, useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sidebar } from "@/components/layout/sidebar"
import { OrderTable } from "@/components/orders/order-table"
import { OrderFilters } from "@/components/orders/order-filters"
import { OrderDialog } from "@/components/orders/order-dialog"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { RemainingItems } from "@/components/dashboard/remaining-items"
import { PayLaterList } from "@/components/dashboard/pay-later-list"
import { PricingSection } from "@/components/sections/pricing-section"
import { MenuSection } from "@/components/sections/menu-section"
import { fetchOrders, fetchSettings, upsertSettings } from "@/lib/orders"
import type { Order, AppSettings, OrderFilter, PaymentFilter, DeliveryFilter } from "@/types"
import { searchOrders, filterOrdersByType, filterOrdersByPayment, filterOrdersByDelivery } from "@/lib/calculations"
import { toast } from "sonner"

export default function Home() {
  const [orders, setOrders] = useState<Order[]>([])
  const [settings, setSettings] = useState<AppSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [showOrderDialog, setShowOrderDialog] = useState(false)
  const [editingOrder, setEditingOrder] = useState<Order | null>(null)
  const [currentSection, setCurrentSection] = useState('dashboard')
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  // Filters
  const [searchTerm, setSearchTerm] = useState("")
  const [orderFilter, setOrderFilter] = useState<OrderFilter>("all")
  const [paymentFilter, setPaymentFilter] = useState<PaymentFilter>("all")
  const [deliveryFilter, setDeliveryFilter] = useState<DeliveryFilter>("all")

  // Initialize theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)
    setIsDarkMode(prefersDark)
    if (prefersDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  function handleThemeToggle() {
    const newTheme = !isDarkMode
    setIsDarkMode(newTheme)
    localStorage.setItem('theme', newTheme ? 'dark' : 'light')
    if (newTheme) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  // Load orders and settings
  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      setLoading(true)
      const [ordersData, settingsData] = await Promise.all([
        fetchOrders(),
        fetchSettings(),
      ])

      console.log('Loaded settings:', settingsData)
      console.log('Menu items count:', settingsData?.menuItems?.length || 0)

      // Ensure orders are sorted by order_number ascending
      setOrders(ordersData.sort((a, b) => a.order_number - b.order_number))

      // If no settings exist, create default
      if (!settingsData) {
        const defaultSettings: AppSettings = {
          pricing: {
            fullSavan: 89,
            halfSavan: 48,
            extraChicken: 16,
            extraWattalpam: 16,
          },
          menuItems: [],
          current_year: 2025,
        }
        const created = await upsertSettings(defaultSettings)
        setSettings(created)
      } else {
        setSettings(settingsData)
      }
    } catch (error) {
      console.error('Error loading data:', error)
      toast.error('Failed to load data. Please check your Supabase connection.')
    } finally {
      setLoading(false)
    }
  }

  // Apply filters and ensure sorted by order number
  const filteredOrders = searchOrders(
    filterOrdersByDelivery(
      filterOrdersByPayment(
        filterOrdersByType(orders, orderFilter),
        paymentFilter
      ),
      deliveryFilter
    ),
    searchTerm
  ).sort((a, b) => a.order_number - b.order_number)

  function handleOrderAdded(newOrder: Order) {
    // Add new order and sort by order number ascending
    setOrders(prevOrders => [...prevOrders, newOrder].sort((a, b) => a.order_number - b.order_number))
  }

  function handleOrderDeleted() {
    loadData()
  }

  function handleOrderUpdate(updatedOrder: Order) {
    // Update the order in local state without full refresh and maintain sort order
    setOrders(prevOrders =>
      prevOrders
        .map(order => order.id === updatedOrder.id ? updatedOrder : order)
        .sort((a, b) => a.order_number - b.order_number)
    )
  }

  if (loading) {
    return (
      <main className="min-h-screen p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground text-lg">Loading...</p>
          </div>
        </div>
      </main>
    )
  }

  if (!settings) {
    return (
      <main className="min-h-screen p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-destructive/10 border border-destructive rounded-lg p-6">
            <h2 className="text-xl font-semibold text-destructive mb-2">
              Configuration Error
            </h2>
            <p className="text-foreground">
              Failed to load settings. Please check your Supabase configuration.
            </p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        currentSection={currentSection}
        onSectionChange={setCurrentSection}
        isDarkMode={isDarkMode}
        onThemeToggle={handleThemeToggle}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 overflow-hidden flex flex-col ${isSidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
        <div className="flex-1 flex flex-col p-4 md:p-8 overflow-hidden">
          <div className="max-w-[1600px] mx-auto w-full h-full flex flex-col">
            {/* Dashboard Section */}
            {currentSection === 'dashboard' && (
              <div className="overflow-y-auto space-y-6">
                {/* Header */}
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-primary/60 mb-1">
                    Eid Order Tracker {settings.current_year}
                  </h1>
                  <p className="text-muted-foreground">
                    Overview and statistics
                  </p>
                </div>

                {/* Stats Cards */}
                <StatsCards orders={orders} />

                {/* Remaining Items */}
                <RemainingItems orders={orders} />
              </div>
            )}

            {/* Customer Orders Section */}
            {currentSection === 'orders' && (
              <div className="h-full flex flex-col gap-6">
                {/* Header */}
                <header className="flex items-center justify-between flex-shrink-0">
                  <div>
                    <h1 className="text-3xl font-bold text-primary/60 mb-2">Customer Orders</h1>
                    <p className="text-muted-foreground">
                      Manage and track all customer orders
                    </p>
                  </div>
                  <Button
                    onClick={() => {
                      setEditingOrder(null)
                      setShowOrderDialog(true)
                    }}
                    size="lg"
                    className="gap-2 bg-primary/60 hover:bg-primary/70"
                  >
                    <Plus className="h-5 w-5" />
                    <span className="hidden sm:inline">New Order</span>
                  </Button>
                </header>

                {/* Filters */}
                <div className="flex-shrink-0">
                  <OrderFilters
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    orderFilter={orderFilter}
                    onOrderFilterChange={setOrderFilter}
                    paymentFilter={paymentFilter}
                    onPaymentFilterChange={setPaymentFilter}
                    deliveryFilter={deliveryFilter}
                    onDeliveryFilterChange={setDeliveryFilter}
                  />
                </div>

                {/* Orders Table - Scrollable */}
                <div className="flex-1 min-h-0">
                  <OrderTable
                    orders={filteredOrders}
                    pricing={settings.pricing}
                    settings={settings}
                    onOrderAdded={handleOrderAdded}
                    onOrderUpdate={handleOrderUpdate}
                    onDeleteOrder={handleOrderDeleted}
                    onEditOrder={(order) => {
                      setEditingOrder(order)
                      setShowOrderDialog(true)
                    }}
                    orderFilter={orderFilter}
                  />
                </div>

                {/* Order Dialog */}
                <OrderDialog
                  open={showOrderDialog}
                  onOpenChange={setShowOrderDialog}
                  existingOrder={editingOrder}
                  orderNumber={orders.length > 0 ? Math.max(...orders.map(o => o.order_number)) + 1 : 1}
                  settings={settings}
                  onSave={(order) => {
                    if (editingOrder) {
                      handleOrderUpdate(order)
                    } else {
                      handleOrderAdded(order)
                    }
                  }}
                />
              </div>
            )}

            {/* Pricing Section */}
            {currentSection === 'pricing' && (
              <div className="overflow-y-auto">
                <PricingSection settings={settings} onSettingsUpdated={loadData} />
              </div>
            )}

            {/* Settings Section */}
            {currentSection === 'settings' && (
              <div className="overflow-y-auto space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-primary/60 mb-2">Settings</h1>
                  <p className="text-muted-foreground">
                    Application settings and configuration
                  </p>
                </div>
                <div className="text-muted-foreground">
                  More settings coming soon...
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
