import { useState, useContext } from "react";
import { toast } from "react-toastify";
import { NavLink } from "react-router-dom";

import { AuthContext } from "../../context/AuthContext";

import api from "../../api/axios";
import logo from "../../assets/icons/logo.svg";
import profile from "../../assets/icons/user.png";
import logout from "../../assets/icons/logoutAdmin.svg";
import orders from "../../assets/icons/order.svg";

function Sidebar() {

  const { user, setUser } = useContext(AuthContext);

  const handleAdminLogout = async () => {
    try {
      await api.get("/auth/logout");
      setUser(null);
      toast.dismiss();
      toast.success("Logged out successfully");
    }
    catch (err) {
      console.log(err.message);
      toast.dismiss();
      toast.error("Something went wrong");
    }
  }

  const links = [
    {
      name: "Add Product",
      path: "/admin/addProduct"
    },
    {
      name: "Products",
      path: "/admin/products"
    },
    {
      name: "Orders",
      path: "/admin/orders"
    },
  ];

  return (
    <div className="h-screen w-80 border-r border-gray-300 flex flex-col">

      {/* LOGO - HEADER */}
      <div className="flex items-center h-20 px-5 border-b border-gray-300">
        <img
          src={logo}
          alt="Quick Cart"
          className="w-36 sm:w-40"
        />
      </div>

      {/* WRAPPER */}
      <div className="flex flex-col justify-between flex-1">

        {/* LINKS */}
        <div className="flex flex-col gap-2">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `p-5 transition-all duration-300 font-semibold
                  ${isActive ? "bg-rose-50" : "bg-white"}`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </div>

        {/* LOGOUT BUTTON */}
        < div
          className="flex items-center gap-2 p-5 cursor-pointer border-t border-gray-300"
          onClick={handleAdminLogout}
        >
          <img
            src={logout}
            alt="Logout"
            className="w-5 h-5 object-contain"
          />

          <span className="font-semibold text-black">
            Logout
          </span>
        </div>

      </div>
    </div>
  );
}

export default Sidebar;