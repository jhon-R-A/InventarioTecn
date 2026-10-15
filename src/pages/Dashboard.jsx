import React from "react";

const dashboard = () => {
  return (
    <>
      <section className="full-box page-content">
        {/* Page header */}
        <div className="full-box page-header">
          <h3 className="text-left">
            <i className="fab fa-dashcube fa-fw"></i> &nbsp; DASHBOARD
          </h3>
          <p className="text-justify">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Suscipit
            nostrum rerum animi natus beatae ex. Culpa blanditiis tempore amet
            alias placeat, obcaecati quaerat ullam, sunt est, odio aut veniam
            ratione.
          </p>
        </div>
        {/* Content */}
        <div className="full-box tile-container">
          <a href="/clientes/nuevo" className="tile">
            <div className="tile-tittle"> Clientes </div>
            <div className="tile-icon">
              <i className="fas fa-users fa-fw"></i> <p> 5 Registrados </p>
            </div>
          </a>
          <a href="/items/lista" className="tile">
            <div className="tile-tittle"> Items </div>
            <div className="tile-icon">
              <i className="fas fa-pallet fa-fw"></i>
              <p> 9 Registrados </p>
            </div>
          </a>
          <a href="/prestamos/lista" className="tile">
            <div className="tile-tittle"> Prestamos </div>
            <div className="tile-icon">
              <i className="fas fa-file-invoice-dollar fa-fw"></i>
              <p> 10 Registrados </p>
            </div>
          </a>
          <a href="/usuarios/lista" className="tile">
            <div className="tile-tittle"> Usuarios </div>
            <div className="tile-icon">
              <i className="fas fa-user-secret fa-fw"></i>
              <p> 50 Registrados </p>
            </div>
          </a>
          <a href="/empresa" className="tile">
            <div className="tile-tittle"> Empresa </div>
            <div className="tile-icon">
              <i className="fas fa-store-alt fa-fw"></i>
              <p> 1 Registrada </p>
            </div>
          </a>
        </div>
      </section>
    </>
  );
};

export default dashboard;
