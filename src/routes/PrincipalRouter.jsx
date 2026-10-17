import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../LoginRegistre/Login.jsx";

import CreateTecnico from "../pages/Tecnico/CrearTenico/CreateTecnico.jsx";
import TablaTecnico from "../pages/Tecnico/CrearTenico/TableTecnic.jsx";
import Reporte from "../pages/Tecnico/reportes/ReportProduct.jsx";
import CreateProduct from "../pages/Tecnico/CrearProduct/CreateProduct.jsx";
import TableProduct from "../pages/Tecnico/CrearProduct/TableProduct.jsx";
import CreateReparac from "../pages/Reparaciones/CreateReparac.jsx";
import TableReparacion from "../pages/Reparaciones/TableReparacion.jsx";

import Dashboard from "../pages/Dashboard.jsx";
import Protected from "./routerprotected/ProtectedRoute.jsx";
import Layout from "../layout/Baselayout.jsx";
function Page({ title }) {
  return (
    <section className="full-box page-content">
      <div className="full-box page-header">
        <h3 className="text-left"> {title} </h3>
        <p className="text-justify">
          Esta sección se encuentra dentro del sistema.
        </p>
      </div>
    </section>
  );
}
function PrincipalRouter() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* ======== RUTA PÚBLICA ======== */}
          <Route path="/" element={<Login />} />
          {/* ======== RUTAS PROTEGIDAS ====== */}
          <Route element={<Protected />}>
            {/* Layout */}
            <Route element={<Layout />}>
              {/* Dashboard */}
              <Route path="/Dashboard" element={<Dashboard />} />


              {/* CREATE TECNICO */}
              <Route
                path="/CreateTecnico"
                element={<CreateTecnico />}
              />
              <Route
                path="/TablaTecnico"
                element={<TablaTecnico />}
              />
             


              {/* CEREAR PRODUCTOS */}
              <Route
                path="/CreateProduct"
                element={<CreateProduct />}
              />
             
              <Route
                path="/TableProduct"
                element={<TableProduct />}
              />

                 {/* CEREAR REPARACIONES */}
              <Route
                path="/CreateReparacion"
                element={<CreateReparac />}
              />
              <Route
                path="/TableReparacion"
                element={<TableReparacion />}
              />
              
              {/* EMPRESA */}
              <Route path="/Reporte" element={<Reporte />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default PrincipalRouter;
