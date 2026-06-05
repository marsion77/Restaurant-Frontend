import { BrowserRouter, Route, Routes } from "react-router-dom";
import CategoryPage from "./CategoryPage";
import RestaurantLogin from "./log";
import RestaurantRegister from "./Register";
import RestaurantForgetPassword from "./Forget-Password";
import CheckoutPage from "./Checkout";

const Nav_bar = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"               element={<RestaurantLogin />} />
        <Route path="/register"       element={<RestaurantRegister />} />
        <Route path="/forget-password" element={<RestaurantForgetPassword />} />
        <Route path="/menu"           element={<CategoryPage />} />
        <Route path="/checkout"       element={<CheckoutPage />} />
        {/* Legacy redirect alias */}
        <Route path="/CategoryPage"   element={<CategoryPage />} />
        <Route path="/Checkout"       element={<CheckoutPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Nav_bar;