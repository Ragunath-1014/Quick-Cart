import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { AuthContext } from "../../context/AuthContext";

import api from "../../api/axios";
import Loader from "../../shared/Loader";
import NotFound from "../components/NotFound";
import noUser from "../../assets/images/noUser.png";
import noOrders from "../../assets/images/noOrders.png";

function MyOrders() {

    const navigate = useNavigate();

    const { user } = useContext(AuthContext);

    const [myOrders, setMyOrders] = useState(null);
    const [loading, setLoading] = useState(false);
    const [addReview, setAddReview] = useState(null);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");

    const stars = [1, 2, 3, 4, 5];

    const getRatingMessage = (rating) => {
        switch (rating) {
            case 5:
                return "Excellent";
            case 4:
                return "Very good";
            case 3:
                return "Good";
            case 2:
                return "Poor";
            case 1:
                return "Very poor";
            default:
                return "";
        }
    };

    const getRatingMessageColor = (rating) => {
        switch (rating) {
            case 5:
                return "text-green-700";
            case 4:
                return "text-green-700";
            case 3:
                return "text-green-700";
            case 2:
                return "text-yellow-500";
            case 1:
                return "text-red-500";
            default:
                return "";
        }
    }

    useEffect(() => {
        const fetchMyOrders = async () => {
            try {
                setLoading(true);

                const res = await api.get("/orders/myOrders");
                setMyOrders(res.data);
            }
            catch (err) {
                console.log(err);
            }
            finally {
                setLoading(false);
            }
        };

        fetchMyOrders();
    }, []);

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

    if (!myOrders || loading) {
        return <Loader loadingMessage={"Loading"} />
    }

    if (myOrders.length === 0) {
        return (
            <NotFound
                image={noOrders}
                alt={"no-orders"}
                title={`Your Orders list is empty ${user.name}!`}
                subTitle={"Looks like you haven't placed any orders yet. Start shopping and place your first order."}
                path={"/"}
                pathName={"Continue Shopping"}
            />
        );
    }

    const handleSubmitReview = async (e, productId) => {
        e.preventDefault();

        try {
            setLoading(true);

            const res = await api.post("/review/addReview", { rating, comment, productId });

            setAddReview(null);
            setRating(0);
            setComment("");

            toast.dismiss();
            toast.success(res.data?.message);
        }
        catch (err) {
            setAddReview(null);
            setRating(0);
            setComment("");

            toast.dismiss();
            toast.error(err.response?.data?.message || "Something went wrong");
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <section className="mx-5 flex justify-center my-5">

            {/* WRAPPER */}
            <div className="w-full max-w-4xl">

                {/* MY ORDERS TITLE */}
                <div className="flex flex-col items-center mb-5">
                    <h1 className="text-2xl font-bold">
                        My Orders
                    </h1>

                    <p className="text-gray-500 text-xs sm:text-sm font-medium">
                        Stay updated with your latest purchases
                    </p>
                </div>

                {/* ORDER DETAILS */}
                {myOrders.map((myOrder) => {
                    const formattedDate = new Date(myOrder.updatedAt)
                        .toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric"
                        });

                    return (
                        <div
                            key={myOrder._id}
                            className="mt-3"
                        >
                            {myOrder.items.map((item) => (
                                <div
                                    key={item._id}
                                    className="border rounded-md p-2 mb-3 flex gap-3 md:gap-5"
                                >

                                    {/* LEFT SIDE */}
                                    <div className="max-w-28 md:max-w-[130px] overflow-hidden rounded-md">
                                        <img
                                            src={item.product.images[0]}
                                            alt={item.product.name}
                                            className="w-full h-full object-cover object-top cursor-pointer"
                                            onClick={() => navigate(`/product/${item.product._id}`)}
                                        />
                                    </div>

                                    {/* RIGHT SIDE */}
                                    <div className="flex flex-col justify-between my-1">
                                        <div className="flex flex-col gap-1 items-start">
                                            <h3 className="text-xs md:text-sm font-medium">
                                                {item.product.brand}
                                            </h3>

                                            <span className="line-clamp-1 text-xs md:text-sm font-medium text-gray-500">
                                                {item.product.name}
                                            </span>

                                            <div className="flex gap-3 items-center text-xs md:text-sm font-medium">
                                                <span className="hidden sm:block">
                                                    Color : {item.product.attributes.Color}
                                                </span>
                                                <span>
                                                    Size : {item.size}
                                                </span>
                                                <span>
                                                    Qty : {item.quantity}
                                                </span>
                                            </div>

                                            <span className="text-xs md:text-sm font-medium">
                                                ₹{item.product.price.toLocaleString()}
                                            </span>

                                            <div className="text-xs sm:text-sm font-medium flex gap-1 items-center">
                                                <i className={`
                                                    ri-circle-fill text-[8px]
                                                    ${myOrder.orderStatus === "Placed"
                                                        ? "text-yellow-500"
                                                        : myOrder.orderStatus === "Shipped"
                                                            ? "text-blue-500"
                                                            : "text-green-700"
                                                    }`}
                                                />
                                                <p>
                                                    Order {myOrder.orderStatus} on {formattedDate}
                                                </p>
                                            </div>
                                        </div>

                                        <div>
                                            {myOrder.orderStatus === "Delivered" &&
                                                <div
                                                    className="flex items-center 
                                                    justify-center gap-1 bg-[#14958F] 
                                                    rounded-md text-white 
                                                    cursor-pointer
                                                    text-xs md:text-sm 
                                                    font-medium w-fit p-2"
                                                    onClick={() => setAddReview(item.product._id)}
                                                >
                                                    <i className="ri-star-fill" />
                                                    <p>
                                                        Rate & Review Product
                                                    </p>
                                                </div>
                                            }
                                        </div>
                                    </div>

                                    {addReview === item.product._id &&
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

                                                {/* RATING */}
                                                <div>
                                                    <h1 className="font-semibold text-lg">
                                                        Rate this product
                                                    </h1>

                                                    <div className="flex items-center gap-5">
                                                        <div className="flex items-center gap-3">
                                                            {stars.map((star) => (
                                                                <button
                                                                    key={star}
                                                                    className={`
                                                                        text-2xl
                                                                        ${star <= rating ? "text-yellow-500" : "text-gray-300"}
                                                                    `}
                                                                    onClick={() => setRating((prev) => (
                                                                        prev === star ? 0 : star
                                                                    ))}
                                                                >
                                                                    ★
                                                                </button>
                                                            ))}
                                                        </div>
                                                        <div
                                                            className={`
                                                                font-semibold
                                                                ${getRatingMessageColor(rating)}
                                                                `}
                                                        >
                                                            {getRatingMessage(rating)}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* REVIEW */}
                                                <div className="mt-6">
                                                    <h1 className="font-semibold text-lg">
                                                        Review this product
                                                    </h1>

                                                    <form
                                                        className="mt-2"
                                                        onSubmit={(e) => handleSubmitReview(e, item.product._id)}
                                                    >
                                                        <textarea
                                                            value={comment}
                                                            onChange={(e) => setComment(e.target.value)}
                                                            className="w-full h-32 
                                                            border border-gray-300 
                                                            outline-none sm:text-sm
                                                            p-2 rounded-md
                                                            "
                                                            placeholder="Description"
                                                            required
                                                        />

                                                        {/* BUTTONS */}
                                                        <div className="flex justify-between gap-5 mt-6">
                                                            <button
                                                                className="text-sm font-medium 
                                                                border border-gray-300
                                                                w-full py-3
                                                                rounded-md
                                                                "
                                                                type="button"
                                                                onClick={() => setAddReview(null)}
                                                            >
                                                                Cancel
                                                            </button>

                                                            <button
                                                                className="text-sm font-medium
                                                                border border-yellow-500
                                                                bg-yellow-500 text-white
                                                                w-full py-3
                                                                rounded-md disabled:bg-opacity-50
                                                                disabled:border-opacity-5
                                                                transition-all duration-300
                                                                "
                                                                disabled={rating === 0}
                                                                type="submit"
                                                            >
                                                                Submit
                                                            </button>
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                </div>
                            ))}
                        </div>
                    )
                })}
            </div>
        </section >
    );
}

export default MyOrders;