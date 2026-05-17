import React, { useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  width,
  height,
  objectFit = 'contain'
}) => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  // Converter URL do Imgur se necessário
  const getImageUrl = () => {
    if (!src || error) return null;
    
    let url = src;
    if (url.includes('imgur.com/a/')) {
      const code = url.split('/a/')[1];
      url = `https://i.imgur.com/${code}.jpg`;
    } else if (url.includes('imgur.com/') && !url.includes('i.imgur.com')) {
      const code = url.split('/').pop();
      url = `https://i.imgur.com/${code}.jpg`;
    }
    
    return url;
  };

  const imageUrl = getImageUrl();

  return (
    <div 
      className={`relative overflow-hidden bg-gray-100 ${className}`}
      style={{ width: width ? `${width}px` : '100%', height: height ? `${height}px` : '100%' }}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}
      
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={alt}
          className={`w-full h-full transition-opacity duration-300 ${loading ? 'opacity-0' : 'opacity-100'}`}
          style={{ objectFit }}
          onLoad={() => setLoading(false)}
          onError={() => {
            setError(true);
            setLoading(false);
          }}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-200">
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;