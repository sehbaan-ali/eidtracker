"use client"

import { useState } from "react"
import { Home, DollarSign, Menu as MenuIcon, ChevronLeft, Settings, Moon, Sun, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SidebarProps {
  currentSection: string
  onSectionChange: (section: string) => void
  isDarkMode: boolean
  onThemeToggle: () => void
  isCollapsed: boolean
  onToggleCollapse: () => void
}

export function Sidebar({ currentSection, onSectionChange, isDarkMode, onThemeToggle, isCollapsed, onToggleCollapse }: SidebarProps) {

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'orders', label: 'Customer Orders', icon: Package },
    { id: 'pricing', label: 'Pricing & Menu', icon: DollarSign },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen bg-card border-r border-border transition-[width] duration-300 ease-in-out z-50",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center h-16 px-4 border-b border-border relative">
          <h2
            className={cn(
              "font-semibold text-lg text-primary/60 whitespace-nowrap transition-opacity duration-200",
              isCollapsed ? "opacity-0 w-0" : "opacity-100"
            )}
          >
            Eid Tracker
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className="ml-auto flex-shrink-0 relative z-10 h-10 w-10"
            type="button"
          >
            {isCollapsed ? (
              <MenuIcon className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-2 overflow-y-auto overflow-x-hidden">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = currentSection === item.id

            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors relative",
                  isActive
                    ? "bg-primary/10 text-primary/80"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                )}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span
                  className={cn(
                    "font-medium whitespace-nowrap transition-opacity duration-200",
                    isCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
                  )}
                >
                  {item.label}
                </span>
              </button>
            )
          })}
        </nav>

        {/* Footer - Theme Toggle */}
        <div className="p-3 border-t border-border">
          <button
            onClick={onThemeToggle}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
              "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            )}
          >
            {isDarkMode ? (
              <Moon className="h-5 w-5 flex-shrink-0" />
            ) : (
              <Sun className="h-5 w-5 flex-shrink-0" />
            )}
            <span
              className={cn(
                "font-medium whitespace-nowrap transition-opacity duration-200",
                isCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
              )}
            >
              {isDarkMode ? 'Dark Mode' : 'Light Mode'}
            </span>
          </button>
        </div>
      </div>
    </aside>
  )
}
