import { Routes, Route, Navigate } from "react-router-dom";
import { AdminRoutes } from "./routes/AdminRoutes";

function App() {
  return (
    <Routes>
      {/* When opening localhost directly */}
      <Route path="/" element={<Navigate to="/admin/login" replace />} />

      {/* All admin pages */}
      <Route path="/admin/*" element={<AdminRoutes />} />
    </Routes>
  );
}

export default App;
