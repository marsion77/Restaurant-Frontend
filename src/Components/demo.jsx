// src/CategoryPage.jsx
import { useState, useMemo, useCallback } from "react";
import { 
  FiBell, 
  FiSearch, 
  FiUser, 
  FiEdit3, 
  FiLogOut, 
  FiSave,
  FiArrowLeft
} from "react-icons/fi";

const MENU_ITEMS = [
  {
    id: 1,
    name: "Grill Sandwich",
    price: 30,
    rating: 5.0,
    category: "Sandwich",
    type: "Veg",
    description: "Beetroot, potato, bell pepper, sandwich masala.",
    image: "https://images.pexels.com/photos/1600711/pexels-photo-1600711.jpeg",
    baseGrams: 50,
  },
  {
    id: 2,
    name: "Chicken Popeyes",
    price: 20,
    rating: 4.0,
    category: "Chicken",
    type: "Non-Veg",
    description: "Crispy fried chicken popeyes style.",
    image: "https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg",
    baseGrams: 50,
  },
  {
    id: 3,
    name: "Bison Burgers",
    price: 50,
    rating: 2.0,
    category: "Burger",
    type: "Non-Veg",
    description: "Juicy bison patty with cheese.",
    image: "https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg",
    baseGrams: 50,
  },
  {
    id: 4,
    name: "Paneer Tikka",
    price: 45,
    rating: 4.8,
    category: "Veg",
    type: "Veg",
    description: "Grilled paneer with spices and bell peppers.",
    image: "https://images.pexels.com/photos/262959/pexels-photo-262959.jpeg",
    baseGrams: 50,
  },
  {
    id: 5,
    name: "Fresh Lime Soda",
    price: 25,
    rating: 4.9,
    category: "Drinks",
    type: "Drink",
    description: "Refreshing lime soda with mint.",
    image: "https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg",
    baseGrams: 50,
  },
  {
    id: 6,
    name: "Chocolate Cake",
    price: 55,
    rating: 4.9,
    category: "Cake",
    type: "Dessert",
    description: "Rich chocolate fudge cake.",
    image: "https://images.pexels.com/photos/2067396/pexels-photo-2067396.jpeg",
    baseGrams: 50,
  },
];

const MENU_SECTIONS = [
  {
    id: "veg",
    name: "Vegetarian",
    image:
      "https://images.pexels.com/photos/262959/pexels-photo-262959.jpeg?auto=compress&cs=tinysrgb&w=400",
    description: "Fresh vegetarian delights",
    itemCount: 2,
    color: "from-emerald-500 to-green-500",
    icon: "🥬"
  },
  {
    id: "non-veg",
    name: "Non-Vegetarian",
    image:
      "https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg?auto=compress&cs=tinysrgb&w=400",
    description: "Juicy meat specialties",
    itemCount: 2,
    color: "from-red-500 to-orange-500",
    icon: "🍗"
  },
  {
    id: "drinks",
    name: "Refreshments",
    image:
      "https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=400",
    description: "Refreshing beverages",
    itemCount: 1,
    color: "from-blue-500 to-cyan-500",
    icon: "🥤"
  },
  {
    id: "cake",
    name: "Desserts",
    image:
      "https://images.pexels.com/photos/2067396/pexels-photo-2067396.jpeg?auto=compress&cs=tinysrgb&w=400",
    description: "Sweet dessert treats",
    itemCount: 1,
    color: "from-pink-500 to-rose-500",
    icon: "🍰"
  },
];

const mockUserData = {
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+91 98765 43210",
};

