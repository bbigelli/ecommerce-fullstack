import React, { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
  onCartClick: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, onCartClick }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header onCartClick={onCartClick} />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;