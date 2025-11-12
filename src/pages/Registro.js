// src/components/pages/Registro.js
import { useState } from "react";
import api from "../services/api";
import { Link, useNavigate } from "react-router-dom";
import "./Registro.css";

export default function Registro() {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    empresa: {
      company_name  : "",
      nit: "",
      direccion: "",
      telefono: "",
      correo_empresa: "",
      sitio_web: "",
    },
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name in form.empresa) {
      setForm({ ...form, empresa: { ...form.empresa, [name]: value } });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    try {
      await api.post("registro/", {
        full_name: form.full_name,
        email: form.email,
        password: form.password,
        empresa: {
          company_name  : form.empresa.company_name,
          nit: form.empresa.nit,
          direccion: form.empresa.direccion,
          telefono: form.empresa.telefono,
          correo_empresa: form.empresa.correo_empresa,
          sitio_web: form.empresa.sitio_web,
        },
      });
      alert("Registro exitoso. Ahora puedes iniciar sesión.");
      navigate("/");
    } catch (err) {
      console.error(err.response?.data);
      alert("Error en el registro: " + JSON.stringify(err.response?.data));
    }
  };

  return (
    <div className="registro-container">
      <form className="registro-form" onSubmit={handleSubmit}>
        <h2>Registro de Empresa</h2>

        <h4>Datos del Usuario</h4>
        <input name="full_name" placeholder="Nombre Completo" onChange={handleChange} required />
        <input name="email" type="email" placeholder="Correo Electrónico" onChange={handleChange} required />
        <input name="password" type="password" placeholder="Contraseña" onChange={handleChange} required />
        <input name="confirmPassword" type="password" placeholder="Confirmar Contraseña" onChange={handleChange} required />

        <h4>Datos de la Empresa</h4>
        <input name="company_name" placeholder="Nombre de la Empresa" onChange={handleChange} required />
        <input name="nit" placeholder="NIT" onChange={handleChange} required />
        <input name="direccion" placeholder="Dirección" onChange={handleChange} required />
        <input name="telefono" placeholder="Teléfono" onChange={handleChange} required />
        <input name="correo_empresa" type="email" placeholder="Correo de la Empresa" onChange={handleChange} required />
        <input name="sitio_web" placeholder="Sitio Web (Opcional)" onChange={handleChange} />

        <button type="submit">Registrar Empresa</button>
        <p className="volver-link">
          <Link to="/">Volver al inicio de sesión</Link>
        </p>
      </form>
    </div>
  );
}