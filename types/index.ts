export interface CustomExtra {
  id: string; // UUID for each extra
  name: string; // e.g., "Mutton Rolls", "Tea", "Extra Rice"
  quantity: number;
  unitPrice: number; // Price per unit
  subtotal: number; // quantity * unitPrice (auto-calculated)
}

export interface Order {
  id: string; // UUID
  order_number: number;
  customer_name: string;
  phone_number: string;

  // Delivery fields
  is_delivery: boolean;
  delivery_address?: string;

  // Standard menu items
  full_mutton_savan: number;
  half_mutton_savan: number;
  full_chicken_savan: number;
  half_chicken_savan: number;
  extra_chicken: number;
  extra_wattalpam: number;

  // Custom extras (5-10% of orders)
  custom_extras: CustomExtra[]; // Array of custom items

  // Metadata
  extra_notes: string;
  total_amount: number; // Auto-calculated (menu items + custom extras)

  // Status fields for Eid day workflow
  delivery_status: 'pending' | 'collected';
  payment_status: 'unpaid' | 'paid' | 'pay-later';
  amount_paid: number;
  amount_remaining: number; // Auto-calculated

  created_at: string; // ISO timestamp
  updated_at: string;
  user_id?: string; // Optional for Supabase auth
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category?: string; // Optional categorization
}

export interface AppSettings {
  id?: string;
  pricing: {
    fullSavan: number; // 89
    halfSavan: number; // 48
    extraChicken: number; // 16
    extraWattalpam: number; // 16
  };
  menuItems?: MenuItem[]; // Predefined menu items for quick selection
  current_year: number; // 2025
  user_id?: string;
  updated_at?: string;
}

export interface OrderFormData {
  customerName: string;
  phoneNumber: string;
  isDelivery: boolean;
  deliveryAddress?: string;
  fullMuttonSavan: number;
  halfMuttonSavan: number;
  fullChickenSavan: number;
  halfChickenSavan: number;
  extraChicken: number;
  extraWattalpam: number;
  customExtras: CustomExtra[];
  extraNotes: string;
  // No payment/delivery status in form - all orders start as pending/unpaid
}

export type OrderFilter = 'all' | 'mutton' | 'chicken' | 'deliveries';
export type DeliveryFilter = 'all' | 'pending' | 'collected';
export type PaymentFilter = 'all' | 'unpaid' | 'paid' | 'pay-later';

export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  paidRevenue: number;
  outstandingRevenue: number;
  pendingOrders: number;
  collectedOrders: number;
  unpaidOrders: number;
  paidOrders: number;
  payLaterOrders: number;
  fullMuttonCount: number;
  halfMuttonCount: number;
  fullChickenCount: number;
  halfChickenCount: number;
  extraChickenCount: number;
  extraWattalpamCount: number;
  customItemsRevenue: number;
}
