import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const OrderDetails = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await axios.get(
          `${API_URL}/api/orders/${id}`,
          getAuthHeader(),
        );
        setOrder(data);
      } catch (err) {
        toast.error("Failed to fetch order");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="p-10 text-center animate-pulse">Loading Order...</div>
    );
  }

  if (!order) {
    return <p className="p-6">Order not found</p>;
  }

  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl md:text-2xl font-semibold">
          Order Details - #{order._id.slice(-5)}
        </h1>

        <button
          onClick={() => navigate(-1)}
          className="bg-gray-200 px-4 py-2 rounded"
        >
          Back
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <div>
          <strong>Customer:</strong> {order.user?.name}
        </div>

        <div>
          <strong>Email:</strong> {order.user?.email}
        </div>

        <div>
          <strong>Total:</strong> ${order.totalPrice?.toFixed(2)}
        </div>

        <div>
          <strong>Status:</strong>{" "}
          {order.isDelivered ? "Delivered" : order.isPaid ? "Paid" : "Pending"}
        </div>

        <div>
          <strong>Date:</strong>{" "}
          {new Date(order.createdAt).toLocaleDateString()}
        </div>

        <div>
          <strong>Shipping Address:</strong>
          <p className="text-sm text-gray-600 mt-1">
            {order.shippingAddress?.address}, {order.shippingAddress?.city},{" "}
            {order.shippingAddress?.postalCode},{" "}
            {order.shippingAddress?.country}
          </p>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Order Items</h2>

        <div className="space-y-3">
          {order.items?.map((item, index) => (
            <div
              key={index}
              className="flex justify-between border-b pb-2 text-sm"
            >
              <span>
                {item.name} * {item.quantity}
              </span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
