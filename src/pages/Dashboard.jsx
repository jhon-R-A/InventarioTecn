import React from "react";

import {
  Speedometer2,
  PeopleFill,
  BoxSeam,
  CashStack,
  PersonBadge,
  Shop,
} from "react-bootstrap-icons";

/* Tamaño de los iconos de las tarjetas (antes 80px) */
const tileIconStyle = { fontSize: 60, lineHeight: 1 };

const dashboard = () => {
  return (
    <>
      <section className="full-box page-content">
        {/* Page header */}
        <div className="full-box page-header">
          <h3 className="text-left">
            <Speedometer2 /> &nbsp; DASHBOARD
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
              <i className="d-block mt-2 mb-2" style={tileIconStyle}><PeopleFill /></i>
              <p> 5 Registrados </p>
            </div>
          </a>
          <a href="/items/lista" className="tile">
            <div className="tile-tittle"> Items </div>
            <div className="tile-icon">
              <i className="d-block mt-2 mb-2" style={tileIconStyle}><BoxSeam /></i>
              <p> 9 Registrados </p>
            </div>
          </a>
          <a href="/prestamos/lista" className="tile">
            <div className="tile-tittle"> Prestamos </div>
            <div className="tile-icon">
              <i className="d-block mt-2 mb-2" style={tileIconStyle}><CashStack /></i>
              <p> 10 Registrados </p>
            </div>
          </a>
          <a href="/usuarios/lista" className="tile">
            <div className="tile-tittle"> Usuarios </div>
            <div className="tile-icon">
              <i className="d-block mt-2 mb-2" style={tileIconStyle}><PersonBadge /></i>
              <p> 50 Registrados </p>
            </div>
          </a>
          <a href="/empresa" className="tile">
            <div className="tile-tittle"> Empresa </div>
            <div className="tile-icon">
              <i className="d-block mt-2 mb-2" style={tileIconStyle}><Shop /></i>
              <p> 1 Registrada </p>
            </div>
          </a>
        </div>
      </section>
    </>
  );
};

export default dashboard;
