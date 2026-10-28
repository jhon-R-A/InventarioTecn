import React from "react";
import { Link } from "react-router-dom";
import {
  Speedometer2,
  PeopleFill,
  BoxSeam,
  PersonBadge,
  Building,Wrench,
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
          <Link to="/CreateTecnico" className="tile">
            <div className="tile-tittle"> TÉCNICOS </div>
            <div className="tile-icon">
              <i className="d-block mt-2 mb-2" style={tileIconStyle}><PeopleFill /></i>
              <p> 5 Registrados </p>
            </div>
          </Link>
          <Link to="/CreateProduct" className="tile">
            <div className="tile-tittle"> PRODUCTOS </div>
            <div className="tile-icon">
              <i className="d-block mt-2 mb-2" style={tileIconStyle}><BoxSeam /></i>
              <p> 9 Registrados </p>
            </div>
          </Link>
          <Link to="/CreateReparacion" className="tile">
            <div className="tile-tittle"> REPARACIONES </div>
            <div className="tile-icon">
              <i className="d-block mt-2 mb-2" style={tileIconStyle}><Wrench /></i>
              <p> 10 Registrados </p>
            </div>
          </Link>
          <Link to="/Reporte" className="tile">
            <div className="tile-tittle"> INFORMES </div>
            <div className="tile-icon">
              <i className="d-block mt-2 mb-2" style={tileIconStyle}><PersonBadge /></i>
              <p> 50 Registrados </p>
            </div>
          </Link>
          <Link to="/createEmpresa" className="tile">
            <div className="tile-tittle"> Empresa </div>
            <div className="tile-icon">
              <i className="d-block mt-2 mb-2" style={tileIconStyle}><Building /></i>
              <p> 1 Registrada </p>
            </div>
          </Link>
        </div>
      </section>
    </>
  );
};

export default dashboard;
