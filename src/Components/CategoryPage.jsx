import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { API_BASE } from "../api/config";
import {
  FaBars, FaChevronRight, FaPlus, FaMinus, FaTrash,
  FaShoppingCart, FaSignOutAlt, FaStar, FaLeaf, FaDrumstickBite
} from "react-icons/fa";

const CategoryPage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems]   = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser]             = useState(null);
  const [cart, setCart]             = useState({ items: [], totalAmount: 0 });
  const [cartOpen, setCartOpen]     = useState(false);
  const [addingId, setAddingId]     = useState(null);
  const [cartLoading, setCartLoading] = useState({});

  // Load user
  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (!stored) { navigate("/"); return; }
      const userData = JSON.parse(stored);
      if (!userData) { navigate("/"); return; }
      setUser(userData);
    } catch (e) {
      localStorage.removeItem("user");
      navigate("/");
    }
  }, [navigate]);

  // Load categories & menu
  useEffect(() => {
    axios.get(`${API_BASE}/category/all`)
      .then(res => setCategories(res.data.data || []))
      .catch(err => console.error("Categories error:", err));

    axios.get(`${API_BASE}/menu/all`)
      .then(res => setMenuItems(res.data.data || []))
      .catch(err => console.error("Menu error:", err));
  }, []);

  // Fetch cart
  const fetchCart = async (u = user) => {
    if (!u) return;
    const userId = u._id || u.id || u.email;
    try {
      const res = await axios.get(`${API_BASE}/api/cart?userId=${userId}`);
      setCart(res.data.cart || { items: [], totalAmount: 0 });
    } catch (err) {
      console.error("Cart fetch failed:", err.response?.data || err.message);
      setCart({ items: [], totalAmount: 0 });
    }
  };

  useEffect(() => { if (user) fetchCart(user); }, [user]);

  const addToCart = async (menuItemId) => {
    if (!user) { alert("Please login to add items to cart"); return; }
    setAddingId(menuItemId);
    try {
      const userId = user._id || user.id || user.email;
      const res = await axios.post(`${API_BASE}/api/cart/add`, { menuItemId, quantity: 1, userId });
      setCart(res.data.cart || { items: [], totalAmount: 0 });
    } catch (err) {
      alert(`Failed: ${err.response?.data?.message || err.message}`);
    } finally {
      setAddingId(null);
    }
  };

  const updateQuantity = async (menuItemId, newQuantity) => {
    if (!user) return;
    setCartLoading(prev => ({ ...prev, [menuItemId]: true }));
    try {
      const userId = user._id || user.id || user.email;
      const res = await axios.post(`${API_BASE}/api/cart/update`, { userId, menuItemId, quantity: newQuantity });
      setCart(res.data.cart || { items: [], totalAmount: 0 });
    } catch (err) {
      alert("Failed to update quantity");
    } finally {
      setCartLoading(prev => ({ ...prev, [menuItemId]: false }));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const filteredItems = activeCategory === "All"
    ? menuItems
    : menuItems.filter(item => item.category?.name === activeCategory);

  const cartCount = cart.items.reduce((s, i) => s + i.quantity, 0);

  // Helper: Get cart quantity of a menu item
  const getCartQuantity = (menuItemId) => {
    const item = cart.items.find(i => (i.menuItemId?._id || i.menuItemId) === menuItemId);
    return item ? item.quantity : 0;
  };

  // Helper: Veg/Non-Veg dot-in-square indicator
  const VegNonVegBadge = ({ type }) => {
    const isVeg = type?.toLowerCase() === "veg" || type?.toLowerCase() === "vegan";
    return (
      <div className={`w-3.5 h-3.5 border flex items-center justify-center rounded-[3px] p-[1.5px] bg-slate-950/40 flex-shrink-0 ${isVeg ? 'border-emerald-500' : 'border-rose-600'}`}>
        <div className={`w-1.5 h-1.5 rounded-full ${isVeg ? 'bg-emerald-500' : 'bg-rose-600'}`} />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 flex text-slate-100 font-sans relative overflow-x-hidden">
      
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-orange-500/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-[150px] pointer-events-none" />

      {/* ── SIDEBAR ──────────────────────────────────────────────────── */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64
        bg-slate-900/80 border-r border-slate-800 backdrop-blur-2xl
        transform transition-transform duration-300 ease-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>
        <div className="h-full flex flex-col justify-between">
          
          <div>
            {/* Brand Header */}
            <div className="px-6 py-5 border-b border-slate-800/80">
              <h1 className="text-xl font-black text-white flex items-center gap-2">
                Sky<span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">Bowl</span>
              </h1>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">Premium Culinary Experience</p>
            </div>

            {/* Category Navigation */}
            <nav className="py-6 px-4 space-y-2 overflow-y-auto max-h-[calc(100vh-200px)]">
              <h3 className="px-3 pb-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-800/60 mb-3 select-none">
                Menu Categories
              </h3>

              {/* "All Items" Link */}
              <button
                onClick={() => { setActiveCategory("All"); setSidebarOpen(false); }}
                className={`w-full flex items-center justify-between py-3 px-4 rounded-2xl transition-all cursor-pointer font-semibold text-sm ${
                  activeCategory === "All"
                    ? "bg-gradient-to-r from-orange-500/20 to-amber-500/10 border border-orange-500/30 text-orange-400 shadow-md shadow-orange-500/5"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent"
                }`}
              >
                <span className="flex items-center gap-3">
                  <FaBars size={12} className="opacity-80" /> All Dishes
                </span>
                <span className="text-[11px] bg-slate-800 px-2 py-0.5 rounded-full text-slate-400">
                  {menuItems.length}
                </span>
              </button>

              {/* Seeded Categories */}
              {categories.map(cat => {
                const count = menuItems.filter(i => i.category?.name === cat.name).length;
                return (
                  <button
                    key={cat._id}
                    onClick={() => { setActiveCategory(cat.name); setSidebarOpen(false); }}
                    className={`w-full flex items-center justify-between py-3 px-4 rounded-2xl transition-all cursor-pointer font-semibold text-sm ${
                      activeCategory === cat.name
                        ? "bg-gradient-to-r from-orange-500/20 to-amber-500/10 border border-orange-500/30 text-orange-400 shadow-md shadow-orange-500/5"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent"
                    }`}
                  >
                    <span className="flex items-center gap-3 truncate">
                      <span className={`w-1.5 h-1.5 rounded-full ${activeCategory === cat.name ? 'bg-orange-400 animate-pulse' : 'bg-slate-600'}`} />
                      {cat.name}
                    </span>
                    <span className="text-[11px] bg-slate-800 px-2 py-0.5 rounded-full text-slate-400 flex-shrink-0">
                      {count}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* User Section at bottom */}
          {user && (
            <div className="p-4 border-t border-slate-800/80 space-y-3">
              <div className="flex items-center gap-3 p-3 bg-slate-950/40 border border-slate-800/60 rounded-2xl">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-xs font-bold text-white shadow-md shadow-orange-500/10 flex-shrink-0 select-none">
                  {user.email?.[0]?.toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-200 truncate">{user.name || 'User'}</p>
                  <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-xs font-bold text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-slate-800/40 hover:border-rose-500/20 transition-all cursor-pointer"
              >
                <FaSignOutAlt size={12} /> Sign Out
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Overlay on mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-slate-950/80 md:hidden transition-opacity duration-300" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── MAIN CONTENT ─────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-h-screen md:ml-64 relative z-10">

        {/* Global Header */}
        <header className="sticky top-0 z-20 bg-slate-950/70 border-b border-slate-900/80 backdrop-blur-xl">
          <div className="flex items-center justify-between px-6 py-4">
            
            <div className="flex items-center gap-3">
              <button
                className="md:hidden h-10 w-10 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-orange-400 transition-colors flex items-center justify-center cursor-pointer"
                onClick={() => setSidebarOpen(v => !v)}
              >
                <FaBars size={14} />
              </button>
              <div>
                <h2 className="text-lg font-black text-white tracking-tight">Menu Catalogue</h2>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
                  {activeCategory === "All" ? "All Items" : activeCategory} · {filteredItems.length} dishes
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Cart Button */}
              <button
                onClick={() => setCartOpen(true)}
                className="relative h-11 w-11 rounded-2xl bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 transition-all flex items-center justify-center text-slate-200 hover:text-orange-400 cursor-pointer shadow-lg"
              >
                <FaShoppingCart size={16} />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 h-5 w-5 bg-orange-500 text-[10px] font-black text-white rounded-full flex items-center justify-center shadow-lg border-2 border-slate-950">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Avatar Icon */}
              <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-xs font-black text-white shadow-lg shadow-orange-500/15 select-none">
                {user?.email?.[0]?.toUpperCase() || "U"}
              </div>
            </div>
          </div>
        </header>

        {/* ── SWIGGY-STYLE FOOD LIST/GRID ───────────────────────────── */}
        <main className="flex-1 px-6 py-8 max-w-4xl mx-auto w-full">
          {filteredItems.length === 0 ? (
            <div className="text-center py-20 bg-slate-900/20 rounded-3xl border border-slate-900 border-dashed">
              <p className="text-sm font-semibold text-slate-500">No dishes available in this category.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              
              {filteredItems.map(item => {
                const qty = getCartQuantity(item._id);
                const isLoading = cartLoading[item._id] || addingId === item._id;

                return (
                  <div
                    key={item._id}
                    className="p-6 bg-slate-900/60 hover:bg-slate-900/80 border border-slate-800/80 hover:border-slate-700/80 rounded-3xl flex items-start justify-between gap-6 shadow-[0_4px_20px_rgba(0,0,0,0.35)] hover:shadow-[0_12px_30px_rgba(0,0,0,0.55)] hover:shadow-orange-500/5 hover:-translate-y-1 transition-all duration-300 relative"
                  >
                    
                    {/* Left side: Item metadata */}
                    <div className="flex-1 space-y-1.5 min-w-0">
                      
                      <div className="flex items-center gap-2">
                        <VegNonVegBadge type={item.type} />
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                          {item.category?.name || "Dish"}
                        </span>
                      </div>
                      
                      <h3 className="text-base font-black text-white tracking-tight truncate">
                        {item.name}
                      </h3>
                      
                      <div className="flex items-center gap-4 text-xs font-bold">
                        <span className="text-slate-100 font-extrabold">₹{item.price}</span>
                        {item.rating && (
                          <span className="flex items-center gap-1 text-amber-500">
                            <FaStar size={11} className="fill-current" />
                            {item.rating}
                          </span>
                        )}
                        <span className="text-slate-500">{item.baseGrams || 100}g serving</span>
                      </div>
                      
                      <p className="text-xs text-slate-400 font-medium leading-relaxed max-w-xl line-clamp-2 pt-1">
                        {item.description || "Freshly cooked gourmet dish, prepared daily with premium ingredients."}
                      </p>
                    </div>

                    {/* Right side: Image + Interactive ADD Button */}
                    <div className="relative flex-shrink-0 w-28 h-28 md:w-32 md:h-32">
                      <img
                        src={item.image || "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=200"}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-2xl border border-slate-900 shadow-inner"
                      />
                      
                      {/* Swiggy-style Quantity Action overlay */}
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 z-10">
                        {qty === 0 ? (
                          // Case A: Show ADD button
                          <button
                            onClick={() => addToCart(item._id)}
                            disabled={isLoading || !user}
                            className="bg-slate-900 text-orange-400 hover:text-orange-300 font-bold border border-slate-800 hover:border-slate-700 shadow-xl active:scale-[0.97] py-1.5 px-6 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50 min-w-[85px] h-[32px] select-none"
                          >
                            {isLoading ? (
                              <span className="h-3 w-3 border-2 border-orange-400/30 border-t-orange-400 rounded-full animate-spin" />
                            ) : (
                              <>ADD <span className="text-[10px] font-extrabold text-orange-400/80">+</span></>
                            )}
                          </button>
                        ) : (
                          // Case B: Show - Qty + bar
                          <div className="flex items-center bg-slate-900 text-orange-400 font-bold border border-slate-800 shadow-xl rounded-xl text-xs overflow-hidden h-[32px] min-w-[85px] select-none">
                            <button
                              onClick={() => updateQuantity(item._id, qty - 1)}
                              disabled={isLoading}
                              className="px-2.5 h-full hover:bg-slate-800 flex items-center justify-center transition-colors cursor-pointer text-slate-500 font-extrabold flex-1 text-sm disabled:opacity-40"
                            >
                              <FaMinus size={8} />
                            </button>
                            
                            <span className="px-1.5 text-center text-white font-extrabold min-w-[18px]">
                              {isLoading ? (
                                <span className="inline-block h-3 w-3 border border-orange-400/30 border-t-orange-400 rounded-full animate-spin" />
                              ) : (
                                qty
                              )}
                            </span>
                            
                            <button
                              onClick={() => updateQuantity(item._id, qty + 1)}
                              disabled={isLoading}
                              className="px-2.5 h-full hover:bg-slate-800 flex items-center justify-center transition-colors cursor-pointer text-orange-400 font-extrabold flex-1 text-sm disabled:opacity-40"
                            >
                              <FaPlus size={8} />
                            </button>
                          </div>
                        )}
                      </div>

                    </div>

                  </div>
                );
              })}

            </div>
          )}
        </main>
      </div>

      {/* ── RIGHT CART DRAWER (Slide-out panel) ────────────────────── */}
      <div className={`
        fixed inset-y-0 right-0 z-50 w-full sm:w-[400px]
        bg-slate-900 border-l border-slate-800/80 backdrop-blur-2xl shadow-2xl
        flex flex-col justify-between transition-transform duration-300 ease-in-out
        ${cartOpen ? "translate-x-0" : "translate-x-full"}
      `}>
        
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="font-black text-lg text-white">Your Cart</h3>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{cartCount} item{cartCount !== 1 ? 's' : ''} added</p>
          </div>
          <button
            onClick={() => setCartOpen(false)}
            className="h-9 w-9 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-950/40 flex items-center justify-center text-slate-400 hover:text-white transition-all cursor-pointer text-lg"
          >
            ×
          </button>
        </div>

        {/* Drawer Scrollable Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.items.length === 0 ? (
            <div className="text-center py-20 text-slate-600 space-y-3">
              <FaShoppingCart size={40} className="mx-auto opacity-20" />
              <p className="text-sm font-bold">Your cart is currently empty</p>
              <p className="text-xs font-semibold text-slate-500 max-w-xs mx-auto">Fill your cart with delectable recipes from our kitchen catalog.</p>
            </div>
          ) : (
            cart.items.map(cartItem => {
              const item = cartItem.menuItemId;
              if (!item) return null;
              const itemId = item._id || item;
              const cid = cartItem._id;
              const isLoading = cartLoading[itemId];

              return (
                <div key={cid} className="flex gap-4 p-4 bg-slate-950/40 border border-slate-800/60 rounded-2xl">
                  <img
                    src={item.image || "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=100"}
                    alt=""
                    className="h-16 w-16 rounded-xl object-cover flex-shrink-0 border border-slate-800"
                  />
                  
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold text-sm text-slate-200 truncate pr-1">{item.name}</h4>
                      <button
                        onClick={() => updateQuantity(itemId, 0)}
                        disabled={isLoading}
                        className="text-slate-500 hover:text-rose-400 transition-colors p-1 cursor-pointer flex-shrink-0"
                      >
                        <FaTrash size={12} />
                      </button>
                    </div>

                    <div className="flex items-end justify-between mt-2">
                      <span className="text-xs font-bold text-emerald-400">
                        ₹{item.price} each
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
            })
          )}
        </div>

        {/* Drawer Footer Actions */}
        {cart.items.length > 0 && (
          <div className="p-5 border-t border-slate-800 bg-slate-950/20 space-y-3">
            <div className="flex justify-between items-end">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Subtotal Amount</span>
              <span className="text-xl font-black text-emerald-400">₹{cart.totalAmount}</span>
            </div>
            
            <button
              onClick={() => { setCartOpen(false); navigate('/checkout'); }}
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-3.5 rounded-2xl shadow-lg active:scale-[0.98] transition-all text-xs uppercase tracking-wider cursor-pointer"
            >
              Proceed to Checkout
            </button>
            <p className="text-[10px] text-center text-slate-500 font-bold uppercase tracking-wider select-none">
              🎉 Free Delivery applies to this order
            </p>
          </div>
        )}

      </div>

    </div>
  );
};

export default CategoryPage;
