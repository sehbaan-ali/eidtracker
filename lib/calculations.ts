import { Order, CustomExtra, AppSettings, DashboardStats } from "@/types";

/**
 * Calculate the total amount for an order based on menu items and custom extras
 */
export function calculateOrderTotal(
  menuItems: {
    fullMuttonSavan: number;
    halfMuttonSavan: number;
    fullChickenSavan: number;
    halfChickenSavan: number;
    extraChicken: number;
    extraWattalpam: number;
  },
  customExtras: CustomExtra[],
  pricing: AppSettings['pricing']
): number {
  // Calculate menu items total
  const menuTotal =
    menuItems.fullMuttonSavan * pricing.fullSavan +
    menuItems.halfMuttonSavan * pricing.halfSavan +
    menuItems.fullChickenSavan * pricing.fullSavan +
    menuItems.halfChickenSavan * pricing.halfSavan +
    menuItems.extraChicken * pricing.extraChicken +
    menuItems.extraWattalpam * pricing.extraWattalpam;

  // Calculate custom extras total
  const customExtrasTotal = customExtras.reduce(
    (sum, extra) => sum + extra.subtotal,
    0
  );

  return menuTotal + customExtrasTotal;
}

/**
 * Calculate subtotal for a custom extra item
 */
export function calculateCustomExtraSubtotal(
  quantity: number,
  unitPrice: number
): number {
  return quantity * unitPrice;
}

/**
 * Calculate dashboard statistics from orders
 */
export function calculateDashboardStats(orders: Order[]): DashboardStats {
  const stats: DashboardStats = {
    totalOrders: orders.length,
    totalRevenue: 0,
    paidRevenue: 0,
    outstandingRevenue: 0,
    pendingOrders: 0,
    collectedOrders: 0,
    unpaidOrders: 0,
    paidOrders: 0,
    payLaterOrders: 0,
    fullMuttonCount: 0,
    halfMuttonCount: 0,
    fullChickenCount: 0,
    halfChickenCount: 0,
    extraChickenCount: 0,
    extraWattalpamCount: 0,
    customItemsRevenue: 0,
  };

  orders.forEach((order) => {
    // Revenue calculations
    stats.totalRevenue += order.total_amount;
    if (order.payment_status === 'paid') {
      stats.paidRevenue += order.total_amount;
    } else {
      // For unpaid and pay-later orders, add the full remaining amount to outstanding
      stats.outstandingRevenue += order.total_amount;
    }

    // Delivery status counts
    if (order.delivery_status === 'pending') {
      stats.pendingOrders += 1;
    } else if (order.delivery_status === 'collected') {
      stats.collectedOrders += 1;
    }

    // Payment status counts
    if (order.payment_status === 'unpaid') {
      stats.unpaidOrders += 1;
    } else if (order.payment_status === 'paid') {
      stats.paidOrders += 1;
    } else if (order.payment_status === 'pay-later') {
      stats.payLaterOrders += 1;
    }

    // Item counts
    stats.fullMuttonCount += order.full_mutton_savan;
    stats.halfMuttonCount += order.half_mutton_savan;
    stats.fullChickenCount += order.full_chicken_savan;
    stats.halfChickenCount += order.half_chicken_savan;
    stats.extraChickenCount += order.extra_chicken;
    stats.extraWattalpamCount += order.extra_wattalpam;

    // Custom items revenue
    const customRevenue = order.custom_extras.reduce(
      (sum, extra) => sum + extra.subtotal,
      0
    );
    stats.customItemsRevenue += customRevenue;
  });

  return stats;
}

/**
 * Filter orders by order type (mutton/chicken/deliveries/all)
 */
export function filterOrdersByType(
  orders: Order[],
  filter: 'all' | 'mutton' | 'chicken' | 'deliveries'
): Order[] {
  if (filter === 'all') return orders;

  if (filter === 'deliveries') {
    return orders.filter((order) => order.is_delivery === true);
  }

  return orders.filter((order) => {
    const hasMutton = order.full_mutton_savan > 0 || order.half_mutton_savan > 0;
    const hasChicken = order.full_chicken_savan > 0 || order.half_chicken_savan > 0;

    if (filter === 'mutton') {
      // Mutton only: has mutton but NO chicken
      return hasMutton && !hasChicken;
    } else {
      // Chicken only: has chicken but NO mutton
      return hasChicken && !hasMutton;
    }
  });
}

/**
 * Filter orders by payment status
 */
export function filterOrdersByPayment(
  orders: Order[],
  filter: 'all' | 'unpaid' | 'paid' | 'pay-later'
): Order[] {
  if (filter === 'all') return orders;
  return orders.filter((order) => order.payment_status === filter);
}

/**
 * Filter orders by delivery status
 */
export function filterOrdersByDelivery(
  orders: Order[],
  filter: 'all' | 'pending' | 'collected'
): Order[] {
  if (filter === 'all') return orders;
  return orders.filter((order) => order.delivery_status === filter);
}

/**
 * Search orders by name, phone, or order number
 */
export function searchOrders(orders: Order[], searchTerm: string): Order[] {
  if (!searchTerm.trim()) return orders;

  const term = searchTerm.toLowerCase();
  return orders.filter((order) => {
    return (
      order.customer_name.toLowerCase().includes(term) ||
      order.phone_number.includes(term) ||
      order.order_number.toString().includes(term)
    );
  });
}

/**
 * Format currency amount
 */
export function formatCurrency(amount: number): string {
  return `£${amount.toFixed(2)}`;
}

/**
 * Get next order number
 */
export function getNextOrderNumber(orders: Order[]): number {
  if (orders.length === 0) return 1;
  const maxOrderNumber = Math.max(...orders.map((o) => o.order_number));
  return maxOrderNumber + 1;
}
