import { useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import {
  Clipboard2Check,PlusCircle,PeopleFill
} from "react-bootstrap-icons";

// ==========================================
// CONFIGURACIÓN BASE DE SWEETALERT2
// (los colores combinan con el resto de la app)
// ==========================================

const Alerta = Swal.mixin({
  confirmButtonColor: "#12202b",
  cancelButtonColor: "#6c7a89",
  reverseButtons: true
});

function FormularioTenicComponen() {

  // ==========================================
  // ESTADOS DEL FORMULARIO
  // ==========================================

  const [nombre, setNombre] = useState("");
  const [codigo, setCodigo] = useState("");

  // Lista de técnicos
  const [tecnicos, setTecnicos] = useState([]);

  // Técnico que se está editando
  const [tecnicoEditando, setTecnicoEditando] = useState(null);


  // ==========================================
  // GUARDAR / ACTUALIZAR
  // ==========================================

  const handleSubmit = (e) => {

    e.preventDefault();

    // Validar campos
    if (!nombre.trim() || !codigo.trim()) {

      Alerta.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Todos los campos son obligatorios",
        confirmButtonText: "Entendido"
      });

      return;
    }


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

      Alerta.fire({
        icon: "success",
        title: "¡Técnico actualizado!",
        text: "Los datos se actualizaron correctamente",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false
      });

    }


    // ==========================================
    // CREAR TÉCNICO
    // ==========================================

    else {

      const nuevoTecnico = {

        id: Date.now(),

        nombre: nombre,

        codigo: codigo

      };


      setTecnicos([
        ...tecnicos,
        nuevoTecnico
      ]);

      Alerta.fire({
        icon: "success",
        title: "¡Técnico creado!",
        text: "El técnico se registró correctamente",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false
      });

    }


    // Limpiar formulario
    limpiarFormulario();

  };


  // ==========================================
  // LIMPIAR FORMULARIO
  // ==========================================

  const limpiarFormulario = () => {

    setNombre("");

    setCodigo("");

    setTecnicoEditando(null);

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

  const handleEliminar = async (id) => {

    const tecnico = tecnicos.find(
      (item) => item.id === id
    );


    // Confirmación
    const resultado = await Alerta.fire({
      icon: "warning",
      title: "¿Eliminar técnico?",
      text: tecnico
        ? `Se eliminará a ${tecnico.nombre} (${tecnico.codigo}). Esta acción no se puede deshacer.`
        : "Esta acción no se puede deshacer.",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#c0392b",
      focusCancel: true
    });


    if (!resultado.isConfirmed) {
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


    // Aviso de eliminado
    Alerta.fire({
      icon: "success",
      title: "¡Eliminado!",
      text: "El técnico fue eliminado correctamente",
      timer: 2000,
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

          &nbsp; AGREGAR TÉCNICO

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
              className="active"
            >

              <PlusCircle />

              &nbsp; AGREGAR TÉCNICO

            </Link>

          </li>


          <li>

            <Link to="/TablaTecnico">

              <Clipboard2Check />

              &nbsp; LISTA DE TÉCNICOS

            </Link>

          </li>

        </ul>

      </div>


      {/* ==========================================
          FORMULARIO
      ========================================== */}

      <div
        className="container-fluid"
        id="formulario"
      >

        <form
          onSubmit={handleSubmit}
          className="form-neon"
          autoComplete="off"
        >


          <fieldset>

            <legend>

              <i className="fas fa-user-cog"></i>

              &nbsp;

              {tecnicoEditando !== null
                ? "Actualizar técnico"
                : "Información del técnico"
              }

            </legend>


            <div className="container-fluid">

              <div className="row">


                {/* ==================================
                    NOMBRE
                ================================== */}

                <div className="col-12 col-md-6">

                  <div className="form-group">

                    <label
                      htmlFor="tecnico_nombre"
                      className="bmd-label-floating"
                    >
                      Nombre
                    </label>


                    <input
                      type="text"
                      className="form-control"
                      name="tecnico_nombre"
                      id="tecnico_nombre"
                      maxLength="100"
                      value={nombre}
                      onChange={(e) =>
                        setNombre(e.target.value)
                      }
                    />

                  </div>

                </div>


                {/* ==================================
                    CÓDIGO
                ================================== */}

                <div className="col-12 col-md-6">

                  <div className="form-group">

                    <label
                      htmlFor="tecnico_codigo"
                      className="bmd-label-floating"
                    >
                      Código
                    </label>


                    <input
                      type="text"
                      className="form-control"
                      name="tecnico_codigo"
                      id="tecnico_codigo"
                      maxLength="30"
                      value={codigo}
                      onChange={(e) =>
                        setCodigo(e.target.value)
                      }
                    />

                  </div>

                </div>


              </div>

            </div>

          </fieldset>


          <br />
          <br />
          <br />


          {/* ==========================================
              BOTONES
          ========================================== */}

          <p
            className="text-center"
            style={{ marginTop: "40px" }}
          >

            <button
              type="button"
              className="btn btn-raised btn-secondary btn-sm"
              onClick={limpiarFormulario}
            >

              <i className="fas fa-paint-roller"></i>

              &nbsp; LIMPIAR

            </button>


            &nbsp; &nbsp;


            <button
              type="submit"
              className="btn btn-raised btn-info btn-sm"
            >

              <i className="far fa-save"></i>

              &nbsp;

              {tecnicoEditando !== null
                ? "ACTUALIZAR"
                : "GUARDAR"
              }

            </button>

          </p>

        </form>

      </div>


      


    </section>

  );

}

export default FormularioTenicComponen;
