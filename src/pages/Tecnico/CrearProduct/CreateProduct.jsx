
import { useState } from "react";
import FormularioProducto from "../../../components/FormularioProduct.jsx";
import TablaProductos from "../../../components/TablaProduct.jsx";

function CreateProduct() {
  const [productos, setProductos] = useState([]);
  const [productoEditar, setProductoEditar] = useState(null);

  const guardarProducto = (datos) => {
    if (productoEditar) {
      // Actualizar producto existente
      setProductos((prev) =>
        prev.map((producto) =>
          producto.id === productoEditar.id
            ? { ...producto, ...datos }
            : producto
        )
      );

      setProductoEditar(null);
    } else {
      // Crear nuevo producto
      const nuevoProducto = {
        id: Date.now(),
        ...datos,
        fecha: new Date().toISOString().split("T")[0],
      };

      setProductos((prev) => [...prev, nuevoProducto]);
    }
  };

  const actualizarProducto = (producto) => {
    setProductoEditar(producto);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const eliminarProducto = (id) => {
    const confirmar = window.confirm(
      "¿Estás seguro de eliminar este producto?"
    );

    if (!confirmar) return;

    setProductos((prev) =>
      prev.filter((producto) => producto.id !== id)
    );

    if (productoEditar?.id === id) {
      setProductoEditar(null);
    }
  };

  return (
    <section className="full-box page-content">
      <div className="full-box page-header">
        <h3 className="text-left">
          <i className="fas fa-box fa-fw"></i>
          &nbsp; GESTIÓN DE PRODUCTOS
        </h3>

        <p className="text-justify">
          Registra, consulta, actualiza y elimina productos.
        </p>
      </div>

      <FormularioProducto
        onGuardar={guardarProducto}
        productoEditar={productoEditar}
        onCancelar={() => setProductoEditar(null)}
      />

      <TablaProductos
        productos={productos}
        onActualizar={actualizarProducto}
        onEliminar={eliminarProducto}
      />
    </section>
  );
}

export default CreateProduct;

