import { useEffect, useState } from "react";
import api from "../services/api";
import "./NuevaFacturaModal.css";

export default function NuevaFacturaModal({ onClose, onFacturaCreada }) {
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [clienteId, setClienteId] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) return;

    Promise.all([
      api.get("/clientes/", { headers: { Authorization: `Bearer ${token}` } }),
      api.get("/productos/", { headers: { Authorization: `Bearer ${token}` } }),
    ])
      .then(([resClientes, resProductos]) => {
        setClientes(resClientes.data);
        setProductos(resProductos.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al cargar datos:", err);
        setLoading(false);
      });
  }, []);

  const handleAddItem = () => {
    setItems((prev) => [...prev, { productoId: "", cantidad: 1 }]);
  };

  const calcularTotal = () => {
    return items.reduce((acc, item) => {
      const producto = productos.find((p) => p.id === parseInt(item.productoId));
      const precio = producto?.unit_price || 0;
      const cantidad = item.cantidad || 0;
      return acc + precio * cantidad;
    }, 0);
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("access");

    if (!clienteId || items.length === 0 || items.some((i) => !i.productoId || i.cantidad <= 0)) {
      alert("Completa todos los campos antes de crear la factura.");
      return;
    }

    const payload = {
      customer: clienteId,
      items: items.map((i) => {
        const producto = productos.find((p) => p.id === parseInt(i.productoId));
        return {
          product: i.productoId,
          quantity: i.cantidad,
          unit_price: producto?.unit_price,
        };
      }),
    };

    try {
      const res = await api.post("/facturas/", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const nuevaFactura = res.data; // debe ser la factura creada retornada por DRF
      alert("Factura creada exitosamente");

      if (onFacturaCreada) onFacturaCreada(nuevaFactura);

      onClose();
    } catch (err) {
      const msg = err.response?.data?.detail || JSON.stringify(err.response?.data);
      alert("Error al crear factura: " + msg);
      console.error("Error al crear factura:", err);
    }
  };

  if (loading) {
    return (
      <div className="modal">
        <div className="modal-content">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Nueva Factura</h2>

        <label>Cliente:</label>
        <select value={clienteId} onChange={(e) => setClienteId(e.target.value)}>
          <option value="">Selecciona un cliente</option>
          {clientes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <h3>Productos:</h3>
        {items.map((item, index) => (
          <div key={index} className="item-row">
            <select
              value={item.productoId}
              onChange={(e) => {
                const newItems = [...items];
                newItems[index].productoId = e.target.value;
                setItems(newItems);
              }}
            >
              <option value="">Selecciona un producto</option>
              {productos.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            <input
              type="number"
              min="1"
              value={item.cantidad}
              onChange={(e) => {
                const newItems = [...items];
                newItems[index].cantidad = parseInt(e.target.value);
                setItems(newItems);
              }}
            />
          </div>
        ))}

        <p>
          <strong>Total estimado:</strong> ${calcularTotal().toFixed(2)}
        </p>

        <button onClick={handleAddItem}>+ Agregar Producto</button>
        <button onClick={handleSubmit}>Crear Factura</button>
        <button onClick={onClose}>Cancelar</button>
      </div>
    </div>
  );
}