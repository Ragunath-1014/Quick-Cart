import { useState, useContext, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { AuthContext } from "../../context/AuthContext";

import api from "../../api/axios";
import logo from "../../assets/icons/logo.svg";
import cart from "../../assets/icons/cart.png";
import profile from "../../assets/icons/user.png";
import menu from "../../assets/icons/menu.png";
import orders from "../../assets/icons/order.svg";
import wishlist from "../../assets/icons/wishlist.svg";
import logout from "../../assets/icons/logout.svg";
import Loader from "../../shared/Loader";

function Navbar() {

    const navigate = useNavigate();

    const { user, setUser } = useContext(AuthContext);

    const cartCount = user?.cart?.length || 0;

    const menuLinks = [
        { name: "Home", path: "/" },
        { name: "Men", path: "/products/men" },
        { name: "Women", path: "/products/women" },
        { name: "Kids", path: "/products/kids" },
    ];

    const profileDetails = [
        { name: "My Orders", path: "/myOrders", img: orders },
        { name: "Wishlist", path: "/wishlist", img: wishlist },
    ];

    const [showMenu, setShowMenu] = useState(false);
    const [showProfile, setShowProfile] = useState(false);

    useEffect(() => {
        if (showProfile || showMenu) {
            document.body.style.overflow = "hidden";
        }
        else {
            document.body.style.overflow = "auto";
        }

        return () => {
            document.body.style.overflow = "auto";
        };
    }, [showProfile, showMenu]);

    const handleLogout = async () => {
        try {
            await api.get("/auth/logout");
            setUser(null);
            toast.dismiss();
            toast.success("Logged out successfully");
            setShowProfile(!showProfile);
        }
        catch (err) {
            console.log(err.message);
            toast.dismiss();
            toast.error("Something went wrong");
        }
    }

    return (
        <nav className="sticky top-0 z-40">
            <div className="bg-white px-5 h-20 flex justify-between items-center shadow-md">

                {/* NAVBAR - LEFTSIDE */}
                <div onClick={() => navigate("/")}>
                    <img
                        src={logo}
                        alt="Quick Cart"
                        className="w-36 sm:w-40 cursor-pointer"
                    />
                </div>

                {/* NAVBAR SMALL SCREEN DEVICE - OVERLAY */}
                <div
                    className={`
                    fixed inset-0 
                    bg-black/60 z-40 
                    transition-opacity duration-300
                    backdrop-blur-sm 
                    lg:hidden
                    ${showMenu ? "opacity-100" : "opacity-0 pointer-events-none"}
                    `}
                    onClick={() => setShowMenu(false)}
                />

                {/* NAVBAR MENU TABS FOR SAMLL SCREEN DEVICE */}
                <div
                    className={`
                    bg-white top-0 
                    w-full sm:max-w-md md:max-w-lg
                    flex flex-col 
                    items-center justify-center
                    gap-8 fixed
                    transition-all duration-500
                    z-50 h-screen
                    sm:rounded-l-xl lg:hidden
                    ${showMenu ? "right-0" : "-right-full"}
                    `}
                >
                    <button
                        className="flex items-center 
                        justify-center w-8 
                        h-8 bg-gray-300/40 
                        rounded-full absolute
                        top-3 left-3
                        sm:top-6 sm:left-6
                        "
                        onClick={() => setShowMenu(false)}
                    >
                        <i className="ri-close-line text-lg font-medium" />
                    </button>

                    {menuLinks.map((menuLink, index) => (
                        <div key={index} className="font-semibold text-lg">
                            <NavLink
                                to={menuLink.path}
                                onClick={() => setShowMenu(false)}
                            >
                                {menuLink.name}
                            </NavLink>
                        </div>
                    ))}
                </div>

                {/* NAVBAR MENU TABS FOR LARGE SCREEN DEVICE */}
                <div className="hidden lg:flex lg:items-center lg:gap-10">
                    {menuLinks.map((menuLink, index) => (
                        <div key={index} className="relative font-semibold text-lg">
                            <NavLink
                                className={({ isActive }) => `
                                after:block after:absolute
                                after:bottom-0 after:left-0
                                after:w-0 after:h-[1px]
                                after:bg-rose-500 after:transition-all
                                after:duration-500 hover:after:w-[80%]
                                ${isActive ? "after:w-[80%]" : ""}
                                `}
                                to={menuLink.path}
                            >
                                {menuLink.name}
                            </NavLink>
                        </div>
                    ))}
                </div>

                {/* NAVBAR - RIGHTSIDE */}
                <div className="flex items-center gap-3">

                    {/* CART */}
                    <NavLink to={"/cart"}>
                        <div className="relative">
                            <img
                                src={cart}
                                alt="Bag-Icon"
                                className="w-7"
                            />
                            {cartCount > 0 && (
                                <p
                                    className="absolute bg-rose-500
                                    text-xs text-white
                                    w-4 h-4
                                    flex justify-center
                                    items-center rounded-full  
                                    -top-1 -right-1
                                    font-medium"
                                >
                                    {cartCount > 99 ? "99+" : cartCount}
                                </p>
                            )}
                        </div>
                    </NavLink>

                    {/* PROFILE */}
                    <div>
                        <img
                            src={profile}
                            alt="Profile-Icon"
                            className="w-7 cursor-pointer"
                            onClick={() => setShowProfile(!showProfile)}
                        />
                    </div>

                    {/* MENU BAR */}
                    <div onClick={() => setShowMenu(true)}>
                        <img
                            src={menu}
                            alt="Menu-Icon"
                            className="w-7 cursor-pointer lg:hidden"
                        />
                    </div>
                </div>

                {/* PROFILE DETAILS - OVERLAY */}
                {showProfile && (
                    <div className="fixed inset-0 bg-black/60 z-40 cursor-pointer"
                        onClick={() => setShowProfile(!showProfile)}
                    />
                )}

                {/* PROFILE DETAILS */}
                <div
                    className={`
                    bg-white px-5
                    absolute rounded-xl
                    right-5 top-16 
                    z-50 transition-all
                    duration-300
                    ${showProfile ? "opacity-100" : "opacity-0 pointer-events-none"}
                    `}
                >
                    {/* ARROW */}
                    <div
                        className="absolute -top-[7px] 
                        right-11 w-0 h-0 
                        border-l-8 border-r-8 
                        border-b-8 border-l-transparent
                        border-b-white border-r-transparent 
                        xl:right-4"
                    />
                    {user ?
                        <div className="py-5">
                            <div className="flex flex-col gap-2">
                                {profileDetails.map((profileDetail, index) => (
                                    <NavLink
                                        key={index}
                                        to={profileDetail.path}
                                        className="flex items-center 
                                        gap-3 px-3 
                                        py-2 hover:bg-gradient-to-r
                                        hover:from-sky-200 hover:to-white 
                                        rounded-md transition
                                        "
                                        onClick={() => setShowProfile(false)}
                                    >
                                        <img
                                            src={profileDetail.img}
                                            alt={profileDetail.name}
                                            className="w-5 h-5 object-contain"
                                        />
                                        <span>
                                            {profileDetail.name}
                                        </span>
                                    </NavLink>
                                ))}

                                <button
                                    onClick={handleLogout}
                                    className="flex items-center 
                                    gap-3 px-3 
                                    py-2 hover:bg-gradient-to-r
                                    hover:from-sky-200 hover:to-white 
                                    rounded-md transition text-left 
                                    w-full"
                                >
                                    <img
                                        src={logout}
                                        alt="logout"
                                        className="ml-1 w-5 h-5 object-contain"
                                    />
                                    <span>
                                        Logout
                                    </span>
                                </button>
                            </div>
                        </div>
                        :
                        <NavLink
                            to={"/login"}
                            className="flex items-center gap-3 p-3"
                        >
                            Login
                        </NavLink>
                    }
                </div>
            </div>
        </nav>
    );
}

export default Navbar;