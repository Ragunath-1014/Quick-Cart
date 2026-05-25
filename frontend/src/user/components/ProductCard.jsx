import { useNavigate } from "react-router-dom";

function ProductCard({ product }) {

    const navigate = useNavigate();

    const price = product.price;
    const formattedPrice = price.toLocaleString();

    return (
        <div
            className="rounded-2xl cursor-pointer"
            onClick={() => navigate(`/product/${product._id}`)}
        >
            <div className="w-full aspect-[3/4] overflow-hidden">
                <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover object-top rounded-t-2xl"
                />
            </div>

            <div className="p-4 border border-gray-200 rounded-b-2xl">
                <h3 className="text-xs sm:text-sm font-medium">
                    {product.brand}
                </h3>
                <p className="line-clamp-1 text-sm text-gray-500">
                    {product.name}
                </p>
                <p className="text-sm sm:text-base font-semibold mt-1">
                    ₹{formattedPrice}
                </p>
            </div>
        </div>
    );
}

export default ProductCard;
