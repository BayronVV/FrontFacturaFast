import { useState } from "react";
import api from "../services/api";
import "./NuevaFacturaModal.css";

export default function NuevaProductoModal({ onClose, onProductoCreado }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    unit_price: "",
    vat_percentage: "19.00"
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("access");
    try {
      const res = await api.post("/productos/", form, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const nuevoProducto = res.data;
      alert("Producto creado exitosamente");

      if (onProductoCreado) {
        onProductoCreado(nuevoProducto);
      }

      onClose();
    } catch (err) {
      const msg = err.response?.data?.detail || JSON.stringify(err.response?.data);
      alert("Error al crear producto: " + msg);
      console.error(err);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Nuevo Producto</h2>
        <input name="name" placeholder="Nombre" value={form.name} onChange={handleChange} />
        <input name="description" placeholder="Descripción" value={form.description} onChange={handleChange} />
        <input name="unit_price" type="number" placeholder="Precio unitario" value={form.unit_price} onChange={handleChange} />
        <input name="vat_percentage" type="number" placeholder="IVA (%)" value={form.vat_percentage} onChange={handleChange} />
        <button onClick={handleSubmit}>Crear Producto</button>
        <button onClick={onClose}>Cancelar</button>
      </div>
    </div>
  );
}