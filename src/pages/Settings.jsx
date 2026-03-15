import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const Settings = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [settings, setSettings] = useState(null);

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await axios.get(`${API_URL}/api/settings`);
      setSettings(data);
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    setSettings({
      ...settings,
      [e.target.name]: Number(e.target.value),
    });
  };

  const handleSave = async () => {
    try {
      await axios.put(`${API_URL}/api/settings`, settings, getAuthHeader());
      toast.success("Settings Updated Successfully");
    } catch {
      toast.error("Update failed");
    }
  };

  if (!settings) return <div>Loading...</div>;

  return (
    <div className="space-y-8 p-6 max-w-5xl">
      <h1 className="text-2xl font-semibold">Store Settings</h1>

      {/* ORDER SETTINGS */}
      <div className="bg-white p-6 rounded-lg shadow space-y-6">
        <h2 className="text-lg font-semibold">Order Configuration</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* DELIVERY CHARGE */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Delivery Charge (₹)
            </label>
            <input
              type="number"
              name="deliveryCharge"
              value={settings.deliveryCharge}
              onChange={handleChange}
              placeholder="Enter delivery charge"
              className="border p-2 rounded w-full"
            />
            <p className="text-xs text-gray-500 mt-1">
              Charge applied if order does not qualify for free delivery.
            </p>
          </div>

          {/* FREE DELIVERY */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Free Delivery Above (₹)
            </label>
            <input
              type="number"
              name="freeDeliveryAbove"
              value={settings.freeDeliveryAbove}
              onChange={handleChange}
              placeholder="Minimum amount for free delivery"
              className="border p-2 rounded w-full"
            />
            <p className="text-xs text-gray-500 mt-1">
              Orders above this amount will not be charged delivery fee.
            </p>
          </div>

          {/* TAX */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Tax Percentage (%)
            </label>
            <input
              type="number"
              name="tax"
              value={settings.tax}
              onChange={handleChange}
              placeholder="Enter tax percentage"
              className="border p-2 rounded w-full"
            />
            <p className="text-xs text-gray-500 mt-1">
              Applied to subtotal during checkout.
            </p>
          </div>

          {/* MIN ORDER */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Minimum Order Amount (₹)
            </label>
            <input
              type="number"
              name="minOrderAmount"
              value={settings.minOrderAmount}
              onChange={handleChange}
              placeholder="Minimum order amount required"
              className="border p-2 rounded w-full"
            />
            <p className="text-xs text-gray-500 mt-1">
              Customers cannot place orders below this amount.
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={handleSave}
        className="bg-[#5e8741] text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-green-700"
      >
        Save All Settings
      </button>
    </div>
  );
};

export default Settings;
