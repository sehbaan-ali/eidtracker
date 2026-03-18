"use client"

import { useState, useEffect } from "react"
import { Moon, Sun, Plus, Trash2, Save } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { AppSettings, MenuItem } from "@/types"
import { fetchSettings, upsertSettings } from "@/lib/orders"
import { toast } from "sonner"

interface SettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [settings, setSettings] = useState<AppSettings | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  // Pricing state
  const [fullSavan, setFullSavan] = useState(89)
  const [halfSavan, setHalfSavan] = useState(48)
  const [extraChicken, setExtraChicken] = useState(16)
  const [extraWattalpam, setExtraWattalpam] = useState(16)

  // Menu items state
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [newItemName, setNewItemName] = useState("")
  const [newItemPrice, setNewItemPrice] = useState("")

  // Load settings when dialog opens
  useEffect(() => {
    if (open) {
      loadSettings()
    }
  }, [open])

  // Load theme preference on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)
    setIsDarkMode(prefersDark)
    applyTheme(prefersDark)
  }, [])

  async function loadSettings() {
    try {
      setLoading(true)
      const data = await fetchSettings()
      if (data) {
        setSettings(data)
        setFullSavan(data.pricing.fullSavan)
        setHalfSavan(data.pricing.halfSavan)
        setExtraChicken(data.pricing.extraChicken)
        setExtraWattalpam(data.pricing.extraWattalpam)
        setMenuItems(data.menuItems || [])
      }
    } catch (error) {
      toast.error('Failed to load settings')
    } finally {
      setLoading(false)
    }
  }

  async function saveSettings() {
    if (!settings) return

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

      // Refresh the page to apply new pricing
      setTimeout(() => {
        window.location.reload()
      }, 500)
    } catch (error) {
      toast.error('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  function applyTheme(dark: boolean) {
    if (dark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  function handleThemeToggle(checked: boolean) {
    setIsDarkMode(checked)
    localStorage.setItem('theme', checked ? 'dark' : 'light')
    applyTheme(checked)
  }

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
    toast.success('Item added! Remember to save settings.')
  }

  function removeMenuItem(id: string) {
    setMenuItems(menuItems.filter(item => item.id !== id))
    toast.success('Item removed! Remember to save settings.')
  }

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">Settings</DialogTitle>
          </DialogHeader>
          <div className="py-8 text-center text-muted-foreground">
            Loading settings...
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Settings</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
            <TabsTrigger value="menu">Menu Items</TabsTrigger>
          </TabsList>

          {/* General Settings Tab */}
          <TabsContent value="general" className="space-y-4 py-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="theme-toggle" className="text-base font-medium">
                  Theme
                </Label>
                <p className="text-sm text-muted-foreground">
                  {isDarkMode ? 'Dark mode is enabled' : 'Light mode is enabled'}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {isDarkMode ? (
                  <Moon className="h-5 w-5 text-primary/60" />
                ) : (
                  <Sun className="h-5 w-5 text-primary/60" />
                )}
                <Switch
                  id="theme-toggle"
                  checked={isDarkMode}
                  onCheckedChange={handleThemeToggle}
                />
              </div>
            </div>
          </TabsContent>

          {/* Pricing Tab */}
          <TabsContent value="pricing" className="space-y-4 py-4">
            <Card>
              <CardHeader>
                <CardTitle>Standard Menu Pricing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="full-savan">Full Savan</Label>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">£</span>
                      <Input
                        id="full-savan"
                        type="number"
                        value={fullSavan}
                        onChange={(e) => setFullSavan(parseFloat(e.target.value) || 0)}
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="half-savan">Half Savan</Label>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">£</span>
                      <Input
                        id="half-savan"
                        type="number"
                        value={halfSavan}
                        onChange={(e) => setHalfSavan(parseFloat(e.target.value) || 0)}
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="extra-chicken">Extra Chicken</Label>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">£</span>
                      <Input
                        id="extra-chicken"
                        type="number"
                        value={extraChicken}
                        onChange={(e) => setExtraChicken(parseFloat(e.target.value) || 0)}
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="extra-wattalpam">Extra Wattalpam</Label>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">£</span>
                      <Input
                        id="extra-wattalpam"
                        type="number"
                        value={extraWattalpam}
                        onChange={(e) => setExtraWattalpam(parseFloat(e.target.value) || 0)}
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Menu Items Tab */}
          <TabsContent value="menu" className="space-y-4 py-4">
            <Card>
              <CardHeader>
                <CardTitle>Menu Items</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Add items that can be quickly selected when adding custom items to orders
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Add New Item */}
                <div className="flex gap-2">
                  <Input
                    placeholder="Item name (e.g., Green Peas)"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addMenuItem()}
                  />
                  <div className="flex items-center gap-2 w-32">
                    <span className="text-muted-foreground">£</span>
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
                  <Button onClick={addMenuItem} size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {/* Menu Items List */}
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {menuItems.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No menu items yet. Add some above!
                    </p>
                  ) : (
                    menuItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{item.name}</p>
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
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={saveSettings}
            disabled={saving}
            className="gap-2"
          >
            <Save className="h-4 w-4" />
            {saving ? 'Saving...' : 'Save All Changes'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
