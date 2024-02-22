// searchable fields
export const orderSearchableFields = ['name', 'status']
// filterable fields
export const orderFilterableFields = [
  'searchTerm',
  'status',
  'customer.customerId',
]

// list of payment status
export const paymentStatus = ['processing', 'succeeded', 'canceled', "transaction_error"]

// list of order tracking status
export const orderTrackingStatus = ['ordered', 'shipped', 'delivered']

// list of payment method
export const paymentMethod = [
  'online_payment',
  'cash_on_delivery',
  'pos_on_delivery',
]
