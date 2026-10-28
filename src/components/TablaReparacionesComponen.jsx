import { useState } from "react";
import { Link } from "react-router-dom";
import { Pagination } from "react-bootstrap";
import Swal from "sweetalert2";

import {
  Clipboard2Check,
  PlusCircle,
  ArrowRepeat,
  Trash,
  Image,
  Wrench,
} from "react-bootstrap-icons";

// Configuración base de SweetAlert2 (mismos colores que el resto de la app)
const Alerta = Swal.mixin({
  confirmButtonColor: "#12202b",
  cancelButtonColor: "#6c7a89",
  reverseButtons: true,
});

/* ==========================================
   DATOS ALEATORIOS (solo para pruebas)
   Se usan cuando NO se pasa la prop "reparaciones".
========================================== */
const NOMBRES = [
  "Carlos Alfaro", "María Gómez", "Juan Pérez", "Laura Ríos",
  "Andrés Mora", "Sofía Castro", "Diego Vargas", "Camila Herrera",
  "Felipe Ortiz", "Valentina Ruiz", "Mateo Salazar", "Daniela Peña",
];

const COMPONENTES = [
  { nombre: "la fuente de poder", detalle: "por falla en el voltaje de salida" },
  { nombre: "el disco duro", detalle: "por sectores dañados" },
  { nombre: "el ventilador de la CPU", detalle: "por ruido y sobrecalentamiento" },
  { nombre: "la pantalla", detalle: "por daño en el panel LCD" },
  { nombre: "la batería", detalle: "porque ya no cargaba más del 20%" },
  { nombre: "la memoria RAM", detalle: "por errores de memoria" },
  { nombre: "el puerto de carga", detalle: "por conector flojo" },
  { nombre: "la tarjeta madre", detalle: "por un corto en la placa" },
  { nombre: "el teclado", detalle: "porque varias teclas no respondían" },
  { nombre: "la tarjeta de video", detalle: "por artefactos en pantalla" },
];

const aleatorio = (lista) => lista[Math.floor(Math.random() * lista.length)];

/* Imagen de ejemplo (SVG) con un color aleatorio */
const fotoAleatoria = (etiqueta) => {
  const hue = Math.floor(Math.random() * 360);
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120">` +
    `<rect width="120" height="120" fill="hsl(${hue},45%,38%)"/>` +
    `<text x="60" y="68" font-size="22" font-family="sans-serif" ` +
    `text-anchor="middle" fill="white">${etiqueta}</text></svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};

function generarDatos(cantidad = 37) {
  return Array.from({ length: cantidad }, (_, i) => {
    const componente = aleatorio(COMPONENTES);
    const codigo = `TEC-${String(Math.floor(Math.random() * 300) + 1).padStart(4, "0")}`;

    return {
      id: i + 1,
      nombre: aleatorio(NOMBRES),
      codigo,
      foto: fotoAleatoria(`#${i + 1}`),
      descripcion: `Se reemplazó ${componente.nombre} ${componente.detalle}. Se probó el equipo y quedó funcionando correctamente.`,
    };
  });
}

/* Devuelve los números de página a mostrar: 1 … 4 5 6 … 12 */
function getPageNumbers(current, total) {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  if (start > 2) pages.push("start-ellipsis");
  for (let p = start; p <= end; p++) pages.push(p);
  if (end < total - 1) pages.push("end-ellipsis");

  pages.push(total);
  return pages;
}

