import { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import {
  PersonCircle,PencilSquare,Save,X,Eye,EyeSlash
} from "react-bootstrap-icons";

// Configuración base de SweetAlert2 (mismos colores que el resto de la app)
const Alerta = Swal.mixin({
  confirmButtonColor: "#12202b",
  cancelButtonColor: "#6c7a89",
  reverseButtons: true,
});

// Largo mínimo del nombre y de la contraseña
const MIN_NOMBRE = 3;
const MIN_CONTRASENA = 6;

// Datos de ejemplo (se usan si no se pasa la prop "usuario")
const USUARIO_EJEMPLO = {
  nombre: "Carlos Alfaro",
  contrasena: "123456",
};

/*
  Props (todas opcionales):
  - usuario:       objeto { nombre, contrasena } con los datos actuales
  - onActualizar(datos): se llama con { nombre, contrasena } cuando el usuario
                   confirma los cambios (puede ser async; si lanza error se
                   muestra una alerta roja y los datos NO se modifican)
*/
function PerfilComponen({
  usuario = USUARIO_EJEMPLO,
  onActualizar,
}) {

  // ==========================================
  // ESTADOS
  // ==========================================

  // Datos guardados (lo que realmente tiene el usuario)
  const [datos, setDatos] = useState(usuario);

  // Valores que se están escribiendo en los campos
  const [nombre, setNombre] = useState(usuario.nombre);
  const [contrasena, setContrasena] = useState(usuario.contrasena);

  // false = los campos están bloqueados (solo lectura)
  const [editando, setEditando] = useState(false);

  const [verContrasena, setVerContrasena] = useState(false);
  const [guardando, setGuardando] = useState(false);

  const nombreRef = useRef(null);


  // Al activar la edición, el cursor va al primer campo
  useEffect(() => {

    if (editando) {
      nombreRef.current?.focus();
    }

  }, [editando]);


  // ==========================================
  // ACTIVAR / CANCELAR EDICIÓN
  // ==========================================

  const iniciarEdicion = () => {

    setEditando(true);

  };


  const cancelarEdicion = () => {

    // Se descartan los cambios y se vuelve a los datos guardados
    setNombre(datos.nombre);

    setContrasena(datos.contrasena);

    setVerContrasena(false);

    setEditando(false);

  };


  // ==========================================
  // GUARDAR CAMBIOS
  // ==========================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    // Seguridad: sin pulsar ACTUALIZAR DATOS no se puede guardar nada
    if (!editando) {
      return;
    }


    // ------------------------------------------
    // Validaciones
    // ------------------------------------------

    if (!nombre.trim() || !contrasena) {

      Alerta.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Todos los campos son obligatorios",
        confirmButtonText: "Entendido"
      }).then(() => {

        // Lleva el cursor al primer campo vacío
        if (!nombre.trim()) {
          nombreRef.current?.focus();
        } else {
          document.getElementById("perfil_contrasena")?.focus();
        }

      });

      return;
    }


    if (nombre.trim().length < MIN_NOMBRE) {

      Alerta.fire({
        icon: "error",
        title: "Nombre muy corto",
        text: `El nombre debe tener al menos ${MIN_NOMBRE} caracteres`,
        confirmButtonText: "Entendido"
      }).then(() => nombreRef.current?.focus());

      return;
    }


    if (contrasena.length < MIN_CONTRASENA) {

      Alerta.fire({
        icon: "error",
        title: "Contraseña muy corta",
        text: `La contraseña debe tener al menos ${MIN_CONTRASENA} caracteres`,
        confirmButtonText: "Entendido"
      }).then(() => document.getElementById("perfil_contrasena")?.focus());

      return;
    }


    // ------------------------------------------
    // Sin cambios
    // ------------------------------------------

    if (
      nombre.trim() === datos.nombre &&
      contrasena === datos.contrasena
    ) {

      Alerta.fire({
        icon: "info",
        title: "Sin cambios",
        text: "No modificaste ningún dato",
        timer: 1800,
        timerProgressBar: true,
        showConfirmButton: false
      });

      setVerContrasena(false);

      setEditando(false);

      return;
    }


    // ------------------------------------------
    // Confirmación (SÍ / NO)
    // ------------------------------------------

    const resultado = await Alerta.fire({
      icon: "question",
      title: "¿Guardar los cambios?",
      text: "Se actualizarán los datos de tu perfil.",
      showCancelButton: true,
      confirmButtonText: "Sí, guardar",
      cancelButtonText: "No",
      confirmButtonColor: "#198754"
    });


    if (!resultado.isConfirmed) {
      return;
    }


    // ------------------------------------------
    // Guardar
    // ------------------------------------------

    const nuevosDatos = {
      nombre: nombre.trim(),
      contrasena: contrasena
    };


    setGuardando(true);

    try {

      await onActualizar?.(nuevosDatos);

    } catch (error) {

      Alerta.fire({
        icon: "error",
        title: "No se pudo actualizar",
        text: "Ocurrió un error al guardar los cambios. Inténtalo de nuevo.",
        confirmButtonText: "Entendido"
      });

      setGuardando(false);

      return;
    }


    setDatos(nuevosDatos);

    setNombre(nuevosDatos.nombre);

    setVerContrasena(false);

    setEditando(false);

    setGuardando(false);


    Alerta.fire({
      icon: "success",
      title: "¡Perfil actualizado!",
      text: "Tus datos se actualizaron correctamente",
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: false
    });

  };


  return (

    <div
      className="container-fluid"
      id="perfil"
    >


      {/* ==========================================
          ENCABEZADO
      ========================================== */}

      <div className="full-box page-header">

        <h3 className="text-left">

          <PersonCircle />

          &nbsp; MI PERFIL

        </h3>


        <p className="text-justify">

          Consulta la información de tu cuenta.
          Para modificar tus datos, pulsa el botón
          ACTUALIZAR DATOS.

        </p>

      </div>


      {/* ==========================================
          FORMULARIO
      ========================================== */}

      <form
        className="form-neon"
        autoComplete="off"
        onSubmit={handleSubmit}
      >


        <fieldset>

          <legend>

            <PersonCircle />

            &nbsp;

            {editando
              ? "Actualizando datos"
              : "Información del usuario"
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
                    htmlFor="perfil_nombre"
                    className="bmd-label-floating"
                  >
                    Nombre
                  </label>


                  <input
                    ref={nombreRef}
                    type="text"
                    className="form-control"
                    name="perfil_nombre"
                    id="perfil_nombre"
                    maxLength="100"
                    readOnly={!editando}
                    value={nombre}
                    onChange={(e) =>
                      setNombre(e.target.value)
                    }
                  />

                </div>

              </div>


              {/* ==================================
                  CONTRASEÑA
              ================================== */}

              <div className="col-12 col-md-6">

                <div className="form-group">

                  <label
                    htmlFor="perfil_contrasena"
                    className="bmd-label-floating"
                  >
                    Contraseña
                  </label>


                  <input
                    type={verContrasena ? "text" : "password"}
                    className="form-control"
                    name="perfil_contrasena"
                    id="perfil_contrasena"
                    maxLength="50"
                    autoComplete="new-password"
                    readOnly={!editando}
                    value={contrasena}
                    onChange={(e) =>
                      setContrasena(e.target.value)
                    }
                  />


                  {/* Mostrar / ocultar contraseña */}
                  <button
                    type="button"
                    className="btn btn-link btn-sm"
                    style={{ padding: "4px 0" }}
                    onClick={() =>
                      setVerContrasena(!verContrasena)
                    }
                  >

                    {verContrasena ? <EyeSlash /> : <Eye />}

                    &nbsp;
                    {verContrasena
                      ? "Ocultar contraseña"
                      : "Mostrar contraseña"
                    }

                  </button>

                </div>

              </div>


            </div>

          </div>

        </fieldset>


        {/* ==========================================
            BOTONES
        ========================================== */}

        <p
          className="text-center"
          style={{ marginTop: "40px" }}
        >

          {editando ? (

            <>

              <button
                key="cancelar"
                type="button"
                className="btn btn-raised btn-secondary btn-sm"
                onClick={cancelarEdicion}
                disabled={guardando}
              >

                <X />

                &nbsp; CANCELAR

              </button>


              &nbsp; &nbsp;


              <button
                key="guardar"
                type="submit"
                className="btn btn-raised btn-info btn-sm"
                disabled={guardando}
              >

                <Save />

                &nbsp;
                {guardando
                  ? "GUARDANDO..."
                  : "GUARDAR CAMBIOS"
                }

              </button>

            </>

          ) : (

            <button
              key="actualizar"
              type="button"
              className="btn btn-raised btn-success btn-sm"
              onClick={iniciarEdicion}
            >

              <PencilSquare />

              &nbsp; ACTUALIZAR DATOS

            </button>

          )}

        </p>


      </form>

    </div>

  );

}

export default PerfilComponen;
