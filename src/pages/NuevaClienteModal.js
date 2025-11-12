import { useState } from "react";
import api from "../services/api";
import "./NuevaFacturaModal.css";

export default function NuevaClienteModal({ onClose, onClienteCreado }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone_number: "",
    address: "",
    tax_identification_number: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("access");
    try {
      const res = await api.post("/clientes/", form, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const nuevoCliente = res.data;
      alert("Cliente creado exitosamente");

      if (onClienteCreado) {
        onClienteCreado(nuevoCliente);
      }

      onClose();
    } catch (err) {
      const msg = err.response?.data?.detail || JSON.stringify(err.response?.data);
      alert("Error al crear cliente: " + msg);
      console.error(err);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Nuevo Cliente</h2>
        <input name="name" placeholder="Nombre" value={form.name} onChange={handleChange} />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
        <input name="phone_number" placeholder="Teléfono" value={form.phone_number} onChange={handleChange} />
        <input name="address" placeholder="Dirección" value={form.address} onChange={handleChange} />
        <input name="tax_identification_number" placeholder="NIT" value={form.tax_identification_number} onChange={handleChange} />
        <button onClick={handleSubmit}>Crear Cliente</button>
        <button onClick={onClose}>Cancelar</button>
      </div>
    </div>
  );
}