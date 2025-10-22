
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Services from './pages/Services';
import Portfolio from './pages/Portfolio';
import Team from './pages/Team';
import About from './pages/About';
import Diplomas from './pages/Diplomas';
import Contact from './pages/Contact';
import BeforeAfter from './pages/BeforeAfter';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="servicios" element={<Services />} />
          <Route path="portafolio" element={<Portfolio />} />
          <Route path="antes-y-despues" element={<BeforeAfter />} />
          <Route path="equipo" element={<Team />} />
          <Route path="nosotros" element={<About />} />
          <Route path="diplomas" element={<Diplomas />} />
          <Route path="contacto" element={<Contact />} />
        </Route>
      </Routes>
    </HashRouter>
  );
};

export default App;