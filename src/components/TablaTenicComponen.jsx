import { useState } from "react";
import { Link } from "react-router-dom";
import { Pagination } from "react-bootstrap";
import Swal from "sweetalert2";
import {
  Clipboard2Check,PlusCircle,PeopleFill,ArrowRepeat,Trash
} from "react-bootstrap-icons";

// Configuración base de SweetAlert2 (mismos colores que el resto de la app)
const Alerta = Swal.mixin({
  confirmButtonColor: "#12202b",
  cancelButtonColor: "#6c7a89",
  reverseButtons: true,
});


// ==========================================
// DATOS ALEATORIOS (solo para pruebas)
// ==========================================

const NOMBRES = [
  "Carlos", "María", "Juan", "Laura", "Andrés", "Sofía",
  "Diego", "Camila", "Felipe", "Valentina", "Mateo", "Daniela",
];

const APELLIDOS = [
  "Alfaro", "Gómez", "Pérez", "Ríos", "Mora", "Castro",
  "Vargas", "Herrera", "Ortiz", "Ruiz", "Salazar", "Peña",
];

const aleatorio = (lista) =>
  lista[Math.floor(Math.random() * lista.length)];

const CARACTERES = "abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";

const contrasenaAleatoria = (largo = 8) =>
  Array.from({ length: largo }, () =>
    CARACTERES[Math.floor(Math.random() * CARACTERES.length)]
  ).join("");

function generarTecnicos(cantidad = 37) {

  return Array.from({ length: cantidad }, (_, i) => ({

    id: i + 1,

    nombre: `${aleatorio(NOMBRES)} ${aleatorio(APELLIDOS)}`,

    codigo: `TEC-${String(i + 1).padStart(4, "0")}`,

    contrasena: contrasenaAleatoria()

  }));

}


// ==========================================
// PAGINADOR
// ==========================================

// Filas que se muestran por página
const FILAS_POR_PAGINA = 5;

// Devuelve los números de página a mostrar: 1 … 4 5 6 … 12
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


