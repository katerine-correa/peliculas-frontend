export interface Genero {
  id?: number;
  nombre: string;
  estado: 'Activo' | 'Inactivo';
  descripcion: string;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
}

export interface Director {
  id?: number;
  nombres: string;
  estado: 'Activo' | 'Inactivo';
  fecha_creacion?: string;
  fecha_actualizacion?: string;
}

export interface Productora {
  id?: number;
  nombre: string;
  estado: 'Activo' | 'Inactivo';
  slogan: string;
  descripcion: string;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
}

export interface Tipo {
  id?: number;
  nombre: string;
  descripcion: string;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
}

export interface Media {
  id?: number;
  serial: string;
  titulo: string;
  sinopsis: string;
  url_pelicula: string;
  imagen_portada: string;
  anio_estreno: number;
  genero_id: number;
  director_id: number;
  productora_id: number;
  tipo_id: number;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
}