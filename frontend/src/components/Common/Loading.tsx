import React from 'react';

interface LoadingProps {
  label?: string;
}

const Loading: React.FC<LoadingProps> = ({ label = 'Carregando…' }) => (
  <div
    className="flex flex-col items-center justify-center gap-3 py-16"
    role="status"
    aria-live="polite"
    aria-label={label}
  >
    <div
      className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-green-600 animate-spin"
      aria-hidden="true"
    />
    <span className="text-sm text-gray-500">{label}</span>
  </div>
);

export default Loading;