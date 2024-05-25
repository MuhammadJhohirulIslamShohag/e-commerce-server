// searchable fields
export const orderSearchableFields = ['name', 'status'];
// filterable fields
export const orderFilterableFields = [
  'searchTerm',
  'status',
  'customer.customerId',
];

// list of payment status
export const paymentStatus = [
  'Not Processed',
  'Processing',
  'Dispatched',
  'Cancelled',
  'Completed',
  'Cash On Delivery',
];

// list of payment status
export const paymentBy = [
  'Stripe',
  'Card'
];

// list of order tracking status
export const orderTrackingStatus = ['ordered', 'shipped', 'delivered'];

// list of payment method
export const paymentMethod = [
  'online_payment',
  'cash_on_delivery',
  'pos_on_delivery',
];
