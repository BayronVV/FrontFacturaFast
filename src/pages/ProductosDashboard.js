import { useEffect, useState } from "react";
import api from "../services/api";
import NuevaProductoModal from "./NuevaProductoModal";
import "./Dashboard.css";

export default function ProductosDashboard() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const cargarProductos = async () => {
    const token = localStorage.getItem("access");
    try {
      const res = await api.get("/productos/", {
        headers: { Authorization: `Bearer ${token}` },
        params: { t: Date.now() },
      });
      setProductos(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error al cargar productos:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const handleDelete = async (id) => {
    const token = localStorage.getItem("access");
    if (!window.confirm("¿Eliminar este producto?")) return;
    try {
      await api.delete(`/productos/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProductos(productos.filter((p) => p.id !== id));
    } catch (err) {
      alert("Error al eliminar producto");
      console.error(err);
    }
  };

  const afterProductoCreado = async (nuevoProducto) => {
    if (nuevoProducto) {
      setProductos((prev) => [nuevoProducto, ...prev]);
    }
    await cargarProductos();
  };

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Productos</h2>
      <button onClick={() => setShowModal(true)} className="crear-btn">
        + Nuevo Producto
      </button>
      {loading ? (
        <p>Cargando productos...</p>
      ) : (
        <div className="facturas-grid">
          {productos.map((p) => (
            <div key={p.id} className="factura-card">
              <h3>{p.name}</h3>
              <p><strong>Descripción:</strong> {p.description}</p>
              <p><strong>Precio:</strong> ${p.unit_price}</p>
              <p><strong>IVA:</strong> {p.vat_percentage}%</p>
              <button onClick={() => handleDelete(p.id)} className="eliminar-btn">
                Eliminar
              </button>
            </div>
          ))}
        </div>
      )}
      {showModal && (
        <NuevaProductoModal
          onClose={() => setShowModal(false)}
          onProductoCreado={afterProductoCreado}
        />
      )}
    </div>
  );
}