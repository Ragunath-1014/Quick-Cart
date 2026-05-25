import { useState, useEffect } from "react";

import api from "../../api/axios";
import Loader from "../../shared/Loader";
import { toast } from "react-toastify";

function ManageOrders() {

  const [manageAllOrders, setManageAllOrders] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAllOrders = async () => {
      try {
        setLoading(true);
        const res = await api.get("/orders");
        setManageAllOrders(res.data);
      }
      catch (err) {
        console.log(err);
      }
      finally {
        setLoading(false);
      }
    }

    fetchAllOrders();
  }, []);

  const handleOrderStatus = async (orderId, newOrderStatus) => {
    try {
      setLoading(true);
      const res = await api.put("/orders/update", { orderId, newOrderStatus });
      setManageAllOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId
            ? res.data.order
            : order
        )
      );
      toast.dismiss();
      toast.success(res.data.message);
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

  if (loading || !manageAllOrders) {
    return <Loader loadingMessage={"Loading"} />
  }

  return (
    <section className="w-full mt-2">

      {/* ORDERS TITLE */}
      <div className="flex flex-col items-center">
        <h1 className="text-2xl font-bold">
          Manage Orders
        </h1>

        <p className="text-gray-500 text-xs sm:text-sm font-medium">
          Track and manage orders
        </p>
      </div>

      <div>
        {manageAllOrders.map((order) => {
          const formattedDate = new Date(order.createdAt)
            .toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric"
            });
          return (
            <div
              key={order._id}
              className="border border-gray-300 m-5 p-5"
            >
              <div className="flex items-start justify-between">

                {/* ORDER DETAILS */}
                <div>
                  <h1 className="font-semibold">
                    Order Details
                  </h1>

                  {/* ORDER ITEMS */}
                  {order.items.map((item) => (
                    <div
                      key={item._id}
                      className="flex gap-3 mt-4"
                    >
                      <img
                        src={item.product.images[0]}
                        alt=""
                        className="w-28 h-36 object-cover object-top rounded-lg"
                      />

                      <div className="flex flex-col gap-1 text-sm font-medium">
                        <span>
                          Brand : {item.product.brand}
                        </span>
                        <span>
                          Name : {item.product.name}
                        </span>
                        <span>
                          Color : {item.product.attributes.Color}
                        </span>
                        <span>
                          Size : {item.size}
                        </span>
                        <span>
                          Qty : {item.quantity}
                        </span>
                        <span>
                          Price : ₹{item.product.price.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* ORDER SUMMARY */}
                <div>
                  <h1 className="font-semibold">
                    Order Summary
                  </h1>

                  <div className="flex flex-col gap-1 text-sm font-medium mt-4">
                    <span>
                      Date : {formattedDate}
                    </span>
                    <span>
                      Total {order.items.length > 1 ? "items" : "item"} : {order.items.length}
                    </span>
                    <span>
                      Total amount : {order.totalAmount.toLocaleString()}
                    </span>
                    <span>
                      Payment method : Online
                    </span>
                  </div>
                </div>

                {/* ADDRESS DETAILS */}
                <div>
                  <h1 className="font-semibold">
                    Shipment details
                  </h1>

                  <div className="flex flex-col gap-1 text-sm font-medium mt-4">
                    <h1>
                      Deliver to : <span className="font-semibold">{order.shippingAddress.fullName}</span>
                    </h1>
                    <span>
                      {order.shippingAddress.addressLine}
                    </span>
                    <span>
                      {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                    </span>
                    <span>
                      Phone : {order.shippingAddress.phone}
                    </span>
                  </div>
                </div>

                {/* ORDER STATUS UPDATE */}
                <div>
                  <select
                    value={order.orderStatus}
                    onChange={(e) => handleOrderStatus(
                      order._id,
                      e.target.value
                    )}
                    className="border border-gray-300 
                    px-3 py-2 rounded-md
                    text-sm font-semibold 
                    outline-none cursor-pointer"
                  >
                    <option value="Placed">
                      Order Placed
                    </option>

                    <option value="Shipped">
                      Order Shipped
                    </option>

                    <option value="Delivered">
                      Order Delivered
                    </option>
                  </select>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  );
}

export default ManageOrders;