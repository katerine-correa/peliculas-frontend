import { useEffect, useState, type FormEvent } from 'react';
import api from '../services/api';
import type { Director } from '../interfaces/types';

export default function DirectoresPage() {

  //Estados y configuracion de estilos

  const [directores, setDirectores] = useState<Director[]>([]);
  const [form, setForm] = useState<Director>({ nombres: '', estado: 'Activo' });
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

 
  //(CRUD) Peticiones a la api

  const cargarDirectores = () => {
    api.get('/directores')
      .then(res => setDirectores(res.data))
      .catch(err => console.error('Error al cargar directores:', err));
  };

  useEffect(() => { 
    cargarDirectores(); 
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (editandoId) {
        await api.put(`/directores/${editandoId}`, form);
        setEditandoId(null);
      } else {
        await api.post('/directores', form);
      }
      setForm({ nombres: '', estado: 'Activo' });
      cargarDirectores();
    } catch (err) {
      alert('Error al guardar el director.');
    }
  };

  const eliminarDirector = async (id: number) => {
    if (window.confirm('Deseas eliminar este director?') && id) {
      try {
        await api.delete(`/directores/${id}`);
        cargarDirectores();
      } catch (err) {
        alert('No se pudo eliminar el director.');
      }
    }
  };

  
  // Renderizado del componente
  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      
      {/* Título de la Sección */}
      <h2 style={{ color: '#f3f4f6', marginBottom: '5px' }}>Directores</h2>
      <p style={{ color: '#9ca3af', marginBottom: '25px' }}>Registra y gestiona los directores de las producciones.</p>

      {/* Formulario de Creación y Edición */}
      <form onSubmit={handleSubmit} style={{ background: '#1f2937', padding: '25px', borderRadius: '10px', marginBottom: '35px', border: '1px solid #374151' }}>
        <h3 style={{ color: '#38bdf8', marginTop: 0, marginBottom: '20px' }}>
          {editandoId ? 'Editar Director' : 'Nuevo Director'}
        </h3>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: '#d1d5db', fontWeight: 'bold' }}>Nombres:</label>
          <input 
            type="text" 
            value={form.nombres} 
            onChange={e => setForm({ ...form, nombres: e.target.value })} 
            required 
            style={inputStyle} 
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
              onClick={() => { setEditandoId(null); setForm({ nombres: '', estado: 'Activo' }); }} 
              style={{ background: '#4b5563', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer' }}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      {/* Tabla de Visualización de Registros */}
      <h3 style={{ color: '#f3f4f6', marginBottom: '15px' }}>Lista de Directores Registrados</h3>
      <div style={{ background: '#1f2937', borderRadius: '10px', border: '1px solid #374151', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#111827', color: '#38bdf8', borderBottom: '1px solid #374151' }}>
              <th style={{ padding: '14px' }}>Nombres</th>
              <th style={{ padding: '14px' }}>Estado</th>
              <th style={{ padding: '14px', textAlign: 'center' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {directores.length === 0 ? (
              <tr>
                <td colSpan={3} style={{ textAlign: 'center', padding: '30px', color: '#9ca3af' }}>No hay directores registrados aun.</td>
              </tr>
            ) : (
              directores.map((d) => (
                <tr key={d.id} style={{ borderBottom: '1px solid #374151', color: '#e5e7eb' }}>
                  <td style={{ padding: '14px', fontWeight: 'bold', color: '#fff' }}>{d.nombres}</td>
                  <td style={{ padding: '14px' }}>
                    <span style={{ 
                      padding: '4px 10px', 
                      borderRadius: '20px', 
                      fontSize: '0.85rem', 
                      background: d.estado === 'Activo' ? 'rgba(22, 101, 52, 0.4)' : 'rgba(153, 27, 27, 0.4)', 
                      color: d.estado === 'Activo' ? '#4ade80' : '#f87171', 
                      fontWeight: 'bold' 
                    }}>
                      {d.estado}
                    </span>
                  </td>
                  <td style={{ padding: '14px', textAlign: 'center' }}>
                    <button 
                      onClick={() => { setEditandoId(d.id || null); setForm({ nombres: d.nombres, estado: d.estado }); }} 
                      style={{ background: '#d97706', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '4px', cursor: 'pointer', marginRight: '8px', fontWeight: 'bold' }}
                    >
                      Editar
                    </button>
                    <button 
                      onClick={() => d.id && eliminarDirector(d.id)} 
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