import React from 'react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  return (
    <div className="flex flex-col justify-center items-center h-64">
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-md">
        <strong className="font-bold">Erro! </strong>
        <span className="block sm:inline">{message}</span>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Tentar novamente
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;