import React from 'react'
import { Outlet , Navigate } from "react-router-dom";
import { useState } from "react";

const ProtectedRoute = () => {
    const [isAuth, setIsAuth] = useState(true); // Cambia a false para probar la redirección
  return isAuth ? <Outlet/> : <Navigate to="/" />
}

export default ProtectedRoute
