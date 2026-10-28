import { useState } from "react";
import PageTabs from "./PageTabs.jsx";
import { Pagination } from "react-bootstrap";
import Swal from "sweetalert2";
import {
  Clipboard2Check,PlusCircle,BoxSeam,Trash,ArrowRepeat,
} from "react-bootstrap-icons";

// Configuración base de SweetAlert2 (mismos colores que el resto de la app)
const Alerta = Swal.mixin({
  confirmButtonColor: "#12202b",
  cancelButtonColor: "#6c7a89",
  reverseButtons: true,
});


/* ==========================================
   DATOS ALEATORIOS (solo para pruebas)
   Se usan cuando NO se pasa la prop "productos".
========================================== */
const PRODUCTOS = [
  "Laptop", "Mouse", "Teclado", "Monitor", "Impresora", "Router",
  "Disco SSD", "Memoria RAM", "Cámara web", "Auriculares",
  "Fuente de poder", "Tarjeta de video", "Switch", "UPS",
  "Cable HDMI", "Tablet",
];

const MARCAS = [
  "Logitech", "HP", "Dell", "Lenovo", "Samsung", "Kingston",
  "Asus", "TP-Link", "Acer", "Genius",
];

const aleatorio = (lista) =>
  lista[Math.floor(Math.random() * lista.length)];

/* Fecha aleatoria dentro de los últimos 90 días (AAAA-MM-DD) */
const fechaAleatoria = () => {
  const fecha = new Date();

  fecha.setDate(fecha.getDate() - Math.floor(Math.random() * 90));

  return fecha.toISOString().split("T")[0];
};

function generarProductos(cantidad = 37) {
  return Array.from({ length: cantidad }, (_, i) => ({
    id: i + 1,
    nombre: `${aleatorio(PRODUCTOS)} ${aleatorio(MARCAS)}`,
    cantidad: Math.floor(Math.random() * 100) + 1,
    fecha: fechaAleatoria(),
  }));
}


/* ==========================================
   PAGINADOR
========================================== */

// Filas que se muestran por página
const FILAS_POR_PAGINA = 5;

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
  Props:
  - productos: arreglo de { id, nombre, cantidad, fecha }.
               Si NO se pasa, la tabla se llena con datos aleatorios.
  - onActualizar(producto): se llama si el usuario responde "Sí" al actualizar
  - onEliminar(id):         se llama si el usuario responde "Sí" al eliminar
                            (puede ser async; si lanza error se muestra alerta roja)
*/
function TablaProduct({
  productos,
  onActualizar,
  onEliminar,
}) {
  const [page, setPage] = useState(1);

  // Si no llegan datos por props, se generan (una sola vez) datos aleatorios
  const esControlado = productos !== undefined;
  const [datosPrueba, setDatosPrueba] = useState(() =>
    esControlado ? [] : generarProductos()
  );
  const datos = esControlado ? productos : datosPrueba;

  /* ---------- Paginación ---------- */
  const total = datos.length;
  const totalPages = Math.max(1, Math.ceil(total / FILAS_POR_PAGINA));
  const current = Math.min(page, totalPages); // si se borra la última fila de una página, retrocede sola
  const startIndex = (current - 1) * FILAS_POR_PAGINA;
  const visibles = datos.slice(startIndex, startIndex + FILAS_POR_PAGINA);

  const from = total === 0 ? 0 : startIndex + 1;
  const to = startIndex + visibles.length;

  const goTo = (p) => setPage(Math.min(Math.max(1, p), totalPages));

  /* ==========================================
     ALERTAS DE DECISIÓN (SÍ / NO)
  ========================================== */

  // Botón ACTUALIZAR
  const confirmarActualizar = async (producto) => {
    const resultado = await Alerta.fire({
      icon: "question",
      title: "¿Actualizar producto?",
      text: `Se cargarán los datos de "${producto.nombre}" para editarlos.`,
      showCancelButton: true,
      confirmButtonText: "Sí, actualizar",
      cancelButtonText: "No",
      confirmButtonColor: "#198754",
    });

    if (!resultado.isConfirmed) return;

    if (onActualizar) {
      onActualizar(producto);
    } else {
      // Modo prueba: no hay formulario conectado
      Alerta.fire({
        icon: "info",
        title: "Producto seleccionado",
        text: `Seleccionaste "${producto.nombre}".`,
        timer: 1800,
        timerProgressBar: true,
        showConfirmButton: false,
      });
    }
  };

  // Botón ELIMINAR
  const confirmarEliminar = async (producto) => {
    const resultado = await Alerta.fire({
      icon: "warning",
      title: "¿Eliminar producto?",
      text: `Se eliminará "${producto.nombre}" (${producto.cantidad} unidades). Esta acción no se puede deshacer.`,
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "No",
      confirmButtonColor: "#c0392b",
      focusCancel: true,
    });

    if (!resultado.isConfirmed) return;

    try {
      await onEliminar?.(producto.id);

      // Con datos de prueba, la tabla se encarga de quitar la fila
      if (!esControlado) {
        setDatosPrueba((prev) => prev.filter((p) => p.id !== producto.id));
      }

      Alerta.fire({
        icon: "success",
        title: "¡Eliminado!",
        text: "El producto fue eliminado correctamente",
        timer: 1800,
        timerProgressBar: true,
        showConfirmButton: false,
      });
    } catch (error) {
      Alerta.fire({
        icon: "error",
        title: "No se pudo eliminar",
        text: "No se pudo eliminar el producto. Inténtalo de nuevo.",
        confirmButtonText: "Entendido",
      });
    }
  };

  return (
    <div className="container-fluid" id="lista-productos">
      {/* ==========================================
          ENCABEZADO
      ========================================== */}

      <div className="full-box page-header">

        <h3 className="text-left">

          <BoxSeam />

          &nbsp; LISTA DE PRODUCTOS

        </h3>


        <p className="text-justify">

          Registra los técnicos que forman parte
          del sistema. Puedes crear, actualizar
          y eliminar técnicos.

        </p>

      </div>


      {/* ==========================================
          PESTAÑAS
      ========================================== */}

      <PageTabs modulo="producto" />

      <div className="table-responsive">
        <table className="table table-dark table-sm">
          <thead>
            <tr className="text-center roboto-medium">
              <th>#</th>
              <th>PRODUCTO</th>
              <th>CANTIDAD</th>
              <th>FECHA</th>
              <th>ACTUALIZAR</th>
              <th>ELIMINAR</th>
            </tr>
          </thead>

          <tbody>
            {visibles.length === 0 ? (
              <tr className="text-center">
                <td colSpan="6">
                  No hay productos registrados.
                </td>
              </tr>
            ) : (
              visibles.map((producto, index) => (
                <tr
                  key={producto.id}
                  className="text-center"
                >
                  <td>{startIndex + index + 1}</td>
                  <td>{producto.nombre}</td>
                  <td>{producto.cantidad}</td>
                  <td>{producto.fecha}</td>

                  <td>
                    <button
                      type="button"
                      className="btn btn-success btn-sm"
                      title="Actualizar producto"
                      onClick={() => confirmarActualizar(producto)}
                    >
                       <ArrowRepeat />
                    </button>
                  </td>

                  <td>
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      title="Eliminar producto"
                      onClick={() => confirmarEliminar(producto)}
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

export default TablaProduct;
