import React, { useEffect, useState } from 'react';
import './styles.css';


const API = 'http://localhost:4000/api';

// Format price based on user country
function formatPrice(user, price) {
  if (!user) return price; 
  if (user.country === 'India') return `₹${price}`;
  return `$${price}`;
}

// sCalling API with optional userId header
function apiFetch(path, userId, opts = {}) {
  opts.headers = opts.headers || {};
  if (userId) opts.headers['x-user-id'] = userId;
  opts.headers['Content-Type'] = 'application/json';
  return fetch(`${API}${path}`, opts).then(async r => {
    try { return await r.json(); } catch { return {}; }
  });
}

function Login({ onLogin, users }) {
  const [sel, setSel] = useState(users[0]?.id || '');
  return (
    <div className="panel" style={{display:'flex', gap:10, alignItems:'center'}}>
      <div style={{flex:1}}>
        <div style={{fontWeight:700}}>Quick login</div>
        <div className="small">Simulated users (pick a role)</div>
      </div>
      <select className="usersel" value={sel} onChange={e => setSel(e.target.value)}>
        {users.map(u => <option key={u.id} value={u.id}>{u.name} — {u.role} — {u.country}</option>)}
      </select>
      <button className="btn btn-primary" onClick={() => onLogin(sel)}>Login</button>
    </div>
  );
}

