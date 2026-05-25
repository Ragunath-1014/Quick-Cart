import { useState } from "react";
import { toast } from "react-toastify";

import api from "../../api/axios";
import Loader from "../../shared/Loader";
import upload from "../../assets/icons/upload.png";

function AddProduct() {

  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([
    null, null, null, null, null
  ]);
  const [productData, setProductData] = useState({
    brand: "",
    name: "",
    category: "men",
    subCategory: "Top wear",
    price: "",
    isFeatured: false
  });
  const [attributes, setAttributes] = useState([
    {
      key: "",
      value: ""
    }
  ]);
  const [sizes, setSizes] = useState([
    {
      size: "",
      stock: 0
    }
  ]);

  const handleImageUpload = (e, index) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }
    const updatedImages = [...images];
    updatedImages[index] = file;
    setImages(updatedImages);
  }

  const handleRemoveImage = (index) => {
    const updatedImages = [...images];
    updatedImages[index] = null;
    setImages(updatedImages);
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setProductData((prevData) => ({
      ...prevData,
      [name]:
        type === "checkbox"
          ? checked
          : value
    }));
  }

  const handleAttributeChange = (index, field, value) => {
    const updatedAttributes = [...attributes];
    updatedAttributes[index][field] = value;
    setAttributes(updatedAttributes);
  };

  const handleAddAttribute = () => {
    setAttributes((prevAttributes) => [
      ...prevAttributes,
      {
        key: "",
        value: ""
      }
    ]);
  };

  const handleRemoveAttribute = (attributeIndex) => {
    setAttributes((prevAttributes) =>
      prevAttributes.filter((prevAttribute, index) =>
        index !== attributeIndex
      )
    );
  };

  const handleSizeChange = (index, field, value) => {
    const updatedSizes = [...sizes];
    updatedSizes[index][field] = value;
    setSizes(updatedSizes);
  }

  const handleAddSize = () => {
    setSizes((prevSizes) =>
      [
        ...prevSizes,
        {
          size: "",
          stock: 0
        }
      ]
    );
  }

  const handleRemoveSize = (sizeIndex) => {
    setSizes((prevSizes) =>
      prevSizes.filter((prevSize, index) =>
        index !== sizeIndex
      )
    );
  }

  const handleAddProduct = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const formData = new FormData();

      // PRODUCT IMAGES
      images.forEach((image) => {
        formData.append("image", image);
      });

      // PRODUCT FIELDS
      formData.append("brand", productData.brand);
      formData.append("name", productData.name);
      formData.append("price", productData.price);
      formData.append("category", productData.category);
      formData.append("subCategory", productData.subCategory);
      formData.append("isFeatured", productData.isFeatured);

      // PRODUCT SIZES
      formData.append("sizes",
        JSON.stringify(
          sizes.map((size) => ({
            size: size.size,
            stock: Number(size.stock)
          }))
        )
      );

      // PRODUCT ATTRIBUTES
      const formattedAttributes = {};
      attributes.forEach((attribute) => {
        if (attribute.key.trim()) {
          formattedAttributes[attribute.key] =
            attribute.value;
        }
      });

      formData.append("attributes",
        JSON.stringify(formattedAttributes)
      );

      const res = await api.post("/product", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      toast.dismiss();
      toast.success(res.data.message);

      setImages([]);

      setProductData({
        brand: "",
        name: "",
        category: "men",
        subCategory: "top-wear",
        price: "",
        isFeatured: false
      });

      setAttributes({
        Fabric: "",
        Sleeve: "",
        Fit: "",
        Color: ""
      });

      setSizes([
        {
          size: "",
          stock: 0
        }
      ]);
    }
    catch (err) {
      console.log(err);
      toast.dismiss();
      toast.error("Failed to add product")
    }
    finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <Loader loadingMessage={"Adding Product"} />
  }

  return (
    <section className="w-full px-5">

      {/* PRODUCTS TITLE */}
      <div className="flex flex-col items-center pt-2">
        <h1 className="text-2xl font-bold">
          Add Product
        </h1>

        <p className="text-gray-500 text-xs sm:text-sm font-medium">
          Create and Upload new Product
        </p>
      </div>

      {/* FORM TO ADD PRODUCT */}
      <form
        className="w-full p-5 my-5 border border-gray-300"
        onSubmit={handleAddProduct}
      >

        {/* FOR UPLOADING IMAGES OF THE PRODUCT */}
        <div>
          <h1 className="font-semibold text-base">
            Product Images
          </h1>

          <div className="flex flex-wrap gap-4 mt-5">
            {images.map((image, index) => (
              <div key={index}>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, index)}
                  id={`imageUpload-${index}`}
                  className="hidden"
                />

                <label htmlFor={`imageUpload-${index}`}>
                  {image
                    ? (
                      <div
                        className="w-32 h-36
                        rounded-lg overflow-hidden
                        relative
                      "
                      >
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`image-${index}`}
                          className="w-full h-full object-cover rounded-md"
                        />
                        <i
                          className="ri-close-fill absolute 
                          top-1 right-1 
                          cursor-pointer bg-white 
                          rounded-full w-6 h-6
                          leading-6 text-center
                          text-sm font-medium"
                          onClick={() => handleRemoveImage(index)}
                        />
                      </div>
                    )
                    : (
                      <div
                        className="border border-gray-300 
                        border-dashed w-32 
                        h-36 p-3
                        flex flex-col gap-1
                        items-center justify-center 
                        rounded-md bg-gray-50
                        cursor-pointer"
                      >
                        <img
                          src={upload}
                          alt="upload-icon"
                          className="w-10"
                        />
                        <span className="text-sm text-center font-medium">
                          Upload image
                        </span>
                      </div>
                    )
                  }
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* PRODUCT DETAILS AND SIZE */}
        <div className="mt-12 flex justify-between">

          {/* PRODUCT DETAILS */}
          <div className="flex flex-col gap-5 text-sm">
            <h1 className="font-semibold text-base">
              Product Details
            </h1>

            {/* PRODUCT-BRAND INPUT BOX */}
            <div className="flex flex-col gap-2 items-start">
              <span className="font-medium">
                Product Brand
              </span>

              <input
                type="text"
                name="brand"
                placeholder="Enter product brand"
                value={productData.brand}
                className="outline-none border 
                border-gray-300 w-80 
                p-2 rounded-md
                "
                onChange={handleChange}
              />
            </div>

            {/* PRODUCT-NAME INPUT BOX */}
            <div className="flex flex-col gap-2 items-start">
              <span className="font-medium">
                Product Name
              </span>

              <textarea
                name="name"
                placeholder="Enter product name"
                value={productData.name}
                className="outline-none border 
                border-gray-300 w-80
                h-20 p-2 rounded-md
                "
                onChange={handleChange}
              />
            </div>

            {/* PRODUCT-PRICE INPUT BOX */}
            <div className="flex flex-col gap-2 items-start">
              <span className="font-medium">
                Product Price
              </span>

              <input
                type="text"
                name="price"
                placeholder="Enter product price"
                value={productData.price}
                className="outline-none border 
                border-gray-300 w-80 
                p-2 rounded-md
                "
                onChange={handleChange}
              />
            </div>

            {/* PRODUCT CATEGORY AND SUB-CATEGORY */}
            <div className="flex items-center gap-8">

              {/* CATEGORY */}
              <div className="flex flex-col gap-2 items-start">
                <span className="font-medium">
                  Product Category
                </span>

                <select
                  value={productData.category}
                  name="category"
                  onChange={handleChange}
                  className="border border-gray-300 
                  rounded-md w-36
                  px-3 py-2
                  text-sm font-medium 
                  outline-none cursor-pointer"
                >
                  <option value="men">
                    Men
                  </option>

                  <option value="women">
                    Women
                  </option>

                  <option value="kids">
                    Kids
                  </option>
                </select>
              </div>

              {/* SUB-CATEGORY */}
              <div className="flex flex-col gap-2 items-start">
                <span className="font-medium">
                  Product Sub-Category
                </span>

                <select
                  value={productData.subCategory}
                  name="subCategory"
                  onChange={handleChange}
                  className="border border-gray-300 
                  rounded-md w-36
                  px-3 py-2
                  text-sm font-medium 
                  outline-none cursor-pointer"
                >
                  <option value="Top wear">
                    Top wear
                  </option>

                  <option value="Bottom wear">
                    Bottom wear
                  </option>
                </select>
              </div>
            </div>

            {/* IS FEATURED CHECKBOX */}
            <div className="flex gap-1 items-center">
              <input
                type="checkbox"
                name="isFeatured"
                checked={productData.isFeatured}
                onChange={handleChange}
                className="cursor-pointer"
              />

              <span className="font-medium">
                Featured Product
              </span>
            </div>
          </div>

          {/* PRODUCT - SIZE AND STOCK */}
          <div className="text-sm">
            <h1 className="font-semibold text-base">
              Product Sizes
            </h1>

            {sizes.map((size, index) => (
              <div
                key={index}
                className="flex items-center gap-10"
              >
                <div className="flex flex-col gap-1 items-start mt-5">
                  <span className="font-medium">
                    Size
                  </span>
                  <input
                    type="text"
                    placeholder="Enter product size"
                    value={size.size}
                    className="outline-none border 
                    border-gray-300 w-52
                    p-2 rounded-md
                    "
                    onChange={(e) => handleSizeChange(index, "size", e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-1 items-start mt-5">
                  <span className="font-medium">
                    Stock
                  </span>
                  <input
                    type="number"
                    placeholder="Enter product stock"
                    value={size.stock}
                    className="outline-none border 
                    border-gray-300 w-52 
                    p-2 rounded-md
                    "
                    onChange={(e) => handleSizeChange(index, "stock", e.target.value)}
                  />
                </div>

                {index !== 0
                  ? (
                    <div className="flex justify-center mt-10">
                      <button
                        type="button"
                        className="bg-red-600 text-white 
                        font-semibold rounded-lg
                        w-28 h-[38px]
                        transition-colors duration-300
                        hover:bg-opacity-90
                        "
                        onClick={() => handleRemoveSize(index)}
                      >
                        Delete Size
                      </button>
                    </div>
                  )
                  : (
                    <div className="flex justify-center mt-10">
                      <button
                        type="button"
                        className="bg-black text-white 
                        font-semibold rounded-lg
                        w-28 h-[38px]
                        transition-colors duration-300
                        hover:bg-opacity-90
                        "
                        onClick={handleAddSize}
                      >
                        Add Size
                      </button>
                    </div>
                  )
                }
              </div>
            ))}
          </div>
        </div>

        {/* PRODUCT ATTRIBUTES */}
        <div className="mt-12 text-sm">
          <h1 className="font-semibold text-base">
            Product Attributes
          </h1>

          {attributes.map((attribute, index) => (
            <div
              key={index}
              className="flex items-center gap-10"
            >
              <div className="flex flex-col gap-1 items-start mt-5">
                <span className="font-medium">
                  Attribute Name
                </span>
                <input
                  type="text"
                  placeholder="Enter attribute name"
                  value={attribute.key}
                  className="outline-none border 
                    border-gray-300 w-52
                    p-2 rounded-md
                    "
                  onChange={(e) => handleAttributeChange(index, "key", e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1 items-start mt-5">
                <span className="font-medium">
                  Attribute Value
                </span>
                <input
                  type="text"
                  placeholder="Enter attribute value"
                  value={attribute.value}
                  className="outline-none border 
                    border-gray-300 w-52 
                    p-2 rounded-md
                    "
                  onChange={(e) => handleAttributeChange(index, "value", e.target.value)}
                />
              </div>

              {index !== 0
                ? (
                  <div className="flex justify-center mt-11">
                    <button
                      type="button"
                      className="bg-red-600 text-white 
                      font-semibold rounded-lg
                      w-36 h-[38px]
                      transition-colors duration-300
                      hover:bg-opacity-90
                      "
                      onClick={() => handleRemoveAttribute(index)}
                    >
                      Delete Attribute
                    </button>
                  </div>
                )
                : (
                  <div className="flex justify-center mt-11">
                    <button
                      type="button"
                      className="bg-black text-white 
                      font-semibold rounded-lg
                      w-36 h-[42px]
                      transition-colors duration-300
                      hover:bg-opacity-90
                      "
                      onClick={handleAddAttribute}
                    >
                      Add Attribute
                    </button>
                  </div>
                )
              }
            </div>
          ))}
        </div>

        {/* SUBMIT BUTTON */}
        <div className="flex flex-col items-center justify-center mt-12">
          <button
            type="submit"
            className="bg-black text-white 
            font-semibold w-56 
            py-4 rounded-lg
            transition-colors duration-300
            hover:bg-opacity-90"
          >
            Add Product
          </button>
        </div>
      </form>
    </section>
  );
}

export default AddProduct;