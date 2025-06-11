import React from 'react';

const SectionPlaceholder = ({ sectionName }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 bg-white rounded-lg shadow">
      <div className="text-6xl text-green-600 mb-4">🚧</div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        Sección en desarrollo
      </h2>
      <p className="text-gray-600 text-center mb-4">
        La sección <span className="font-semibold">{sectionName}</span> está siendo implementada con la conexión a la base de datos Turso.
      </p>
      <p className="text-sm text-gray-500 text-center">
        Por favor, utiliza las secciones "Personal" o "Auditorías" que ya están conectadas a la base de datos.
      </p>
    </div>
  );
};

export default SectionPlaceholder;
