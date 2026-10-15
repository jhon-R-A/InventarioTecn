
import { useState } from "react";
import { NavLink } from "react-router-dom";

import {
  XCircle,
  Speedometer2,
  PeopleFill,
  ChevronDown,
  ChevronUp,
  PlusCircle,
  Clipboard2Check,
  BoxSeam,
  Search,
} from "react-bootstrap-icons";

function Sidebar({ open, onClose }) {
  const [openMenu, setOpenMenu] = useState(null);

  const toggleMenu = (menu) => {
    setOpenMenu((prev) => (prev === menu ? null : menu));
  };

  return (
    <>
      {/* Fondo oscuro para móvil */}
      {open && (
        <div
          className="full-box nav-lateral-bg show-nav-lateral"
          onClick={onClose}
        />
      )}

      <section
        className={`full-box nav-lateral ${
          open ? "sidebar-open" : ""
        }`}
      >
        <div className="full-box nav-lateral-content">
          {/* Avatar */}
          <figure className="full-box nav-lateral-avatar">
            <button
              type="button"
              className="sidebar-close"
              onClick={onClose}
              aria-label="Cerrar menú"
            >
              <XCircle />
            </button>

            <img
              src="/assets/avatar/Avatar.png"
              className="img-fluid"
              alt="Avatar"
            />

            <figcaption className="roboto-medium text-center">
              Carlos Alfaro
              <br />
              <small className="roboto-condensed-light">
                Web Developer
              </small>
            </figcaption>
          </figure>

          <div className="full-box nav-lateral-bar" />

          {/* Menú */}
          <nav className="full-box nav-lateral-menu">
            <ul>
              {/* Dashboard */}
              <li>
                <NavLink
                  to="/dashboard"
                  onClick={onClose}
                >
                  <Speedometer2 />
                  &nbsp; Dashboard
                </NavLink>
              </li>

              {/* CLIENTES */}
              <li>
                <button
                  type="button"
                  className="nav-btn-submenu"
                  onClick={() => toggleMenu("clientes")}
                  aria-expanded={openMenu === "clientes"}
                >
                  <span>
                    <PeopleFill />
                    &nbsp; Clientes
                  </span>

                  {openMenu === "clientes" ? (
                    <ChevronUp />
                  ) : (
                    <ChevronDown />
                  )}
                </button>

                <ul
                  className={
                    openMenu === "clientes" ? "submenu-open" : ""
                  }
                >
                  <li>
                    <NavLink
                      to="/CreateTecnico"
                      onClick={onClose}
                    >
                      <PlusCircle />
                      &nbsp; Crear técnico
                    </NavLink>
                  </li>

                  <li>
                    <NavLink
                      to="/TablaTecnico"
                      onClick={onClose}
                    >
                      <Clipboard2Check />
                      &nbsp; Lista de técnicos
                    </NavLink>
                  </li>
                </ul>
              </li>

              {/* PRODUCTOS */}
              <li>
                <button
                  type="button"
                  className="nav-btn-submenu"
                  onClick={() => toggleMenu("items")}
                  aria-expanded={openMenu === "items"}
                >
                  <span>
                    <BoxSeam />
                    &nbsp; Productos
                  </span>

                  {openMenu === "items" ? (
                    <ChevronUp />
                  ) : (
                    <ChevronDown />
                  )}
                </button>

                <ul
                  className={
                    openMenu === "items" ? "submenu-open" : ""
                  }
                >
                  <li>
                    <NavLink
                      to="/CreateProduct"
                      onClick={onClose}
                    >
                      <PlusCircle />
                      &nbsp; Agregar Producto
                    </NavLink>
                  </li>
                </ul>
              </li>

              {/* REPORTES */}
              <li>
                <NavLink
                  to="/reporte"
                  onClick={onClose}
                >
                  <Search />
                  &nbsp; Reporte técnicos
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>
      </section>
    </>
  );
}

export default Sidebar;