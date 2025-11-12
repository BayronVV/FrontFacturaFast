import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import Facturas from "./pages/Facturas";
import Dashboard from "./pages/Dashboard";
import ClientesDashboard from "./pages/ClientesDashboard";
import ProductosDashboard from "./pages/ProductosDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registro" element={<Registro />} />

        {/* 👇 Rutas anidadas para facturas */}
        <Route path="/facturas" element={<Facturas />}>
          <Route path="dashboard" element={<Dashboard />} />
        </Route>

        {/* 👇 Rutas anidadas para clientes */}
        <Route path="/clientes" element={<Facturas />}>
          <Route path="dashboard" element={<ClientesDashboard />} />
        </Route>

        {/* 👇 Rutas anidadas para productos */}
        <Route path="/productos" element={<Facturas />}>
          <Route path="dashboard" element={<ProductosDashboard />} />
        </Route>

        {/* 👇 Fallback para rutas no reconocidas */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;