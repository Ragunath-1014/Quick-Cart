import { useState, useEffect } from "react";
import { toast } from "react-toastify";

import api from "../../api/axios";
import Loader from "../../shared/Loader";

function ManageProducts() {

  const [manageAllProducts, setManageAllProducts] = useState(null);
  const [editModal, setEditModal] = useState(null);
  const [originalProduct, setOriginalProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState(null);

  const [productBrand, setProductBrand] = useState("");
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [featuredProduct, setFeaturedProduct] = useState(false);

  const tableHeads = [
    { name: "Image" },
    { name: "Brand" },
    { name: "Name" },
    { name: "Category" },
    { name: "Price" },
    { name: "Actions" }
  ];

  const isChanged =
    productName !== originalProduct?.name ||
    productBrand !== originalProduct?.brand ||
    productPrice !== originalProduct?.price ||
    featuredProduct !== originalProduct?.isFeatured;

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        setLoading(true);

        const res = await api.get("/product");
        setManageAllProducts(res.data);
      }
      catch (err) {
        console.log(err);
      }
      finally {
        setLoading(false);
      }
    }

    fetchAllProducts();
  }, []);

  const handleEdit = (product) => {

    setEditModal(product._id);

    setOriginalProduct(product);

    setProductName(product.name);
    setProductBrand(product.brand);
    setProductPrice(product.price);
    setFeaturedProduct(product.isFeatured);
  }

  const handleSave = async (e, productId) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await api.put("/product/update", {
        productId,
        productName,
        productBrand,
        productPrice,
        featuredProduct
      });
      setManageAllProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === productId
            ? res.data.product
            : product
        )
      );

      toast.dismiss();
      toast.success(res.data.message);
      setEditModal(null);
    }
    catch (err) {
      console.log(err);
      toast.error("Failed to update product");
    }
    finally {
      setLoading(false);
    }
  }

  const handleDeleteProduct = async (productId) => {
    try {
      setLoading(true);
      const res = await api.delete(`/product/delete/${productId}`);
      setManageAllProducts((prevProducts) =>
        prevProducts.filter((product) =>
          product._id !== productId
        )
      );
      toast.dismiss();
      toast.success(res.data.message);
      setDeleteModal(null);
    }
    catch (err) {
      console.log(err);
      toast.error("Failed to delete product");
    }
    finally {
      setLoading(false);
    }
  }

  if (loading || !manageAllProducts) {
    return <Loader loadingMessage={"Loading"} />
  }

  return (
    <section className="w-full mt-2">

      {/* PRODUCTS TITLE */}
      <div className="flex flex-col items-center">
        <h1 className="text-2xl font-bold">
          Manage Products
        </h1>

        <p className="text-gray-500 text-xs sm:text-sm font-medium">
          Keep products updated
        </p>
      </div>

      <div className="w-full p-5">
        <table className="w-full">
          <thead className="bg-gray-100 border border-gray-300">
            <tr>
              {tableHeads.map((tableHead, index) => (
                <th
                  key={index}
                  className="px-5 py-2 font-semibold"
                >
                  {tableHead.name}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {manageAllProducts.map((product) => (
              <tr
                key={product._id}
                className="border border-gray-300"
              >
                <td className="p-4">
                  <div className="flex justify-center">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-20 h-24 object-cover object-top rounded-lg"
                    />
                  </div>
                </td>

                <td className="p-4 text-sm text-center font-medium">
                  {product.brand}
                </td>

                <td className=" p-4 max-w-64 text-sm text-center font-medium">
                  <p className="line-clamp-1">
                    {product.name}
                  </p>
                </td>

                <td className="p-4 capitalize text-sm text-center font-medium">
                  {product.category}
                </td>

                <td className="p-4 text-sm text-center font-medium">
                  ₹{product.price.toLocaleString()}
                </td>

                <td className="p-4">
                  <div className="flex items-center justify-center  gap-3">

                    {/* EDIT BUTTON */}
                    <button
                      className="w-20 py-2 rounded bg-black text-white text-sm font-medium"
                      onClick={() => handleEdit(product)}
                    >
                      Edit
                    </button>

                    {/* DELETE BUTTON */}
                    <button
                      className="w-20 py-2 rounded bg-red-600 text-white text-sm font-medium"
                      onClick={() => setDeleteModal(product._id)}
                    >
                      Delete
                    </button>
                  </div>

                  {/* PRODUCT EDIT MODAL */}
                  {editModal === product._id &&
                    <div
                      className="fixed inset-0 
                      flex justify-center 
                      items-center
                      z-50 bg-black/60"
                    >
                      <div
                        className="w-[450px]
                        rounded-t-2xl sm:rounded-2xl
                        bg-white h-auto
                        py-5
                        flex flex-col  
                        relative"
                      >

                        {/* TITLE */}
                        <div className="flex items-center justify-between px-5">
                          <h1 className="font-medium">
                            Edit Product
                          </h1>
                          <i
                            className="ri-close-line text-xl cursor-pointer"
                            onClick={() => setEditModal(null)}
                          />
                        </div>

                        {/* DIVIDER */}
                        <hr className="border-gray-300 my-3" />

                        <div className="px-5 mt-1">
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-28 h-36 object-cover object-top rounded-lg"
                          />

                          <form
                            onSubmit={(e) => handleSave(e, product._id)}
                            className="flex flex-col gap-3 mt-3"
                          >

                            {/* PRODUCT NAME */}
                            <div>
                              <label className="text-sm font-medium">
                                Product Name
                              </label>

                              <textarea
                                value={productName}
                                onChange={(e) => setProductName(e.target.value)}
                                className="w-full h-16 
                                border border-gray-300 
                                outline-none text-sm 
                                p-2 rounded-md
                                "
                                placeholder="Name"
                                required
                              />
                            </div>

                            {/* PRODUCT BRAND */}
                            <div>
                              <label className="text-sm font-medium">
                                Product Brand
                              </label>

                              <input
                                type="text"
                                value={productBrand}
                                onChange={(e) => setProductBrand(e.target.value)}
                                className="w-full border
                                border-gray-300 outline-none 
                                text-sm p-2
                                rounded-md
                                "
                                placeholder="Brand"
                                required
                              />
                            </div>

                            {/* PRODUCT PRICE */}
                            <div>
                              <label className="text-sm font-medium">
                                Product Price
                              </label>

                              <input
                                type="number"
                                value={productPrice}
                                onChange={(e) => setProductPrice(Number(e.target.value))}
                                className="w-full border
                                border-gray-300 outline-none 
                                text-sm p-2
                                rounded-md
                                "
                                placeholder="Price"
                                required
                              />
                            </div>

                            {/* IS FEATURED PRODUCT */}
                            <div className="flex items-center gap-1">
                              <input
                                type="checkbox"
                                checked={featuredProduct}
                                onChange={(e) => setFeaturedProduct(e.target.checked)}
                                className="cursor-pointer"
                              />
                              {console.log(featuredProduct)}

                              <label className="text-sm font-medium">
                                Featured Product
                              </label>
                            </div>

                            <div className="flex justify-between gap-5 mt-4">
                              <button
                                className="text-sm font-medium 
                                border border-gray-300
                                w-full py-3
                                rounded-md
                                "
                                type="button"
                                onClick={() => setEditModal(null)}
                              >
                                Cancel
                              </button>

                              <button
                                disabled={!isChanged}
                                className="text-sm font-medium
                                border border-black
                                bg-black text-white                                
                                w-full py-3                                
                                rounded-md disabled:bg-opacity-50                                
                                disabled:border-opacity-5                                
                                transition-all duration-300                                
                                "
                                type="submit"
                              >
                                Update
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  }

                  {/* PRODUCT DELETE MODAL */}
                  {deleteModal === product._id &&
                    <div
                      className="fixed inset-0 
                      flex justify-center 
                      items-center
                      z-50 bg-black/60"
                    >
                      <div
                        className="w-[450px]
                        rounded-t-2xl sm:rounded-2xl
                        bg-white h-auto
                        py-5
                        flex flex-col  
                        relative"
                      >
                        <div>

                          {/* TITLE */}
                          <div className="flex items-center justify-between px-5">
                            <h1 className="font-medium">
                              Delete Product
                            </h1>
                            <i
                              className="ri-close-line text-xl cursor-pointer"
                              onClick={() => setDeleteModal(null)}
                            />
                          </div>

                          {/* DIVIDER */}
                          <hr className="border-gray-300 my-3" />

                          <div className="px-5 flex gap-5 mt-4">
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-28 h-36 object-cover object-top rounded-lg"
                            />

                            <div className="flex flex-col gap-1 text-sm text-gray-700 font-medium">
                              <span>
                                Brand : {product.brand}
                              </span>
                              <span>
                                Name : {product.name}
                              </span>
                              <span className="capitalize">
                                Category : {product.category}
                              </span>
                              <span>
                                Price : ₹{product.price.toLocaleString()}
                              </span>
                            </div>
                          </div>

                          <p className="text-center text-red-600 font-semibold text-xs mt-5 px-5">
                            Are you sure about deleting this product? This product will be deleted permanently.
                          </p>

                          <div className="flex justify-between gap-5 mt-5 px-5">
                            <button
                              className="text-sm font-medium 
                                border border-gray-300
                                w-full py-3
                                rounded-md
                                "
                              type="button"
                              onClick={() => setDeleteModal(null)}
                            >
                              Cancel
                            </button>

                            <button
                              className="text-sm font-medium
                                border border-black
                                bg-black text-white                                
                                w-full py-3                                
                                rounded-md                              
                                "
                              type="button"
                              onClick={() => handleDeleteProduct(product._id)}
                            >
                              Confirm
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default ManageProducts;