import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import GenerosPage from './pages/GenerosPage';
import DirectoresPage from './pages/DirectoresPage';
import ProductorasPage from './pages/ProductorasPage';
import TiposPage from './pages/TiposPage';
import MediaPage from './pages/MediaPage';

function App() {
  return (
    <Router>
      <div style={{ fontFamily: 'Arial, sans-serif', minHeight: '100vh', backgroundColor: '#f4f6f8' }}>
        {/* Barra de Navegación Superior */}
        <nav style={{ backgroundColor: '#1f2937', padding: '15px 30px', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '1.2rem' }}>Administrar Películas</h2>
          <div style={{ display: 'flex', gap: '20px' }}>
            <Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>Inicio</Link>
            <Link to="/generos" style={{ color: '#fff', textDecoration: 'none' }}>Géneros</Link>
            <Link to="/directores" style={{ color: '#fff', textDecoration: 'none' }}>Directores</Link>
            <Link to="/productoras" style={{ color: '#fff', textDecoration: 'none' }}>Productoras</Link>
            <Link to="/tipos" style={{ color: '#fff', textDecoration: 'none' }}>Tipos</Link>
            <Link to="/media" style={{ color: '#fff', textDecoration: 'none' }}>Media (Películas/Series)</Link>
          </div>
        </nav>

        {/* Contenido Principal / Rutas */}
        <div style={{ padding: '30px' }}>
          <Routes>
            <Route path="/" element={
              <div style={{ textAlign: 'center', marginTop: '50px' }}>
                <h1>Bienvenida al Panel de Administración</h1>
                <p>Selecciona un módulo en la barra superior para empezar a gestionar el contenido.</p>
              </div>
            } />
            <Route path="/generos" element={<GenerosPage />} />
            <Route path="/directores" element={<DirectoresPage />} />
            <Route path="/productoras" element={<ProductorasPage />} />
            <Route path="/tipos" element={<TiposPage />} />
            <Route path="/media" element={<MediaPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
