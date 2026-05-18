import React from 'react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => (
  <div
    className="flex flex-col items-center justify-center gap-4 py-16 px-4"
    role="alert"
    aria-live="assertive"
  >
    <div className="flex items-start gap-3 bg-red-50 border border-red-300 text-red-700 px-5 py-4 rounded-lg max-w-md w-full">
      <svg
        className="w-5 h-5 flex-shrink-0 mt-0.5"
        fill="currentColor"
        viewBox="0 0 20 20"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
          clipRule="evenodd"
        />
      </svg>
      <p className="text-sm font-medium">{message}</p>
    </div>

    {onRetry && (
      <button onClick={onRetry} className="btn-primary btn-sm" type="button">
        Tentar novamente
      </button>
    )}
  </div>
);

export default ErrorMessage;