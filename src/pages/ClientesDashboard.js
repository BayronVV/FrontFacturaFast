import { useEffect, useState } from "react";
import api from "../services/api";
import NuevaClienteModal from "./NuevaClienteModal";
import "./Dashboard.css";

export default function ClientesDashboard() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const cargarClientes = async () => {
    const token = localStorage.getItem("access");
    try {
      const res = await api.get("/clientes/", {
        headers: { Authorization: `Bearer ${token}` },
        params: { t: Date.now() },
      });
      setClientes(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error al cargar clientes:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarClientes();
  }, []);

  const handleDelete = async (id) => {
    const token = localStorage.getItem("access");
    if (!window.confirm("¿Eliminar este cliente?")) return;
    try {
      await api.delete(`/clientes/${id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setClientes(clientes.filter(c => c.id !== id));
    } catch (err) {
      alert("Error al eliminar cliente");
      console.error(err);
    }
  };

  const afterClienteCreado = async (nuevoCliente) => {
    if (nuevoCliente) {
      setClientes((prev) => [nuevoCliente, ...prev]);
    }
    await cargarClientes();
  };

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Clientes</h2>
      <button onClick={() => setShowModal(true)} className="crear-btn">+ Nuevo Cliente</button>
      {loading ? (
        <p>Cargando clientes...</p>
      ) : (
        <div className="facturas-grid">
          {clientes.map((c) => (
            <div key={c.id} className="factura-card">
              <h3>{c.name}</h3>
              <p><strong>Email:</strong> {c.email}</p>
              <p><strong>Teléfono:</strong> {c.phone_number}</p>
              <p><strong>NIT:</strong> {c.tax_identification_number}</p>
              <button onClick={() => handleDelete(c.id)} className="eliminar-btn">Eliminar</button>
            </div>
          ))}
        </div>
      )}
      {showModal && (
        <NuevaClienteModal
          onClose={() => setShowModal(false)}
          onClienteCreado={afterClienteCreado}
        />
      )}
    </div>
  );
}