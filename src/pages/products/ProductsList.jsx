import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const ProductsList = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [stockInput, setStockInput] = useState("");

  const LOW_STOCK_LIMIT = 10;

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API_URL}/api/products`);
      setProducts(data);
    } catch (err) {
      toast.error("Failed to fetch inventory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openModal = (product) => {
    setSelectedProduct(product);
    setStockInput("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleUpdateStock = async () => {
    const additionalStock = parseInt(stockInput);

    if (isNaN(additionalStock))
      return toast.error("Please enter a valid number");

    try {
      const currentStock = Number(selectedProduct.countInStock || 0);
      const newStock = currentStock + additionalStock;

      await axios.put(
        `${API_URL}/api/products/${selectedProduct._id}`,
        { countInStock: newStock },
        getAuthHeader(),
      );

      toast.success("Stock updated successfully!");
      closeModal();
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Permanently delete this product?")) return;

    try {
      await axios.delete(`${API_URL}/api/products/${id}`, getAuthHeader());

      toast.success("Product removed");
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      toast.error("Delete failed. Check authorization.");
    }
  };

  if (loading) {
    return (
      <div className="p-10 text-center animate-pulse">Syncing Inventory...</div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
          Products ({products.length})
        </h1>

        <Link
          to="/admin/products/add"
          className="bg-[#5e8741] text-white px-4 sm:px-5 py-2 rounded-lg hover:bg-green-800 transition shadow-sm font-medium text-sm sm:text-base"
        >
          + Add Product
        </Link>
      </div>

      {/* CONTAINER */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* DESKTOP TABLE */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-bold border-b">
              <tr>
                <th className="p-4">Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {products.map((product) => (
                <tr
                  key={product._id}
                  className="hover:bg-gray-50/50 transition"
                >
                  <td className="p-4 font-semibold text-gray-800">
                    {product.name}
                  </td>

                  <td className="text-sm text-gray-500">{product.category}</td>

                  <td className="font-bold text-gray-900">
                    ${product.price?.toFixed(2)}
                  </td>

                  <td>
                    <span
                      className={`font-mono ${
                        product.countInStock <= LOW_STOCK_LIMIT
                          ? "text-red-600 font-bold"
                          : "text-gray-700"
                      }`}
                    >
                      {Number(product.countInStock || 0)}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`px-2 py-1 text-[10px] uppercase font-bold rounded-md ${
                        product.countInStock <= LOW_STOCK_LIMIT
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {product.countInStock <= LOW_STOCK_LIMIT
                        ? "Low Stock"
                        : "Active"}
                    </span>
                  </td>

                  <td className="p-4">
                    <div className="flex justify-center gap-4">
                      <button
                        onClick={() => openModal(product)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Stock
                      </button>

                      <Link
                        to={`/admin/products/edit/${product._id}`}
                        className="text-green-600 hover:text-green-800 text-sm font-medium"
                      >
                        Edit
                      </Link>

                      <button
                        onClick={() => handleDelete(product._id)}
                        className="text-red-500 hover:text-red-700 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* MOBILE CARD LAYOUT */}
        <div className="md:hidden divide-y divide-gray-100">
          {products.map((product) => (
            <div key={product._id} className="p-4 space-y-3">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-gray-800">{product.name}</h3>

                <span
                  className={`text-xs px-2 py-1 rounded-md font-bold ${
                    product.countInStock <= LOW_STOCK_LIMIT
                      ? "bg-red-100 text-red-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {product.countInStock <= LOW_STOCK_LIMIT
                    ? "Low Stock"
                    : "Active"}
                </span>
              </div>

              <div className="text-sm text-gray-500">
                Category: {product.category}
              </div>

              <div className="flex justify-between text-sm">
                <span className="font-bold text-gray-900">
                  ${product.price?.toFixed(2)}
                </span>

                <span
                  className={`font-mono ${
                    product.countInStock <= LOW_STOCK_LIMIT
                      ? "text-red-600 font-bold"
                      : "text-gray-700"
                  }`}
                >
                  Stock: {Number(product.countInStock || 0)}
                </span>
              </div>

              <div className="flex gap-4 pt-2">
                <button
                  onClick={() => openModal(product)}
                  className="text-blue-600 text-sm font-medium"
                >
                  Stock
                </button>

                <Link
                  to={`/admin/products/edit/${product._id}`}
                  className="text-green-600 text-sm font-medium"
                >
                  Edit
                </Link>

                <button
                  onClick={() => handleDelete(product._id)}
                  className="text-red-500 text-sm font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* STOCK MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-lg sm:text-xl font-bold mb-2">Update Stock</h2>

            <p className="text-sm text-gray-500 mb-4">
              Adding to:{" "}
              <span className="font-semibold text-gray-800">
                {selectedProduct?.name}
              </span>
            </p>

            <input
              type="number"
              className="w-full border border-gray-300 p-3 rounded-lg mb-6 outline-none focus:ring-2 focus:ring-[#5e8741]"
              value={stockInput}
              onChange={(e) => setStockInput(e.target.value)}
              autoFocus
            />

            <div className="flex gap-3">
              <button
                onClick={closeModal}
                className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdateStock}
                className="flex-1 py-2.5 bg-[#5e8741] text-white rounded-lg font-semibold hover:bg-green-800 transition"
              >
                Update Stock
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsList;
