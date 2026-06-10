import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE } from "../api/config";
import {
  FaArrowLeft, FaTrash, FaPlus, FaMinus,
  FaMapMarkerAlt, FaCheckCircle, FaShoppingBag,
  FaUser, FaPhone
} from "react-icons/fa";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [cart, setCart]         = useState({ items: [], totalAmount: 0 });
  const [user, setUser]         = useState(null);
  const [loading, setLoading]   = useState(false);
  const [cartLoading, setCartLoading] = useState({});
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [address, setAddress] = useState({
    name: "", address1: "", address2: "", mobile: ""
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (!stored) { navigate("/"); return; }
      const userData = JSON.parse(stored);
      if (!userData) { navigate("/"); return; }
      setUser(userData);
      fetchCart(userData);
      // Pre-fill fields from user profile if available
      if (userData.name) setAddress(a => ({ ...a, name: userData.name }));
      if (userData.mobile) setAddress(a => ({ ...a, mobile: userData.mobile }));
      if (userData.address1) setAddress(a => ({ ...a, address1: userData.address1 }));
      if (userData.address2) setAddress(a => ({ ...a, address2: userData.address2 }));
    } catch (e) {
      localStorage.removeItem("user");
      navigate("/");
    }
  }, [navigate]);

  const fetchCart = async (u) => {
    try {
      const userId = u._id || u.id || u.email;
      const res = await axios.get(`${API_BASE}/api/cart?userId=${userId}`);
      setCart(res.data.cart || { items: [], totalAmount: 0 });
    } catch (err) {
      console.error("Cart fetch error:", err);
    }
  };

  const updateQuantity = async (menuItemId, newQty) => {
    if (!user || newQty < 0) return;
    setCartLoading(p => ({ ...p, [menuItemId]: true }));
    try {
      const userId = user._id || user.id || user.email;
      const res = await axios.post(`${API_BASE}/api/cart/update`, { userId, menuItemId, quantity: newQty });
      setCart(res.data.cart || { items: [], totalAmount: 0 });
    } finally {
      setCartLoading(p => ({ ...p, [menuItemId]: false }));
    }
  };

  const removeItem = async (menuItemId) => {
    if (!window.confirm("Remove this item?")) return;
    await updateQuantity(menuItemId, 0);
  };

  const handleConfirmOrder = async () => {
    if (!address.name || !address.address1 || !address.mobile) {
      alert("Please fill Name, Address Line 1, and Mobile Number.");
      return;
    }
    setLoading(true);
    try {
      const userId = user._id || user.id || user.email;
      const customerEmail = user.email;

      const res = await axios.post(`${API_BASE}/api/order/confirm`, {
        userId,
        customerEmail,
        address
      });

      setOrderSuccess(res.data.order);
    } catch (err) {
      console.error("Order confirm error:", err);
      alert(err.response?.data?.message || "Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const mainWrapperClass = "min-h-screen bg-slate-950 text-slate-100 font-sans relative overflow-x-hidden pb-12";
  const bgGlows = (
    <>
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-orange-500/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-[150px] pointer-events-none" />
    </>
  );

  // ── Success Screen ───────────────────────────────────────────────────────────
  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 text-slate-100 font-sans relative">
        {bgGlows}
        <div className="max-w-md w-full z-10">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-3xl blur opacity-30 pointer-events-none" />
          
          <div className="relative bg-slate-900/80 backdrop-blur-2xl border border-slate-800 rounded-3xl p-8 shadow-2xl text-center">
            {/* Animated check */}
            <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-emerald-500/30 animate-bounce">
              <FaCheckCircle size={32} className="text-emerald-400" />
            </div>

            <h2 className="text-2xl font-black text-emerald-400 mb-1 tracking-tight">Order Placed! 🎉</h2>
            <p className="text-slate-400 text-xs font-semibold mb-6 leading-relaxed">
              Your order has been confirmed. A detailed receipt has been dispatched to{" "}
              <strong className="text-orange-400">{user?.email}</strong>.
            </p>

            {/* Order Details box */}
            <div className="bg-slate-950/50 border border-slate-800 rounded-2xl p-4 mb-6 space-y-1">
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Order ID Reference</p>
              <p className="text-lg font-black font-mono text-orange-400">{orderSuccess.orderId}</p>
              <p className="text-xs font-bold text-slate-400">
                ₹{orderSuccess.totalAmount?.toFixed(2)} · {orderSuccess.items?.length} item{orderSuccess.items?.length !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Delivery address preview */}
            <div className="bg-slate-950/20 border border-slate-800 rounded-2xl p-4 mb-6 text-left space-y-1">
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Delivering To</p>
              <p className="text-xs font-bold text-slate-200">{address.name}</p>
              <p className="text-xs text-slate-400 font-semibold leading-relaxed">{address.address1}{address.address2 ? ', ' + address.address2 : ''}</p>
              <p className="text-xs text-slate-400 font-semibold">📞 {address.mobile}</p>
            </div>

            <button
              onClick={() => navigate("/menu")}
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-orange-500/10 active:scale-[0.98] transition-all text-xs uppercase tracking-wider cursor-pointer"
            >
              Order More Delicacies
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Empty Cart Screen ────────────────────────────────────────────────────────
  if (!loading && cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-100 font-sans relative">
        {bgGlows}
        <div className="text-center z-10 p-8">
          <div className="w-20 h-20 bg-slate-900 border border-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <FaShoppingBag size={28} className="text-slate-600" />
          </div>
          <h2 className="text-2xl font-black mb-1">Your cart is empty</h2>
          <p className="text-slate-400 text-xs font-semibold mb-6 max-w-xs mx-auto">Fill your cart with delicious recipes before proceeding to checkout!</p>
          <button
            onClick={() => navigate("/menu")}
            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-3.5 px-8 rounded-2xl shadow-lg shadow-orange-500/10 transition-all text-xs uppercase tracking-wider cursor-pointer"
          >
            Browse Menu
          </button>
        </div>
      </div>
    );
  }

  // ── Main Checkout Layout ─────────────────────────────────────────────────────
  return (
    <div className={mainWrapperClass}>
      {bgGlows}
      
      {/* Checkout Page Header */}
      <header className="sticky top-0 z-20 bg-slate-950/70 border-b border-slate-900/80 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-400 hover:text-orange-400 transition-colors text-xs font-bold uppercase tracking-wider cursor-pointer"
          >
            <FaArrowLeft size={10} /> Back to Menu
          </button>
          <div className="font-black text-white text-base">
            Sky<span className="text-orange-400">Bowl</span> · Checkout
          </div>
          <div className="text-xs font-bold bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-full text-slate-400">
            {cart.items.reduce((s, i) => s + i.quantity, 0)} Items
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-5 gap-8 relative z-10">

        {/* ── Left Column: Summary and Delivery Form ───────────────── */}
        <div className="md:col-span-3 space-y-6">

          {/* Cart Itemized Summary */}
          <div className="bg-slate-900/40 border border-slate-900 rounded-3xl overflow-hidden shadow-xl">
            <div className="px-6 py-4 border-b border-slate-900 flex justify-between items-center bg-slate-950/30">
              <h2 className="text-sm font-black text-slate-200 uppercase tracking-wider">Order Items</h2>
              <span className="text-xs font-bold text-slate-500">{cart.items.length} Category Groups</span>
            </div>
            
            <div className="divide-y divide-slate-900/80 max-h-96 overflow-y-auto">
              {cart.items.map(cartItem => {
                const item = cartItem.menuItemId;
                if (!item) return null;
                const itemId = item._id || item;
                const cid = cartItem._id;
                const isLoading = cartLoading[itemId];

                return (
                  <div key={cid} className="flex gap-4 p-5 items-center">
                    <img
                      src={item.image || "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=100"}
                      alt=""
                      className="h-16 w-16 rounded-xl object-cover flex-shrink-0 border border-slate-800"
                    />
                    
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-bold text-sm text-slate-200 truncate pr-1">{item.name}</h4>
                        <button
                          onClick={() => removeItem(itemId)} disabled={isLoading}
                          className="text-slate-500 hover:text-rose-400 p-1 transition-colors cursor-pointer disabled:opacity-40"
                        >
                          <FaTrash size={12} />
                        </button>
                      </div>

                      <div className="flex items-end justify-between mt-2">
                        <span className="text-xs font-semibold text-slate-400">
                          ₹{item.price} × {cartItem.quantity}
                        </span>

                        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg text-xs overflow-hidden h-[28px] w-[75px] select-none">
                          <button
                            onClick={() => updateQuantity(itemId, cartItem.quantity - 1)}
                            disabled={isLoading}
                            className="w-6 h-full hover:bg-slate-800 flex items-center justify-center text-slate-500 font-extrabold cursor-pointer disabled:opacity-40"
                          >
                            -
                          </button>
                          <span className="flex-1 text-center font-bold text-slate-200">
                            {cartItem.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(itemId, cartItem.quantity + 1)}
                            disabled={isLoading}
                            className="w-6 h-full hover:bg-slate-800 flex items-center justify-center text-orange-400 font-extrabold cursor-pointer disabled:opacity-40"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Delivery Address Form */}
          <div className="bg-slate-900/40 border border-slate-900 rounded-3xl overflow-hidden shadow-xl">
            <div className="px-6 py-4 border-b border-slate-900 flex items-center gap-2.5 bg-slate-950/30">
              <FaMapMarkerAlt className="text-orange-400" size={14} />
              <h2 className="text-sm font-black text-slate-200 uppercase tracking-wider">Delivery Details</h2>
            </div>
            
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Name */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1.5 ml-1">Full Name</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3.5 flex items-center text-slate-500">
                    <FaUser size={12} />
                  </span>
                  <input
                    type="text"
                    placeholder="Recipient's Name"
                    value={address.name}
                    onChange={(e) => setAddress(a => ({ ...a, name: e.target.value }))}
                    className="w-full p-3 bg-slate-950/50 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-orange-500/80 pl-10 font-semibold"
                  />
                </div>
              </div>

              {/* Mobile */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1.5 ml-1">Mobile Number</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3.5 flex items-center text-slate-500">
                    <FaPhone size={12} />
                  </span>
                  <input
                    type="tel"
                    placeholder="Contact Number"
                    value={address.mobile}
                    onChange={(e) => setAddress(a => ({ ...a, mobile: e.target.value }))}
                    className="w-full p-3 bg-slate-950/50 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-orange-500/80 pl-10 font-semibold"
                  />
                </div>
              </div>

              {/* Address 1 */}
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-slate-400 mb-1.5 ml-1">Address Line 1 (Required)</label>
                <input
                  type="text"
                  placeholder="Flat, House No., Building name"
                  value={address.address1}
                  onChange={(e) => setAddress(a => ({ ...a, address1: e.target.value }))}
                  className="w-full p-3 bg-slate-950/50 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-orange-500/80 font-semibold"
                />
              </div>

              {/* Address 2 */}
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-slate-400 mb-1.5 ml-1">Address Line 2 (Optional)</label>
                <input
                  type="text"
                  placeholder="Street, Landmark, Area info"
                  value={address.address2}
                  onChange={(e) => setAddress(a => ({ ...a, address2: e.target.value }))}
                  className="w-full p-3 bg-slate-950/50 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-orange-500/80 font-semibold"
                />
              </div>

            </div>
          </div>
        </div>

        {/* ── Right Column: Invoice Breakdown and Checkout CTA ────────── */}
        <div className="md:col-span-2">
          <div className="sticky top-24 bg-slate-900/40 border border-slate-900 rounded-3xl overflow-hidden shadow-xl">
            <div className="px-6 py-4 border-b border-slate-900 bg-slate-950/30">
              <h2 className="text-sm font-black text-slate-200 uppercase tracking-wider">Summary Breakdown</h2>
            </div>
            
            <div className="p-6 space-y-4">
              
              {/* Item subtotals */}
              <div className="space-y-2.5 max-h-40 overflow-y-auto pr-1">
                {cart.items.map(cartItem => {
                  const item = cartItem.menuItemId;
                  if (!item) return null;
                  return (
                    <div key={cartItem._id} className="flex justify-between text-xs font-semibold text-slate-400">
                      <span className="truncate pr-4">{item.name} × {cartItem.quantity}</span>
                      <span className="text-slate-300 flex-shrink-0">₹{(item.price * cartItem.quantity).toFixed(0)}</span>
                    </div>
                  );
                })}
              </div>

              {/* Extras */}
              <div className="pt-3 border-t border-slate-900 flex justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
                <span>Delivery Charges</span>
                <span className="text-emerald-500 font-extrabold">Free</span>
              </div>

              {/* Total amount */}
              <div className="pt-3 border-t border-slate-900 flex justify-between items-baseline font-black text-sm text-slate-300">
                <span className="uppercase tracking-wider">Grand Total</span>
                <span className="text-2xl text-emerald-400 font-black">₹{cart.totalAmount}</span>
              </div>

              {/* Place Order Action */}
              <button
                onClick={handleConfirmOrder}
                disabled={loading || cart.totalAmount === 0}
                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-orange-500/10 active:scale-[0.98] transition-all text-xs uppercase tracking-widest cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="h-4.5 w-4.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Placing Order…
                  </span>
                ) : (
                  "Confirm Order"
                )}
              </button>

              <p className="text-[10px] text-center text-slate-500 font-bold uppercase tracking-wider leading-relaxed">
                A confirmation email with items breakdown<br />
                will be sent to <strong className="text-slate-400">{user?.email}</strong>
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CheckoutPage;
