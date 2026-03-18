"use client"

import { useState, useEffect } from "react"
import { Plus, Trash2, Save } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { AppSettings, MenuItem } from "@/types"
import { upsertSettings } from "@/lib/orders"
import { toast } from "sonner"

interface MenuSectionProps {
  settings: AppSettings
  onSettingsUpdated?: () => void
}

export function MenuSection({ settings, onSettingsUpdated }: MenuSectionProps) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(settings.menuItems || [])
  const [newItemName, setNewItemName] = useState("")
  const [newItemPrice, setNewItemPrice] = useState("")
  const [saving, setSaving] = useState(false)

  // Update local state when settings prop changes
  useEffect(() => {
    setMenuItems(settings.menuItems || [])
  }, [settings.menuItems])

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
        menuItems,
      }

      console.log('Saving menu items:', menuItems)
      const result = await upsertSettings(updatedSettings)
      console.log('Save result:', result)
      toast.success('Menu items saved successfully!')

      // Notify parent to reload settings
      if (onSettingsUpdated) {
        console.log('Calling onSettingsUpdated callback')
        onSettingsUpdated()
      }
    } catch (error) {
      console.error('Error saving menu items:', error)
      toast.error('Failed to save menu items')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary/60 mb-2">Menu Items</h1>
        <p className="text-muted-foreground">
          Manage items that can be quickly selected when adding custom items to orders
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add New Menu Item</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3">
            <Input
              placeholder="Item name (e.g., Green Peas)"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addMenuItem()}
              className="flex-1"
            />
            <div className="flex items-center gap-2 w-40">
              <span className="text-muted-foreground text-lg">£</span>
              <Input
                type="number"
                placeholder="Price"
                value={newItemPrice}
                onChange={(e) => setNewItemPrice(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addMenuItem()}
                min="0"
                step="0.01"
              />
            </div>
            <Button onClick={addMenuItem} size="icon" className="flex-shrink-0">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current Menu Items ({menuItems.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {menuItems.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <MenuIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No menu items yet. Add some above!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {menuItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border"
                  >
                    <div>
                      <p className="font-medium text-lg">{item.name}</p>
                      <p className="text-sm text-muted-foreground">£{item.price.toFixed(2)}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeMenuItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive/80" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end pt-4 border-t mt-4">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="gap-2"
            >
              <Save className="h-4 w-4" />
              {saving ? 'Saving...' : 'Save All Changes'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  )
}
