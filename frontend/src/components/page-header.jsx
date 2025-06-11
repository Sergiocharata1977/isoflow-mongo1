import React from 'react';

export function PageHeader({ title, description }) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{title}</h1>
      {description && (
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{description}</p>
      )}
    </div>
  );
}
