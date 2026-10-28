import { useState } from "react";
import PageTabs from "./PageTabs.jsx";
import { Pagination } from "react-bootstrap";
import Swal from "sweetalert2";
import {
  Clipboard2Check,PlusCircle,Building,ArrowRepeat,Trash
} from "react-bootstrap-icons";

// Configuración base de SweetAlert2 (mismos colores que el resto de la app)
const Alerta = Swal.mixin({
  confirmButtonColor: "#12202b",
  cancelButtonColor: "#6c7a89",
  reverseButtons: true,
});


/* ==========================================
   DATOS ALEATORIOS (solo para pruebas)
   Se usan cuando NO se pasa la prop "empresas".
========================================== */
const PREFIJOS = [
  "Tecno", "Comercial", "Distribuidora", "Inversiones", "Servicios",
  "Grupo", "Industrias", "Soluciones", "Importadora", "Logística",
];

const SUFIJOS = [
  "Andina", "del Norte", "Global", "Delta", "Central",
  "Pacífico", "Express", "Integral", "Moderna", "Unidos",
];

const FORMAS = ["S.A.S.", "S.A.", "Ltda."];

const aleatorio = (lista) =>
  lista[Math.floor(Math.random() * lista.length)];

/* Quita tildes y espacios para armar el usuario: "Logística Andina" -> "logisticaandina" */
const aSlug = (texto) =>
  texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

const CARACTERES = "abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";

const contrasenaAleatoria = (largo = 8) =>
  Array.from({ length: largo }, () =>
    CARACTERES[Math.floor(Math.random() * CARACTERES.length)]
  ).join("");

function generarEmpresas(cantidad = 37) {
  return Array.from({ length: cantidad }, (_, i) => {
    const base = `${aleatorio(PREFIJOS)} ${aleatorio(SUFIJOS)}`;

    return {
      id: i + 1,
      nombre: `${base} ${aleatorio(FORMAS)}`,
      usuario: `${aSlug(base)}${String(i + 1).padStart(2, "0")}`,
      contrasena: contrasenaAleatoria(),
    };
  });
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
  Props (todas opcionales):
  - empresas: arreglo de { id, nombre, usuario, contrasena }.
              Si NO se pasa, la tabla se llena con datos aleatorios.
  - onActualizar(empresa): se llama si el usuario responde "Sí" al actualizar
  - onEliminar(id):        se llama si el usuario responde "Sí" al eliminar
                           (puede ser async; si lanza error se muestra alerta roja)
*/
function TableEmpresacomponen({
  empresas,
  onActualizar,
  onEliminar,
}) {
  const [page, setPage] = useState(1);

  // Si no llegan datos por props, se generan (una sola vez) datos aleatorios
  const esControlado = empresas !== undefined;
  const [datosPrueba, setDatosPrueba] = useState(() =>
    esControlado ? [] : generarEmpresas()
  );
  const datos = esControlado ? empresas : datosPrueba;

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
  const confirmarActualizar = async (empresa) => {
    const resultado = await Alerta.fire({
      icon: "question",
      title: "¿Actualizar empresa?",
      text: `Se cargarán los datos de "${empresa.nombre}" para editarlos.`,
      showCancelButton: true,
      confirmButtonText: "Sí, actualizar",
      cancelButtonText: "No",
      confirmButtonColor: "#198754",
    });

    if (!resultado.isConfirmed) return;

    if (onActualizar) {
      onActualizar(empresa);
    } else {
      // Modo prueba: no hay formulario conectado
      Alerta.fire({
        icon: "info",
        title: "Empresa seleccionada",
        text: `Seleccionaste "${empresa.nombre}".`,
        timer: 1800,
        timerProgressBar: true,
        showConfirmButton: false,
      });
    }
  };

  // Botón ELIMINAR
  const confirmarEliminar = async (empresa) => {
    const resultado = await Alerta.fire({
      icon: "warning",
      title: "¿Eliminar empresa?",
      text: `Se eliminará "${empresa.nombre}". Esta acción no se puede deshacer.`,
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "No",
      confirmButtonColor: "#c0392b",
      focusCancel: true,
    });

    if (!resultado.isConfirmed) return;

    try {
      await onEliminar?.(empresa.id);

      // Con datos de prueba, la tabla se encarga de quitar la fila
      if (!esControlado) {
        setDatosPrueba((prev) => prev.filter((e) => e.id !== empresa.id));
      }

      Alerta.fire({
        icon: "success",
        title: "¡Eliminada!",
        text: "La empresa fue eliminada correctamente",
        timer: 1800,
        timerProgressBar: true,
        showConfirmButton: false,
      });
    } catch (error) {
      Alerta.fire({
        icon: "error",
        title: "No se pudo eliminar",
        text: "No se pudo eliminar la empresa. Inténtalo de nuevo.",
        confirmButtonText: "Entendido",
      });
    }
  };

  return (
    <div className="container-fluid" id="lista-empresas">

      {/* ==========================================
          ENCABEZADO
      ========================================== */}

      <div className="full-box page-header">

        <h3 className="text-left">

          <Building />

          &nbsp; LISTA DE EMPRESAS

        </h3>


        <p className="text-justify">

          Consulta las empresas registradas en el
          sistema. Puedes actualizar y eliminar
          cada empresa.

        </p>

      </div>


      {/* ==========================================
          PESTAÑAS
      ========================================== */}

     <PageTabs modulo="empresa" />


      {/* ==========================================
          TABLA
      ========================================== */}

      <div className="tabla-compacta">

        <div className="table-responsive">

          <table className="table table-dark table-sm tabla-tecnicos">

            <thead>

              <tr>

                <th>#</th>

                <th>EMPRESA</th>

                <th>USUARIO</th>

                <th>CONTRASEÑA</th>

                <th>ACTUALIZAR</th>

                <th>ELIMINAR</th>

              </tr>

            </thead>


            <tbody>

              {visibles.length === 0 ? (

                <tr>

                  <td
                    colSpan="6"
                    className="text-center"
                  >

                    No hay empresas registradas.

                  </td>

                </tr>

              ) : (

                visibles.map((empresa, index) => (

                  <tr key={empresa.id}>

                    <td>{startIndex + index + 1}</td>

                    <td>{empresa.nombre}</td>

                    <td>{empresa.usuario}</td>

                    {/* La contraseña nunca se muestra en la tabla */}
                    <td aria-label="Contraseña oculta">
                      ••••••••
                    </td>


                    {/* ACTUALIZAR */}

                    <td>

                      <button
                        type="button"
                        className="btn btn-success btn-sm"
                        title="Actualizar empresa"
                        aria-label={`Actualizar ${empresa.nombre}`}
                        onClick={() => confirmarActualizar(empresa)}
                      >

                        <ArrowRepeat />

                      </button>

                    </td>


                    {/* ELIMINAR */}

                    <td>

                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        title="Eliminar empresa"
                        aria-label={`Eliminar ${empresa.nombre}`}
                        onClick={() => confirmarEliminar(empresa)}
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

    </div>
  );
}

export default TableEmpresacomponen;
