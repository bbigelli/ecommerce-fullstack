// src/components/Cart/Cart.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const Cart: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const { user } = useAuth();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Função para gerar mensagem do WhatsApp
  const generateWhatsAppMessage = () => {
    // Número da vendedora (substitua pelo número real)
    const phoneNumber = "5511992216409"; // Formato: 55 + DDD + número
    
    // Criar mensagem com os produtos
    let message = "🛍️ *NOVO PEDIDO - ARTELLI ARTESANATOS* 🛍️\n\n";
    message += "*DETALHES DO PEDIDO:*\n";
    message += "━".repeat(30) + "\n\n";
    
    // Listar produtos
    cart.forEach((item, index) => {
      message += `*${index + 1}.* ${item.name}\n`;
      message += `   📦 Quantidade: ${item.quantity}\n`;
      message += `   💰 Valor unitário: R$ ${item.price.toFixed(2)}\n`;
      message += `   💵 Subtotal: R$ ${(item.price * item.quantity).toFixed(2)}\n\n`;
    });
    
    message += "━".repeat(30) + "\n\n";
    message += `*💰 TOTAL DO PEDIDO:* R$ ${total.toFixed(2)}\n\n`;
    message += "━".repeat(30) + "\n\n";
    
    // Informações do cliente
    if (user) {
      message += "*👤 DADOS DO CLIENTE:*\n";
      message += `Nome: ${user.username}\n`;
      message += `Email: ${user.email}\n`;
    } else {
      message += "*⚠️ Cliente não autenticado*\n";
    }
    
    message += "\n━".repeat(30) + "\n\n";
    message += "*📋 INFORMAÇÕES ADICIONAIS:*\n";
    message += "Produtos sob encomenda\n";
    message += "Prazo de produção: 15-20 dias úteis\n";
    message += "Formas de pagamento: Pix, Cartão\n\n";
    message += "━".repeat(30) + "\n\n";
    message += "*✨ Agradecemos pela preferência!*\n";
    message += "*Em breve entraremos em contato!* 🎨";
    
    // Codificar a mensagem para URL
    return encodeURIComponent(message);
  };

  const handleWhatsAppOrder = () => {
    if (!user) {
      toast.error('Faça login para fazer o pedido');
      return;
    }
    
    if (cart.length === 0) {
      toast.error('Seu carrinho está vazio');
      return;
    }
    
    const message = generateWhatsAppMessage();
    const phoneNumber = "5511992216409"; // Substitua pelo número real
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    
    // Abrir WhatsApp em nova aba
    window.open(whatsappUrl, '_blank');
    
    // Opcional: Limpar carrinho após o pedido
    // toast.success('Pedido enviado! Você será redirecionado para o WhatsApp');
    // setTimeout(() => {
    //   clearCart();
    // }, 2000);
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-2xl font-bold text-artesanal-brown mb-4">Seu carrinho está vazio</h2>
        <p className="text-gray-600 mb-8">Que tal explorar nossos produtos artesanais?</p>
        <Link to="/products" className="btn-primary inline-block">
          Explorar Produtos
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-artesanal-brown mb-8">Seu Carrinho</h1>
      
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Lista de produtos */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div key={item.id} className="card-artesanal p-4 flex gap-4">
              <img
                src={item.image_url || 'https://via.placeholder.com/100'}
                alt={item.name}
                className="w-24 h-24 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-artesanal-brown">{item.name}</h3>
                <p className="text-artesanal-orange font-bold">
                  R$ {item.price.toFixed(2)}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <label className="text-sm text-gray-600">Quantidade:</label>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                    className="w-16 px-2 py-1 border rounded"
                  />
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-700 ml-4"
                  >
                    Remover
                  </button>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-artesanal-brown">
                  R$ {(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Resumo do pedido */}
        <div className="lg:col-span-1">
          <div className="card-artesanal p-6 sticky top-24">
            <h2 className="text-xl font-bold text-artesanal-brown mb-4">Resumo do Pedido</h2>
            
            <div className="space-y-2 border-b pb-4">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>R$ {total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Frete:</span>
                <span>Favor enviar seu endereço para ser calculado</span>
              </div>
            </div>
            
            <div className="flex justify-between font-bold text-lg mt-4">
              <span>Total Sem Frete:</span>
              <span className="text-artesanal-orange">R$ {total.toFixed(2)}</span>
            </div>
            
            {/* Botão do WhatsApp */}
            <button
              onClick={handleWhatsAppOrder}
              className="btn-whatsapp w-full mt-6 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.588 1.972.895 3.054.895h.002c3.18 0 5.767-2.586 5.768-5.766.001-3.18-2.585-5.768-5.765-5.768zm3.236 7.674c-.13.361-.537.813-.915.984-.348.158-.754.184-1.063.184-.649 0-1.071-.142-1.624-.406-1.14-.545-2.315-1.603-3.192-2.829-.365-.511-.802-1.176-.802-1.861 0-.461.132-.862.384-1.17.196-.24.455-.365.72-.433.163-.041.333-.028.479-.028.115 0 .207.008.297.094.096.091.21.264.301.427.192.345.371.733.509 1.094.065.172.082.306.041.463-.042.157-.123.29-.211.392-.082.094-.167.169-.249.248-.067.064-.141.134-.198.204-.062.076-.131.164-.096.281.067.224.308.562.54.816.246.27.548.496.885.686.172.097.364.179.556.227.127.031.232.036.334.022.152-.019.285-.072.401-.161.12-.093.207-.207.249-.336.059-.176.022-.359-.053-.509-.058-.117-.131-.229-.199-.336l-.001-.002c-.053-.082-.11-.169-.138-.23-.037-.081-.024-.157.024-.228.084-.128.203-.218.325-.301.161-.11.354-.186.548-.186.241 0 .442.103.563.239.132.148.199.365.207.594.004.115-.013.27-.044.439-.042.229-.132.475-.304.692-.169.214-.421.373-.687.472-.235.087-.492.108-.744.108-.044 0-.088-.001-.132-.003-.124-.007-.249-.024-.373-.052-.266-.06-.529-.177-.767-.333-.575-.379-1.043-.929-1.404-1.45-.036-.052-.136-.207-.078-.297.071-.108.34-.424.416-.545.062-.099.092-.169.118-.225.027-.056.027-.109-.005-.167-.031-.058-.084-.127-.136-.195-.057-.076-.124-.165-.175-.217-.144-.149-.333-.205-.514-.205-.174 0-.336.036-.471.108-.388.202-.779.618-1.028.956-.372.5-.566 1.123-.566 1.759 0 .544.192 1.02.428 1.437.22.387.518.729.825 1.014.37.341.807.587 1.281.749.417.143.859.212 1.301.212.355 0 .703-.049 1.041-.15.399-.119.769-.303 1.087-.548.318-.244.575-.53.759-.843.18-.308.28-.633.295-.948.014-.253-.026-.483-.124-.688-.091-.189-.204-.33-.336-.44-.126-.106-.253-.174-.381-.205-.158-.037-.271-.044-.371-.018.041.022.087.048.137.08.126.083.252.18.368.291.109.105.194.216.257.327z"/>
              </svg>
              Encomendar via WhatsApp
            </button>
            
            <Link
              to="/products"
              className="block text-center text-artesanal-brown hover:text-artesanal-orange mt-4"
            >
              Continuar comprando
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;