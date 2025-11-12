// src/components/pages/Dashboard.js
import { useEffect, useState } from "react";
import api from "../services/api";
import "./Dashboard.css";

export default function Dashboard() {
  const [facturas, setFacturas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) {
      console.warn("Token no encontrado");
      return;
    }

    api.get("/facturas/", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((res) => {
        setFacturas(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al cargar facturas:", err);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id) => {
    const token = localStorage.getItem("access");
    if (!window.confirm("¿Eliminar esta factura?")) return;

    try {
      await api.delete(`/facturas/${id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFacturas(facturas.filter(f => f.id !== id));
    } catch (err) {
      alert("Error al eliminar factura");
      console.error("Error al eliminar factura:", err);
    }
  };

  if (loading) return <p className="loading">Cargando facturas...</p>;

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Dashboard de Facturas</h2>
      {facturas.length === 0 ? (
        <p className="no-facturas">No hay facturas registradas.</p>
      ) : (
        <div className="facturas-grid">
          {facturas.map((f) => (
            <div key={f.id} className="factura-card">
              <h3>Factura {f.number ? `#${f.number}` : `#${f.id}`}</h3>
              <p><strong>Cliente:</strong> {f.customer_detail?.name || "Sin nombre"}</p>
              <p><strong>Total:</strong> ${f.total}</p>
              <button onClick={() => handleDelete(f.id)} className="eliminar-btn">
                Eliminar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}