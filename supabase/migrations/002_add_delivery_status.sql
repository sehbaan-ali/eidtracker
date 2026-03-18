-- Add delivery_status column to orders table
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS delivery_status text NOT NULL DEFAULT 'pending' CHECK (delivery_status IN ('pending', 'collected'));

-- Update payment_status to support 3 options
ALTER TABLE orders
DROP CONSTRAINT IF EXISTS orders_payment_status_check;

ALTER TABLE orders
ADD CONSTRAINT orders_payment_status_check CHECK (payment_status IN ('unpaid', 'paid', 'pay-later'));

-- Update existing orders to have delivery_status = 'pending' and payment_status = 'unpaid' if null
UPDATE orders SET delivery_status = 'pending' WHERE delivery_status IS NULL;
UPDATE orders SET payment_status = 'unpaid' WHERE payment_status IS NULL OR payment_status NOT IN ('unpaid', 'paid', 'pay-later');

-- Add index for quick filtering
CREATE INDEX IF NOT EXISTS orders_delivery_status_idx ON orders(delivery_status);
