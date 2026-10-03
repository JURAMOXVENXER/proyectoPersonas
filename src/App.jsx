import "./App.css";
import { useState, useEffect } from "react";

const API_URL = "http://localhost:3000/personas";

function App() {
  const [form, setForm] = useState({
    tipoDocumento: "",
    numeroDocumento: "",
    nombres: "",
    apellidos: "",
    direccion: "",
    ciudad: "",
    fechaNacimiento: "",
    correo: "",
  });

  const [personas, setPersonas] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    cargarPersonas();
  }, []);

  function cargarPersonas() {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setPersonas(data))
      .catch(() => setMensaje("No se pudo conectar con el servidor (backend)"));
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }

  function limpiarFormulario() {
    setForm({
      tipoDocumento: "",
      numeroDocumento: "",
      nombres: "",
      apellidos: "",
      direccion: "",
      ciudad: "",
      fechaNacimiento: "",
      correo: "",
    });
    setEditandoId(null);
  }

  function guardarPersona() {
    if (!form.numeroDocumento || !form.nombres || !form.apellidos) {
      setMensaje("Completa los campos obligatorios");
      return;
    }

    if (editandoId === null) {
      fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
        .then((res) => res.json())
        .then(() => {
          setMensaje("Persona guardada correctamente");
          cargarPersonas();
          limpiarFormulario();
        })
        .catch(() => setMensaje("Error al guardar la persona"));
    } else {
      fetch(`${API_URL}/${editandoId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
        .then((res) => res.json())
        .then(() => {
          setMensaje("Persona actualizada correctamente");
          cargarPersonas();
          limpiarFormulario();
        })
        .catch(() => setMensaje("Error al actualizar la persona"));
    }
  }

  function cargarParaActualizar(persona) {
    setForm({
      tipoDocumento: persona.tipoDocumento || "",
      numeroDocumento: persona.numeroDocumento || "",
      nombres: persona.nombres || "",
      apellidos: persona.apellidos || "",
      direccion: persona.direccion || "",
      ciudad: persona.ciudad || "",
      fechaNacimiento: persona.fechaNacimiento
        ? persona.fechaNacimiento.substring(0, 10)
        : "",
      correo: persona.correo || "",
    });
    setEditandoId(persona.id);
    setMensaje("");
  }

  function eliminarPersona(id) {
    const confirmar = window.confirm("¿Realmente deseas eliminar esta persona?");
    if (!confirmar) return;

    fetch(`${API_URL}/${id}`, { method: "DELETE" })
      .then(() => {
        setMensaje("Persona eliminada correctamente");
        cargarPersonas();
        if (editandoId === id) limpiarFormulario();
      })
      .catch(() => setMensaje("Error al eliminar la persona"));
  }

  return (
    <div className="contenedor">
      <h1>Tecnológico de Antioquia</h1>
      <h2>Gestión de Personas</h2>

      <div className="formulario">
        <label>
          Tipo de documento
          <select
            name="tipoDocumento"
            value={form.tipoDocumento}
            onChange={handleChange}
          >
            <option value="">Seleccione...</option>
            <option value="CC">CC</option>
            <option value="TI">TI</option>
            <option value="CE">CE</option>
            <option value="Pasaporte">Pasaporte</option>
          </select>
        </label>

        <label>
          Número de documento
          <input
            type="text"
            name="numeroDocumento"
            value={form.numeroDocumento}
            onChange={handleChange}
          />
        </label>

        <label>
          Nombres
          <input
            type="text"
            name="nombres"
            value={form.nombres}
            onChange={handleChange}
          />
        </label>

        <label>
          Apellidos
          <input
            type="text"
            name="apellidos"
            value={form.apellidos}
            onChange={handleChange}
          />
        </label>

        <label>
          Dirección
          <input
            type="text"
            name="direccion"
            value={form.direccion}
            onChange={handleChange}
          />
        </label>

        <label>
          Ciudad
          <select name="ciudad" value={form.ciudad} onChange={handleChange}>
            <option value="">Seleccione...</option>
            <option value="Bogota">Bogotá</option>
            <option value="Medellin">Medellín</option>
            <option value="Cali">Cali</option>
            <option value="Barranquilla">Barranquilla</option>
          </select>
        </label>

        <label>
          Fecha de nacimiento
          <input
            type="date"
            name="fechaNacimiento"
            value={form.fechaNacimiento}
            onChange={handleChange}
          />
        </label>

        <label>
          Correo electrónico
          <input
            type="email"
            name="correo"
            value={form.correo}
            onChange={handleChange}
          />
        </label>

        <button onClick={guardarPersona}>
          {editandoId === null ? "Guardar" : "Actualizar"}
        </button>
      </div>

      {mensaje && <p className="mensaje">{mensaje}</p>}

      <h3>Personas registradas</h3>

      <table>
        <thead>
          <tr>
            <th>Tipo Documento</th>
            <th>Número Documento</th>
            <th>Nombres</th>
            <th>Apellidos</th>
            <th>Dirección</th>
            <th>Ciudad</th>
            <th>Fecha Nacimiento</th>
            <th>Correo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {personas.map((p) => (
            <tr key={p.id}>
              <td>{p.tipoDocumento}</td>
              <td>{p.numeroDocumento}</td>
              <td>{p.nombres}</td>
              <td>{p.apellidos}</td>
              <td>{p.direccion}</td>
              <td>{p.ciudad}</td>
              <td>{p.fechaNacimiento ? p.fechaNacimiento.substring(0, 10) : ""}</td>
              <td>{p.correo}</td>
              <td>
                <button onClick={() => cargarParaActualizar(p)}>
                  Actualizar
                </button>
                <button onClick={() => eliminarPersona(p.id)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
