import React from 'react';
import { useCart } from '../../contexts/CartContext';

const WHATSAPP_NUMBER = '5511992216409';

const WhatsAppIcon = () => (
  <svg
    className="w-5 h-5 flex-shrink-0"
    fill="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path d="M12.032 1.964c-5.517 0-9.99 4.472-9.99 9.987 0 1.763.459 3.421 1.26 4.86l-1.305 4.31 4.422-1.274c1.386.75 2.96 1.148 4.612 1.148 5.517 0 9.99-4.473 9.99-9.989 0-5.516-4.473-9.989-9.99-9.989z" />
  </svg>
);

interface WhatsAppButtonProps {
  /** Quando passado, gera mensagem de interesse em produto específico. */
  productName?: string;
  productId?: number;
}

const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({ productName, productId: _productId }) => {
  const { getWhatsAppMessage, getTotalItems } = useCart();

  const getMessage = () => {
    if (productName) {
      return `🛍️ *Tenho interesse no produto: ${productName}*\n\nGostaria de saber condições de entrega e prazo para produção.`;
    }
    return getWhatsAppMessage();
  };

  const handleClick = () => {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(getMessage())}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  /* Botão de produto individual */
  if (productName) {
    return (
      <button
        onClick={handleClick}
        className="btn-whatsapp w-full"
        type="button"
        aria-label={`Encomendar ${productName} pelo WhatsApp`}
      >
        <WhatsAppIcon />
        Encomendar pelo WhatsApp
      </button>
    );
  }

  /* Botão do carrinho */
  const hasItems = getTotalItems() > 0;
  return (
    <button
      onClick={handleClick}
      disabled={!hasItems}
      className="btn-whatsapp w-full"
      type="button"
      aria-label="Finalizar pedido via WhatsApp"
      aria-disabled={!hasItems}
    >
      <WhatsAppIcon />
      Finalizar Pedido via WhatsApp
    </button>
  );
};

export default WhatsAppButton;