import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { AuthContext } from "../../context/AuthContext";

import api from "../../api/axios";
import Loader from "../../shared/Loader";
import RecentlyViewedProduct from "../components/RecentlyViewedProduct";
import Footer from "../components/Footer";

function ProductDetails() {

    const { productId } = useParams();

    const { user, setUser } = useContext(AuthContext);

    const [productById, setProductById] = useState(null);
    const [getReviews, setGetReviews] = useState(null);
    const [activeImage, setActiveImage] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [showReview, setShowReview] = useState(false);
    const [showProductHiglights, setShowProductHighlights] = useState(true);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchProductsById = async () => {
            try {
                setLoading(true);
                const [productByIdRes, reviewRes] = await Promise.all([
                    api.get(`/product/${productId}`),
                    api.get(`/review/${productId}`)
                ]);
                setProductById(productByIdRes.data.product);
                setActiveImage(productByIdRes.data.product.images[0]);
                setGetReviews(reviewRes.data);

                const viewedProduct = productByIdRes.data.product;

                const recent = JSON.parse(localStorage.getItem("recentProducts")) || [];

                // REMOVE DUPLICATE PRODUCT IF ALREADY EXISTS
                const filtered = recent.filter((item) => (
                    item._id !== viewedProduct._id
                ));

                // ADD LATEST PRODUCT AT BEGINNING
                filtered.unshift(viewedProduct);

                const limitedProducts = filtered.slice(0, 8);

                localStorage.setItem("recentProducts", JSON.stringify(limitedProducts));
            }
            catch (err) {
                console.log(err);
            }
            finally {
                setLoading(false);
            }
        }

        fetchProductsById();
    }, [productId]);

    useEffect(() => {
        if (showReview) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        return () => {
            document.body.style.overflow = "auto";
        };
    }, [showReview]);

    if (loading || !productById || !activeImage || !getReviews) {
        return <Loader loadingMessage={"Loading"} />
    }

    const handleCart = async () => {
        if (!selectedSize) {
            toast.dismiss();
            return toast.error("Select a size to add in Cart");
        }

        if (!user) {
            toast.dismiss();
            return toast.error("Login required for Cart");
        }

        try {
            setLoading(true);
            const res = await api.post("/cart", { productId, size: selectedSize });
            setUser((prev) => ({
                ...prev,
                cart: res.data.cart
            }));

            toast.dismiss();
            toast.success("Item added to Cart");
        }
        catch (err) {
            toast.dismiss();
            toast.error(err.response?.data?.message || "Something went wrong");
        }
        finally {
            setLoading(false);
        }
    }

    const handleWishlist = async () => {
        if (!user) {
            toast.dismiss();
            return toast.error("Login required for Wishlist");
        }

        try {
            setLoading(true);
            const res = await api.post("/wishlist", { productId })
            setUser((prev) => ({
                ...prev,
                wishlist: res.data
            }));

            toast.dismiss();
            toast.success(res.data.message);
        }
        catch (err) {
            toast.dismiss();
            toast.error(err.response?.data?.message || "Something went wrong");
        }
        finally {
            setLoading(false);
        }
    }

    const breakDowns = [5, 4, 3, 2, 1];
    const totalReviews = getReviews.reviews.length;

    const getStarColor = (stars) => {
        switch (stars) {
            case 5:
                return "bg-[#14958F]";
            case 4:
                return "bg-[#14958F]";
            case 3:
                return "bg-[#72BFBC]";
            case 2:
                return "bg-[#FCB301]";
            case 1:
                return "bg-[#F16565]";
            default:
                return "bg-gray-300";
        }
    };

    const ratingCounts = {
        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1: 0
    };

    getReviews.reviews.forEach((review) => {
        ratingCounts[review.rating] += 1;
    });

    const getPercentage = (rating) => {
        if (!totalReviews) return 0;
        return ((ratingCounts[rating] / totalReviews) * 100).toFixed(0);
    };

    return (
        <section>
            <div className="mx-5 my-10 flex flex-col sm:items-center md:flex-row justify-center gap-8 md:gap-12 lg:gap-14 xl:gap-20">

                {/* PRODUCT DETAIL PAGE - LEFT SIDE */}
                <div className="flex flex-col lg:flex-row gap-5">

                    {/* MAIN IMAGE */}
                    <div
                        className="order-1 lg:order-2 
                        w-full max-w-[400px] 
                        md:max-w-[320px] lg:max-w-[450px]
                        aspect-[3/4] overflow-hidden 
                        rounded-lg lg:max-h-[520px]"
                    >
                        <img
                            src={activeImage}
                            alt="image"
                            className="w-full h-full object-cover object-top"
                        />
                    </div>

                    {/* IMAGE THUMBNAIL */}
                    <div
                        className="order-2 lg:order-1 
                        flex lg:flex-col 
                        flex-shrink-0 gap-3 
                        overflow-x-auto md:overflow-y-auto 
                        max-w-[400px] md:max-w-[320px] 
                        lg:max-w-[450px] lg:max-h-[520px]"
                    >
                        {productById.images.map((productImage, index) => (
                            <img
                                src={productImage}
                                alt={`image-${index + 1}`}
                                key={index}
                                onClick={() => setActiveImage(productImage)}
                                onMouseEnter={() => setActiveImage(productImage)}
                                className="w-24 h-28 
                                object-cover object-top 
                                flex-shrink-0 cursor-pointer 
                                rounded-lg"
                            />
                        ))}
                    </div>
                </div>

                {/* PRODUCT DETAIL PAGE - RIGHT SIDE */}
                <div>

                    {/* PRODUCT DETAILS */}
                    <div className="mt-10 md:mt-0">
                        <h2 className="text-lg font-semibold">
                            {productById.brand}
                        </h2>
                        <p className="text-gray-500 font-medium">
                            {productById.name}
                        </p>
                        <h2 className="text-xl font-bold mt-2">
                            ₹{productById.price.toLocaleString()}
                        </h2>
                    </div>

                    {/* SIZES OF THE PRODUCT */}
                    <div className={`${totalReviews > 0 ? "mt-4" : "mt-5"}`}>
                        <h2 className="text-lg font-semibold">
                            Select Size
                        </h2>

                        <div className="flex gap-4 mt-2">
                            {productById.sizes.map((productSize) => (
                                <button
                                    key={productSize._id}
                                    className={`
                                    border h-12 rounded-lg font-medium transition-all duration-150
                                    ${productSize.size.length > 4 ? "w-16" : "w-14"}
                                    ${selectedSize === productSize.size
                                            ? "border-black bg-black text-white font-semibold"
                                            : "bg-white border-gray-300"
                                        }
                                    ${productSize.stock === 0
                                            ? "bg-gray-100 text-gray-300 border-dashed"
                                            : ""
                                        } 
                                    `}
                                    onClick={() => setSelectedSize((prev) => (
                                        prev === productSize.size ? null : productSize.size
                                    ))}
                                    disabled={productSize.stock === 0}
                                >
                                    {productSize.size}
                                </button>
                            ))}
                        </div>
                    </div>

                    {totalReviews > 0 &&
                        <div
                            className="mt-4 bg-green-50 w-fit px-3 py-2 rounded-md cursor-pointer"
                            onClick={() => setShowReview(!showReview)}
                        >
                            <div className="flex items-center gap-1">
                                <span className="font-medium text-sm">
                                    {getReviews.avgRating}
                                </span>
                                <i className="ri-star-fill text-[#14958F] text-xs" />
                                <span className="px-1">
                                    |
                                </span>
                                <span className="text-sm font-medium">
                                    {totalReviews} reviews
                                </span>
                            </div>
                        </div>
                    }

                    {/* PRODUCT REVIEW - OVERLAY */}
                    <div
                        className={`
                        fixed inset-0 
                        bg-black/60 z-40 
                        transition-opacity duration-300 
                        ${showReview ? "opacity-100" : "opacity-0 pointer-events-none"}
                        `}
                        onClick={() => setShowReview(!showReview)}
                    />

                    {/* PRODUCT REVIEWS UI */}
                    <div
                        className={`
                        bg-white top-0 
                        w-full sm:max-w-lg
                        flex flex-col 
                        fixed h-screen
                        transition-all duration-500
                        z-50 sm:rounded-l-xl
                        px-5
                        ${showReview ? "right-0" : "-right-full"}
                        `}
                    >
                        <div className="flex items-center justify-between h-20">
                            <h1 className="text-lg font-semibold">
                                Ratings
                            </h1>
                            <i
                                className="ri-close-line text-2xl font-medium cursor-pointer"
                                onClick={() => setShowReview(!showReview)}
                            />
                        </div>

                        {/* AVG REVIEW AND RATING BREAKDOWN */}
                        <div className="flex items-center gap-5 sm:gap-8 mt-5">

                            {/* AVERAGE REVIEWS - BY NUMBER UI */}
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center gap-3">
                                    <h1 className="text-4xl sm:text-5xl font-medium">
                                        {getReviews.avgRating}
                                    </h1>
                                    <i className="ri-star-fill text-[#14958F] text-2xl sm:text-3xl" />
                                </div>
                                <h3 className="text-sm text-gray-500">
                                    {totalReviews} Verified {totalReviews > 1 ? "buyers" : "buyer"}
                                </h3>
                            </div>

                            {/* DIVIDER */}
                            <div className="w-[1px] h-28 bg-gray-300" />

                            {/* REVIEWS BREAKDOWN */}
                            <div className="flex-1">
                                {breakDowns.map((value) => (
                                    <div key={value}>
                                        <span className="flex items-center gap-2 w-full">

                                            <span className="w-4 text-gray-500 text-sm">
                                                {value}
                                            </span>

                                            <i className="ri-star-fill text-gray-300 text-xs" />

                                            <div className="flex-1 bg-gray-200 h-[6px] rounded">
                                                <div
                                                    className={`${getStarColor(value)} h-[6px] rounded`}
                                                    style={{
                                                        width: `${(ratingCounts[value] / totalReviews) * 100 || 0}%`
                                                    }}
                                                />
                                            </div>

                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <h1 className="text-lg font-semibold mt-8">
                            Customer Reviews
                        </h1>

                        {/* REVIEWS BY USER - UI */}
                        <div className="mt-2 overflow-y-auto h-full">
                            {getReviews.reviews.map((review) => {
                                const formattedDate = new Date(review.createdAt)
                                    .toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric"
                                    });
                                return (
                                    <div
                                        key={review._id}
                                        className="flex flex-col 
                                        gap-2 bg-green-50 
                                        p-5 my-5
                                        rounded-xl"
                                    >
                                        <div
                                            className={`
                                            ${getStarColor(review.rating)} 
                                            text-white font-medium 
                                            px-1 rounded-sm
                                            flex items-center
                                            justify-center gap-1
                                            w-10
                                            `}
                                        >
                                            <span className="text-sm">
                                                {review.rating}
                                            </span>
                                            <i className="ri-star-fill text-xs" />
                                        </div>

                                        <p className="font-medium">
                                            {review.comment}
                                        </p>

                                        <h2 className="mt-10 text-sm font-medium">
                                            {review.user.name} | {formattedDate}
                                        </h2>

                                        <div className="flex items-center gap-1">
                                            <span
                                                className="flex items-center 
                                                justify-center border 
                                                rounded-full w-4 
                                                h-4 border-gray-600"
                                            >
                                                <i className="ri-check-fill text-gray-600 font-light text-[12px]" />
                                            </span>
                                            <span className="text-xs text-gray-600 font-medium">
                                                Verified buyer
                                            </span>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                    </div>

                    <hr className={`${totalReviews > 0 ? "mt-5 mb-3" : "mt-8 mb-5"} border-gray-300`} />

                    {/* PRODUCT HIGHLIGHTS */}
                    <div>
                        <div
                            className="flex items-center gap-5 cursor-pointer"
                            onClick={() => setShowProductHighlights(!showProductHiglights)}
                        >
                            <h1 className="text-lg font-semibold">
                                Product Highlights
                            </h1>
                            <i
                                className={`
                                ri-arrow-down-s-line inline-block 
                                transition-transform duration-300 
                                ${showProductHiglights ? "rotate-180" : "rotate-0"} text-lg
                                `}
                            />
                        </div>

                        {showProductHiglights ?
                            <div className="grid grid-cols-2 gap-x-10 gap-y-4 mt-2">
                                {productById.attributes &&
                                    Object.entries(productById.attributes).map(([key, value]) => {
                                        if (!value) return null;

                                        return (
                                            <div key={key} className="font-semibold">
                                                <h5 className="text-sm text-gray-500">
                                                    {key}
                                                </h5>

                                                <h2>
                                                    {value}
                                                </h2>
                                                <hr className="mt-2 border-gray-300" />
                                            </div>
                                        );
                                    })}
                            </div>
                            :
                            <p className="text-sm font-medium text-gray-500 mt-1">
                                Key features, specifications and more...
                            </p>
                        }

                    </div>

                    {/* BUTTONS */}
                    <div className="mt-6 flex items-center gap-5">
                        <button
                            className="border border-black 
                            text-sm font-semibold 
                            rounded-lg w-40 
                            py-4 transition-all 
                            duration-200 text-white
                            bg-black xl:hover:border-black/10
                            xl:hover:bg-black/80
                            "
                            onClick={handleCart}>
                            Add to Cart
                        </button>

                        <button
                            className="border border-rose-500
                            text-sm font-semibold
                            rounded-lg w-40
                            py-4 transition-all
                            duration-200 text-white 
                            bg-rose-500 xl:hover:border-rose-400
                            xl:hover:bg-rose-400
                            "
                            onClick={handleWishlist}
                        >
                            Add to Wishlist
                        </button>
                    </div>
                </div>
            </div>
            
            <RecentlyViewedProduct />
            <Footer />
        </section>
    );
}

export default ProductDetails;