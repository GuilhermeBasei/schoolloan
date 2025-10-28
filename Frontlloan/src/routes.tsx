import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import CadastroUser from "./pages/CadastroUser";
import CadastroADM from "./pages/CadastroADM";
import CadastroEquip from "./pages/CadastroEquip";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Emprestar from "./pages/Emprestar";
import Recolher from "./pages/Recolher";
import Relatorios from "./pages/Relatorios";

function MainRoutes() {
  return (
    <AuthProvider>
      <Routes>
        {/* rota pública */}
        <Route path="/Login" element={<Login />} />

        {/* rotas protegidas */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/CadastroADM"
          element={
            <ProtectedRoute>
              <CadastroADM />
            </ProtectedRoute>
          }
        />
        <Route
          path="/CadastroUser"
          element={
            <ProtectedRoute>
              <CadastroUser />
            </ProtectedRoute>
          }
        />
        <Route
          path="/CadastroEquip"
          element={
            <ProtectedRoute>
              <CadastroEquip />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Emprestar"
          element={
            <ProtectedRoute>
              <Emprestar />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Recolher"
          element={
            <ProtectedRoute>
              <Recolher />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Relatorios"
          element={
            <ProtectedRoute>
              <Relatorios />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default MainRoutes;
