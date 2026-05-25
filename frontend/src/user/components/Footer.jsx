import { useState } from "react";
import { Link } from "react-router-dom";

import googlePlay from "../../assets/icons/googlePlay.svg";
import apple from "../../assets/icons/apple.svg";

function Footer() {

    const [onlineShopping, setOnlineShopping] = useState(false);
    const [links, setLinks] = useState(false);
    const [brand, setBrand] = useState(false);
    const [enquiry, setEnquiry] = useState(false);

    const shoppingLinks = [
        { name: "Home", path: "/" },
        { name: "Men", path: "/products/men" },
        { name: "Women", path: "/products/women" },
        { name: "Kids", path: "/products/kids" }
    ];

    const brands = [
        { name: "Banana Club | Levis | Snitch | The Bear House | U.S. Polo Assn" },
        { name: "H&M | HERE&NOW | MAX | Pepe Jeans | Roadster" },
        { name: "Allen Solly Junior | Nauti Nauti | U.S. Polo Assn. Kids | United Colors Of Benetton" },
    ];

    return (
        <footer className="bg-[#F1F1F2] w-full px-5 mt-16">

            {/* SMALL SCREEN DEVICE */}
            <section className="md:hidden pt-8">

                {/* PLAYSTORE & APPSTORE */}
                <div className="flex flex-col gap-2">
                    <h1 className="text-lg font-medium">
                        Download the app
                    </h1>
                    <div className="flex gap-5">
                        <img src={googlePlay} alt="googlePlay" className="w-32" />
                        <img src={apple} alt="apple" className="w-32" />
                    </div>
                </div>

                <div>

                    {/* BROWSE ALL */}
                    <div className="flex justify-between mt-5 font-medium">
                        <h1>
                            Online Shopping
                        </h1>
                        <i
                            className={`
                            ri-arrow-down-s-line 
                            inline-block transition-transform 
                            duration-300 cursor-pointer 
                            ${onlineShopping ? "rotate-180" : "rotate-0"} text-lg
                            `}
                            onClick={() => setOnlineShopping(!onlineShopping)}
                        />
                    </div>

                    <p className="border-t-2 border-gray-300/80 my-3" />

                    {onlineShopping &&
                        <div className="flex flex-col gap-1 text-blue-600 font-medium px-5 mt-2">
                            {shoppingLinks.map((shoppingLink, index) => (
                                <div key={index}>
                                    <Link to={shoppingLink.path}>
                                        {shoppingLink.name}
                                    </Link>
                                    <p className="border-t-2 border-gray-300/80 my-2" />
                                </div>
                            ))}
                        </div>
                    }

                    {/* LINKS */}
                    <div className="flex justify-between mt-5 font-medium">
                        <h1>
                            Links
                        </h1>
                        <i
                            className={`
                            ri-arrow-down-s-line 
                            inline-block transition-transform 
                            duration-300 cursor-pointer 
                            ${links ? "rotate-180" : "rotate-0"} text-lg
                            `}
                            onClick={() => setLinks(!links)}
                        />
                    </div>

                    <p className="border-t-2 border-gray-300/80 my-3" />

                    {links &&
                        <div className="flex flex-col gap-1 text-blue-600 font-medium px-5 mt-2">
                            <Link to={"/signup"}>
                                Signup
                            </Link>
                            <p className="border-t-2 border-gray-300/80 my-2" />
                            <Link to={"/login"}>
                                Login
                            </Link>
                            <p className="border-t-2 border-gray-300/80 my-2" />
                        </div>
                    }

                    {/* BRANDS */}
                    <div className="flex justify-between mt-5 font-medium">
                        <h1>
                            Brands
                        </h1>
                        <i
                            className={`
                            ri-arrow-down-s-line 
                            inline-block transition-transform 
                            duration-300 cursor-pointer 
                            ${brand ? "rotate-180" : "rotate-0"} text-lg
                            `}
                            onClick={() => setBrand(!brand)}
                        />
                    </div>

                    <p className="border-t-2 border-gray-300/80 my-2" />

                    {brand &&
                        <div className="mt-2">
                            {brands.map((brandName, index) => (
                                <div
                                    key={index}
                                    className="flex flex-col gap-1 text-blue-600 font-medium px-5"
                                >
                                    <p>
                                        {brandName.name}
                                    </p>
                                    <p className="border-t-2 border-gray-300/80 my-2" />
                                </div>
                            ))}
                        </div>
                    }

                    {/* ENQUIRY */}
                    <div className="flex justify-between mt-5 font-medium">
                        <h1>
                            Enquiry
                        </h1>
                        <i
                            className={`
                            ri-arrow-down-s-line 
                            inline-block transition-transform 
                            duration-300 cursor-pointer 
                            ${enquiry ? "rotate-180" : "rotate-0"} text-lg
                            `}
                            onClick={() => setEnquiry(!enquiry)}
                        />
                    </div>

                    <p className="border-t-2 border-gray-300/80 my-2" />

                    {enquiry &&
                        <div className="text-blue-600 font-medium px-5 mt-2">
                            <p>
                                Support Service (24x7)
                            </p>
                            <p className="border-t-2 border-gray-300/80 my-2" />
                        </div>
                    }

                </div>

                {/* COPYRIGHT */}
                <p className="text-xs font-medium text-center mt-5 pb-5">
                    Copyright &#169; 2026 CodeWithRagu. All Rights Reserved.
                </p>
            </section>

            {/* LARGE SCREEN DEVICE */}
            <section className="flex justify-center">
                <div className="hidden md:block pt-8">

                    {/* PLAYSTORE & APPSTORE */}
                    <div className="flex items-center gap-16">
                        <h1 className="text-xl font-medium">
                            Download the app
                        </h1>
                        <div className="flex gap-5">
                            <img src={googlePlay} alt="googlePlay" className="w-40" />
                            <img src={apple} alt="apple" className="w-40" />
                        </div>
                    </div>

                    <p className="border-t-2 border-gray-300/80 my-8" />

                    <div className="font-medium flex items-start gap-12 lg:gap-32 xl:gap-40">

                        {/* ONLINE SHOPPING */}
                        <div>
                            <h1>
                                Online Shopping
                            </h1>
                            <div className="flex flex-col gap-1 text-blue-600 mt-2">
                                {shoppingLinks.map((shoppingLink, index) => (
                                    <div key={index}>
                                        <Link to={shoppingLink.path}>
                                            {shoppingLink.name}
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* LINKS */}
                        <div>
                            <h1>
                                Links
                            </h1>
                            <div className="flex flex-col gap-1 text-blue-600 mt-2">
                                <Link to={"/signup"}>
                                    Signup
                                </Link>
                                <Link to={"/login"}>
                                    Login
                                </Link>
                            </div>
                        </div>

                        {/* BRANDS */}
                        <div className="xl:w-[500px]">
                            <h1>
                                Brands
                            </h1>
                            <div className="mt-2 flex flex-col gap-1">
                                {brands.map((brandName, index) => (
                                    <div
                                        key={index}
                                        className="text-blue-600 font-medium"
                                    >
                                        <p>
                                            {brandName.name}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* ENQUIRY */}
                        <div>
                            <h1>
                                Enquiry
                            </h1>
                            <p className="text-blue-600 font-medium mt-2">
                                Support Service (24x7)
                            </p>
                        </div>
                    </div>

                    <p className="border-t-2 border-gray-300/80 my-5" />

                    {/* COPYRIGHT */}
                    <p className="text-sm font-medium text-center pb-5">
                        Copyright &#169; 2026 CodeWithRagu. All Rights Reserved.
                    </p>
                </div>
            </section>
        </footer>
    );
}

export default Footer;