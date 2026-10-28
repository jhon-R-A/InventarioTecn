import { useState, useEffect } from "react";
import PageTabs from "./PageTabs.jsx";
import Swal from "sweetalert2";
import {
  Clipboard2Check,PlusCircle,Building,Save
} from "react-bootstrap-icons";

// Configuración base de SweetAlert2 (mismos colores que el resto de la app)
const Alerta = Swal.mixin({
  confirmButtonColor: "#12202b",
  cancelButtonColor: "#6c7a89",
  reverseButtons: true,
});

/*
  Props (todas opcionales):
  - onGuardar(datos): se llama con { nombre, usuario, contrasena }
                      (puede ser async; si lanza error se muestra alerta roja)
  - empresaEditar:    objeto { id, nombre, usuario, contrasena } para editar.
                      Si no se pasa, el formulario es de "nueva empresa".
*/
function FormularioEmpresa({
  onGuardar,
  empresaEditar = null,
}) {
  const [nombre, setNombre] = useState("");
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");

  // Si llega una empresa para editar, se cargan sus datos en el formulario
  useEffect(() => {
    if (empresaEditar) {
      setNombre(empresaEditar.nombre);
      setUsuario(empresaEditar.usuario);
      setContrasena(empresaEditar.contrasena);
    } else {
      setNombre("");
      setUsuario("");
      setContrasena("");
    }
  }, [empresaEditar]);

  const limpiarFormulario = () => {
    setNombre("");
    setUsuario("");
    setContrasena("");
  };

  const enfocar = (id) => {
    document.getElementById(id)?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Campos vacíos
    if (!nombre.trim() || !usuario.trim() || !contrasena) {
      Alerta.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Todos los campos son obligatorios",
        confirmButtonText: "Entendido",
      }).then(() => {
        // Lleva el cursor al primer campo vacío
        if (!nombre.trim()) enfocar("empresa_nombre");
        else if (!usuario.trim()) enfocar("empresa_usuario");
        else enfocar("empresa_contrasena");
      });

      return;
    }

    // Usuario válido
    if (usuario.trim().length < 4 || /\s/.test(usuario)) {
      Alerta.fire({
        icon: "error",
        title: "Usuario no válido",
        text: "El usuario debe tener al menos 4 caracteres y no puede tener espacios",
        confirmButtonText: "Entendido",
      }).then(() => enfocar("empresa_usuario"));

      return;
    }

    // Contraseña válida
    if (contrasena.length < 6) {
      Alerta.fire({
        icon: "error",
        title: "Contraseña muy corta",
        text: "La contraseña debe tener al menos 6 caracteres",
        confirmButtonText: "Entendido",
      }).then(() => enfocar("empresa_contrasena"));

      return;
    }

    // Guardar
    try {
      await onGuardar?.({
        nombre: nombre.trim(),
        usuario: usuario.trim(),
        contrasena,
      });
    } catch (error) {
      Alerta.fire({
        icon: "error",
        title: "No se pudo guardar",
        text: "Ocurrió un error al guardar la empresa. Inténtalo de nuevo.",
        confirmButtonText: "Entendido",
      });

      return;
    }

    Alerta.fire({
      icon: "success",
      title: empresaEditar
        ? "¡Empresa actualizada!"
        : "¡Empresa creada!",
      text: `"${nombre.trim()}" se guardó correctamente`,
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: false,
    });

    limpiarFormulario();
  };

  return (
    <div className="container-fluid" id="formulario-empresa">

      {/* ==========================================
          ENCABEZADO
      ========================================== */}

      <div className="full-box page-header">

        <h3 className="text-left">

          <Building />

          &nbsp; AGREGAR EMPRESA

        </h3>


        <p className="text-justify">

          Registra las empresas que forman parte
          del sistema con su usuario y contraseña
          de acceso.

        </p>

      </div>


      {/* ==========================================
          PESTAÑAS
      ========================================== */}

     <PageTabs modulo="empresa" />


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

            <Building />

            &nbsp;
            {empresaEditar
              ? "Actualizar empresa"
              : "Información de la empresa"}

          </legend>


          <div className="container-fluid">

            <div className="row">


              {/* ==================================
                  NOMBRE DE LA EMPRESA
              ================================== */}

              <div className="col-12 col-md-4">

                <div className="form-group">

                  <label
                    htmlFor="empresa_nombre"
                    className="bmd-label-floating"
                  >
                    Nombre de la empresa
                  </label>

                  <input
                    type="text"
                    id="empresa_nombre"
                    className="form-control"
                    maxLength="100"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                  />

                </div>

              </div>


              {/* ==================================
                  USUARIO
              ================================== */}

              <div className="col-12 col-md-4">

                <div className="form-group">

                  <label
                    htmlFor="empresa_usuario"
                    className="bmd-label-floating"
                  >
                    Usuario
                  </label>

                  <input
                    type="text"
                    id="empresa_usuario"
                    className="form-control"
                    maxLength="50"
                    value={usuario}
                    onChange={(e) => setUsuario(e.target.value)}
                  />

                </div>

              </div>


              {/* ==================================
                  CONTRASEÑA
              ================================== */}

              <div className="col-12 col-md-4">

                <div className="form-group">

                  <label
                    htmlFor="empresa_contrasena"
                    className="bmd-label-floating"
                  >
                    Contraseña
                  </label>

                  <input
                    type="password"
                    id="empresa_contrasena"
                    className="form-control"
                    maxLength="50"
                    autoComplete="new-password"
                    value={contrasena}
                    onChange={(e) => setContrasena(e.target.value)}
                  />

                </div>

              </div>


            </div>

          </div>

        </fieldset>


        {/* ==========================================
            BOTÓN
        ========================================== */}

        <p
          className="text-center"
          style={{ marginTop: "40px" }}
        >

          <button
            type="submit"
            className="btn btn-raised btn-info btn-sm"
          >

            <Save />

            &nbsp;
            {empresaEditar
              ? "ACTUALIZAR EMPRESA"
              : "GUARDAR EMPRESA"}

          </button>

        </p>

      </form>

    </div>
  );
}

export default FormularioEmpresa;
