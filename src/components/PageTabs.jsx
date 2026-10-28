import { NavLink } from "react-router-dom";
import {
  Clipboard2Check,PlusCircle
} from "react-bootstrap-icons";

/* ==========================================
   MÓDULOS
   Para agregar uno nuevo basta con sumar otro
   bloque aquí (rutas y textos de las pestañas).
========================================== */
const MODULOS = {

  tecnico: {
    crearPath: "/CreateTecnico",
    listaPath: "/TablaTecnico",
    crearTexto: "AGREGAR TÉCNICO",
    listaTexto: "LISTA DE TÉCNICOS"
  },

  producto: {
    crearPath: "/CreateProduct",
    listaPath: "/TableProduct",
    crearTexto: "AGREGAR PRODUCTO",
    listaTexto: "LISTA DE PRODUCTOS"
  },

  empresa: {
    crearPath: "/CreateEmpresa",
    listaPath: "/TableEmpresa",
    crearTexto: "AGREGAR EMPRESA",
    listaTexto: "LISTA DE EMPRESAS"
  },

  reparacion: {
    crearPath: "/CreateReparacion",
    listaPath: "/TableReparacion",
    crearTexto: "AGREGAR REPARACIÓN",
    listaTexto: "LISTA DE REPARACIONES"
  }

};


/*
  Pestañas "Agregar / Lista" de cada módulo.

  Props:
  - modulo: "tecnico" | "producto" | "empresa" | "reparacion"

  La pestaña activa se marca sola según la ruta en la que estás
  (NavLink agrega la clase "active", que ya tiene estilos en tu CSS).

  Uso:
  <PageTabs modulo="producto" />
*/
function PageTabs({ modulo }) {

  const config = MODULOS[modulo];

  if (!config) {

    console.warn(
      `PageTabs: el módulo "${modulo}" no existe. ` +
      `Usa: ${Object.keys(MODULOS).join(", ")}`
    );

    return null;

  }


  return (

    <div className="container-fluid">

      <ul className="full-box list-unstyled page-nav-tabs">

        <li>

          <NavLink to={config.crearPath} end>

            <PlusCircle />

            &nbsp; {config.crearTexto}

          </NavLink>

        </li>


        <li>

          <NavLink to={config.listaPath} end>

            <Clipboard2Check />

            &nbsp; {config.listaTexto}

          </NavLink>

        </li>

      </ul>

    </div>

  );

}

export default PageTabs;