function TablaTenicComponen() {

  

  // Lista de técnicos (se llena con datos aleatorios)
  const [tecnicos, setTecnicos] = useState(() => generarTecnicos());

  // Técnico que se está editando
  const [tecnicoEditando, setTecnicoEditando] = useState(null);

  // Página actual
  const [page, setPage] = useState(1);


  // ==========================================
  // CÁLCULO DE LA PÁGINA
  // ==========================================

  const total = tecnicos.length;

  const totalPages = Math.max(
    1,
    Math.ceil(total / FILAS_POR_PAGINA)
  );

  // Si se elimina la última fila de una página, retrocede sola
  const current = Math.min(page, totalPages);

  const startIndex = (current - 1) * FILAS_POR_PAGINA;

  const visibles = tecnicos.slice(
    startIndex,
    startIndex + FILAS_POR_PAGINA
  );

  const from = total === 0 ? 0 : startIndex + 1;

  const to = startIndex + visibles.length;

  const goTo = (p) =>
    setPage(Math.min(Math.max(1, p), totalPages));


  // ==========================================
  // GUARDAR / ACTUALIZAR
  // ==========================================

  const handleSubmit = (e) => {

    e.preventDefault();

   


    // ==========================================
    // ACTUALIZAR TÉCNICO
    // ==========================================

    if (tecnicoEditando !== null) {

      const tecnicosActualizados = tecnicos.map((tecnico) => {

        if (tecnico.id === tecnicoEditando) {

          return {
            ...tecnico,
            nombre: nombre,
            codigo: codigo
          };

        }

        return tecnico;

      });


      setTecnicos(tecnicosActualizados);

      alert("Técnico actualizado correctamente");

    }
  };

  // ==========================================
  // EDITAR TÉCNICO
  // ==========================================

  const handleEditar = (tecnico) => {

    // (en esta tabla no hay formulario, solo se marca el técnico)
    setTecnicoEditando(tecnico.id);

    // Llevar el usuario al formulario
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  };


  // ==========================================
  // ELIMINAR TÉCNICO
  // ==========================================

  const handleEliminar = (id) => {

    const tecnicosFiltrados = tecnicos.filter(
      (tecnico) => tecnico.id !== id
    );


    setTecnicos(tecnicosFiltrados);


    // Si estaba editando ese técnico,
    // se deja de editar
    if (tecnicoEditando === id) {

      setTecnicoEditando(null);

    }

  };


  // ==========================================
  // ALERTAS DE DECISIÓN (SÍ / NO)
  // ==========================================

  // Botón ACTUALIZAR
  const confirmarActualizar = async (tecnico) => {

    const resultado = await Alerta.fire({
      icon: "question",
      title: "¿Actualizar técnico?",
      text: `Se cargarán los datos de ${tecnico.nombre} (${tecnico.codigo}) para editarlos.`,
      showCancelButton: true,
      confirmButtonText: "Sí, actualizar",
      cancelButtonText: "No",
      confirmButtonColor: "#198754"
    });


    if (resultado.isConfirmed) {

      handleEditar(tecnico);

      Alerta.fire({
        icon: "info",
        title: "Técnico seleccionado",
        text: `Seleccionaste a ${tecnico.nombre} (${tecnico.codigo}).`,
        timer: 1800,
        timerProgressBar: true,
        showConfirmButton: false
      });

    }

  };


  // Botón ELIMINAR
  const confirmarEliminar = async (tecnico) => {

    const resultado = await Alerta.fire({
      icon: "warning",
      title: "¿Eliminar técnico?",
      text: `Se eliminará a ${tecnico.nombre} (${tecnico.codigo}). Esta acción no se puede deshacer.`,
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "No",
      confirmButtonColor: "#c0392b",
      focusCancel: true
    });


    if (!resultado.isConfirmed) {
      return;
    }


    handleEliminar(tecnico.id);


    Alerta.fire({
      icon: "success",
      title: "¡Eliminado!",
      text: "El técnico fue eliminado correctamente",
      timer: 1800,
      timerProgressBar: true,
      showConfirmButton: false
    });

  };


  return (

    <section className="full-box page-content">


      {/* ==========================================
          ENCABEZADO
      ========================================== */}

      <div className="full-box page-header">

        <h3 className="text-left">

          <PeopleFill />

          &nbsp; LISTA DE TÉCNICOS

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

      <div className="container-fluid">

        <ul className="full-box list-unstyled page-nav-tabs">

          <li>

            <Link
              to="/CreateTecnico"
              
            >

              <PlusCircle />

              &nbsp; AGREGAR TÉCNICO

            </Link>

          </li>


          <li>

            <Link to="/TablaTecnico" className="active">
                  
              <Clipboard2Check />

              &nbsp; LISTA DE TÉCNICOS

            </Link>

          </li>

        </ul>

      </div>


     


      {/* ==========================================
          TABLA
      ========================================== */}

      <div
        className="container-fluid"
        id="lista"
      >

        <h3 className="text-left tabla-titulo">

          <i className="fas fa-clipboard-list fa-fw"></i>

          &nbsp; LISTA DE TÉCNICOS

        </h3>


        {/* Contenedor que limita el ancho para que la tabla no se estire */}
        <div className="tabla-compacta">

        <div className="table-responsive">

          <table className="table table-dark table-sm tabla-tecnicos">

            <thead>

              <tr>

                <th>#</th>

                <th>
                  NOMBRE
                </th>

                <th>
                  CÓDIGO
                </th>

                <th>
                  CONTRASEÑA
                </th>

                <th>
                  ACTUALIZAR
                </th>

                <th>
                  ELIMINAR
                </th>

              </tr>

            </thead>


            <tbody>

              {visibles.length === 0 ? (

                <tr>

                  <td
                    colSpan="6"
                    className="text-center"
                  >

                    No hay técnicos registrados.

                  </td>

                </tr>

              ) : (

                visibles.map((tecnico, index) => (

                  <tr key={tecnico.id}>

                    <td>
                      {startIndex + index + 1}
                    </td>


                    <td>
                      {tecnico.nombre}
                    </td>


                    <td>
                      {tecnico.codigo}
                    </td>


                    {/* La contraseña nunca se muestra en la tabla */}
                    <td aria-label="Contraseña oculta">
                      ••••••••
                    </td>


                    {/* ACTUALIZAR */}

                    <td>

                      <button
                        type="button"
                        className="btn btn-success btn-sm"
                        title="Actualizar técnico"
                        aria-label={`Actualizar a ${tecnico.nombre}`}
                        onClick={() =>
                          confirmarActualizar(tecnico)
                        }
                      >

                        <ArrowRepeat />

                      </button>

                    </td>


                    {/* ELIMINAR */}

                    <td>

                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        title="Eliminar técnico"
                        aria-label={`Eliminar a ${tecnico.nombre}`}
                        onClick={() =>
                          confirmarEliminar(tecnico)
                        }
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


    </section>

  );

}

export default TablaTenicComponen;
