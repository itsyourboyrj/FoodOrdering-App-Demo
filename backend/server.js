
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const { seedData, findUserById, checkPermission } = require('./utils');


const app = express();
app.use(cors());
app.use(bodyParser.json());

const { users, restaurants, orders } = seedData();

// Middleware: simulating the auth by sending userId in header 'x-user-id'
app.use((req, res, next) => {
  const userId = req.header('x-user-id');
  if (userId) {
    const user = findUserById(userId, users);
    if (user) req.user = user;
  }
  next();
});

// RBAC helper middleware factory
function requirePermission(action) {
  return (req, res, next) => {
    const user = req.user;
    if (!user) return res.status(401).json({ error: 'Missing user (set x-user-id header)' });
    const allowed = checkPermission(user, action, req);
    if (!allowed) return res.status(403).json({ error: 'Forbidden for this role/country' });
    next();
  };
}

// --- Routes
app.get('/api/me', (req, res) => {
  if (!req.user) return res.json({ user: null });
  res.json({ user: req.user });
});

// List restaurants (all roles)
app.get('/api/restaurants', requirePermission('view_restaurants'), (req, res) => {
  // Managers/Members see only restaurants in their country (bonus)
  const country = req.user.role === 'ADMIN' ? null : req.user.country;
  const list = country ? restaurants.filter(r => r.country === country) : restaurants;
  res.json({ restaurants: list });
});

// Get menu for a restaurant (assume id)
app.get('/api/restaurants/:id/menu', requirePermission('view_restaurants'), (req, res) => {
  const rest = restaurants.find(r => r.id === req.params.id);
  if (!rest) return res.status(404).json({ error: 'Restaurant not found' });
  // enforce country scoping for non-admins
  if (req.user.role !== 'ADMIN' && req.user.country !== rest.country)
    return res.status(403).json({ error: 'Forbidden for this restaurant' });
  res.json({ menu: rest.menu });
});

// Create cart/order (add items)
app.post('/api/orders', requirePermission('create_order'), (req, res) => {
  const { restaurantId, items } = req.body;
  if (!restaurantId || !items || !Array.isArray(items)) {
    return res.status(400).json({ error: 'restaurantId and items[] required' });
  }
  const order = {
    id: 'ord_' + Math.random().toString(36).substring(2,9),
    restaurantId,
    items,
    total: items.reduce((s, it) => s + (it.price * (it.qty||1)), 0),
    status: 'CREATED',
    createdBy: req.user.id,
    country: req.user.country
  };
  orders.push(order);
  res.json({ order });
});

// Checkout / pay (only ADMIN and MANAGER)
app.post('/api/orders/:id/checkout', requirePermission('place_order'), (req, res) => {
  const order = orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  // country scoping
  if (req.user.role !== 'ADMIN' && req.user.country !== order.country)
    return res.status(403).json({ error: 'Forbidden for this order' });
  if (order.status !== 'CREATED') return res.status(400).json({ error: 'Order not in CREATED state' });

  // Simulate payment using user's paymentMethods[0]
  const pm = req.user.paymentMethods && req.user.paymentMethods[0];
  if (!pm) return res.status(400).json({ error: 'No payment method on file' });

  order.status = 'PAID';
  order.paidWith = pm;
  order.paidAt = new Date().toISOString();
  res.json({ order, message: 'Payment simulated successful' });
});

// Cancel order (ADMIN & MANAGER)
app.post('/api/orders/:id/cancel', requirePermission('cancel_order'), (req, res) => {
  const order = orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  if (req.user.role !== 'ADMIN' && req.user.country !== order.country)
    return res.status(403).json({ error: 'Forbidden for this order' });
  if (order.status === 'PAID') return res.status(400).json({ error: 'Cannot cancel paid order' });
  order.status = 'CANCELLED';
  res.json({ order, message: 'Order cancelled' });
});

// Update payment method (ADMIN only)
app.put('/api/users/:id/payment', requirePermission('update_payment'), (req, res) => {
  const { id } = req.params;
  const { paymentMethods } = req.body;
  if (req.user.role !== 'ADMIN' && req.user.id !== id) {
    return res.status(403).json({ error: 'Only admin can update someone else' });
  }
  const u = users.find(x => x.id === id);
  if (!u) return res.status(404).json({ error: 'User not found' });
  u.paymentMethods = paymentMethods || [];
  res.json({ user: u });
});

// List orders (for testing)
app.get('/api/orders', requirePermission('view_orders'), (req, res) => {
  // Admin sees all; managers/members see their country only
  const list = req.user.role === 'ADMIN' ? orders : orders.filter(o => o.country === req.user.country);
  res.json({ orders: list });
});

const PORT = 4000;
app.listen(PORT, () => console.log(`Backend running http://localhost:${PORT}`));