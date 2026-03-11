import { createContext, useContext, useEffect, useState } from "react";

const AdminProductContext = createContext();

export const AdminProductProvider = ({ children }) => {
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem("adminProducts");
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 1,
            name: "Red Apple",
            category: "Fruits",
            price: 5.99,
            stock: 120,
            status: "Active",
            image: "",
          },
        ];
  });

  useEffect(() => {
    localStorage.setItem("adminProducts", JSON.stringify(products));
  }, [products]);

  const addProduct = (product) => {
    setProducts((prev) => [...prev, product]);
  };

  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const updateProduct = (updatedProduct) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)),
    );
  };

  return (
    <AdminProductContext.Provider
      value={{ products, addProduct, deleteProduct, updateProduct }}
    >
      {children}
    </AdminProductContext.Provider>
  );
};

export const useAdminProducts = () => useContext(AdminProductContext);
