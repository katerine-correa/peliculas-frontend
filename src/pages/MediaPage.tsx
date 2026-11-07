import { useEffect, useState, type FormEvent } from 'react';
import api from '../services/api';

export default function MediaPage() {
  
  // Estados y estilos
  const [mediaList, setMediaList] = useState<any[]>([]);
  const [rels, setRels] = useState({ generos: [], directores: [], productoras: [], tipos: [] });
  const [form, setForm] = useState({ 
    serial: '', 
    titulo: '', 
    sinopsis: '', 
    ano_estreno: new Date().getFullYear(), 
    url_pelicula: '', 
    genero_id: '', 
    director_id: '', 
    productora_id: '', 
    tipo_id: '' 
  });
  const [editandoId, setEditandoId] = useState<number | null>(null);

  const inputStyle = { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #4b5563', background: '#111827', color: '#fff', boxSizing: 'border-box' as const };

  //Peticiones al api CRUD
  const cargarDatos = async () => {
    try {
      const [media, generos, directores, productoras, tipos] = await Promise.all([
        api.get('/media'), api.get('/generos'), api.get('/directores'), api.get('/productoras'), api.get('/tipos')
      ]);
      setMediaList(media.data);
      setRels({ generos: generos.data, directores: directores.data, productoras: productoras.data, tipos: tipos.data });
      
      let maxNum = 0;
      media.data.forEach((item: any) => {
        const num = parseInt(item.serial, 10);
        if (!isNaN(num) && num > maxNum) {
          maxNum = num;
        }
      });

      const siguienteNum = maxNum + 1;
      const serialGenerado = String(siguienteNum).padStart(3, '0');
      setForm(prev => ({ ...prev, serial: serialGenerado }));

    } catch (err) { console.error('Error al cargar datos:', err); }
  };

  useEffect(() => { cargarDatos(); }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      // Enviar ano_estreno sin ñ, las diferentes formas de la url
      const payload = {
        ...form,
        ano_estreno: form.ano_estreno,
        anio_estreno: form.ano_estreno,
        urlPelícula: form.url_pelicula,
        urlPelicula: form.url_pelicula,
        url: form.url_pelicula,
        generoId: form.genero_id,
        directorId: form.director_id,
        productoraId: form.productora_id,
        tipoId: form.tipo_id
      };

      editandoId ? await api.put(`/media/${editandoId}`, payload) : await api.post('/media', payload);
      setEditandoId(null);
      await cargarDatos();
    } catch (err) { alert('Error al guardar el contenido.'); }
  };

  const eliminar = async (id: number) => {
    if (window.confirm('Deseas eliminar este registro?') && id) {
      await api.delete(`/media/${id}`).catch(() => alert('No se pudo eliminar.'));
      cargarDatos();
    }
  };

  // vista
  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      
      {/* Título de la Sección */}
      <h2 style={{ color: '#f3f4f6', marginBottom: '5px' }}>Modulo de Media</h2>
      <p style={{ color: '#9ca3af', marginBottom: '25px' }}>Administra el catalogo general relacionando generos, directores, productoras y tipos.</p>

      {/* Formulario de Creación y Edición */}
      <form onSubmit={handleSubmit} style={{ background: '#1f2937', padding: '25px', borderRadius: '10px', marginBottom: '35px', border: '1px solid #374151' }}>
        <h3 style={{ color: '#38bdf8', marginTop: 0, marginBottom: '20px' }}>{editandoId ? 'Editar Contenido' : 'Nuevo Contenido'}</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#d1d5db', fontWeight: 'bold' }}>Serial (Automático):</label>
            <input type="text" value={form.serial} disabled style={{ ...inputStyle, background: '#1f2937', color: '#9ca3af', cursor: 'not-allowed' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#d1d5db', fontWeight: 'bold' }}>Titulo:</label>
            <input type="text" value={form.titulo} onChange={e => setForm({ ...form, titulo: e.target.value })} required style={inputStyle} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#d1d5db', fontWeight: 'bold' }}>Año de Estreno:</label>
            <input type="number" value={form.ano_estreno} onChange={e => setForm({ ...form, ano_estreno: Number(e.target.value) })} required style={inputStyle} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#d1d5db', fontWeight: 'bold' }}>URL de la Película / Serie:</label>
            <input type="text" placeholder="Ej: https://www.youtube.com/watch?v=..." value={form.url_pelicula} onChange={e => setForm({ ...form, url_pelicula: e.target.value })} required style={inputStyle} />
          </div>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: '#d1d5db', fontWeight: 'bold' }}>Sinopsis:</label>
          <textarea value={form.sinopsis} onChange={e => setForm({ ...form, sinopsis: e.target.value })} required style={{ ...inputStyle, height: '70px' }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          {[['genero_id', 'Genero', rels.generos, 'nombre'], ['director_id', 'Director', rels.directores, 'nombres'], ['productora_id', 'Productora', rels.productoras, 'nombre'], ['tipo_id', 'Tipo', rels.tipos, 'nombre']].map(([key, label, data, field]: any) => (
            <div key={key}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#d1d5db', fontWeight: 'bold' }}>{label}:</label>
              <select value={form[key as keyof typeof form]} onChange={e => setForm({ ...form, [key]: Number(e.target.value) })} required style={inputStyle}>
                <option value="">Seleccione {label.toLowerCase()}</option>
                {data.map((item: any) => <option key={item.id} value={item.id}>{item[field]}</option>)}
              </select>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="submit" style={{ background: '#0284c7', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>{editandoId ? 'Actualizar' : 'Guardar'}</button>
          {editandoId && <button type="button" onClick={() => { setEditandoId(null); cargarDatos(); }} style={{ background: '#4b5563', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer' }}>Cancelar</button>}
        </div>
      </form>

      {/* Tabla de Visualización de Registros */}
      <h3 style={{ color: '#f3f4f6', marginBottom: '15px' }}>Lista de Multimedia Registrada</h3>
      <div style={{ background: '#1f2937', borderRadius: '10px', border: '1px solid #374151', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#111827', color: '#38bdf8', borderBottom: '1px solid #374151' }}>
              <th style={{ padding: '14px' }}>Serial</th>
              <th style={{ padding: '14px' }}>Título</th>
              <th style={{ padding: '14px' }}>Año</th>
              <th style={{ padding: '14px' }}>Sinopsis</th>
              <th style={{ padding: '14px', textAlign: 'center' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {mediaList.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: '30px', color: '#9ca3af' }}>No hay contenido multimedia registrado aun.</td></tr>
            ) : (
              mediaList.map((m) => (
                <tr key={m.id} style={{ borderBottom: '1px solid #374151', color: '#e5e7eb' }}>
                  <td style={{ padding: '14px', fontWeight: 'bold', color: '#38bdf8' }}>{m.serial}</td>
                  <td style={{ padding: '14px', fontWeight: 'bold', color: '#fff' }}>{m.titulo}</td>
                  {/* Leemos ano_estreno o anio_estreno según lo que devuelva el backend */}
                  <td style={{ padding: '14px', color: '#9ca3af' }}>{m.ano_estreno || m.anio_estreno || m.anioEstreno}</td>
                  <td style={{ padding: '14px', color: '#9ca3af', maxWidth: '300px' }}>{m.sinopsis}</td>
                  <td style={{ padding: '14px', textAlign: 'center' }}>
                    <button onClick={() => { setEditandoId(m.id || null); setForm({ serial: m.serial, titulo: m.titulo, sinopsis: m.sinopsis, ano_estreno: m.ano_estreno || m.anio_estreno || m.anioEstreno, url_pelicula: m.url_pelicula || m.urlPelícula || m.url, genero_id: m.genero_id?.id || m.genero_id, director_id: m.director_id?.id || m.director_id, productora_id: m.productora_id?.id || m.productora_id, tipo_id: m.tipo_id?.id || m.tipo_id }); }} style={{ background: '#d97706', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '4px', cursor: 'pointer', marginRight: '8px', fontWeight: 'bold' }}>Editar</button>
                    <button onClick={() => m.id && eliminar(m.id)} style={{ background: '#dc2626', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Eliminar</button>
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