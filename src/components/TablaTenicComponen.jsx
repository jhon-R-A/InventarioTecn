import { useState } from "react";

function TablaTenicComponen() {

  

  // Lista de técnicos
  const [tecnicos, setTecnicos] = useState([]);

  // Técnico que se está editando
  const [tecnicoEditando, setTecnicoEditando] = useState(null);


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

    setNombre(tecnico.nombre);

    setCodigo(tecnico.codigo);

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

    const confirmar = window.confirm(
      "¿Está seguro de que desea eliminar este técnico?"
    );


    if (!confirmar) {
      return;
    }


    const tecnicosFiltrados = tecnicos.filter(
      (tecnico) => tecnico.id !== id
    );


    setTecnicos(tecnicosFiltrados);


    // Si estaba editando ese técnico,
    // limpiamos el formulario
    if (tecnicoEditando === id) {

      limpiarFormulario();

    }

  };


  return (

    <section className="full-box page-content">


      {/* ==========================================
          ENCABEZADO
      ========================================== */}

      <div className="full-box page-header">

        <h3 className="text-left">

          <i className="fas fa-plus fa-fw"></i>

          &nbsp; BUSCAR TÉCNICO

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

            <a
              href="#formulario"
              className="active"
            >

              <i className="fas fa-plus fa-fw"></i>

              &nbsp; AGREGAR TÉCNICO

            </a>

          </li>


          <li>

            <a href="#lista">

              <i className="fas fa-clipboard-list fa-fw"></i>

              &nbsp; LISTA DE TÉCNICOS

            </a>

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

        <br />
        <br />


        <h3 className="text-left">

          <i className="fas fa-clipboard-list fa-fw"></i>

          &nbsp; LISTA DE TÉCNICOS

        </h3>


        <div className="table-responsive">

          <table className="table table-dark table-sm">

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
                  ACTUALIZAR
                </th>

                <th>
                  ELIMINAR
                </th>

              </tr>

            </thead>


            <tbody>

              {tecnicos.length === 0 ? (

                <tr>

                  <td
                    colSpan="5"
                    className="text-center"
                  >

                    No hay técnicos registrados.

                  </td>

                </tr>

              ) : (

                tecnicos.map((tecnico, index) => (

                  <tr key={tecnico.id}>

                    <td>
                      {index + 1}
                    </td>


                    <td>
                      {tecnico.nombre}
                    </td>


                    <td>
                      {tecnico.codigo}
                    </td>


                    {/* ACTUALIZAR */}

                    <td>

                      <button
                        type="button"
                        className="btn btn-success btn-sm"
                        onClick={() =>
                          handleEditar(tecnico)
                        }
                      >

                        <i className="fas fa-sync-alt"></i>

                        &nbsp; ACTUALIZAR

                      </button>

                    </td>


                    {/* ELIMINAR */}

                    <td>

                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() =>
                          handleEliminar(tecnico.id)
                        }
                      >

                        <i className="far fa-trash-alt"></i>

                        &nbsp; ELIMINAR

                      </button>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>


    </section>

  );

}

export default TablaTenicComponen;
