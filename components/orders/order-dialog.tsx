"use client"

import { useState, useEffect } from "react"
import { Plus, Trash2, Save, X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Order, AppSettings, CustomExtra } from "@/types"
import { createOrder, updateOrder } from "@/lib/orders"
import { calculateOrderTotal, calculateCustomExtraSubtotal } from "@/lib/calculations"
import { toast } from "sonner"

interface OrderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  existingOrder?: Order | null
  orderNumber: number
  settings: AppSettings
  onSave: (order: Order) => void
}

export function OrderDialog({
  open,
  onOpenChange,
  existingOrder,
  orderNumber,
  settings,
  onSave
}: OrderDialogProps) {
  console.log('OrderDialog settings.menuItems:', settings.menuItems)

  const [customerName, setCustomerName] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [isDelivery, setIsDelivery] = useState(false)
  const [deliveryAddress, setDeliveryAddress] = useState("")
  const [fullMuttonSavan, setFullMuttonSavan] = useState(0)
  const [halfMuttonSavan, setHalfMuttonSavan] = useState(0)
  const [fullChickenSavan, setFullChickenSavan] = useState(0)
  const [halfChickenSavan, setHalfChickenSavan] = useState(0)
  const [extraChicken, setExtraChicken] = useState(0)
  const [extraWattalpam, setExtraWattalpam] = useState(0)
  const [customExtras, setCustomExtras] = useState<CustomExtra[]>([])
  const [extraNotes, setExtraNotes] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [customOrderNumber, setCustomOrderNumber] = useState(orderNumber)

  // Reset form when dialog opens/closes or when existing order changes
  useEffect(() => {
    if (open) {
      if (existingOrder) {
        setCustomerName(existingOrder.customer_name)
        setPhoneNumber(existingOrder.phone_number)
        setIsDelivery(existingOrder.is_delivery || false)
        setDeliveryAddress(existingOrder.delivery_address || "")
        setFullMuttonSavan(existingOrder.full_mutton_savan)
        setHalfMuttonSavan(existingOrder.half_mutton_savan)
        setFullChickenSavan(existingOrder.full_chicken_savan)
        setHalfChickenSavan(existingOrder.half_chicken_savan)
        setExtraChicken(existingOrder.extra_chicken)
        setExtraWattalpam(existingOrder.extra_wattalpam)
        setCustomExtras(existingOrder.custom_extras || [])
        setExtraNotes(existingOrder.extra_notes || "")
        setCustomOrderNumber(existingOrder.order_number)
      } else {
        // Reset to defaults for new order
        setCustomerName("")
        setPhoneNumber("")
        setIsDelivery(false)
        setDeliveryAddress("")
        setFullMuttonSavan(0)
        setHalfMuttonSavan(0)
        setFullChickenSavan(0)
        setHalfChickenSavan(0)
        setExtraChicken(0)
        setExtraWattalpam(0)
        setCustomExtras([])
        setExtraNotes("")
        setCustomOrderNumber(orderNumber)
      }
    }
  }, [open, existingOrder, orderNumber])

  const liveTotal = calculateOrderTotal(
    {
      fullMuttonSavan,
      halfMuttonSavan,
      fullChickenSavan,
      halfChickenSavan,
      extraChicken,
      extraWattalpam,
    },
    customExtras,
    settings.pricing
  )

  function addCustomExtra() {
    setCustomExtras([
      ...customExtras,
      {
        id: crypto.randomUUID(),
        name: "",
        quantity: 1,
        unitPrice: 0,
        subtotal: 0,
      },
    ])
  }

  function removeCustomExtra(id: string) {
    setCustomExtras(customExtras.filter((extra) => extra.id !== id))
  }

  function updateCustomExtra(id: string, updates: Partial<CustomExtra>) {
    setCustomExtras(
      customExtras.map((extra) => {
        if (extra.id === id) {
          const updated = { ...extra, ...updates }
          updated.subtotal = calculateCustomExtraSubtotal(updated.quantity, updated.unitPrice)
          return updated
        }
        return extra
      })
    )
  }

  async function handleSave() {
    if (!customerName.trim() || !phoneNumber.trim()) {
      toast.error('Name and phone number are required')
      return
    }

    if (isDelivery && !deliveryAddress.trim()) {
      toast.error('Delivery address is required for delivery orders')
      return
    }

    try {
      setIsSaving(true)
      const formData = {
        customerName,
        phoneNumber,
        isDelivery,
        deliveryAddress: isDelivery ? deliveryAddress : undefined,
        fullMuttonSavan,
        halfMuttonSavan,
        fullChickenSavan,
        halfChickenSavan,
        extraChicken,
        extraWattalpam,
        customExtras,
        extraNotes,
      }

      let savedOrder: Order
      if (existingOrder) {
        savedOrder = await updateOrder(existingOrder.id, formData, settings.pricing, customOrderNumber)
        toast.success('Order updated successfully!')
      } else {
        savedOrder = await createOrder(formData, settings.pricing, undefined, customOrderNumber)
        toast.success('Order created successfully!')
      }

      onSave(savedOrder)
      onOpenChange(false)
    } catch (error) {
      console.error('Error saving order:', error)
      toast.error('Failed to save order')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {existingOrder ? `Edit Order #${customOrderNumber}` : `New Order`}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Order Number - Always shown, editable */}
          <div className="space-y-2">
            <Label htmlFor="order-number">Order Number *</Label>
            <Input
              id="order-number"
              type="number"
              value={customOrderNumber}
              onChange={(e) => setCustomOrderNumber(parseInt(e.target.value) || 1)}
              min="1"
              className="max-w-[200px]"
            />
          </div>

          {/* Customer Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customer-name">Customer Name *</Label>
              <Input
                id="customer-name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter customer name"
                autoFocus={!existingOrder}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Enter phone number"
              />
            </div>
          </div>

          {/* Delivery Checkbox */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="is-delivery"
              checked={isDelivery}
              onCheckedChange={(checked) => setIsDelivery(checked as boolean)}
            />
            <Label htmlFor="is-delivery" className="text-base cursor-pointer">
              This is a delivery order
            </Label>
          </div>

          {/* Delivery Address (conditional) */}
          {isDelivery && (
            <div className="space-y-2">
              <Label htmlFor="delivery-address">Delivery Address *</Label>
              <Textarea
                id="delivery-address"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="Enter delivery address"
                rows={3}
              />
            </div>
          )}

          {/* Menu Items */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Menu Items</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="full-mutton">Full Mutton Savan</Label>
                <Input
                  id="full-mutton"
                  type="number"
                  value={fullMuttonSavan}
                  onChange={(e) => setFullMuttonSavan(parseInt(e.target.value) || 0)}
                  onFocus={(e) => e.target.select()}
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="half-mutton">Half Mutton Savan</Label>
                <Input
                  id="half-mutton"
                  type="number"
                  value={halfMuttonSavan}
                  onChange={(e) => setHalfMuttonSavan(parseInt(e.target.value) || 0)}
                  onFocus={(e) => e.target.select()}
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="full-chicken">Full Chicken Savan</Label>
                <Input
                  id="full-chicken"
                  type="number"
                  value={fullChickenSavan}
                  onChange={(e) => setFullChickenSavan(parseInt(e.target.value) || 0)}
                  onFocus={(e) => e.target.select()}
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="half-chicken">Half Chicken Savan</Label>
                <Input
                  id="half-chicken"
                  type="number"
                  value={halfChickenSavan}
                  onChange={(e) => setHalfChickenSavan(parseInt(e.target.value) || 0)}
                  onFocus={(e) => e.target.select()}
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="extra-chicken">Extra Chicken</Label>
                <Input
                  id="extra-chicken"
                  type="number"
                  value={extraChicken}
                  onChange={(e) => setExtraChicken(parseFloat(e.target.value) || 0)}
                  onFocus={(e) => e.target.select()}
                  min="0"
                  step="0.5"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="extra-wattalpam">Extra Wattalpam</Label>
                <Input
                  id="extra-wattalpam"
                  type="number"
                  value={extraWattalpam}
                  onChange={(e) => setExtraWattalpam(parseFloat(e.target.value) || 0)}
                  onFocus={(e) => e.target.select()}
                  min="0"
                  step="0.5"
                />
              </div>
            </div>
          </div>

          {/* Custom Items */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">Custom Items</h3>
              <Button onClick={addCustomExtra} variant="outline" size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Add Item
              </Button>
            </div>

            {customExtras.length > 0 && (
              <div className="space-y-3">
                {/* Header row */}
                <div className="flex gap-2 items-center px-1">
                  <div className="flex-1">
                    <Label className="text-xs text-muted-foreground">Item</Label>
                  </div>
                  <div className="w-24">
                    <Label className="text-xs text-muted-foreground">Qty</Label>
                  </div>
                  <div className="w-32 text-right">
                    <Label className="text-xs text-muted-foreground">Total</Label>
                  </div>
                  <div className="w-10"></div>
                </div>

                {/* Items */}
                {customExtras.map((extra) => (
                  <div key={extra.id} className="flex gap-2 items-center">
                    <div className="flex-1">
                      <Select
                        value={extra.name || 'custom'}
                        onValueChange={(value) => {
                          const menuItem = settings.menuItems?.find(item => item.name === value)
                          if (menuItem) {
                            // Update both name and price together
                            updateCustomExtra(extra.id, {
                              name: menuItem.name,
                              unitPrice: menuItem.price
                            })
                          } else if (value === 'custom') {
                            updateCustomExtra(extra.id, { name: '', unitPrice: 0 })
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select item" />
                        </SelectTrigger>
                        <SelectContent>
                          {settings.menuItems && settings.menuItems.length > 0 ? (
                            <>
                              {settings.menuItems.map((item) => (
                                <SelectItem key={item.id} value={item.name}>
                                  {item.name} - £{item.price.toFixed(2)}
                                </SelectItem>
                              ))}
                              <SelectItem value="custom">Custom</SelectItem>
                            </>
                          ) : (
                            <SelectItem value="custom">Custom</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="w-24">
                      <Input
                        type="number"
                        value={extra.quantity}
                        onChange={(e) => updateCustomExtra(extra.id, { quantity: parseFloat(e.target.value) || 0 })}
                        onFocus={(e) => e.target.select()}
                        min="0"
                      />
                    </div>
                    <div className="w-32 text-right">
                      <p className="text-sm font-semibold">£{extra.subtotal.toFixed(2)}</p>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => removeCustomExtra(extra.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive/80" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={extraNotes}
              onChange={(e) => setExtraNotes(e.target.value)}
              placeholder="Add any special notes..."
              rows={2}
            />
          </div>

          {/* Total */}
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <span className="text-lg font-semibold">Order Total:</span>
            <span className="text-2xl font-bold text-primary/80">£{liveTotal.toFixed(2)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving} className="gap-2">
            <Save className="h-4 w-4" />
            {isSaving ? 'Saving...' : existingOrder ? 'Update Order' : 'Create Order'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
