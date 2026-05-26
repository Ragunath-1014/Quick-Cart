import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { AuthContext } from "../../context/AuthContext";

import api from "../../api/axios";
import Loader from "../../shared/Loader";
import NotFound from "../components/NotFound";
import emptyCart from "../../assets/images/emptyCart.png";
import noUser from "../../assets/images/noUser.png";
import Address from "../components/Address";

function Cart() {

  const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID;

  const navigate = useNavigate();

  const { setUser, user } = useContext(AuthContext);

  const [cartDetails, setCartDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [quantityModal, setQuantityModal] = useState(null);
  const [selectedQty, setSelectedQty] = useState(null);
  const [removeLoading, setRemoveLoading] = useState(false);
  const [addressModal, setAddressModal] = useState(false);
  const [addressDetails, setAddressDetails] = useState(null);
  const [editAddress, setEditAddress] = useState(null);

  const deliveryFee = 40;

  const quantity = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  useEffect(() => {
    if (!user) return;

    const fetchCartDetails = async () => {
      try {
        const [cartRes, addressRes] = await Promise.all([
          api.get("/cart"),
          api.get("/address")
        ]);
        setCartDetails(cartRes.data);
        setAddressDetails(addressRes.data);
      }
      catch (err) {
        console.log(err);
      }
    }

    fetchCartDetails();
  }, [user]);

  useEffect(() => {
    if (addressModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [addressModal]);

  const handleUpdateCart = async (productId, size) => {
    try {
      setLoading(true)
      await api.put("/cart/update", { productId, size, quantity: selectedQty });

      setCartDetails((prev) => (
        prev.map((item) => (
          item.product._id === productId && item.size === size
            ? { ...item, quantity: selectedQty }
            : item
        ))
      ));

      setQuantityModal(null);
      setSelectedQty(null);

      toast.dismiss();
      toast.success("Item updated");
    }
    catch (err) {
      console.log(err);
      toast.dismiss();
      toast.error("Something went wrong");
    }
    finally {
      setLoading(false);
    }
  }

  const handleRemoveCart = async (productId, size) => {
    try {
      setLoading(true);

      await api.delete("/cart/remove", {
        data: { productId, size }
      });

      setCartDetails((prev) => (
        prev.filter((item) => (
          !(item.product._id === productId && item.size === size)
        ))
      ));

      setUser((prev) => ({
        ...prev,
        cart: prev.cart.filter((item) => (
          !(item.product.toString() === productId && item.size === size)
        ))
      }));

      toast.dismiss();
      toast.success("Item removed from Cart");
    }
    catch (err) {
      console.log(err);
      toast.dismiss();
      toast.error("Something went wrong");
    }
    finally {
      setLoading(false);
    }
  }

  const handlePlaceOrder = async () => {
    if (addressDetails.length === 0) {
      toast.dismiss();
      toast.error("Kindly add your address");
      return setAddressModal(true);
    }

    try {
      setLoading(true);
      await api.get("/orders/stockValidate");
      const { data: order } = await api.post("/orders/create", { amount: totalAmount + deliveryFee });

      const options = {
        key: RAZORPAY_KEY,
        amount: order.amount,
        currency: order.currency,
        name: "Quick Cart",
        description: "Order payment",
        order_id: order.id,

        timeout: 300,

        theme: {
          color: "#f43f5e"
        },

        modal: {
          ondismiss: async () => {
            toast.dismiss();
            toast.error("Payment cancelled");
          }
        },

        handler: async (response) => {

          toast.dismiss();
          toast.success("You'll be redirected shortly");

          await api.post("/orders/verify-payment", {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            shippingAddress: addressDetails[0],
            totalAmount: totalAmount + deliveryFee
          });

          setCartDetails([]);

          setUser((prev) => ({
            ...prev,
            cart: []
          }));

          toast.dismiss();
          toast.success("Order placed successfully");
          navigate("/myOrders");
        }
      }

      const razor = new window.Razorpay(options);
      razor.open();
    }
    catch (err) {
      console.log(err);
      toast.dismiss();
      toast.error(err.response?.data?.message || "Something went wrong");
    }
    finally {
      setLoading(false);
    }
  }

  if (!user) {
    return (
      <NotFound
        image={noUser}
        alt={"no-user"}
        title={"Hey there!"}
        subTitle={"Kindly log in to view your cart and start shopping."}
        path={"/login"}
        pathName={"Login"}
      />
    );
  }

  if (!cartDetails || !addressDetails || loading) {
    return <Loader loadingMessage={"Loading"} />
  }

  const totalAmount = cartDetails.reduce((acc, item) => {
    return acc + item.product.price * item.quantity;
  }, 0);

  if (cartDetails.length === 0) {
    return (
      <NotFound
        image={emptyCart}
        alt={"empty-cart"}
        title={`Hey, it feels so light ${user.name}!`}
        subTitle={"There is nothing in your Cart. Let's add some items."}
        path={"/"}
        pathName={"Continue Shopping"}
      />
    );
  }

  return (
    <section className="px-5 mt-5 flex justify-center">

      {/* WRAPPER */}
      <div className="w-full max-w-5xl grid grid-cols-1 md:flex justify-between gap-5">

        {/* LEFT SIDE */}
        <div className="w-full flex flex-col gap-3">

          {/* ADDRESS DETAILS */}
          {addressDetails.map((addressDetail) => (
            <div
              className="bg-rose-50 h-fit 
              p-5 rounded-md 
              flex flex-col 
              lg:flex-row lg:justify-between
              lg:items-center
              gap-3 border
              border-rose-100"
              key={addressDetail._id}
            >
              <div className="text-xs sm:text-base">
                <h1>
                  Deliver to : <span className="font-semibold">{addressDetail.fullName}</span>
                </h1>
                <p>
                  {addressDetail.addressLine}
                </p>
                <p>
                  {addressDetail.city}, {addressDetail.state} - {addressDetail.pincode}
                </p>
                <p>
                  Phone : {addressDetail.phone}
                </p>
              </div>

              <button
                className="text-xs sm:text-sm 
                border border-rose-500 
                font-medium w-fit 
                py-2 px-5 
                rounded-md text-rose-500"
                onClick={() => {
                  setEditAddress(addressDetail);
                  setAddressModal(true);
                }}
              >
                Edit Address
              </button>
            </div>
          ))}

          {/* CART DETAILS */}
          <div className="flex-1">
            {cartDetails.map((cartDetail) => {
              const price = cartDetail.product.price * cartDetail.quantity;
              return (
                <div
                  key={cartDetail._id}
                  className="relative border rounded-md p-2 mb-3 flex gap-3"
                >

                  {/* CART DETAIL - LEFT SIDE (PRODUCT IMAGE) */}
                  <div className="max-w-28 overflow-hidden rounded-md">
                    <img
                      src={cartDetail.product.images[0]}
                      alt={cartDetail.product.brand}
                      className="w-full h-full object-cover object-top cursor-pointer"
                      onClick={() => navigate(`/product/${cartDetail.product._id}`)}
                    />
                  </div>

                  {/* CART DETAIL - RIGHT SIDE (PRODUCT DETAILS) */}
                  <div className="mt-1 w-40 sm:w-fit">
                    <h3 className="line-clamp-1 text-sm md:text-base font-medium">
                      {cartDetail.product.brand}
                    </h3>
                    <p className="line-clamp-1 text-xs md:text-sm text-gray-500">
                      {cartDetail.product.name}
                    </p>
                    <p className="text-xs md:text-sm font-medium mt-1">
                      Size : {cartDetail.size}
                    </p>

                    {/* QUANTITY UPDATE BUTTON */}
                    <div
                      className="inline-flex justify-center 
                      gap-1 bg-gray-200 
                      px-2 py-1 
                      rounded cursor-pointer
                      mt-2
                      "
                      onClick={() => setQuantityModal(cartDetail._id)}
                    >
                      <button className="text-xs md:text-sm font-medium">
                        Qty: {cartDetail.quantity}
                      </button>

                      <i className="ri-arrow-down-s-fill text-sm" />
                    </div>

                    <p className="text-sm md:text-base font-semibold mt-4">
                      ₹{price.toLocaleString()}
                    </p>
                  </div>

                  {/* QUANTITY MODAL TO UPDATE THE QUANTITY */}
                  {quantityModal === cartDetail._id &&
                    <div
                      className="fixed inset-0 
                      flex justify-center 
                      items-end sm:items-center
                      z-50 bg-black/40"
                    >
                      <div
                        className="relative w-full 
                        sm:w-[450px] h-auto 
                        py-6 rounded-t-2xl 
                        sm:rounded-2xl bg-white 
                        flex flex-col 
                        px-8"
                      >
                        <h1 className="font-semibold text-lg">
                          Select Quantity
                        </h1>

                        <hr className="border-gray-300 mt-4 w-[100%]" />

                        <div className="grid grid-cols-5 gap-5 mt-6">
                          {quantity.map((value) => (
                            <button
                              key={value}
                              onClick={() => setSelectedQty(value)}
                              className={`
                              border  
                              w-14 h-12 
                              rounded-lg font-medium 
                              transition-all duration-150
                              ${(selectedQty ?? cartDetail.quantity) === value
                                  ? "bg-black text-white border-black"
                                  : "border-gray-300"
                                }
                              `}
                            >
                              {value}
                            </button>
                          ))}
                        </div>

                        <button
                          className="mt-5 bg-rose-500 
                          rounded-md text-white 
                          font-semibold w-full 
                          py-3 disabled:bg-rose-300
                          text-sm
                          "
                          disabled={(selectedQty ?? cartDetail.quantity) === cartDetail.quantity}
                          onClick={() => handleUpdateCart(cartDetail.product._id, cartDetail.size)}
                        >
                          Done
                        </button>

                        <i
                          className="ri-close-line absolute top-3 right-3 text-xl cursor-pointer"
                          onClick={() => setQuantityModal(false)}
                        />
                      </div>
                    </div>
                  }

                  {/* REMOVE ITEM FROM CART - CLOSE ICON */}
                  <i
                    className="ri-close-line absolute top-1 right-1 text-xl cursor-pointer"
                    onClick={() => handleRemoveCart(cartDetail.product._id, cartDetail.size)}
                  />
                </div>
              )
            })}
          </div>
        </div>

        {/* CART - RIGHT SIDE */}
        <div
          className="w-full md:w-[500px]
          lg:w-[600px] border 
          rounded-md p-4 
          h-fit md:sticky 
          md:top-[100px]"
        >
          <h2 className="font-semibold text-sm sm:text-base">
            Price details ({cartDetails.length} {cartDetails.length === 1 ? "item" : "items"})
          </h2>

          <div className="flex justify-between text-xs sm:text-sm font-medium">
            <p>
              Total MRP
            </p>
            <p>
              ₹{totalAmount.toLocaleString()}
            </p>
          </div>

          <div className="flex justify-between text-xs sm:text-sm font-medium">
            <p>
              Delivery Fee
            </p>
            <p>
              ₹{deliveryFee}
            </p>
          </div>

          <hr className="my-3" />

          <div className="flex justify-between text-sm sm:text-base font-semibold">
            <p>
              Total Amount
            </p>
            <p>
              ₹{(totalAmount + deliveryFee).toLocaleString()}
            </p>
          </div>

          <button
            className="mt-5 bg-rose-500 
            text-white w-full 
            py-3 rounded-md
            font-medium text-sm"
            onClick={handlePlaceOrder}
          >
            Place Order
          </button>
        </div>
      </div>

      {/* ADDRESS MANAGEMENT */}
      {addressModal &&
        <Address
          addressModal={addressModal}
          setAddressModal={setAddressModal}
          editAddress={editAddress}
          setAddressDetails={setAddressDetails}
        />
      }
    </section>
  );
}

export default Cart;