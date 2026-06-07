import { useState, useEffect } from "react";

import api from "../../api/axios";
import Loader from "../../shared/Loader";
import Slider from "../components/Slider";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";

function Home() {

  const [newProducts, setNewProducts] = useState(null);
  const [featuredProducts, setFeaturedProducts] = useState(null);
  const [hideNewScrollMessage, setHideNewScrollMessage] = useState(false);
  const [hideFeaturedScrollMessage, setHideFeaturedScrollMessage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Loading");

  useEffect(() => {
    const hasVisited = sessionStorage.getItem("quickcart-visited");

    if (!hasVisited) {
      setLoadingMessage(
        "Backend hosted on Render free tier. Initial load may take a few seconds."
      );

      sessionStorage.setItem("quickcart-visited", "true");
    }
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const [newProductsRes, featuredProductsRes] = await Promise.all([
          api.get("/product/newProducts"),
          api.get("/product/featuredProducts")
        ]);

        setNewProducts(newProductsRes.data);
        setFeaturedProducts(featuredProductsRes.data);
      }
      catch (err) {
        console.log(err);
      }
      finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  if (loading || !newProducts || !featuredProducts) {
    return <Loader loadingMessage={loadingMessage} />
  }

  return (
    <section>

      {/* SLIDER */}
      <Slider />

      {/* NEW ARRIVALS */}
      <div className="w-full flex flex-col mt-10 px-5">

        {/* HEADER */}
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-bold">
            New Arrivals
          </h1>

          <p className="text-gray-500 text-xs sm:text-sm font-medium">
            Fresh styles just dropped - explore the latest trends
          </p>
        </div>

        {/* NEW PRODUCTS */}
        <div
          className="flex gap-5 overflow-x-auto mt-5"
          onScroll={(e) => {
            if (e.target.scrollLeft > 20) {
              setHideNewScrollMessage(true);
            }
          }}
        >
          {newProducts.map((newProduct) => (
            <div
              className="relative"
              key={newProduct._id}
            >
              <div className="w-48 sm:w-56 md:w-64 flex-shrink-0">
                <ProductCard product={newProduct} />
              </div>

              <div className="absolute top-4 bg-red-600 px-2 py-1 rounded-r-md">
                <p className="text-xs font-semibold text-white">
                  New
                </p>
              </div>
            </div>
          ))}
        </div>

        <div
          className={`
            flex items-center 
            justify-center gap-2 
            mt-5 transition-all
            duration-500 ease-out
            ${hideNewScrollMessage
              ? "opacity-0 translate-y-2 pointer-events-none"
              : "opacity-100 translate-y-0"
            }
          `}
        >
          <p className="text-xs font-medium">
            Scroll to view new products
          </p>
          <i className="ri-arrow-right-long-line font-extralight animate-scroll-arrow" />
        </div>
      </div>

      {/* FEATURED PRODUCTS */}
      <div className="w-full flex flex-col mt-8 px-5">

        {/* HEADER */}
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-bold">
            Featured Products
          </h1>

          <p className="text-gray-500 text-xs sm:text-sm font-medium">
            Handpicked favorites you'll love the most
          </p>
        </div>

        <div
          className="flex gap-5 overflow-x-auto mt-5"
          onScroll={(e) => {
            if (e.target.scrollLeft > 20) {
              setHideFeaturedScrollMessage(true);
            }
          }}
        >
          {featuredProducts.map((featuredProduct) => (
            <div
              key={featuredProduct._id}
              className="w-48 sm:w-56 md:w-64 flex-shrink-0"
            >
              <ProductCard product={featuredProduct} />
            </div>
          ))}
        </div>

        <div
          className={`
            flex items-center 
            justify-center gap-2 
            mt-5 transition-all
            duration-500 ease-in-out
            ${hideFeaturedScrollMessage
              ? "opacity-0 translate-y-2 pointer-events-none"
              : "opacity-100 translate-y-0"
            }
          `}
        >
          <p className="text-xs font-medium">
            Scroll to view featured products
          </p>
          <i className="ri-arrow-right-long-line font-extralight animate-scroll-arrow" />
        </div>
      </div>

      <Footer />
    </section>
  );
}

export default Home;