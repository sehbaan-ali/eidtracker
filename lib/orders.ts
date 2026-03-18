import { supabase } from './supabase'
import type { Order, AppSettings, OrderFormData, CustomExtra } from '@/types'
import { calculateOrderTotal, getNextOrderNumber } from './calculations'

/**
 * Fetch all orders from Supabase
 */
export async function fetchOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('order_number', { ascending: true })

  if (error) {
    console.error('Error fetching orders:', error)
    throw new Error(`Failed to fetch orders: ${error.message}`)
  }

  return data || []
}

/**
 * Create a new order
 */
export async function createOrder(
  formData: OrderFormData,
  pricing: AppSettings['pricing'],
  userId?: string,
  customOrderNumber?: number
): Promise<Order> {
  // Use custom order number if provided, otherwise auto-increment
  let orderNumber: number
  if (customOrderNumber !== undefined) {
    orderNumber = customOrderNumber
  } else {
    const orders = await fetchOrders()
    orderNumber = getNextOrderNumber(orders)
  }

  // Calculate total amount
  const totalAmount = calculateOrderTotal(
    {
      fullMuttonSavan: formData.fullMuttonSavan,
      halfMuttonSavan: formData.halfMuttonSavan,
      fullChickenSavan: formData.fullChickenSavan,
      halfChickenSavan: formData.halfChickenSavan,
      extraChicken: formData.extraChicken,
      extraWattalpam: formData.extraWattalpam,
    },
    formData.customExtras,
    pricing
  )

  // All new orders start as pending/unpaid
  const newOrder: any = {
    order_number: orderNumber,
    customer_name: formData.customerName,
    phone_number: formData.phoneNumber,
    is_delivery: formData.isDelivery || false,
    delivery_address: formData.deliveryAddress || null,
    full_mutton_savan: formData.fullMuttonSavan,
    half_mutton_savan: formData.halfMuttonSavan,
    full_chicken_savan: formData.fullChickenSavan,
    half_chicken_savan: formData.halfChickenSavan,
    extra_chicken: formData.extraChicken,
    extra_wattalpam: formData.extraWattalpam,
    custom_extras: formData.customExtras,
    extra_notes: formData.extraNotes,
    total_amount: totalAmount,
    delivery_status: 'pending',
    payment_status: 'unpaid',
    amount_paid: 0,
    amount_remaining: totalAmount,
    user_id: userId,
  }

  const { data, error } = await supabase
    .from('orders')
    .insert([newOrder])
    .select()
    .single()

  if (error) {
    console.error('Error creating order:', error)
    throw new Error(`Failed to create order: ${error.message}`)
  }

  return data
}

/**
 * Update an existing order
 */
export async function updateOrder(
  id: string,
  formData: OrderFormData,
  pricing: AppSettings['pricing']
): Promise<Order> {
  // Calculate total amount (keep existing delivery/payment status)
  const totalAmount = calculateOrderTotal(
    {
      fullMuttonSavan: formData.fullMuttonSavan,
      halfMuttonSavan: formData.halfMuttonSavan,
      fullChickenSavan: formData.fullChickenSavan,
      halfChickenSavan: formData.halfChickenSavan,
      extraChicken: formData.extraChicken,
      extraWattalpam: formData.extraWattalpam,
    },
    formData.customExtras,
    pricing
  )

  const updates: any = {
    customer_name: formData.customerName,
    phone_number: formData.phoneNumber,
    is_delivery: formData.isDelivery || false,
    delivery_address: formData.deliveryAddress || null,
    full_mutton_savan: formData.fullMuttonSavan,
    half_mutton_savan: formData.halfMuttonSavan,
    full_chicken_savan: formData.fullChickenSavan,
    half_chicken_savan: formData.halfChickenSavan,
    extra_chicken: formData.extraChicken,
    extra_wattalpam: formData.extraWattalpam,
    custom_extras: formData.customExtras,
    extra_notes: formData.extraNotes,
    total_amount: totalAmount,
    // Don't update delivery/payment status when editing order details
  }

  const { data, error } = await supabase
    .from('orders')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating order:', error)
    throw new Error(`Failed to update order: ${error.message}`)
  }

  return data
}

/**
 * Delete an order
 */
export async function deleteOrder(id: string): Promise<void> {
  const { error } = await supabase
    .from('orders')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting order:', error)
    throw new Error(`Failed to delete order: ${error.message}`)
  }
}

/**
 * Update delivery status (pending ↔ collected)
 */
export async function updateDeliveryStatus(
  id: string,
  status: 'pending' | 'collected'
): Promise<Order> {
  const { data, error } = await supabase
    .from('orders')
    .update({ delivery_status: status })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating delivery status:', error)
    throw new Error(`Failed to update delivery status: ${error.message}`)
  }

  return data
}

/**
 * Update payment status (unpaid / paid / pay-later)
 */
export async function updatePaymentStatus(
  id: string,
  status: 'unpaid' | 'paid' | 'pay-later',
  totalAmount: number
): Promise<Order> {
  const updates: any = {
    payment_status: status,
  }

  if (status === 'paid') {
    updates.amount_paid = totalAmount
    updates.amount_remaining = 0
  } else if (status === 'unpaid') {
    updates.amount_paid = 0
    updates.amount_remaining = totalAmount
  } else if (status === 'pay-later') {
    updates.amount_paid = 0
    updates.amount_remaining = totalAmount
  }

  const { data, error } = await supabase
    .from('orders')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating payment status:', error)
    throw new Error(`Failed to update payment status: ${error.message}`)
  }

  return data
}

/**
 * Fetch app settings
 */
export async function fetchSettings(userId?: string): Promise<AppSettings | null> {
  console.log('Fetching settings with userId:', userId)

  // For single-user app, just get the first settings row
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .limit(1)
    .single()

  console.log('Fetch settings response - data:', data, 'error:', error)

  if (error) {
    // No settings exist yet
    if (error.code === 'PGRST116') {
      return null
    }
    console.error('Error fetching settings:', error)
    throw new Error(`Failed to fetch settings: ${error.message}`)
  }

  // Transform snake_case to camelCase
  return {
    id: data.id,
    pricing: data.pricing,
    menuItems: data.menu_items || [],
    current_year: data.current_year,
    user_id: data.user_id,
    updated_at: data.updated_at,
  }
}

/**
 * Create or update settings
 */
export async function upsertSettings(
  settings: Partial<AppSettings>,
  userId?: string
): Promise<AppSettings> {
  // For single-user app, update the existing settings row
  // If settings.id exists, update that row, otherwise create new
  const settingsData: any = {
    pricing: settings.pricing,
    menu_items: settings.menuItems || [],
    current_year: settings.current_year,
    user_id: userId || settings.user_id || null,
  }

  console.log('Upserting settings with data:', settingsData)

  let data, error

  if (settings.id) {
    // Update existing row
    const result = await supabase
      .from('settings')
      .update(settingsData)
      .eq('id', settings.id)
      .select()
      .single()
    data = result.data
    error = result.error
  } else {
    // Insert new row
    const result = await supabase
      .from('settings')
      .insert([settingsData])
      .select()
      .single()
    data = result.data
    error = result.error
  }

  console.log('Upsert response - data:', data, 'error:', error)

  if (error) {
    console.error('Error upserting settings:', error)
    throw new Error(`Failed to save settings: ${error.message}`)
  }

  // Transform snake_case back to camelCase
  return {
    id: data.id,
    pricing: data.pricing,
    menuItems: data.menu_items || [],
    current_year: data.current_year,
    user_id: data.user_id,
    updated_at: data.updated_at,
  }
}
