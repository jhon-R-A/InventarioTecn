
import { useState } from "react";
import FormularioProducto from "../../../components/FormularioProduct.jsx";


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

  

  return (
    <section className="full-box page-content">
      

      <FormularioProducto
        onGuardar={guardarProducto}
        productoEditar={productoEditar}
        onCancelar={() => setProductoEditar(null)}
      />

      
    </section>
  );
}

export default CreateProduct;

