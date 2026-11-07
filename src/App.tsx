import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import GenerosPage from './pages/GenerosPage';
import DirectoresPage from './pages/DirectoresPage';
import ProductorasPage from './pages/ProductorasPage';
import TiposPage from './pages/TiposPage';
import MediaPage from './pages/MediaPage';

function App() {
 
  //Estilos de navegacion
 
  const linkStyle = ({ isActive }: { isActive: boolean }) => ({
    color: isActive ? '#38bdf8' : '#9ca3af',
    textDecoration: 'none',
    fontWeight: isActive ? 'bold' : 'normal',
    padding: '6px 10px',
    borderRadius: '6px',
    backgroundColor: isActive ? 'rgba(56, 189, 248, 0.1)' : 'transparent',
    transition: 'all 0.2s ease',
    fontSize: '0.95rem',
    whiteSpace: 'nowrap' as const,
  });

  // Renderizado
  
  return (
    <Router>
      <div style={{ fontFamily: 'Arial, sans-serif', minHeight: '100vh', backgroundColor: '#111827', color: '#f3f4f6' }}>
        
        {/* Barra de navegación superior */}
        <nav style={{ 
          backgroundColor: '#0f172a', 
          padding: '15px 25px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          borderBottom: '1px solid #1f2937',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)',
          flexWrap: 'wrap',
          gap: '15px'
        }}>
          <h2 style={{ margin: 0, fontSize: '1.2rem', color: '#38bdf8', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>
            Administrador de Películas
          </h2>
          
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            <NavLink to="/" style={linkStyle} end>Inicio</NavLink>
            <NavLink to="/generos" style={linkStyle}>Géneros</NavLink>
            <NavLink to="/directores" style={linkStyle}>Directores</NavLink>
            <NavLink to="/productoras" style={linkStyle}>Productoras</NavLink>
            <NavLink to="/tipos" style={linkStyle}>Tipos</NavLink>
            <NavLink to="/media" style={linkStyle}>Media</NavLink>
          </div>
        </nav>

        {/* Contenido Principal */}
        <div style={{ padding: '40px 20px', maxWidth: '1100px', margin: '0 auto' }}>
          <Routes>
            <Route path="/" element={
              <div style={{ textAlign: 'center', marginTop: '80px' }}>
                <h1 style={{ color: '#f3f4f6', fontSize: '2.5rem', marginBottom: '15px' }}>Bienvenido al Panel de Administración</h1>
                <p style={{ color: '#9ca3af', fontSize: '1.1rem' }}>Selecciona un módulo en la barra superior para empezar a gestionar el contenido de la plataforma.</p>
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