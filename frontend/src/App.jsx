import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// USER LAYOUT
import UserLayout from "./user/layout/UserLayout";

// USER PAGES
import Signup from "./user/pages/Signup";
import Login from "./user/pages/Login";
import Home from "./user/pages/Home";
import Products from "./user/pages/Products";
import ProductDetails from "./user/pages/ProductDetails";
import Cart from "./user/pages/Cart";
import Wishlist from "./user/pages/Wishlist";
import MyOrders from "./user/pages/MyOrders";

// ADMIN LAYOUT
import AdminLayout from "./admin/layout/AdminLayout";

// ADMIN ROUTE
import AdminRoute from "./admin/routes/AdminRoute";

// ADMIN PAGES
import ManageProducts from "./admin/pages/ManageProducts";
import ManageOrders from "./admin/pages/ManageOrders";
import AddProduct from "./admin/pages/AddProduct";

function App() {
  return (
    <BrowserRouter>

      <ToastContainer
        position="top-center"
        hideProgressBar={true}
        transition={Slide}
        autoClose={2000}
        closeButton={false}
        closeOnClick={true}
        toastClassName={(context) =>
          `custom-toast ${context?.type === "error"
            ? "error-toast"
            : context?.type === "info"
              ? "info-toast"
              : "success-toast"
          }`
        }
      />

      <Routes>

        {/* USER ROUTES */}
        <Route path="/" element={<UserLayout />}>

          {/* HOME */}
          <Route
            index
            element={<Home />}
          />

          {/* PRODUCT */}
          <Route
            path="products/:category"
            element={<Products />}
          />

          {/* PRODUCT DETAIL */}
          <Route
            path="product/:productId"
            element={<ProductDetails />}
          />

          {/* CART */}
          <Route
            path="cart"
            element={<Cart />}
          />

          {/* WISHLIST */}
          <Route
            path="wishlist"
            element={<Wishlist />}
          />

          {/* MY ORDERS */}
          <Route
            path="myOrders"
            element={<MyOrders />}
          />
        </Route>

        {/* AUTH ROUTES */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* ADMIN ROUTES */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >

          {/* MANAGE ALL PRODUCTS - EDIT, DELETE */}
          <Route
            path="products"
            element={<ManageProducts />}
          />

          {/* ADD NEW PRODUCT */}
          <Route
            path="addProduct"
            element={<AddProduct />}
          />

          {/* MANAGE ALL ORDERS */}
          <Route
            path="orders"
            element={<ManageOrders />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App