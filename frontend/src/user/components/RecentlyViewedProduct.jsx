import { useEffect, useState } from "react";

import Loader from "../../shared/Loader";
import ProductCard from "./ProductCard";

function RecentlyViewedProduct() {

    const [recentProducts, setRecentProducts] = useState(null);
    const [hideRecentScrollMessage, setHideRecentScrollMessage] = useState(false);

    useEffect(() => {
        const recent = JSON.parse(localStorage.getItem("recentProducts"));
        setRecentProducts(recent);
    }, []);

    if (!recentProducts) {
        return <Loader loadingMessage={"Loading"} />
    }

    return (
        <div className="max-w-7xl mx-auto w-full px-5 flex flex-col">
            <h1 className="text-lg font-semibold md:mt-5">
                Recently Viewed
            </h1>

            <div
                className="flex gap-5 overflow-x-auto mt-4"
                onScroll={(e) => {
                    if (e.target.scrollLeft > 20) {
                        setHideRecentScrollMessage(true);
                    }
                }}
            >
                {recentProducts.map((recentProduct) => (
                    <div
                        key={recentProduct._id}
                        className="w-48 sm:w-56 md:w-64 flex-shrink-0"
                    >
                        <ProductCard product={recentProduct} />
                    </div>
                ))}
            </div>

            {recentProducts.length >= 2 &&
                <div
                    className={`
                    flex items-center 
                    justify-center gap-2 
                    mt-5 transition-all
                    duration-500 ease-in-out
                    sm:hidden
                    ${hideRecentScrollMessage
                            ? "opacity-0 translate-y-2 pointer-events-none"
                            : "opacity-100 translate-y-0"
                        }
                    `}
                >
                    <p className="text-xs font-medium">
                        Scroll to view recent products
                    </p>
                    <i className="ri-arrow-right-long-line font-extralight animate-scroll-arrow" />
                </div>
            }
        </div>
    )
}

export default RecentlyViewedProduct;