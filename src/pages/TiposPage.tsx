import { useEffect, useState, type FormEvent } from 'react';
import api from '../services/api';
import type { Tipo } from '../interfaces/types';

export default function TiposPage() {
  
  //Estados y estilos
  
  const [tipos, setTipos] = useState<Tipo[]>([]);
  const [form, setForm] = useState<Tipo>({ nombre: '', descripcion: '' });
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

  
  //Peticiones al api (CRUD)
  
  const cargarTipos = () => {
    api.get('/tipos')
      .then(res => setTipos(res.data))
      .catch(err => console.error('Error al cargar tipos:', err));
  };

  useEffect(() => { 
    cargarTipos(); 
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (editandoId) {
        await api.put(`/tipos/${editandoId}`, form);
        setEditandoId(null);
      } else {
        await api.post('/tipos', form);
      }
      setForm({ nombre: '', descripcion: '' });
      cargarTipos();
    } catch (err) {
      alert('Error al guardar el tipo.');
    }
  };

  const eliminarTipo = async (id: number) => {
    if (window.confirm('Deseas eliminar este tipo?') && id) {
      try {
        await api.delete(`/tipos/${id}`);
        cargarTipos();
      } catch (err) {
        alert('No se pudo eliminar el tipo.');
      }
    }
  };

  
  //Renderizado del componente
  
  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      
      {/* Título de la Sección */}
      <h2 style={{ color: '#f3f4f6', marginBottom: '5px' }}>Tipos</h2>
      <p style={{ color: '#9ca3af', marginBottom: '25px' }}>Registra y gestiona los tipos de contenido multimedia.</p>

      {/* Formulario de Creación y Edición */}
      <form onSubmit={handleSubmit} style={{ background: '#1f2937', padding: '25px', borderRadius: '10px', marginBottom: '35px', border: '1px solid #374151' }}>
        <h3 style={{ color: '#38bdf8', marginTop: 0, marginBottom: '20px' }}>
          {editandoId ? 'Editar Tipo' : 'Nuevo Tipo'}
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

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: '#d1d5db', fontWeight: 'bold' }}>Descripcion:</label>
          <textarea 
            value={form.descripcion} 
            onChange={e => setForm({ ...form, descripcion: e.target.value })} 
            required 
            style={{ ...inputStyle, height: '80px' }} 
          />
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="submit" style={{ background: '#0284c7', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
            {editandoId ? 'Actualizar' : 'Guardar'}
          </button>
          {editandoId && (
            <button 
              type="button" 
              onClick={() => { setEditandoId(null); setForm({ nombre: '', descripcion: '' }); }} 
              style={{ background: '#4b5563', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer' }}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      {/* Tabla de Visualización de Registros */}
      <h3 style={{ color: '#f3f4f6', marginBottom: '15px' }}>Lista de Tipos Registrados</h3>
      <div style={{ background: '#1f2937', borderRadius: '10px', border: '1px solid #374151', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#111827', color: '#38bdf8', borderBottom: '1px solid #374151' }}>
              <th style={{ padding: '14px' }}>Nombre</th>
              <th style={{ padding: '14px' }}>Descripcion</th>
              <th style={{ padding: '14px', textAlign: 'center' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {tipos.length === 0 ? (
              <tr>
                <td colSpan={3} style={{ textAlign: 'center', padding: '30px', color: '#9ca3af' }}>No hay tipos registrados aun.</td>
              </tr>
            ) : (
              tipos.map((t) => (
                <tr key={t.id} style={{ borderBottom: '1px solid #374151', color: '#e5e7eb' }}>
                  <td style={{ padding: '14px', fontWeight: 'bold', color: '#fff' }}>{t.nombre}</td>
                  <td style={{ padding: '14px', color: '#9ca3af' }}>{t.descripcion}</td>
                  <td style={{ padding: '14px', textAlign: 'center' }}>
                    <button 
                      onClick={() => { setEditandoId(t.id || null); setForm({ nombre: t.nombre, descripcion: t.descripcion }); }} 
                      style={{ background: '#d97706', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '4px', cursor: 'pointer', marginRight: '8px', fontWeight: 'bold' }}
                    >
                      Editar
                    </button>
                    <button 
                      onClick={() => t.id && eliminarTipo(t.id)} 
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