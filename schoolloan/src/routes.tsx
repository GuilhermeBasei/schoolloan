import { Routes, Route } from 'react-router-dom';
import CadastroUser from './pages/CadastroUser';
import CadastroADM from './pages/CadastroADM';
import CadastroEquip from './pages/CadastroEquip';
import Login from './pages/Login';
import Home from './pages/Home';
import Emprestar from './pages/Emprestar';
import Recolher from './pages/Recolher';
import Relatorios from './pages/Relatorios';

function MainRoutes() {

    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/CadastroADM" element={<CadastroADM />} />
            <Route path="/CadastroUser" element={<CadastroUser />} />
            <Route path="/CadastroEquip" element={<CadastroEquip />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/Emprestar" element={<Emprestar />} />
            <Route path="/Recolher" element={<Recolher />} />
            <Route path="/Relatorios" element={<Relatorios />} />
        </Routes>
    );

}


export default MainRoutes;