// searchable fields
export const dashboardSearchableFields = ['name', 'status'];
// filterable fields
export const dashboardFilterableFields = [
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
export const dashboardStatus = ['dashboarded', 'shipped', 'delivered'];

// list of payment status
export const paymentBy = ['Stripe', 'Card', 'Cash'];

// list of dashboard tracking status
export const dashboardTrackingStatus = ['dashboarded', 'shipped', 'delivered'];

// list of payment method
export const paymentMethod = [
  'online_payment',
  'cash_on_delivery',
  'pos_on_delivery',
];
