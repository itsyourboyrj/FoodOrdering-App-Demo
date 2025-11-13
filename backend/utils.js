function seedData() {
  const users = [
    { id: 'u1', name: 'Nick Fury', role: 'ADMIN', country: 'GLOBAL', paymentMethods: [{ id: 'pm1', type: 'card', last4: '4242' }] },
    { id: 'u2', name: 'Captain Marvel', role: 'MANAGER', country: 'India', paymentMethods: [{ id: 'pm2', type: 'card', last4: '1111' }] },
    { id: 'u3', name: 'Captain America', role: 'MANAGER', country: 'America', paymentMethods: [{ id: 'pm3', type: 'card', last4: '2222' }] },
    { id: 'u4', name: 'Thanos', role: 'MEMBER', country: 'India', paymentMethods: [] },
    { id: 'u5', name: 'Thor', role: 'MEMBER', country: 'India', paymentMethods: [] },
    { id: 'u6', name: 'Travis', role: 'MEMBER', country: 'America', paymentMethods: [] }
  ];

  const restaurants = [
  {
    id: 'r1',
    name: 'Bombay Bites',
    country: 'India',
    menu: [
      { id: 'm1', name: 'Butter Chicken', price: 320 },
      { id: 'm2', name: 'Paneer Tikka', price: 240 },
      { id: 'm3', name: 'Garlic Naan (2 pc)', price: 60 },
      { id: 'm4', name: 'Chicken Biryani', price: 280 }
    ]
  },
  {
    id: 'r2',
    name: 'Mumbai Rolls',
    country: 'India',
    menu: [
      { id: 'm5', name: 'Kathi Roll', price: 130 },
      { id: 'm6', name: 'Veg Frankie', price: 90 },
      { id: 'm7', name: 'Chicken Mayo Roll', price: 160 }
    ]
  },
  {
    id: 'r3',
    name: 'NY Deli',
    country: 'America',
    menu: [
      { id: 'm8', name: 'Pastrami Sandwich', price: 9.0 },
      { id: 'm9', name: 'Cheesecake Slice', price: 5.5 },
      { id: 'm10', name: 'Bagel w/ Cream Cheese', price: 3.5 },
      { id: 'm11', name: 'NY Pizza Slice', price: 4.0 }
    ]
  },
  {
    id: 'r4',
    name: 'LA Taco Hub',
    country: 'America',
    menu: [
      { id: 'm12', name: 'Beef Taco', price: 3.0 },
      { id: 'm13', name: 'Chicken Taco', price: 2.5 },
      { id: 'm14', name: 'Guacamole Dip', price: 1.5 }
    ]
  }
];


  const orders = [];

  return { users, restaurants, orders };
}

function findUserById(id, users) {
  return users.find(u => u.id === id);
}

function checkPermission(user, action, req) {
  const role = user.role;
  const can = {
    view_restaurants: ['ADMIN','MANAGER','MEMBER'],
    create_order: ['ADMIN','MANAGER','MEMBER'],
    place_order: ['ADMIN','MANAGER'],
    cancel_order: ['ADMIN','MANAGER'],
    update_payment: ['ADMIN'],
    view_orders: ['ADMIN','MANAGER','MEMBER']
  };

  if (!can[action]) return false;
  if (!can[action].includes(role)) return false;

  return true;
}

module.exports = { seedData, findUserById, checkPermission };