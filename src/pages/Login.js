import { useState } from "react";
import api from "../services/api";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("login/", { email, password });

      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      localStorage.setItem("usuario_nombre", res.data.full_name || res.data.email);

      alert("Login exitoso!");

      setTimeout(() => {
        navigate("/facturas/dashboard");
      }, 100);
    } catch (err) {
      alert("Error en login: " + (err.response?.data?.detail || "Credenciales inválidas"));
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <div className="login-header">
          <h1>FacturaFast</h1>
          <p>Tu sistema inteligente para gestión de facturas, clientes y productos</p>
        </div>

        <h2>Iniciar Sesión</h2>
        <p>Accede con tu correo empresarial para comenzar</p>

        <input
          type="email"
          placeholder="Correo Electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" onClick={handleLogin}>Iniciar Sesión</button>

        <p className="registro-link">
          ¿No tienes cuenta? <Link to="/registro">Regístrate aquí</Link>
        </p>

        <div className="login-footer">
          <p>📞 Contacto: +57 3222924772</p>
          <p>📧 Email: bayronricardovr@ufps.edu.co</p>
        </div>
      </div>
    </div>
  );
}