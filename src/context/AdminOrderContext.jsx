import { createContext, useContext, useState } from "react";

const AdminOrderContext = createContext();

export const AdminOrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([
    {
      id: "1001",
      customer: "Alice Johnson",
      amount: 89.99,
      orderStatus: "Processing",
      date: new Date().toLocaleDateString(),
      items: [
        { id: 1, name: "Red Apple", price: 5.99, quantity: 2 },
        { id: 2, name: "Milk Bottle", price: 3.49, quantity: 1 },
      ],
    },
  ]);

  const addOrder = (order) => {
    setOrders((prev) => [order, ...prev]);
  };

  const updateOrderStatus = (id, status) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === id ? { ...order, orderStatus: status } : order,
      ),
    );
  };

  return (
    <AdminOrderContext.Provider value={{ orders, addOrder, updateOrderStatus }}>
      {children}
    </AdminOrderContext.Provider>
  );
};

export const useAdminOrders = () => useContext(AdminOrderContext);
