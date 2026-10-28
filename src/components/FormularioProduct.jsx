import PageTabs from "./PageTabs.jsx";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  Clipboard2Check,PlusCircle,BoxSeam
} from "react-bootstrap-icons";

// Configuración base de SweetAlert2 (mismos colores que el resto de la app)
const Alerta = Swal.mixin({
  confirmButtonColor: "#12202b",
  cancelButtonColor: "#6c7a89",
  reverseButtons: true,
});

function FormularioProducto({
  onGuardar,
  productoEditar,
  onCancelar,
}) {
  const [nombre, setNombre] = useState("");
  const [cantidad, setCantidad] = useState("");

  useEffect(() => {
    if (productoEditar) {
      setNombre(productoEditar.nombre);
      setCantidad(String(productoEditar.cantidad));
    } else {
      setNombre("");
      setCantidad("");
    }
  }, [productoEditar]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!nombre.trim() || cantidad === "") {
      Alerta.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Todos los campos son obligatorios",
        confirmButtonText: "Entendido",
      }).then(() => {
        // Lleva el cursor al primer campo vacío
        const idVacio = !nombre.trim()
          ? "producto_nombre"
          : "producto_cantidad";

        document.getElementById(idVacio)?.focus();
      });

      return;
    }

    if (
      !Number.isInteger(Number(cantidad)) ||
      Number(cantidad) < 1
    ) {
      Alerta.fire({
        icon: "error",
        title: "Cantidad no válida",
        text: "La cantidad debe ser un número entero mayor que cero",
        confirmButtonText: "Entendido",
      }).then(() => {
        document.getElementById("producto_cantidad")?.focus();
      });

      return;
    }

    onGuardar({
      nombre: nombre.trim(),
      cantidad: Number(cantidad),
    });

    setNombre("");
    setCantidad("");
  };

  const limpiarFormulario = () => {
    setNombre("");
    setCantidad("");
    onCancelar();
  };

  return (
    <div className="container-fluid" id="formulario-producto">
{/* ==========================================
          ENCABEZADO
      ========================================== */}

      <div className="full-box page-header">

        <h3 className="text-left">

          <BoxSeam />

          &nbsp; AGREGAR PRODUCTO

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


      
      <form
        className="form-neon"
        autoComplete="off"
        onSubmit={handleSubmit}
      >
        <fieldset>
          <legend>
            <i className="fas fa-box-open"></i>
            &nbsp; Información del producto
          </legend>

          <div className="container-fluid">
            <div className="row">
              <div className="col-12 col-md-6">
                <div className="form-group">
                  <label
                    htmlFor="producto_nombre"
                    className="bmd-label-floating"
                  >
                    Nombre del producto
                  </label>

                  <input
                    type="text"
                    id="producto_nombre"
                    className="form-control"
                    maxLength="100"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                  />
                </div>
              </div>

              <div className="col-12 col-md-6">
                <div className="form-group">
                  <label
                    htmlFor="producto_cantidad"
                    className="bmd-label-floating"
                  >
                    Cantidad
                  </label>

                  <input
                    type="number"
                    id="producto_cantidad"
                    className="form-control"
                    min="1"
                    step="1"
                    value={cantidad}
                    onChange={(e) => setCantidad(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </fieldset>

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
            <i
              className={
                productoEditar
                  ? "fas fa-sync-alt"
                  : "far fa-save"
              }
            ></i>

            &nbsp;
            {productoEditar
              ? "ACTUALIZAR PRODUCTO"
              : "GUARDAR PRODUCTO"}
          </button>
        </p>
      </form>
    </div>
  );
}

export default FormularioProducto;