function Restaurants({ user, onOpen }) {
  const [rests, setRests] = useState([]);
  useEffect(() => {
    if (!user) return;
    apiFetch('/restaurants', user.id).then(r => {
      if (r.restaurants) setRests(r.restaurants);
    });
  }, [user]);

  if (!user) return <div className="panel small">Please login to view restaurants.</div>;
  return (
    <div className="panel">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <div style={{fontWeight:700}}>Restaurants</div>
        <div className="small">Visible to you</div>
      </div>

      <div className="rest-list" style={{marginTop:12}}>
        {rests.map(r => (
          <div key={r.id} className="rest-item">
            <div>
              <span className="meta">{r.name}</span>
              <small>{r.country}</small>
            </div>
            <div>
              <button className="btn btn-ghost" onClick={() => onOpen(r)}>View menu</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Menu({ user, restaurant, onAdd }) {
  const [menu, setMenu] = useState([]);
  useEffect(() => {
    if (!restaurant || !user) return;
    apiFetch(`/restaurants/${restaurant.id}/menu`, user.id).then(r => {
      if (r.menu) setMenu(r.menu);
      else setMenu([]);
    }).catch(()=>setMenu([]));
  }, [restaurant, user]);

  if (!restaurant) return null;
  return (
    <div className="panel" style={{marginTop:12}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <div style={{fontWeight:700}}>Menu — {restaurant.name}</div>
        <div className="small">Tap to add</div>
      </div>
      <div className="menu">
        {menu.map(it => (
          <div key={it.id} className="menu-item">
            <div>
              <div style={{fontWeight:600}}>{it.name}</div>
              <div className="small">{formatPrice(user, it.price)}</div>
            </div>
            <div>
              <button className="btn btn-primary" onClick={() => onAdd({ ...it, qty:1})}>Add</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Cart({ user, cart, setCart, onCheckout, onCancel }) {
  const total = cart.reduce((s,i) => s + i.price * i.qty, 0);
  return (
    <div className="panel">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <div style={{fontWeight:700}}>Cart</div>
        <div className="small">{cart.length} item(s)</div>
      </div>

      <div className="cart-items" style={{marginTop:10}}>
        {cart.length===0 && <div className="small">No items yet — add from the menu</div>}
        {cart.map((it, idx) => (
          <div key={idx} className="cart-row">
            <div>
              <div style={{fontWeight:600}}>{it.name} <small className="small">x{it.qty}</small></div>
              <div className="small">{formatPrice(user, it.price * it.qty)}</div>
            </div>
            <div style={{display:'flex', alignItems:'center', gap:8}}>
              <button className="btn" onClick={() => {
                const copy = [...cart]; copy.splice(idx,1); setCart(copy);
              }}>Remove</button>
            </div>
          </div>
        ))}
      </div>

      <div style={{marginTop:12, display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <div>
          <div className="small">Total</div>
          <div style={{fontWeight:800, fontSize:18}}>{formatPrice(user, total)}</div>
        </div>
        <div style={{display:'flex', gap:8}}>
          <button className="btn btn-ghost" onClick={onCancel}>Cancel</button>
          <button className="btn btn-primary" onClick={onCheckout} disabled={cart.length===0}>Checkout</button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState(null);
  const [restaurant, setRestaurant] = useState(null);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    setUsers([
      { id: 'u1', name: 'Nick Fury', role: 'ADMIN', country: 'GLOBAL' },
      { id: 'u2', name: 'Captain Marvel', role: 'MANAGER', country: 'India' },
      { id: 'u3', name: 'Captain America', role: 'MANAGER', country: 'America' },
      { id: 'u4', name: 'Thanos', role: 'MEMBER', country: 'India' },
      { id: 'u5', name: 'Thor', role: 'MEMBER', country: 'India' },
      { id: 'u6', name: 'Travis', role: 'MEMBER', country: 'America' }
    ]);
  }, []);

  const onLogin = (id) => {
    apiFetch('/me', id).then(r => {
      if (r.user) {
        setUser(r.user);
        setCart([]);
        refreshOrders(r.user);
      } else {
        alert('login failed');
      }
    });
  };

  const refreshOrders = (u) => {
    apiFetch('/orders', u.id).then(r => {
      if (r.orders) setOrders(r.orders);
    });
  };

  const onAddToCart = (item) => {
    setCart(prev => {
      const foundIdx = prev.findIndex(p => p.id === item.id);
      if (foundIdx >= 0) {
        const cp = [...prev]; cp[foundIdx].qty += 1; return cp;
      }
      return [...prev, item];
    });
  };

  const onCreateOrder = () => {
    if (!user) return alert('login first');
    if (!restaurant) return alert('open a restaurant first');
    const payload = { restaurantId: restaurant.id, items: cart };
    apiFetch('/orders', user.id, { method: 'POST', body: JSON.stringify(payload) })
      .then(r => {
        if (r.order) {
          alert('Order created: ' + r.order.id);
          setCart([]);
          refreshOrders(user);
        } else {
          alert(JSON.stringify(r));
        }
      });
  };

  const onCheckout = () => {
    if (!user) return alert('login first');
    apiFetch('/orders', user.id).then(r => {
      const list = r.orders || [];
      const ord = list.slice(-1)[0];
      if (!ord) return alert('No order to checkout (create one first)');
      apiFetch(`/orders/${ord.id}/checkout`, user.id, { method: 'POST' })
        .then(res => {
          if (res.order) {
            alert('Paid ' + ord.id);
            refreshOrders(user);
          } else alert(JSON.stringify(res));
        });
    });
  };

  const onCancel = () => {
    if (!user) return alert('login first');
    apiFetch('/orders', user.id).then(r => {
      const list = r.orders || [];
      const ord = list.slice(-1)[0];
      if (!ord) return alert('No order to cancel');
      apiFetch(`/orders/${ord.id}/cancel`, user.id, { method: 'POST' })
        .then(res => {
          if (res.order) {
            alert('Cancelled ' + ord.id);
            refreshOrders(user);
          } else alert(JSON.stringify(res));
        });
    });
  };

  const updatePaymentForUser = () => {
    if (!user) return alert('login first');
    const newPm = [{ id: 'pm_new', type: 'card', last4: '9999' }];
    apiFetch(`/users/${user.id}/payment`, user.id, { method: 'PUT', body: JSON.stringify({ paymentMethods: newPm }) })
      .then(r => {
        if (r.user) {
          alert('Payment updated for ' + r.user.name);
          apiFetch('/me', user.id).then(rr => setUser(rr.user));
        } else alert(JSON.stringify(r));
      });
  };

  return (
    <div className="app">
      <div className="header">
        <div className="title">
          <div className="logo">FR</div>
          <div>
            <div className="h1">Food Ordering — Demo</div>
            <small className="small">By : Ravi Raj Role-based demo</small>
          </div>
        </div>

        <div className="controls">
          <div style={{marginRight:8}}>{user ? <div className="small">Signed in: <span className="kv">{user.name}</span></div> : null}</div>
        </div>
      </div>

      <Login users={users} onLogin={onLogin} />

      <div className="layout" style={{marginTop:14}}>
        <div>
          <Restaurants user={user} onOpen={r => setRestaurant(r)} />
          <Menu user={user} restaurant={restaurant} onAdd={onAddToCart} />
        </div>

        <div className="side">
          <Cart user={user} cart={cart} setCart={setCart}
                onCheckout={() => { onCreateOrder(); setTimeout(()=>onCheckout(),300); }}
                onCancel={() => { onCreateOrder(); setTimeout(()=>onCancel(),300); }} />
          <div className="panel">
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <div style={{fontWeight:700}}>Your visible orders</div>
              <div className="small">Tap refresh</div>
            </div>
            <div style={{marginTop:8}}>
              <button className="btn btn-ghost" onClick={() => refreshOrders(user)}>Refresh</button>
            </div>
            <div style={{marginTop:10}}>
              {orders.map(o => (
                <div key={o.id} style={{padding:10, borderRadius:10, marginTop:8, border:'1px solid #f0f6ff'}}>
                  <div style={{fontWeight:700}}>{o.id} — <span className="small">{o.status}</span></div>
                  <div className="small">Restaurant: {o.restaurantId} — country: {o.country} — ttotal: {formatPrice(user, o.total)}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="footer">
            <small>Backend: http://localhost:4000 · In-memory demo</small>
          </div>
        </div>
      </div>
    </div>
  );
}
