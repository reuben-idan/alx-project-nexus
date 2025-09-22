import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { Toaster } from 'sonner';

const Layout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-ios-background-primary">
      <Navbar />
      
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Outlet />
        </div>
      </main>
      
      <Footer />
      <Toaster position="top-center" richColors />
    </div>
  );
};

export default Layout;
