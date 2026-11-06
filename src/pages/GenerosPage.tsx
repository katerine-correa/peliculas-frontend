import { useEffect, useState, type FormEvent } from 'react';
import api from '../services/api';
import type { Genero } from '../interfaces/types';

export default function GenerosPage() {

  // Estados y configuracion de estilos

  const [generos, setGeneros] = useState<Genero[]>([]);
  const [form, setForm] = useState<Genero>({ nombre: '', descripcion: '', estado: 'Activo' });
  const [editandoId, setEditandoId] = useState<number | null>(null);

  const inputStyle = { 
    width: '100%', 
    padding: '10px', 
    borderRadius: '6px', 
    border: '1px solid #4b5563', 
    background: '#111827', 
    color: '#fff', 
    boxSizing: 'border-box' as const 
  };

 
  // Peticiones a la api (CRUD)
 
  const cargarGeneros = () => {
    api.get('/generos')
      .then(res => setGeneros(res.data))
      .catch(err => console.error('Error al cargar géneros:', err));
  };

  useEffect(() => { 
    cargarGeneros(); 
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (editandoId) {
        await api.put(`/generos/${editandoId}`, form);
        setEditandoId(null);
      } else {
        await api.post('/generos', form);
      }
      setForm({ nombre: '', descripcion: '', estado: 'Activo' });
      cargarGeneros();
    } catch (err) {
      alert('Error al guardar el género.');
    }
  };

  const eliminarGenero = async (id: number) => {
    if (window.confirm('Deseas eliminar este género?') && id) {
      try {
        await api.delete(`/generos/${id}`);
        cargarGeneros();
      } catch (err) {
        alert('No se pudo eliminar el género.');
      }
    }
  };

  // Renderizado del componente

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      
      {/* Título de la Sección */}
      <h2 style={{ color: '#f3f4f6', marginBottom: '5px' }}>Géneros</h2>
      <p style={{ color: '#9ca3af', marginBottom: '25px' }}>Registra y gestiona los géneros de películas y series.</p>

      {/* Formulario de Creación y Edición */}
      <form onSubmit={handleSubmit} style={{ background: '#1f2937', padding: '25px', borderRadius: '10px', marginBottom: '35px', border: '1px solid #374151' }}>
        <h3 style={{ color: '#38bdf8', marginTop: 0, marginBottom: '20px' }}>
          {editandoId ? 'Editar Género' : 'Nuevo Género'}
        </h3>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: '#d1d5db', fontWeight: 'bold' }}>Nombre:</label>
          <input 
            type="text" 
            value={form.nombre} 
            onChange={e => setForm({ ...form, nombre: e.target.value })} 
            required 
            style={inputStyle} 
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: '#d1d5db', fontWeight: 'bold' }}>Descripcion:</label>
          <textarea 
            value={form.descripcion} 
            onChange={e => setForm({ ...form, descripcion: e.target.value })} 
            required 
            style={{ ...inputStyle, height: '80px' }} 
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: '#d1d5db', fontWeight: 'bold' }}>Estado:</label>
          <select 
            value={form.estado} 
            onChange={e => setForm({ ...form, estado: e.target.value as 'Activo' | 'Inactivo' })} 
            style={inputStyle}
          >
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="submit" style={{ background: '#0284c7', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
            {editandoId ? 'Actualizar' : 'Guardar'}
          </button>
          {editandoId && (
            <button 
              type="button" 
              onClick={() => { setEditandoId(null); setForm({ nombre: '', descripcion: '', estado: 'Activo' }); }} 
              style={{ background: '#4b5563', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer' }}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      {/* Tabla de Visualización de Registros */}
      <h3 style={{ color: '#f3f4f6', marginBottom: '15px' }}>Lista de Géneros Registrados</h3>
      <div style={{ background: '#1f2937', borderRadius: '10px', border: '1px solid #374151', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#111827', color: '#38bdf8', borderBottom: '1px solid #374151' }}>
              <th style={{ padding: '14px' }}>Nombre</th>
              <th style={{ padding: '14px' }}>Descripción</th>
              <th style={{ padding: '14px' }}>Estado</th>
              <th style={{ padding: '14px', textAlign: 'center' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {generos.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', padding: '30px', color: '#9ca3af' }}>No hay generos registrados aun.</td>
              </tr>
            ) : (
              generos.map((g) => (
                <tr key={g.id} style={{ borderBottom: '1px solid #374151', color: '#e5e7eb' }}>
                  <td style={{ padding: '14px', fontWeight: 'bold', color: '#fff' }}>{g.nombre}</td>
                  <td style={{ padding: '14px', color: '#9ca3af' }}>{g.descripcion}</td>
                  <td style={{ padding: '14px' }}>
                    <span style={{ 
                      padding: '4px 10px', 
                      borderRadius: '20px', 
                      fontSize: '0.85rem', 
                      background: g.estado === 'Activo' ? 'rgba(22, 101, 52, 0.4)' : 'rgba(153, 27, 27, 0.4)', 
                      color: g.estado === 'Activo' ? '#4ade80' : '#f87171', 
                      fontWeight: 'bold' 
                    }}>
                      {g.estado}
                    </span>
                  </td>
                  <td style={{ padding: '14px', textAlign: 'center' }}>
                    <button 
                      onClick={() => { setEditandoId(g.id || null); setForm({ nombre: g.nombre, descripcion: g.descripcion, estado: g.estado }); }} 
                      style={{ background: '#d97706', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '4px', cursor: 'pointer', marginRight: '8px', fontWeight: 'bold' }}
                    >
                      Editar
                    </button>
                    <button 
                      onClick={() => g.id && eliminarGenero(g.id)} 
                      style={{ background: '#dc2626', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}