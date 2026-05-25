import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import api from "../../api/axios";
import ProductCard from "../components/ProductCard";
import noProduct from "../../assets/images/noProduct.png";
import Loader from "../../shared/Loader";
import Footer from "../components/Footer";

function Products() {
    const { category } = useParams();

    const [allProducts, setAllProducts] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showfilter, setShowFilter] = useState(false);
    const [brands, setBrands] = useState([]);
    const [subCategories, setSubCategories] = useState([]);

    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("");
    const [selectedSubCategory, setSelectedSubCategory] = useState("");
    const [selectedBrand, setSelectedBrand] = useState("");

    const sortOptions = [
        { label: "Newest", value: "new" },
        { label: "Price High to Low", value: "high" },
        { label: "Price Low to High", value: "low" }
    ];

    const FirstLetterCapital = (str) =>
        str.charAt(0).toUpperCase() + str.slice(1);

    useEffect(() => {
        fetchProducts();
    }, [category, selectedSubCategory, selectedBrand, sort]);

    const fetchProducts = async () => {
        try {
            setLoading(true);

            const res = await api.get("/product", {
                params: {
                    category,
                    subCategory: selectedSubCategory,
                    brand: selectedBrand,
                    sort
                }
            });

            setAllProducts(res.data);
            setProducts(res.data);
        }
        catch (err) {
            console.log(err);
        }
        finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let filtered = [...allProducts];

        if (search) {
            filtered = filtered.filter((product) =>
                product.name.toLowerCase().includes(search.toLowerCase()) ||
                product.brand.toLowerCase().includes(search.toLowerCase())
            );
        }

        setProducts(filtered);
    }, [search, allProducts]);

    useEffect(() => {
        const fetchFilters = async () => {
            try {
                const res = await api.get("/product/filters", {
                    params: { category }
                });

                setBrands(res.data.brands);
                setSubCategories(res.data.subCategories);
            } 
            catch (err) {
                console.log(err);
            }
        };

        fetchFilters();
    }, [category]);

    if (loading) {
        return <Loader loadingMessage={"Loading"} />;
    }

    return (
        <section>
            <div className="flex flex-col items-center px-5 mt-3 md:mt-0">

                {/* SEARCH BAR */}
                <div
                    className="flex 
                    gap-3 w-full 
                    sm:w-[600px] lg:w-[700px]
                    mt-5 sm:mt-8
                    border border-gray-400
                    rounded-lg
                    p-2 md:p-3"
                >
                    <i className="ri-search-2-line text-xl text-gray-400" />

                    <input
                        type="text"
                        placeholder="Search for Products and Brands"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="focus:outline-none w-full text-sm"
                    />
                </div>

                <div className="md:flex md:gap-10 mt-5 items-start w-full">

                    {/* FILTER AND SORT */}
                    <div className="md:w-[200px] lg:w-[300px] shrink-0 md:sticky md:top-24 h-fit">

                        {/* FILTER TITLE */}
                        <div
                            className="flex items-center gap-1 cursor-pointer w-fit"
                            onClick={() => setShowFilter(!showfilter)}
                        >
                            <p className="text-lg font-semibold">FILTERS</p>
                            <i
                                className={`
                                ri-arrow-right-s-line text-xl 
                                md:hidden transition-all 
                                duration-300 
                                ${showfilter ? "-rotate-90" : "rotate-90"}
                                `}
                            />
                        </div>

                        {/* FILTER BY BRANDS */}
                        <div
                            className={` 
                            border border-gray-300 
                            px-4 py-3 
                            mt-2 md:block 
                            max-w-96 rounded-lg   
                            ${showfilter ? "" : "hidden"}
                            `}
                        >
                            <h3 className="font-semibold text-sm">
                                BRANDS
                            </h3>

                            <div className="mt-2">
                                {brands.map((brand, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-1 mt-1"
                                    >
                                        <input
                                            type="checkbox"
                                            onChange={() => setSelectedBrand((prev) => (
                                                prev === brand ? null : brand
                                            ))}
                                            checked={selectedBrand === brand}
                                            className="cursor-pointer"
                                        />
                                        <span className="text-xs">
                                            {brand}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* FILTER BY SUB-CATEGORY */}
                        <div
                            className={` 
                            border border-gray-300 
                            px-4 py-3 
                            mt-5 md:block 
                            max-w-96 rounded-lg     
                            ${showfilter ? "" : "hidden"}
                            `}
                        >
                            <h3 className="font-semibold text-sm">
                                TYPE
                            </h3>

                            <div className="mt-2">
                                {subCategories.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-1 mt-1"
                                    >
                                        <input
                                            type="checkbox"
                                            onChange={() =>
                                                setSelectedSubCategory((prev) =>
                                                    prev === item ? null : item
                                                )
                                            }
                                            checked={selectedSubCategory === item}
                                            className="cursor-pointer"
                                        />
                                        <span className="text-xs">
                                            {item}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* SORT */}
                        <div
                            className={` 
                            border border-gray-300 
                            px-4 py-3 
                            mt-5 md:block 
                            max-w-96 rounded-lg      
                            ${showfilter ? "" : "hidden"}
                            `}
                        >
                            <h3 className="font-semibold text-sm">
                                SORT
                            </h3>

                            <div className="mt-2">
                                {sortOptions.map((sortOption, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-1 mt-1"
                                    >
                                        <input
                                            type="checkbox"
                                            onChange={() => setSort((prev) => (
                                                prev === sortOption.value ? null : sortOption.value
                                            ))}
                                            checked={sort === sortOption.value}
                                            className="cursor-pointer"
                                        />
                                        <span className="text-xs">
                                            {sortOption.label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {products.length > 0
                        ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-5 gap-y-8 my-5 md:my-6">
                                {products.map((product) => (
                                    <ProductCard
                                        key={product._id}
                                        product={product}
                                    />
                                ))}
                            </div>
                        )
                        : (
                            <div className="flex flex-col items-center justify-center min-h-[60vh] w-full">
                                <img
                                    src={noProduct}
                                    alt="no-orders"
                                    className="w-48"
                                />

                                <h1 className="text-xl font-semibold mt-4">
                                    No products found
                                </h1>
                            </div>
                        )}
                </div>
            </div>
            <Footer />
        </section >
    );
}

export default Products;