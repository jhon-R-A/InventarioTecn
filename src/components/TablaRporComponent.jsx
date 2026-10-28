import { useState } from "react";
import Swal from "sweetalert2";

// Configuración base de SweetAlert2 (mismos colores que el resto de la app)
const Alerta = Swal.mixin({
  confirmButtonColor: "#12202b",
  cancelButtonColor: "#6c7a89",
  reverseButtons: true,
});

function TablaComponent() {

  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  // Nuevo filtro
  const [busqueda, setBusqueda] = useState("");

  const [resultados, setResultados] = useState([]);

  /*
   * Datos de ejemplo.
   * Posteriormente estos datos pueden
   * venir desde una API o base de datos.
   */
  const datos = [
    {
      id: 1,
      fecha: "2026-10-01",
      tecnico: "Carlos Pérez",
      codigo: "TEC001",
      producto: "Laptop",
      cantidad: 5
    },
    {
      id: 2,
      fecha: "2026-10-02",
      tecnico: "Juan Gómez",
      codigo: "TEC002",
      producto: "Mouse",
      cantidad: 20
    },
    {
      id: 3,
      fecha: "2026-10-03",
      tecnico: "Carlos Pérez",
      codigo: "TEC001",
      producto: "Teclado",
      cantidad: 10
    },
    {
      id: 4,
      fecha: "2026-10-05",
      tecnico: "Ana Rodríguez",
      codigo: "TEC003",
      producto: "Monitor",
      cantidad: 8
    }
  ];


  const buscarReporte = (e) => {

    e.preventDefault();

    // Alerta: faltan las fechas
    if (!fechaInicio || !fechaFin) {

      Alerta.fire({
        icon: "warning",
        title: "Fechas incompletas",
        text: "Seleccione la fecha inicial y la fecha final",
        confirmButtonText: "Entendido"
      }).then(() => {

        // Lleva el cursor a la primera fecha vacía
        const idVacio = !fechaInicio
          ? "fechaInicio"
          : "fechaFin";

        document.getElementById(idVacio)?.focus();

      });

      return;
    }

    const textoBusqueda = busqueda
      .trim()
      .toLowerCase();


    const filtrados = datos.filter((registro) => {

      // Filtro por fechas
      const coincideFecha =
        registro.fecha >= fechaInicio &&
        registro.fecha <= fechaFin;


      // Filtro por código o nombre
      const coincideBusqueda =
        textoBusqueda === "" ||
        registro.codigo
          .toLowerCase()
          .includes(textoBusqueda) ||
        registro.tecnico
          .toLowerCase()
          .includes(textoBusqueda);


      return coincideFecha && coincideBusqueda;

    });


    setResultados(filtrados);


    // Alerta: resultado de la búsqueda
    if (filtrados.length === 0) {

      Alerta.fire({
        icon: "info",
        title: "Sin resultados",
        text: "No hay información para los filtros seleccionados",
        confirmButtonText: "Entendido"
      });

    } else {

      Alerta.fire({
        icon: "success",
        title: "¡Reporte generado!",
        text: `Se encontraron ${filtrados.length} ${
          filtrados.length === 1 ? "registro" : "registros"
        }`,
        timer: 1800,
        timerProgressBar: true,
        showConfirmButton: false
      });

    }
  };


  const limpiarBusqueda = () => {

    setFechaInicio("");
    setFechaFin("");
    setBusqueda("");
    setResultados([]);

  };


  return (
   <>
   {/* Page header */}
      <div className="full-box page-header">

        <h3 className="text-left">

          <i className="fas fa-chart-bar fa-fw"></i>

          &nbsp; REPORTES

        </h3>

        <p className="text-justify">

          Consulta la información registrada
          por rango de fechas, código o nombre
          del técnico.

        </p>

      </div>


      {/* Filtros */}
      <div className="container-fluid">

        <form
          className="form-neon"
          onSubmit={buscarReporte}
        >

          <div className="container-fluid">

            <div className="row justify-content-md-center">

              {/* Fecha inicial */}
              <div className="col-12 col-md-4">

                <div className="form-group">

                  <label
                    htmlFor="fechaInicio"
                    className="bmd-label-floating"
                  >
                    Fecha inicial
                  </label>

                  <input
                    type="date"
                    className="form-control"
                    name="fechaInicio"
                    id="fechaInicio"
                    value={fechaInicio}
                    onChange={(e) =>
                      setFechaInicio(e.target.value)
                    }
                  />

                </div>

              </div>


              {/* Fecha final */}
              <div className="col-12 col-md-4">

                <div className="form-group">

                  <label
                    htmlFor="fechaFin"
                    className="bmd-label-floating"
                  >
                    Fecha final
                  </label>

                  <input
                    type="date"
                    className="form-control"
                    name="fechaFin"
                    id="fechaFin"
                    value={fechaFin}
                    onChange={(e) =>
                      setFechaFin(e.target.value)
                    }
                  />

                </div>

              </div>


              {/* Código o nombre */}
              <div className="col-12 col-md-8">

                <div className="form-group">

                  <label
                    htmlFor="busqueda"
                    className="bmd-label-floating"
                  >
                    Buscar por código o nombre del técnico
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    name="busqueda"
                    id="busqueda"
                    maxLength="100"
                    value={busqueda}
                    onChange={(e) =>
                      setBusqueda(e.target.value)
                    }
                  />

                </div>

              </div>


              {/* Botones */}
              <div className="col-12">

                <p
                  className="text-center"
                  style={{ marginTop: "40px" }}
                >

                  <button
                    type="submit"
                    className="btn btn-raised btn-info"
                  >

                    <i className="fas fa-search"></i>

                    &nbsp; BUSCAR

                  </button>

                  &nbsp; &nbsp;

                  <button
                    type="button"
                    className="btn btn-raised btn-secondary"
                    onClick={limpiarBusqueda}
                  >

                    <i className="fas fa-eraser"></i>

                    &nbsp; LIMPIAR

                  </button>

                </p>

              </div>

            </div>

          </div>

        </form>

      </div>


      {/* Información de resultados */}
      <div className="container-fluid">

        <div className="container-fluid">

          <div className="row justify-content-md-center">

            <div className="col-12 col-md-6">

              <p
                className="text-center"
                style={{ fontSize: "20px" }}
              >

                Resultados del reporte

                {resultados.length > 0 && (
                  <>
                    {" "}
                    <strong>
                      ({resultados.length} registros)
                    </strong>
                  </>
                )}

              </p>

            </div>


            {/* Botón eliminar búsqueda */}
            {resultados.length > 0 && (

              <div className="col-12">

                <p
                  className="text-center"
                  style={{ marginTop: "20px" }}
                >

                  <button
                    type="button"
                    className="btn btn-raised btn-danger"
                    onClick={limpiarBusqueda}
                  >

                    <i className="far fa-trash-alt"></i>

                    &nbsp; ELIMINAR BÚSQUEDA

                  </button>

                </p>

              </div>

            )}

          </div>

        </div>

      </div>


      {/* Tabla */}
      <div className="container-fluid">

        <div className="table-responsive">

          <table className="table table-dark table-sm">

            <thead>

              <tr className="text-center roboto-medium">

                <th>#</th>

                <th>FECHA</th>

                <th>TÉCNICO</th>

                <th>CÓDIGO</th>

                <th>PRODUCTO</th>

                <th>CANTIDAD</th>

              </tr>

            </thead>


            <tbody>

              {resultados.length === 0 ? (

                <tr className="text-center">

                  <td colSpan="6">

                    No hay información para mostrar.

                  </td>

                </tr>

              ) : (

                resultados.map((registro, index) => (

                  <tr
                    key={registro.id}
                    className="text-center"
                  >

                    <td>
                      {index + 1}
                    </td>

                    <td>
                      {registro.fecha}
                    </td>

                    <td>
                      {registro.tecnico}
                    </td>

                    <td>
                      {registro.codigo}
                    </td>

                    <td>
                      {registro.producto}
                    </td>

                    <td>
                      {registro.cantidad}
                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>
   </>
   
  );

}

export default TablaComponent;
