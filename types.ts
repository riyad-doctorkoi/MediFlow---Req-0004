
export enum StockStatus {
  OK = 'OK',
  LOW = 'LOW',
  CRITICAL = 'CRITICAL'
}

export enum OrderStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  REFUNDED = 'REFUNDED'
}

export enum BillStatus {
  UNPAID = 'UNPAID',
  PARTIAL = 'PARTIAL',
  PAID = 'PAID',
  REFUNDED = 'REFUNDED'
}

export interface Patient {
  id: string;
  name: string;
  mobile: string;
  dob: string;
  family_id?: string;
  relationship?: string;
  walletBalance: number;
}

export interface Medicine {
  id: string;
  brand: string;
  generic: string;
  strength: string;
  pack_size: number;
  buying_price: number;
  selling_price: number;
  rack: string;
  stock_total: number;
  min_stock: number;
  isChronic?: boolean;
}

export interface OrderRecord {
  id: string;
  patientName: string;
  mobile: string;
  date: string;
  totalAmount: number;
  discountAmount: number;
  type: 'Direct Sell' | 'Home Delivery';
  items: string[];
  initial: string;
}

export interface BillItem {
  id: string;
  name: string;
  type: 'Consultation' | 'Lab Test' | 'Pharmacy' | 'Procedure' | 'Other';
  qty: number;
  unitPrice: number;
  discount: number; // line level discount
}

export interface Bill {
  bill_id: string;
  patient_name: string;
  patient_id: string;
  bill_date: string;
  items: BillItem[];
  discount_type: 'amount' | 'percentage';
  discount_value: number;
  total_before_discount: number;
  total_after_discount: number;
  amount_paid: number;
  amount_due: number;
  payment_status: BillStatus;
  service_status: 'pending' | 'in-progress' | 'completed';
}

export interface PaymentRecord {
  payment_id: string;
  bill_id: string;
  amount: number;
  method: 'Cash' | 'Card' | 'MFS';
  collected_by: string;
  timestamp: string;
}

export interface RefundRecord {
  refund_id: string;
  bill_id: string;
  amount: number;
  requested_by: string;
  status: 'pending' | 'approved' | 'rejected';
  approved_by?: string;
  approved_at?: string;
}

export interface StockLog {
  id: string;
  medicine_id: string;
  date: string;
  change: number;
  type: 'Restock' | 'Sale' | 'Adjustment' | 'Return';
  user: string;
  reason: string;
}

export interface ParsedItem {
  medicine_id?: string;
  brand: string;
  generic: string;
  strength: string;
  dose: string;
  qty: number;
  confidence: number;
  selling_price?: number;
  alternative_matches?: string[];
}

export interface Prescription {
  id: string;
  patient_id: string;
  image_url: string;
  parsed_items: ParsedItem[];
  scanned_at: string;
  verified_by?: string;
}

export interface RefillSchedule {
  id: string;
  patient_id: string;
  medicine_name: string;
  next_refill_date: string;
  interval_days: number;
  status: 'active' | 'completed' | 'paused';
  last_contacted?: string;
}

export interface Delivery {
  id: string;
  order_id: string;
  rider_name: string;
  status: 'assigned' | 'en_route' | 'delivered' | 'feedback';
  eta: string;
}
