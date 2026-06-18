import { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

import { AuthContext } from "../../context/AuthContext";

import api from "../../api/axios";
import Loader from "../../shared/Loader";
import NotFound from "../components/NotFound";
import noUser from "../../assets/images/noUser.png";
import emptyWishlist from "../../assets/images/emptyWishlist.png";

function Wishlist() {

  const navigate = useNavigate();

  const { user, setUser } = useContext(AuthContext);

  const [wishlistDetails, setWishlistDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sizeModal, setSizeModal] = useState(null);
  const [wishlistItemSize, setWishlistItemSize] = useState(null);
  const [moveToCartLoading, setMoveToCartLoading] = useState(false);

  const sizes = ["S", "M", "L", "XL"];

  useEffect(() => {
    const fetchWishlistDetails = async () => {
      try {
        setLoading(true);
        const res = await api.get("/wishlist");
        setWishlistDetails(res.data);
      }
      catch (err) {
        console.log(err);
      }
      finally {
        setLoading(false);
      }
    }

    fetchWishlistDetails();
  }, [user]);

  useEffect(() => {
    if (sizeModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [sizeModal]);

  const handleRemoveWishlist = async (productId) => {
    try {
      const res = await api.delete("/wishlist/remove", { data: { productId } });

      setUser((prev) => ({
        ...prev,
        wishlist: res.data.wishlist
      }));

      toast.dismiss();
      toast.success(res.data.message);
    }
    catch (err) {
      console.log(err);

      toast.dismiss();
      toast.error("Something went wrong");
    }
  }

  const handleMoveToCart = async (productId) => {
    try {
      setMoveToCartLoading(true);
      const cartRes = await api.post("/cart", { productId, size: wishlistItemSize });
      const wishlistRes = await api.delete("/wishlist/remove", { data: { productId } });

      setUser((prev) => ({
        ...prev,
        cart: cartRes.data.cart
      }));

      setSizeModal(null);
      setWishlistItemSize(null);

      toast.dismiss();
      toast.success("Item moved to cart")
    }
    catch (err) {
      console.log(err);
      toast.error("Something went wrong");
    }
    finally {
      setMoveToCartLoading(false);
    }
  }

  if (!user) {
    return (
      <NotFound
        image={noUser}
        alt={"no-user"}
        title={"Hey there!"}
        subTitle={"Kindly log in to view your wishlist and start shopping."}
        path={"/login"}
        pathName={"Login"}
      />
    );
  }

  if (loading || !wishlistDetails) {
    return <Loader loadingMessage={"Loading"} />
  }

  if (wishlistDetails.length === 0) {
    return (
      <NotFound
        image={emptyWishlist}
        alt={"empty-wishlist"}
        title={`Your Wishlist is empty ${user.name}!`}
        subTitle={"Add items that you like to your wishlist."}
        path={"/"}
        pathName={"Continue Shopping"}
      />
    )
  }

  return (
    <section>

      {/* WISHLIST TITLE */}
      <div className="flex flex-col items-center mt-5">
        <h1 className="text-2xl font-bold">
          My Wishlist
        </h1>

        <p className="text-gray-500 text-xs sm:text-sm font-medium">
          All your favorites, right here
        </p>
      </div>

      {/* WISHLIST PRODUCTS */}
      <div className="p-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 gap-y-8">

        {wishlistDetails.map((wishlistDetail) => {
          const formattedPrice = wishlistDetail.product.price.toLocaleString();
          return (
            <div
              className="rounded-2xl cursor-pointer 
              transition-all duration-500 
              hover:shadow-md relative
              "
              key={wishlistDetail.product._id}
            >
              <div className="w-full aspect-[4/5] overflow-hidden">
                <img
                  src={wishlistDetail.product.images[0]}
                  alt={wishlistDetail.product.name}
                  className="w-full h-full object-cover object-top rounded-t-2xl"
                  onClick={() => navigate(`/product/${wishlistDetail.product._id}`)}
                />
              </div>

              <div className="border border-gray-200 rounded-b-2xl">
                <div className="p-4">
                <p className="line-clamp-1 text font-medium">
                    {wishlistDetail.product.brand}
                  </p>
                  <p className="line-clamp-1 text-sm text-gray-500">
                    {wishlistDetail.product.name}
                  </p>
                  <p className="text-sm md:text-base font-semibold mt-1">
                    ₹{formattedPrice}
                  </p>
                </div>

                <hr className="border-gray-200 my-1" />

                <div className="flex justify-center">
                  <button
                    className="p-3 sm:p-4 text-sm sm:text-base font-semibold text-rose-500"
                    onClick={() => setSizeModal(wishlistDetail.product._id)}
                  >
                    MOVE TO CART
                  </button>
                </div>
              </div>

              {sizeModal === wishlistDetail.product._id &&
                <div
                  className="fixed inset-0 
                  flex justify-center 
                  items-end sm:items-center
                  z-50 bg-black/60"
                >
                  <div
                    className="w-full sm:w-[450px]
                    rounded-t-2xl sm:rounded-2xl
                    bg-white h-auto
                    px-8 py-5
                    flex flex-col  
                    relative"
                  >

                    {/* SIZE MODAL TOP */}
                    <div className="flex items-start gap-4 mt-2">
                      <img
                        src={wishlistDetail.product.images[0]}
                        alt={wishlistDetail.product.brand}
                        className="w-24 object-cover object-top rounded-md"
                      />
                      <div>
                        <p className="line-clamp-2 text-sm text-gray-500">
                          {wishlistDetail.product.name}
                        </p>
                        <p className="text-sm md:text-base font-semibold mt-1">
                          ₹{formattedPrice}
                        </p>
                      </div>
                    </div>

                    {/* DIVIDER */}
                    <hr className="border-gray-300 my-5 w-[100%]" />

                    <h1 className="mb-2 text-lg font-semibold">
                      Select Size
                    </h1>

                    <div className="flex items-center gap-5">
                      {sizes.map((size, index) => (
                        <button
                          key={index}
                          className={`
                          border w-14 h-12 rounded-lg font-medium transition-all duration-150
                          ${wishlistItemSize === size
                              ? "bg-black border-black text-white"
                              : "border-gray-300"
                            }
                          `}
                          onClick={() => setWishlistItemSize((prev) => (
                            prev === size ? null : size
                          ))}
                        >
                          {size}
                        </button>
                      ))}
                    </div>

                    <button
                      className={`
                      mt-5 bg-rose-500 
                      rounded-md text-white 
                      font-semibold w-full 
                      py-3 disabled:bg-rose-300
                      text-sm
                      ${moveToCartLoading ? "opacity-50" : ""}
                      `}
                      disabled={(!wishlistItemSize)}
                      onClick={() => handleMoveToCart(wishlistDetail.product._id)}
                    >
                      {moveToCartLoading ? (
                        <div className="flex justify-center items-center gap-3">
                          <span>
                            Moving
                          </span>
                          <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        </div>
                      ) : (
                        <h1>
                          Move
                        </h1>
                      )}
                    </button>

                    <i
                      className="ri-close-line absolute top-2 right-3 text-lg"
                      onClick={() => setSizeModal(null)}
                    />
                  </div>
                </div>
              }

              <div
                className="absolute top-2 
                right-2 w-6 
                cursor-pointer bg-white/80 
                rounded-full inline-flex 
                justify-center items-center
                "
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveWishlist(wishlistDetail.product._id);
                }}
              >
                <i className="ri-close-line" />
              </div>
            </div>
          )
        })}
      </div>
    </section >
  );
}

export default Wishlist;