/*
  Props (mismos nombres que TablaProduct):
  - reparaciones: arreglo de { id, nombre, codigo, foto, descripcion }.
                  Si NO se pasa, la tabla se llena con datos aleatorios.
  - onActualizar(item): se llama si el usuario responde "Sí" al actualizar
  - onEliminar(id):     se llama si el usuario responde "Sí" al eliminar
                        (puede ser async; si lanza error se muestra alerta roja)
  - pageSize:           filas por página (por defecto 5)
  - encabezado:         muestra el título y las pestañas (por defecto true)
  - crearPath / listaPath: rutas de las pestañas
*/
function TablaReparaciones({
  reparaciones,
  onActualizar,
  onEliminar,
  pageSize = 5,
  encabezado = true,
  crearPath = "/CreateReparacion",
  listaPath = "/TableReparacion",
}) {
  const [page, setPage] = useState(1);

  // Si no llegan datos por props, se generan (una sola vez) datos aleatorios
  const esControlado = reparaciones !== undefined;
  const [datosPrueba, setDatosPrueba] = useState(() =>
    esControlado ? [] : generarDatos()
  );
  const datos = esControlado ? reparaciones : datosPrueba;

  /* ---------- Paginación ---------- */
  const total = datos.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const current = Math.min(page, totalPages); // si se borra la última fila de una página, retrocede sola
  const startIndex = (current - 1) * pageSize;
  const visible = datos.slice(startIndex, startIndex + pageSize);

  const from = total === 0 ? 0 : startIndex + 1;
  const to = startIndex + visible.length;

  const goTo = (p) => setPage(Math.min(Math.max(1, p), totalPages));

  /* ==========================================
     ALERTAS DE DECISIÓN (SÍ / NO)
  ========================================== */

  // Botón ACTUALIZAR
  const confirmarActualizar = async (item) => {
    const resultado = await Alerta.fire({
      icon: "question",
      title: "¿Actualizar reparación?",
      text: `Se cargarán los datos de ${item.nombre} (${item.codigo}) para editarlos.`,
      showCancelButton: true,
      confirmButtonText: "Sí, actualizar",
      cancelButtonText: "No",
      confirmButtonColor: "#198754",
    });

    if (!resultado.isConfirmed) return;

    if (onActualizar) {
      onActualizar(item);
    } else {
      // Modo prueba: no hay formulario conectado
      Alerta.fire({
        icon: "info",
        title: "Registro seleccionado",
        text: "Pasa la prop onActualizar para abrir la edición.",
        timer: 2200,
        timerProgressBar: true,
        showConfirmButton: false,
      });
    }
  };

  // Botón ELIMINAR
  const confirmarEliminar = async (item) => {
    const resultado = await Alerta.fire({
      icon: "warning",
      title: "¿Eliminar reparación?",
      text: `Se eliminará la reparación de ${item.nombre} (${item.codigo}). Esta acción no se puede deshacer.`,
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "No",
      confirmButtonColor: "#c0392b",
      focusCancel: true,
    });

    if (!resultado.isConfirmed) return;

    try {
      await onEliminar?.(item.id);

      // Con datos de prueba, la tabla se encarga de quitar la fila
      if (!esControlado) {
        setDatosPrueba((prev) => prev.filter((r) => r.id !== item.id));
      }

      Alerta.fire({
        icon: "success",
        title: "¡Eliminado!",
        text: `Se eliminó la reparación de ${item.nombre}.`,
        timer: 1800,
        timerProgressBar: true,
        showConfirmButton: false,
      });
    } catch (error) {
      Alerta.fire({
        icon: "error",
        title: "No se pudo eliminar",
        text: "No se pudo eliminar el registro. Inténtalo de nuevo.",
        confirmButtonText: "Entendido",
      });
    }
  };

  return (
    <div className="container-fluid" id="lista-reparaciones">
      {encabezado && (
        <>
          {/* ==========================================
              ENCABEZADO
          ========================================== */}
          <div className="full-box page-header">
            <h3 className="text-left">
              <Wrench />
              &nbsp; LISTA DE REPARACIONES
            </h3>

            <p className="text-justify">
              Consulta las reparaciones registradas por los técnicos. Puedes
              actualizar y eliminar cada registro.
            </p>
          </div>

          {/* ==========================================
              PESTAÑAS
          ========================================== */}
          <div className="container-fluid">
            <ul className="full-box list-unstyled page-nav-tabs">
              <li>
                <Link to="/CreateReparacion">
                  <PlusCircle />
                  &nbsp; AGREGAR REPARACIÓN
                </Link>
              </li>

              <li>
                <Link to={listaPath} className="active">
                  <Clipboard2Check />
                  &nbsp; LISTA DE REPARACIONES
                </Link>
              </li>
            </ul>
          </div>
        </>
      )}

      {/* ==========================================
          TABLA
      ========================================== */}
      <div className="table-responsive">
        <table className="table table-dark table-sm align-middle">
          <thead>
            <tr className="text-center roboto-medium">
              <th>#</th>
              <th>FOTO</th>
              <th>TÉCNICO</th>
              <th>CÓDIGO</th>
              <th>DESCRIPCIÓN</th>
              <th>ACTUALIZAR</th>
              <th>ELIMINAR</th>
            </tr>
          </thead>

          <tbody>
            {visible.length === 0 ? (
              <tr className="text-center">
                <td colSpan="7">No hay reparaciones registradas.</td>
              </tr>
            ) : (
              visible.map((item, index) => (
                <tr key={item.id} className="text-center">
                  <td>{startIndex + index + 1}</td>

                  <td>
                    {item.foto ? (
                      <img
                        src={item.foto}
                        alt={`Componente cambiado por ${item.nombre}`}
                        className="tabla-thumb mx-auto"
                        loading="lazy"
                      />
                    ) : (
                      <span className="tabla-thumb tabla-thumb-empty mx-auto">
                        <Image />
                      </span>
                    )}
                  </td>

                  <td>{item.nombre}</td>
                  <td>{item.codigo}</td>

                  <td>
                    <p className="tabla-desc mx-auto" title={item.descripcion}>
                      {item.descripcion}
                    </p>
                  </td>

                  <td>
                    <button
                      type="button"
                      className="btn btn-success btn-sm"
                      title="Actualizar reparación"
                      aria-label={`Actualizar reparación de ${item.nombre}`}
                      onClick={() => confirmarActualizar(item)}
                    >
                      <ArrowRepeat />
                    </button>
                  </td>

                  <td>
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      title="Eliminar reparación"
                      aria-label={`Eliminar reparación de ${item.nombre}`}
                      onClick={() => confirmarEliminar(item)}
                    >
                      <Trash />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ==========================================
          PAGINADOR
      ========================================== */}
      {total > 0 && (
        <footer className="tabla-footer">
          <span className="tabla-info">
            Mostrando {from}–{to} de {total}
          </span>

          <Pagination className="paginador mb-0">
            <Pagination.Prev
              disabled={current === 1}
              onClick={() => goTo(current - 1)}
            />

            {getPageNumbers(current, totalPages).map((p) =>
              typeof p === "number" ? (
                <Pagination.Item
                  key={p}
                  active={p === current}
                  onClick={() => goTo(p)}
                >
                  {p}
                </Pagination.Item>
              ) : (
                <Pagination.Ellipsis key={p} disabled />
              )
            )}

            <Pagination.Next
              disabled={current === totalPages}
              onClick={() => goTo(current + 1)}
            />
          </Pagination>
        </footer>
      )}
    </div>
  );
}

export default TablaReparaciones;
