import { useNavigate } from "react-router-dom";
import {
  Button,
  Dropdown
} from "react-bootstrap";

import {
  Bell,
  PersonCircle,
  List
} from "react-bootstrap-icons";

function NavbarMenu({ onMenuClick }) {

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
        
    navigate("/login", {
      replace: true
    });
  };

  return (
    
    <nav className="full-box app-navbar">

      {/* Parte izquierda */}
      <div className="navbar-left">

        <button
        type="button"
        className="navbar-menu-button"
        onClick={onMenuClick}
        aria-label="Abrir o cerrar menú"
      >
        <List size={26} />
      </button>

      </div>


      {/* Parte derecha */}
      <div className="navbar-actions">

        {/* Notificaciones */}
        <Button
          className="icon-button"
          variant="light"
          aria-label="Notificaciones"
        >
          <Bell size={19} />

          <span className="notification-dot"></span>
        </Button>


        {/* Usuario */}
        <Dropdown align="end">

          <Dropdown.Toggle
            variant="light"
            className="user-button"
          >

            <PersonCircle size={28} />

            <span className="user-label">
              Usuario
            </span>

          </Dropdown.Toggle>


          <Dropdown.Menu>

            <Dropdown.Item
              onClick={() => navigate("/perfil")}
            >
              <i className="fas fa-user me-2"></i>
              Mi perfil
            </Dropdown.Item>


           


            <Dropdown.Divider />


            <Dropdown.Item
              className="logout"
              onClick={handleLogout}
            >
              <i className="fas fa-power-off me-2"></i>
              Cerrar sesión
            </Dropdown.Item>

          </Dropdown.Menu>

        </Dropdown>

      </div>

    </nav>
  );
}

export default NavbarMenu;
