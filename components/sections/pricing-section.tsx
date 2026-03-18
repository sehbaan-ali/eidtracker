"use client"

import { useState, useEffect } from "react"
import { Save, Plus, Trash2, AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { AppSettings, MenuItem } from "@/types"
import { upsertSettings } from "@/lib/orders"
import { toast } from "sonner"

interface PricingSectionProps {
  settings: AppSettings
  onSettingsUpdated?: () => void
}

export function PricingSection({ settings, onSettingsUpdated }: PricingSectionProps) {
  const [fullSavan, setFullSavan] = useState(settings.pricing.fullSavan)
  const [halfSavan, setHalfSavan] = useState(settings.pricing.halfSavan)
  const [extraChicken, setExtraChicken] = useState(settings.pricing.extraChicken)
  const [extraWattalpam, setExtraWattalpam] = useState(settings.pricing.extraWattalpam)
  const [menuItems, setMenuItems] = useState<MenuItem[]>(settings.menuItems || [])
  const [newItemName, setNewItemName] = useState("")
  const [newItemPrice, setNewItemPrice] = useState("")
  const [saving, setSaving] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  // Update menu items when settings prop changes
  useEffect(() => {
    setMenuItems(settings.menuItems || [])
  }, [settings.menuItems])

  // Track unsaved changes
  useEffect(() => {
    const pricingChanged =
      fullSavan !== settings.pricing.fullSavan ||
      halfSavan !== settings.pricing.halfSavan ||
      extraChicken !== settings.pricing.extraChicken ||
      extraWattalpam !== settings.pricing.extraWattalpam

    const menuItemsChanged = JSON.stringify(menuItems) !== JSON.stringify(settings.menuItems || [])

    setHasUnsavedChanges(pricingChanged || menuItemsChanged)
  }, [fullSavan, halfSavan, extraChicken, extraWattalpam, menuItems, settings])

  function addMenuItem() {
    if (!newItemName.trim() || !newItemPrice || parseFloat(newItemPrice) <= 0) {
      toast.error('Please enter a valid item name and price')
      return
    }

    const newItem: MenuItem = {
      id: crypto.randomUUID(),
      name: newItemName.trim(),
      price: parseFloat(newItemPrice),
    }

    setMenuItems([...menuItems, newItem])
    setNewItemName("")
    setNewItemPrice("")
  }

  function removeMenuItem(id: string) {
    setMenuItems(menuItems.filter(item => item.id !== id))
  }

  async function handleSave() {
    try {
      setSaving(true)
      const updatedSettings: AppSettings = {
        ...settings,
        pricing: {
          fullSavan,
          halfSavan,
          extraChicken,
          extraWattalpam,
        },
        menuItems,
      }

      await upsertSettings(updatedSettings)
      toast.success('Settings saved successfully!')

      // Notify parent to reload settings
      if (onSettingsUpdated) {
        onSettingsUpdated()
      }
    } catch (error) {
      toast.error('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary/60 mb-2">Pricing & Menu Management</h1>
        <p className="text-muted-foreground">
          Manage prices for standard items and custom menu items
        </p>
      </div>

      {/* Unsaved Changes Alert */}
      {hasUnsavedChanges && (
        <Alert variant="default" className="border-orange-500/50 bg-orange-500/10">
          <AlertCircle className="h-4 w-4 text-orange-500" />
          <AlertDescription className="text-orange-500">
            You have unsaved changes. Click "Save All Changes" to apply them.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Standard Menu Items</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="full-savan">Full Savan</Label>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-lg">£</span>
                <Input
                  id="full-savan"
                  type="number"
                  value={fullSavan}
                  onChange={(e) => setFullSavan(parseFloat(e.target.value) || 0)}
                  min="0"
                  step="0.01"
                  className="text-lg"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="half-savan">Half Savan</Label>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-lg">£</span>
                <Input
                  id="half-savan"
                  type="number"
                  value={halfSavan}
                  onChange={(e) => setHalfSavan(parseFloat(e.target.value) || 0)}
                  min="0"
                  step="0.01"
                  className="text-lg"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="extra-chicken">Extra Chicken</Label>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-lg">£</span>
                <Input
                  id="extra-chicken"
                  type="number"
                  value={extraChicken}
                  onChange={(e) => setExtraChicken(parseFloat(e.target.value) || 0)}
                  min="0"
                  step="0.01"
                  className="text-lg"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="extra-wattalpam">Extra Wattalpam</Label>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-lg">£</span>
                <Input
                  id="extra-wattalpam"
                  type="number"
                  value={extraWattalpam}
                  onChange={(e) => setExtraWattalpam(parseFloat(e.target.value) || 0)}
                  min="0"
                  step="0.01"
                  className="text-lg"
                />
              </div>
            </div>
          </div>

        </CardContent>
      </Card>

      {/* Extra Menu Items */}
      <Card>
        <CardHeader>
          <CardTitle>Extra Menu Items</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {menuItems.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {menuItems.map((item) => (
                <div key={item.id} className="flex items-end gap-3">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor={`item-${item.id}`}>{item.name}</Label>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground text-lg">£</span>
                      <Input
                        id={`item-${item.id}`}
                        type="number"
                        value={item.price}
                        onChange={(e) => {
                          const updatedItems = menuItems.map(i =>
                            i.id === item.id ? { ...i, price: parseFloat(e.target.value) || 0 } : i
                          )
                          setMenuItems(updatedItems)
                        }}
                        min="0"
                        step="0.01"
                        className="text-lg"
                      />
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeMenuItem(item.id)}
                    className="mb-0.5"
                  >
                    <Trash2 className="h-4 w-4 text-destructive/80" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Add New Item */}
          <div className="flex items-end gap-3 pt-4 border-t">
            <div className="flex-1 space-y-2">
              <Label htmlFor="new-item-name">New Item Name</Label>
              <Input
                id="new-item-name"
                placeholder="e.g., Green Peas"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addMenuItem()}
              />
            </div>
            <div className="w-48 space-y-2">
              <Label htmlFor="new-item-price">Price</Label>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-lg">£</span>
                <Input
                  id="new-item-price"
                  type="number"
                  placeholder="0.00"
                  value={newItemPrice}
                  onChange={(e) => setNewItemPrice(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addMenuItem()}
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
            <Button onClick={addMenuItem} size="default" className="gap-2">
              <Plus className="h-4 w-4" />
              Add Item
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={saving || !hasUnsavedChanges}
          size="lg"
          className="gap-2"
        >
          <Save className="h-4 w-4" />
          {saving ? 'Saving...' : 'Save All Changes'}
        </Button>
      </div>
    </div>
  )
}
