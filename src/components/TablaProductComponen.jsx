import { Link } from "react-router-dom";
import {
  Clipboard2Check,PlusCircle,BoxSeam
} from "react-bootstrap-icons";
function TablaProduct({
  productos,
  onActualizar,
  onEliminar,
}) {
  return (
    <div className="container-fluid" id="lista-productos">
      {/* ==========================================
          ENCABEZADO
      ========================================== */}

      <div className="full-box page-header">

        <h3 className="text-left">

          <BoxSeam />

          &nbsp; LISTA DE PRODUCTOS

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
              to="/CreateProduct"
              
            >

              <PlusCircle />

              &nbsp; AGREGAR PRODUCTO

            </Link>

          </li>


          <li>

            <Link to="/TableProduct" className="active">
                  
              <Clipboard2Check />

              &nbsp; LISTA DE PRODUCTOS

            </Link>

          </li>

        </ul>

      </div>

      <div className="table-responsive">
        <table className="table table-dark table-sm">
          <thead>
            <tr className="text-center roboto-medium">
              <th>#</th>
              <th>PRODUCTO</th>
              <th>CANTIDAD</th>
              <th>FECHA</th>
              <th>ACTUALIZAR</th>
              <th>ELIMINAR</th>
            </tr>
          </thead>

          <tbody>
            {productos.length === 0 ? (
              <tr className="text-center">
                <td colSpan="6">
                  No hay productos registrados.
                </td>
              </tr>
            ) : (
              productos.map((producto, index) => (
                <tr
                  key={producto.id}
                  className="text-center"
                >
                  <td>{index + 1}</td>
                  <td>{producto.nombre}</td>
                  <td>{producto.cantidad}</td>
                  <td>{producto.fecha}</td>

                  <td>
                    <button
                      type="button"
                      className="btn btn-success btn-sm"
                      title="Actualizar producto"
                      onClick={() => onActualizar(producto)}
                    >
                      <i className="fas fa-sync-alt"></i>
                    </button>
                  </td>

                  <td>
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      title="Eliminar producto"
                      onClick={() => onEliminar(producto.id)}
                    >
                      <i className="far fa-trash-alt"></i>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TablaProduct;