const CategoryPage = () => {
  const [activeView, setActiveView] = useState("all");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeMenuSection, setActiveMenuSection] = useState("veg");
  const [showSectionItems, setShowSectionItems] = useState(false);
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState({});
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userViewOpen, setUserViewOpen] = useState(false);
  const [userData, setUserData] = useState(mockUserData);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(mockUserData);

  const categories = useMemo(
    () => ["All", ...new Set(MENU_ITEMS.map((i) => i.category))],
    []
  );

  const filteredItems = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      const matchCategory =
        activeCategory === "All" || item.category === activeCategory;

      let matchMenuSection = true;
      if (showSectionItems) {
        const sectionMap = {
          veg: item.type === "Veg",
          "non-veg": item.type === "Non-Veg",
          drinks: item.type === "Drink",
          cake: item.type === "Dessert",
        };
        matchMenuSection = sectionMap[activeMenuSection] || false;
      }

      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q);

      return matchCategory && matchMenuSection && matchSearch;
    });
  }, [activeCategory, search, showSectionItems, activeMenuSection]);

  const addToCart = useCallback((id) => {
    setCart((prev) => {
      const item = MENU_ITEMS.find((i) => i.id === id);
      if (!item) return prev;

      const current = prev[id] || { qty: 0, grams: 0 };
      const qty = current.qty + 1;
      const grams = item.baseGrams * qty;

      return { ...prev, [id]: { qty, grams } };
    });
  }, []);

  const removeFromCart = useCallback((id) => {
    setCart((prev) => {
      const current = prev[id];
      if (!current) return prev;

      const item = MENU_ITEMS.find((i) => i.id === id);
      if (!item) return prev;

      const qty = current.qty - 1;
      if (qty <= 0) {
        const next = { ...prev };
        delete next[id];
        return next;
      }
      const grams = item.baseGrams * qty;
      return { ...prev, [id]: { qty, grams } };
    });
  }, []);

  const cartItems = useMemo(
    () =>
      Object.entries(cart)
        .map(([id, data]) => {
          const item = MENU_ITEMS.find((i) => i.id === Number(id));
          if (!item) return null;
          const qty = data.qty;
          const grams = data.grams || item.baseGrams * qty;
          const unitPricePerGram = item.price / item.baseGrams;
          const linePrice = unitPricePerGram * grams;
          return { ...item, qty, grams, linePrice };
        })
        .filter(Boolean),
    [cart]
  );

  const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + item.linePrice, 0);
  const tax = subtotal * 0.06;
  const charges = subtotal > 0 ? 24 : 0;
  const total = subtotal + tax + charges;

  const title = showSectionItems
    ? `${
        activeMenuSection.charAt(0).toUpperCase() +
        activeMenuSection.slice(1).replace("-", " ")
      }`
    : activeView === "all"
    ? "All Dishes"
    : activeView === "orders"
    ? "Order Summary"
    : "Main Menu";

  const handleSectionClick = useCallback((sectionId) => {
    setActiveMenuSection(sectionId);
    setActiveView('all'); // Change view to 'all' to show items
    setShowSectionItems(true); // Flag to filter by section
  }, []);

  const goBackToMenuCards = useCallback(() => {
    setShowSectionItems(false);
    setActiveView('menu'); // Go back to the main menu view
  }, []);

  // User handlers
  const handleEditUser = () => {
    setEditData(userData);
    setIsEditing(true);
  };

  const handleSaveUser = () => {
    setUserData(editData);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleLogout = () => {
    setUserViewOpen(false);
    setActiveView("all");
    setMobileMenuOpen(false);
  };

  return (
    <>
      <style>
        {`
          .scroll-hide::-webkit-scrollbar {
            display: none;
          }
          @keyframes slideInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes pulse-glow {
            0%, 100% {
              box-shadow: 0 0 20px rgba(255, 255, 255, 0.1);
            }
            50% {
              box-shadow: 0 0 40px rgba(255, 255, 255, 0.2);
            }
          }
          .menu-card-hover {
            transition: all 0.5s cubic-bezier(0.23, 1, 0.320, 1);
          }
          .menu-card-hover:hover {
            transform: translateY(-15px) scale(1.02);
          }
          .menu-card-hover:hover .menu-card-image {
            transform: scale(1.1) rotate(2deg);
          }
          .menu-card-image {
            transition: transform 0.6s cubic-bezier(0.23, 1, 0.320, 1);
          }
        `}
      </style>

      <div className="h-screen overflow-hidden relative bg-gradient-to-br from-slate-900/20 via-sky-900/10 to-slate-900/20 flex">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* decorations */}
        </div>

        {/* DESKTOP SIDEBAR */}
        <aside className="hidden md:flex h-full w-72 bg-slate-900/95 backdrop-blur-xl border-r border-white/10 text-slate-100 flex-col py-8 px-6 shadow-2xl">
          <div className="flex items-center mb-10">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-sky-400 to-emerald-400 flex items-center justify-center text-slate-900 font-bold text-xl shadow-xl">
              B
            </div>
            <span className="ml-4 font-semibold text-xl tracking-tight">
              Bistro
            </span>
          </div>

          <nav className="space-y-2 mb-auto" aria-label="Sidebar navigation">
            <button
              type="button"
              onClick={() => {
                setActiveView("all");
                setShowSectionItems(false);
                setUserViewOpen(false);
              }}
              className={`group flex items-center w-full text-sm rounded-2xl px-4 py-3 transition-all duration-300 ${
                activeView === "all" && !showSectionItems && !userViewOpen
                  ? "bg-sky-500/20 border border-sky-400/50 text-sky-100 shadow-lg"
                  : "hover:bg-slate-800/50 hover:border hover:border-white/20"
              }`}
            >
              <span className="flex items-center gap-3 flex-1">
                <div className="h-3 w-3 rounded-full bg-gradient-to-r from-sky-400 to-emerald-400 shadow-lg" />
                <span>All dishes</span>
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveView("menu");
                setShowSectionItems(false);
                setUserViewOpen(false);
              }}
              className={`group flex items-center w-full text-sm rounded-2xl px-4 py-3 transition-all duration-300 ${
                activeView === "menu" && !showSectionItems && !userViewOpen
                  ? "bg-emerald-500/20 border border-emerald-400/50 text-emerald-100 shadow-lg"
                  : "hover:bg-slate-800/50 hover:border hover:border-white/20"
              }`}
            >
              <span className="flex items-center gap-3 flex-1">
                <div className="h-3 w-3 rounded-full bg-gradient-to-r from-emerald-400 to-green-400 shadow-lg" />
                <span>Menu</span>
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveView("orders");
                setShowSectionItems(false);
                setUserViewOpen(false);
              }}
              className={`group flex items-center w-full text-sm rounded-2xl px-4 py-3 transition-all duration-300 relative ${
                activeView === "orders" && !userViewOpen
                  ? "bg-gradient-to-r from-sky-500 to-emerald-500 text-slate-900 shadow-xl"
                  : "hover:bg-slate-800/50 hover:border hover:border-white/20"
              }`}
            >
              <span className="flex items-center gap-3 flex-1">
                <div className="h-3 w-3 rounded-full bg-gradient-to-r from-orange-400 to-rose-400 shadow-lg" />
                <span>Orders</span>
              </span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 inline-flex items-center justify-center w-7 h-7 text-xs font-bold bg-rose-400 text-slate-900 rounded-full shadow-lg">
                  {cartCount}
                </span>
              )}
            </button>
          </nav>

          {/* Profile Button - MOVED TO BOTTOM */}
          <button
            type="button"
            onClick={() => {
              setUserViewOpen(true);
              setActiveView("user");
            }}
            className={`group flex items-center w-full text-sm rounded-2xl px-4 py-3 transition-all duration-300 ${
              userViewOpen
                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-slate-900 shadow-xl"
                : "hover:bg-slate-800/50 hover:border hover:border-white/20"
            }`}
          >
            <span className="flex items-center gap-3 flex-1">
              <FiUser className="h-5 w-5" />
              <span>Profile</span>
            </span>
          </button>
        </aside>

        {/* MOBILE SIDEBAR */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            <div className="w-80 bg-slate-900/95 backdrop-blur-xl border-r border-white/10 text-slate-100 flex flex-col py-8 px-6 shadow-2xl">
              <div className="flex items-center mb-10">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-sky-400 to-emerald-400 flex items-center justify-center text-slate-900 font-bold text-xl shadow-xl">
                  B
                </div>
                <span className="ml-4 font-semibold text-xl tracking-tight">
                  Bistro
                </span>
              </div>

              <nav className="space-y-2 mb-auto" aria-label="Mobile navigation">
                <button
                  type="button"
                  onClick={() => {
                    setActiveView("all");
                    setShowSectionItems(false);
                    setUserViewOpen(false);
                    setMobileMenuOpen(false);
                  }}
                  className={`group flex items-center w-full text-sm rounded-2xl px-4 py-3 transition-all duration-300 ${
                    activeView === "all" && !showSectionItems && !userViewOpen
                      ? "bg-sky-500/20 border border-sky-400/50 text-sky-100 shadow-lg"
                      : "hover:bg-slate-800/50 hover:border hover:border-white/20"
                  }`}
                >
                  <span className="flex items-center gap-3 flex-1">
                    <div className="h-3 w-3 rounded-full bg-gradient-to-r from-sky-400 to-emerald-400 shadow-lg" />
                    <span>All dishes</span>
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveView("menu");
                    setShowSectionItems(false);
                    setUserViewOpen(false);
                    setMobileMenuOpen(false);
                  }}
                  className={`group flex items-center w-full text-sm rounded-2xl px-4 py-3 transition-all duration-300 ${
                    activeView === "menu" && !showSectionItems && !userViewOpen
                      ? "bg-emerald-500/20 border border-emerald-400/50 text-emerald-100 shadow-lg"
                      : "hover:bg-slate-800/50 hover:border hover:border-white/20"
                  }`}
                >
                  <span className="flex items-center gap-3 flex-1">
                    <div className="h-3 w-3 rounded-full bg-gradient-to-r from-emerald-400 to-green-400 shadow-lg" />
                    <span>Menu</span>
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveView("orders");
                    setShowSectionItems(false);
                    setUserViewOpen(false);
                    setMobileMenuOpen(false);
                  }}
                  className={`group flex items-center w-full text-sm rounded-2xl px-4 py-3 transition-all duration-300 relative ${
                    activeView === "orders" && !userViewOpen
                      ? "bg-gradient-to-r from-sky-500 to-emerald-500 text-slate-900 shadow-xl"
                      : "hover:bg-slate-800/50 hover:border hover:border-white/20"
                  }`}
                >
                  <span className="flex items-center gap-3 flex-1">
                    <div className="h-3 w-3 rounded-full bg-gradient-to-r from-orange-400 to-rose-400 shadow-lg" />
                    <span>Orders</span>
                  </span>
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 inline-flex items-center justify-center w-7 h-7 text-xs font-bold bg-rose-400 text-slate-900 rounded-full shadow-lg">
                      {cartCount}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setUserViewOpen(true);
                    setActiveView("user");
                    setMobileMenuOpen(false);
                  }}
                  className={`group flex items-center w-full text-sm rounded-2xl px-4 py-3 transition-all duration-300 ${
                    userViewOpen
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-slate-900 shadow-xl"
                      : "hover:bg-slate-800/50 hover:border hover:border-white/20"
                  }`}
                >
                  <span className="flex items-center gap-3 flex-1">
                    <FiUser className="h-5 w-5" />
                    <span>Profile</span>
                  </span>
                </button>
              </nav>
            </div>

            <div
              className="flex-1 bg-black/60 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
          </div>
        )}

        {/* MAIN CONTENT */}
        <main className="flex-1 h-screen px-6 lg:px-12 py-8 lg:py-12 flex lg:flex-row gap-8 relative z-10 overflow-hidden">
          {/* LEFT/MAIN AREA */}
          <div className="flex-1 flex flex-col min-h-0">
            {userViewOpen ? (
              <UserProfilePage
                userData={userData}
                editData={editData}
                isEditing={isEditing}
                onEdit={handleEditUser}
                onSave={handleSaveUser}
                onCancel={handleCancelEdit}
                onLogout={handleLogout}
                onBack={() => {
                  setUserViewOpen(false);
                  setActiveView("all");
                }}
              />
            ) : activeView === "orders" ? (
              <OrderContent
                cartItems={cartItems}
                subtotal={subtotal}
                tax={tax}
                charges={charges}
                total={total}
                addToCart={addToCart}
                removeFromCart={removeFromCart}
                onBack={() => setActiveView("all")}
              />
            ) : (
              /* REGULAR AND NEW MENU CONTENT */
              <div className="flex flex-col h-full">
                {/* HEADER */}
                <div className="mb-6 space-y-6 shrink-0">
                  <div className="flex items-center justify-between">
                    <button
                      className="md:hidden h-12 w-12 rounded-2xl bg-gradient-to-r from-sky-500 to-emerald-500 text-slate-900 flex items-center justify-center shadow-2xl hover:shadow-sky-500/50 hover:-translate-y-0.5 transition-all duration-300 font-bold text-lg"
                      onClick={() => setMobileMenuOpen(true)}
                      aria-label="Open navigation"
                    >
                      ☰
                    </button>

                    <h1 className="text-3xl lg:text-4xl font-black bg-gradient-to-r from-slate-100 via-sky-100 to-emerald-100 bg-clip-text text-transparent tracking-tight w-full text-center">
                      Bistro Bliss
                    </h1>
                  </div>

                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="relative w-full lg:w-auto lg:flex-1">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-300 text-lg">
                        <FiSearch />
                      </span>
                      <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-12 pr-6 py-4 rounded-3xl border border-white/20 bg-slate-900/50 backdrop-blur-xl text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 shadow-2xl hover:shadow-xl transition-all duration-300"
                        placeholder="Search delicious dishes..."
                      />
                    </div>

                    <button className="self-start lg:self-auto h-12 w-12 rounded-2xl bg-gradient-to-r from-sky-500 to-emerald-500 text-slate-900 flex items-center justify-center shadow-2xl hover:shadow-sky-500/50 hover:-translate-y-0.5 transition-all duration-300 font-semibold">
                      <FiBell className="text-lg" />
                    </button>
                  </div>

                  {activeView !== 'menu' && (
                    <p className="text-sm font-semibold text-sky-200 uppercase tracking-[0.3em] text-center">
                      {title}
                    </p>
                  )}
                </div>

                {/* SCROLLABLE/STATIC CONTENT */}
                <div className="flex-1 min-h-0">
                  {/* BACK BUTTON */}
                  {showSectionItems && (
                    <div className="mb-6">
                      <button
                        onClick={goBackToMenuCards}
                        className="group flex items-center gap-3 text-sky-300 hover:text-sky-100 text-base font-semibold mb-4 transition-all duration-300 hover:translate-x-1"
                      >
                        <FiArrowLeft />
                        <span>Back to Menu</span>
                      </button>
                    </div>
                  )}

                  {/* STATIC PREMIUM MENU CARDS */}
                  {activeView === "menu" && !showSectionItems && (
                    <div className="h-full flex flex-col items-center justify-center pb-12">
                       <p className="text-sm font-semibold text-emerald-300 uppercase tracking-[0.3em] text-center mb-12">
                          {title}
                        </p>
                      <div className="grid grid-cols-2 gap-8 w-full max-w-6xl">
                        {MENU_SECTIONS.map((section, idx) => (
                          <MenuSectionCard
                            key={section.id}
                            section={section}
                            onClick={() => handleSectionClick(section.id)}
                            idx={idx}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* SCROLLABLE ITEMS GRID */}
                  {(activeView === "all") && (
                     <div className="h-full overflow-y-auto scroll-hide">
                        {/* Category chips */}
                        <div className="flex flex-wrap gap-3 mb-8">
                          {categories.map((cat) => (
                            <button
                              key={cat}
                              onClick={() => setActiveCategory(cat)}
                              className={`px-6 py-3 text-sm font-semibold rounded-3xl border-2 transition-all duration-300 backdrop-blur-xl shadow-xl hover:shadow-2xl hover:-translate-y-1 hover:scale-[1.02] ${
                                activeCategory === cat
                                  ? "bg-gradient-to-r from-sky-500 to-emerald-500 text-slate-900 border-sky-400 shadow-sky-500/50"
                                  : "bg-slate-900/50 text-slate-200 border-white/20 hover:bg:white/10 hover:border-sky-300"
                              }`}
                            >
                              {cat}
                            </button>
                          ))}
                        </div>

                        <div className="grid gap-6 lg:gap-8 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 auto-rows-fr">
                          {filteredItems.map((item) => (
                            <MenuCard
                              key={item.id}
                              item={item}
                              addToCart={addToCart}
                            />
                          ))}
                          {filteredItems.length === 0 && (
                            <p className="text-sm text-slate-400 col-span-full text-center py-12 font-medium">
                              No {showSectionItems ? activeMenuSection : "items"} available right now.
                            </p>
                          )}
                        </div>
                     </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT ORDER SUMMARY */}
          {!userViewOpen && activeView !== "orders" && (
            <aside className="hidden xl:flex h-full w-96 bg-slate-900/95 backdrop-blur-3xl border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
              <div className="p-8 pt-6 pb-4 border-b border-white/10 shrink-0">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-black bg-gradient-to-r from-slate-100 via-sky-100 to-emerald-100 bg-clip-text text-transparent tracking-tight">
                    Order Summary
                  </h2>
                  {cartCount > 0 && (
                    <span className="inline-flex items-center justify-center w-10 h-10 text-sm font-bold bg-gradient-to-r from-rose-400 to-orange-400 text-slate-900 rounded-2xl shadow-lg">
                      {cartCount}
                    </span>
                  )}
                </div>
              </div>

              <div
                className="flex-1 min-h-0 overflow-y-auto px-4 pb-4 pt-2 -mx-1 scroll-hide"
                style={{
                  msOverflowStyle: "none",
                  scrollbarWidth: "none",
                }}
              >
                {cartItems.length === 0 ? (
                  <div className="text-center py-16 px-4">
                    <div className="w-20 h-20 mx-auto mb-4 bg-slate-800/50 rounded-3xl flex items-center justify-center">
                      <svg
                        className="w-12 h-12 text-slate-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M3 3h18l-2 12H5L3 3zm4 16a1 1 0 11-2 0 1 1 0 012 0zm12 0a1 1 0 11-2 0 1 1 0 012 0z"
                        />
                      </svg>
                    </div>
                    <p className="text-lg font-semibold text-slate-400">
                      Your cart is empty
                    </p>
                    <p className="text-sm text-slate-500 mt-1">
                      Add delicious items to get started
                    </p>
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="group flex items-center gap-4 p-4 bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-white/10 hover:bg:white/10 hover:border-sky-400/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl mb-3 last:mb-0"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-16 w-16 rounded-2xl object-cover shadow-lg flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-100 truncate group-hover:text-sky-100 transition-colors">
                          {item.name}
                        </p>
                        <p className="text-xs text-emerald-300 font-semibold">
                          {item.grams} g
                        </p>
                        <p className="text-sm font-bold text-slate-100">
                          ₹{item.linePrice.toFixed(2)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="h-10 w-10 rounded-xl border-2 border-slate-400/50 bg-slate-900/50 flex items-center justify-center text-slate-300 hover:bg-slate-800 hover:border-slate-300 hover:text-slate-100 transition-all duration-200 font-semibold"
                        >
                          −
                        </button>
                        <span className="text-lg font-black text-slate-100 w-12 text-center">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => addToCart(item.id)}
                          className="h-10 w-10 rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 text-slate-900 flex items-center justify-center font-bold text-sm shadow-lg hover:shadow-sky-500/50 hover:-translate-y-0.5 transition-all duration-200"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="border-t border-white/20 pt-6 pb-8 px-8 bg-slate-900/95 backdrop-blur-xl shrink-0">
                <div className="space-y-3 text-sm mb-6">
                  <div className="flex justify-between text-slate-300">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Tax (6%)</span>
                    <span>₹{tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Service</span>
                    <span>₹{charges.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xl font-black bg-gradient-to-r from-slate-100 via-sky-100 to-emerald-100 bg-clip-text text-transparent pt-3 border-t border-white/30">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>
                <button
                  disabled={cartItems.length === 0}
                  className="w-full py-4 rounded-3xl bg-gradient-to-r from-sky-500 via-blue-500 to-emerald-500 text-slate-900 font-black text-lg shadow-2xl hover:shadow-sky-500/50 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  Place Order Now
                </button>
              </div>
            </aside>
          )}
        </main>
      </div>
    </>
  );
};

/* --- SUB COMPONENTS --- */

const UserProfilePage = ({ userData, editData, isEditing, onEdit, onSave, onCancel, onLogout, onBack }) => {
  return (
    <div className="flex flex-col h-full bg-slate-900/95 backdrop-blur-3xl rounded-3xl shadow-2xl border border-white/10 p-12 gap-8 overflow-hidden">
      {/* Header with back button */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="group flex items-center gap-3 text-sky-300 hover:text-sky-100 text-xl font-semibold transition-all duration-300 hover:translate-x-1 p-3 rounded-2xl hover:bg-sky-500/10"
        >
          <span className="h-6 w-6 border-l-2 border-t-2 border-sky-400 rotate-[-45deg] group-hover:border-sky-300 transition-all duration-300" />
          <span>Back to Menu</span>
        </button>
      </div>

      <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full overflow-y-auto scroll-hide">
        {/* Profile Header */}
        <div className="text-center mb-12">
          {/* LARGE USER ICON - w-48 h-48 */}
          <div className="w-48 h-48 mx-auto mb-8 bg-gradient-to-br from-purple-400 via-pink-400 to-rose-400 rounded-full flex items-center justify-center shadow-2xl border-4 border-white/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent animate-pulse" />
            <FiUser className="w-28 h-28 text-white/90 relative z-10" />
          </div>
          <h1 className="text-4xl font-black bg-gradient-to-r from-slate-100 via-purple-100 to-pink-100 bg-clip-text text-transparent tracking-tight mb-2">
            Profile Settings
          </h1>
          <p className="text-slate-400 text-lg">Manage your account details</p>
        </div>

        {/* Edit/Save buttons */}
        <div className="flex justify-center mb-12 gap-4">
          {!isEditing ? (
            <button
              onClick={onEdit}
              className="flex items-center gap-2 px-8 py-4 rounded-3xl bg-gradient-to-r from-purple-500 to-pink-500 text-slate-900 font-bold text-lg shadow-2xl hover:shadow-purple-500/50 hover:-translate-y-1 transition-all duration-300"
            >
              <FiEdit3 className="w-5 h-5" />
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={onSave}
                className="flex items-center gap-2 px-8 py-4 rounded-3xl bg-gradient-to-r from-emerald-500 to-green-500 text-slate-900 font-bold text-lg shadow-2xl hover:shadow-emerald-500/50 hover:-translate-y-1 transition-all duration-300"
              >
                <FiSave className="w-5 h-5" />
                Save Changes
              </button>
              <button
                onClick={onCancel}
                className="px-8 py-4 rounded-3xl bg-slate-800/50 border border-white/20 text-slate-300 font-bold text-lg hover:bg-slate-700 hover:border-white/40 transition-all duration-300"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* User Details Form - CLEANED (No Address) */}
        <div className="space-y-8 pb-8">
          <div>
            <label className="block text-sm font-semibold text-slate-300 uppercase tracking-wide mb-4 flex items-center gap-2">
              <span>Personal Information</span>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            </label>
            <div className="space-y-6">
              <InputField
                label="Full Name"
                value={isEditing ? editData.name : userData.name}
                onChange={(e) => isEditing && setEditData({...editData, name: e.target.value})}
                disabled={!isEditing}
              />
              <InputField
                label="Email Address"
                type="email"
                value={isEditing ? editData.email : userData.email}
                onChange={(e) => isEditing && setEditData({...editData, email: e.target.value})}
                disabled={!isEditing}
              />
              <InputField
                label="Phone Number"
                value={isEditing ? editData.phone : userData.phone}
                onChange={(e) => isEditing && setEditData({...editData, phone: e.target.value})}
                disabled={!isEditing}
              />
            </div>
          </div>

          {/* Logout Button */}
          <div className="mt-8 pt-8 border-t border-white/20">
            <button
              onClick={onLogout}
              className="w-full py-5 px-8 rounded-3xl bg-gradient-to-r from-rose-500 to-red-500 text-slate-100 font-black text-xl shadow-2xl hover:shadow-rose-500/50 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3"
            >
              <FiLogOut className="w-6 h-6" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const InputField = ({ label, value, onChange, disabled, type = "text", rows }) => (
  <div className="space-y-2">
    <label className="block text-sm font-semibold text-slate-300 mb-2">
      {label}
    </label>
    {type === "textarea" ? (
      <textarea
        value={value}
        onChange={onChange}
        disabled={disabled}
        rows={rows}
        className="w-full p-5 rounded-2xl bg-slate-800/50 backdrop-blur-xl border border-white/20 text-slate-100 text-base focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed resize-vertical min-h-[100px]"
      />
    ) : (
      <input
        type={type}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="w-full p-5 rounded-2xl bg-slate-800/50 backdrop-blur-xl border border-white/20 text-slate-100 text-base focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
      />
    )}
  </div>
);

// PREMIUM MENU SECTION CARD
const MenuSectionCard = ({ section, onClick, idx }) => {
  const animationDelay = idx * 100;
  
  return (
    <button
      type="button"
      onClick={onClick}
      className="menu-card-hover group relative h-80 rounded-3xl overflow-hidden border-2 border-white/10 shadow-2xl hover:shadow-2xl transition-all duration-500 cursor-pointer"
      style={{
        animation: `slideInUp 0.6s ease-out ${animationDelay}ms forwards`,
        opacity: 0,
      }}
    >
      <div className="absolute inset-0">
        <img
          src={section.image}
          alt={section.name}
          className="menu-card-image h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
        <div className={`absolute inset-0 bg-gradient-to-br from-${section.color.split(' ')[1]}/20 to-transparent`} />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-900/80" />
      </div>

      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-3xl translate-x-20 -translate-y-20 group-hover:translate-x-10 group-hover:-translate-y-10 transition-transform duration-500" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-white/5 to-transparent rounded-full blur-2xl -translate-x-16 translate-y-16 group-hover:-translate-x-8 group-hover:translate-y-8 transition-transform duration-500" />

      <div className="relative h-full flex flex-col justify-between p-6 z-10">
        <div className="flex items-start justify-between">
          <div className={`text-6xl p-3 rounded-2xl bg-gradient-to-br ${section.color} shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
            {section.icon}
          </div>
          <div className="px-4 py-2 rounded-full bg-slate-900/60 backdrop-blur-md border border-white/20">
            <span className="text-xs font-bold text-emerald-300">{section.itemCount} items</span>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-2xl font-black text-white drop-shadow-lg group-hover:text-emerald-300 transition-colors duration-300">
            {section.name}
          </h3>
          <p className="text-sm text-slate-300 group-hover:text-slate-100 transition-colors duration-300 line-clamp-2">
            {section.description}
          </p>
          
          <div className="pt-3 flex items-center gap-2 text-emerald-300 font-semibold text-sm group-hover:text-emerald-200 transition-all duration-300 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0">
            <span>Explore Menu</span>
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-emerald-400/50 transition-colors duration-300 pointer-events-none" />
    </button>
  );
};

// --- FIXED PREMIUM DISH CARD ---
const MenuCard = ({ item, addToCart }) => (
  <div className="group relative bg-slate-900/40 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-sky-500/20 hover:-translate-y-2 hover:border-white/20 h-full flex flex-col">
    
    {/* Image Section with Overlay */}
    <div className="relative h-48 w-full overflow-hidden flex-shrink-0">
      <img
        src={item.image}
        alt={item.name}
        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      {/* Darker Gradient Overlay for perfect text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/30 to-transparent" />
      
      {/* Top Right Grams Badge - Highlighted */}
      <div className="absolute top-3 right-3 z-10">
        <div className="bg-slate-900/80 backdrop-blur-md border border-emerald-500/40 px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-xl group-hover:bg-emerald-500/30 group-hover:border-emerald-400/60 transition-all duration-400">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse shadow-md"></span>
          <span className="text-sm font-black text-emerald-100 tracking-wide">{item.baseGrams}g</span>
        </div>
      </div>

      {/* Rating Badge - Top Left */}
      <div className="absolute top-3 left-3 z-10 bg-white/15 backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-lg border border-white/20">
        <span className="text-orange-400 text-sm">★</span>
        <span className="text-sm font-bold text-white">{item.rating.toFixed(1)}</span>
      </div>
    </div>

    {/* Content Section - FLEX TO PUSH BUTTONS TO BOTTOM */}
    <div className="p-6 flex-1 flex flex-col min-h-0">
      <div className="space-y-3 mb-auto">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-black text-slate-50 leading-tight line-clamp-1 group-hover:text-sky-300 transition-all duration-400">
            {item.name}
          </h3>
          <span className="text-2xl font-black bg-gradient-to-r from-emerald-400 via-sky-400 to-emerald-500 bg-clip-text text-transparent drop-shadow-lg">
            ₹{item.price}
          </span>
        </div>

        <p className="text-sm text-slate-300 line-clamp-2 font-medium leading-relaxed group-hover:text-slate-200 transition-all duration-300">
          {item.description}
        </p>
      </div>

      {/* Bottom Action Area - ALWAYS AT BOTTOM */}
      <div className="pt-6 border-t border-white/10 mt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className={`h-3 w-3 rounded-full shadow-lg ${item.type === 'Veg' ? 'bg-emerald-400' : 'bg-red-400'}`}></span>
            <span className="text-sm font-bold text-slate-300 uppercase tracking-wide">{item.category}</span>
          </div>

          {/* Animated Add Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              addToCart(item.id);
            }}
            className="group/btn relative overflow-hidden px-6 py-3 rounded-2xl bg-gradient-to-r from-slate-800/80 to-slate-700/80 backdrop-blur-md border border-white/20 text-white font-black text-sm shadow-xl hover:shadow-2xl hover:shadow-emerald-500/30 active:scale-95 transition-all duration-400"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-sky-500 to-emerald-600 opacity-0 group-hover/btn:opacity-100 transition-all duration-400" />
            <div className="relative flex items-center gap-2 justify-center">
              <span>Add</span>
              <span className="bg-white/30 backdrop-blur-sm rounded-lg p-1 group-hover/btn:bg-white/50 transition-all duration-300">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                </svg>
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>
);

const OrderContent = ({
  cartItems,
  subtotal,
  tax,
  charges,
  total,
  addToCart,
  removeFromCart,
  onBack
}) => (
  <div className="bg-slate-900/90 backdrop-blur-3xl rounded-[3rem] shadow-2xl border border-white/10 p-6 lg:p-10 flex flex-col h-full w-full">
    <div className="flex items-center gap-4 mb-6">
      <button
        onClick={onBack}
        className="group flex items-center gap-3 text-sky-300 hover:text-sky-100 text-lg font-semibold transition-all duration-300 hover:translate-x-1 p-2 rounded-2xl hover:bg-sky-500/10"
      >
         <FiArrowLeft className="text-xl" />
        <span>Back</span>
      </button>
      <h2 className="flex-1 text-3xl font-black bg-gradient-to-r from-slate-100 via-sky-100 to-emerald-100 bg-clip-text text-transparent tracking-tight text-center mr-20">
        Order Details
      </h2>
    </div>

    <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full overflow-hidden">
      <div
        className="space-y-4 mb-6 flex-1 min-h-0 overflow-y-auto scroll-hide pr-2"
        style={{
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}
      >
        {cartItems.length === 0 && (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 bg-slate-800/50 rounded-3xl flex items-center justify-center border-2 border-white/20">
              <svg
                className="w-14 h-14 text-slate-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 3h18l-2 12H5L3 3zm4 16a1 1 0 11-2 0 1 1 0 012 0zm12 0a1 1 0 11-2 0 1 1 0 012 0z"
                />
              </svg>
            </div>
            <p className="text-2xl font-black text-slate-400 mb-2">Empty Cart</p>
            <p className="text-lg text-slate-500">
              Start adding your favorite dishes
            </p>
          </div>
        )}

        {cartItems.map((item) => (
          <div
            key={item.id}
            className="group flex items-center gap-6 p-6 bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-white/20 hover:bg:white/10 hover:border-sky-400/50 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl shadow-xl"
          >
            <img
              src={item.image}
              alt={item.name}
              className="h-24 w-24 rounded-2xl object-cover shadow-2xl flex-shrink-0 group-hover:scale-105 transition-transform duration-300"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xl font-black text-slate-100 truncate group-hover:text-sky-100 transition-colors">
                {item.name}
              </p>
              <p className="text-base text-emerald-300 mt-1">{item.grams} g</p>
              <p className="text-2xl font-bold text-emerald-400 mt-2">
                ₹{item.linePrice.toFixed(2)}
              </p>
            </div>
            <div className="flex items-center gap-4 flex-shrink-0">
              <button
                onClick={() => removeFromCart(item.id)}
                className="h-12 w-12 rounded-2xl border-2 border-slate-400/50 bg-slate-900/50 flex items-center justify-center text-xl font-black text-slate-300 hover:bg-slate-800 hover:border-slate-300 hover:text-slate-100 transition-all duration-300 shadow-lg hover:shadow-slate-500/50 hover:-translate-y-0.5"
              >
                −
              </button>
              <span className="text-3xl font-black text-slate-100 w-16 text-center">
                {item.qty}
              </span>
              <button
                onClick={() => addToCart(item.id)}
                className="h-12 w-12 rounded-2xl bg-gradient-to-r from-sky-500 to-emerald-500 text-slate-900 flex items-center justify-center text-xl font-black shadow-2xl hover:shadow-sky-500/50 hover:-translate-y-0.5 transition-all duration-300"
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-white/30 pt-6 space-y-4 text-lg bg-slate-900/40 rounded-3xl p-6">
        <div className="flex justify-between text-slate-300 font-semibold">
          <span>Subtotal</span>
          <span>₹{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-slate-400">
          <span>Tax (6%)</span>
          <span>₹{tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-slate-400">
          <span>Service Charge</span>
          <span>₹{charges.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-3xl font-black bg-gradient-to-r from-slate-100 via-sky-100 to-emerald-100 bg-clip-text text-transparent pt-4 border-t border-white/50">
          <span>Total Amount</span>
          <span>₹{total.toFixed(2)}</span>
        </div>
      </div>

      <button
        disabled={cartItems.length === 0}
        className="mt-6 w-full py-5 rounded-3xl bg-gradient-to-r from-sky-500 via-blue-500 to-emerald-500 text-slate-900 font-black text-xl shadow-2xl hover:shadow-[0_0_40px_rgba(2,132,199,0.6)] hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-500"
      >
        Confirm & Place Order
      </button>
    </div>
  </div>
);

export default CategoryPage;
