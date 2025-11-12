import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../services/api";
import NuevaFacturaModal from "./NuevaFacturaModal";
import NuevaClienteModal from "./NuevaClienteModal";
import NuevaProductoModal from "./NuevaProductoModal";
import "./FacturasLayout.css";

export default function Facturas() {
  const navigate = useNavigate();
  const location = useLocation();
  const usuario = localStorage.getItem("usuario_nombre") || "Usuario";

  const [mostrarModalFactura, setMostrarModalFactura] = useState(false);
  const [mostrarModalCliente, setMostrarModalCliente] = useState(false);
  const [mostrarModalProducto, setMostrarModalProducto] = useState(false);

  const [facturas, setFacturas] = useState([]);
  const [refreshVersion, setRefreshVersion] = useState(0); // fuerza remount del Outlet

  useEffect(() => {
    cargarFacturas();
  }, []);

  const cargarFacturas = async () => {
    const token = localStorage.getItem("access");
    try {
      const res = await api.get("/facturas/", {
        headers: { Authorization: `Bearer ${token}` },
        // evitar respuestas cacheadas del navegador/proxy
        params: { t: Date.now() },
      });
      setFacturas(res.data);
    } catch (err) {
      console.error("Error cargando facturas:", err);
    }
  };

  const rutaActual = location.pathname;

  const renderBotonCrear = () => {
    if (rutaActual.includes("/facturas")) {
      return <button onClick={() => setMostrarModalFactura(true)}>+ Nueva Factura</button>;
    }
    if (rutaActual.includes("/clientes")) {
      return <button onClick={() => setMostrarModalCliente(true)}>+ Nuevo Cliente</button>;
    }
    if (rutaActual.includes("/productos")) {
      return <button onClick={() => setMostrarModalProducto(true)}>+ Nuevo Producto</button>;
    }
    return null;
  };

  const afterFacturaCreada = async (nuevaFactura) => {
    // 1) Actualización optimista si viene la factura creada
    if (nuevaFactura) {
      setFacturas((prev) => [nuevaFactura, ...prev]);
    }
    // 2) Sincroniza con backend para asegurar consistencia
    await cargarFacturas();
    // 3) Fuerza que el Outlet y sus hijos se remonten y lean el nuevo estado
    setRefreshVersion((v) => v + 1);
  };

  return (
    <div className="facturas-layout">
      <aside className="sidebar">
        <h2>FacturaFast</h2>
        {renderBotonCrear()}
        <nav>
          <ul>
            <li onClick={() => navigate("/facturas/dashboard")}>Dashboard</li>
            <li onClick={() => navigate("/clientes/dashboard")}>Clientes</li>
            <li onClick={() => navigate("/productos/dashboard")}>Productos</li>
          </ul>
        </nav>
        <div className="usuario">
          <p>{usuario}</p>
          <button
            onClick={() => {
              localStorage.clear();
              navigate("/");
            }}
          >
            Cerrar Sesión
          </button>
        </div>
      </aside>

      <main className="contenido">
        {/* key obliga remount del árbol del Outlet cuando refreshVersion cambia */}
        <div key={refreshVersion}>
          <Outlet context={{ facturas, setFacturas, cargarFacturas }} />
        </div>
      </main>

      {mostrarModalFactura && (
        <NuevaFacturaModal
          onClose={() => setMostrarModalFactura(false)}
          onFacturaCreada={afterFacturaCreada}
        />
      )}
      {mostrarModalCliente && (
        <NuevaClienteModal onClose={() => setMostrarModalCliente(false)} />
      )}
      {mostrarModalProducto && (
        <NuevaProductoModal onClose={() => setMostrarModalProducto(false)} />
      )}
    </div>
  );
}
