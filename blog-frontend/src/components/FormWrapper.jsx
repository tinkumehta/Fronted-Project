import React from 'react';

export default function FormWrapper({ title, children }) {
  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold mb-4 text-center">{title}</h2>
      {children}
    </div>
  );
}