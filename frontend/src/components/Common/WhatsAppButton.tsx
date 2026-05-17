import React from 'react';
import { useCart } from '../../contexts/CartContext';

interface WhatsAppButtonProps {
  productName?: string;
  productId?: number;
}

const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({ productName, productId }) => {
  const { items, getWhatsAppMessage, getTotalItems } = useCart();
  
  const numeroWhatsApp = import.meta.env.VITE_WHATSAPP_NUMBER || "5511992216409";
  
  const getMessage = () => {
    if (productName) {
      // Mensagem para produto específico
      return `🛍️ *Olá Iolete!. Tenho interesse no produto: ${productName}* 🛍️\n\nGostaria de saber condições de entrega e prazo para produção.`;
    } else {
      // Mensagem para o carrinho completo
      return getWhatsAppMessage();
    }
  };
  
  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(getMessage());
    const url = `https://wa.me/${numeroWhatsApp}?text=${message}`;
    window.open(url, '_blank');
  };
  
  const hasItems = getTotalItems() > 0;
  
  if (productName) {
    // Botão para produto individual
    return (
      <button
        onClick={handleWhatsAppClick}
        className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition flex items-center justify-center gap-2"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.032 1.964c-5.517 0-9.99 4.472-9.99 9.987 0 1.763.459 3.421 1.26 4.86l-1.305 4.31 4.422-1.274c1.386.75 2.96 1.148 4.612 1.148 5.517 0 9.99-4.473 9.99-9.989 0-5.516-4.473-9.989-9.99-9.989z"/>
        </svg>
        Encomendar pelo WhatsApp
      </button>
    );
  }
  
  // Botão para o carrinho
  return (
    <button
      onClick={handleWhatsAppClick}
      disabled={!hasItems}
      className={`w-full py-2 px-4 rounded-md transition flex items-center justify-center gap-2 ${
        hasItems
          ? 'bg-green-600 hover:bg-green-700 text-white'
          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
      }`}
    >
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.032 1.964c-5.517 0-9.99 4.472-9.99 9.987 0 1.763.459 3.421 1.26 4.86l-1.305 4.31 4.422-1.274c1.386.75 2.96 1.148 4.612 1.148 5.517 0 9.99-4.473 9.99-9.989 0-5.516-4.473-9.989-9.99-9.989z"/>
      </svg>
      Finalizar Pedido via WhatsApp
    </button>
  );
};

export default WhatsAppButton;