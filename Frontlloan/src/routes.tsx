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
import RelatorioDiario from './pages/RelatorioDiario';
import RelatorioMensal from './pages/RelatorioMensal';

function MainRoutes() {
  return (
    <AuthProvider>
      <Routes>
        {}
        <Route path="/Login" element={<Login />} />

        {}
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
          <Route
          path="/Relatorios/Diario"
          element={
            <ProtectedRoute>
              <RelatorioDiario />
            </ProtectedRoute>
          }
        />
          <Route
          path="/Relatorios/Mensal"
          element={
            <ProtectedRoute>
              <RelatorioMensal />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default MainRoutes;
