import React, { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen w-full bg-eve-dark relative overflow-hidden text-gray-100 font-sans selection:bg-eve-magenta selection:text-white">
      {/* Background Ambience / Gradient Blobs */}
      <div className="fixed top-[-20%] left-[-10%] w-[500px] h-[500px] bg-eve-purple rounded-full blur-[120px] opacity-40 animate-pulse pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-eve-magenta rounded-full blur-[140px] opacity-20 pointer-events-none" />
      
      {/* Texture overlay */}
      <div className="fixed inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none z-0 mix-blend-overlay" />

      {/* Main Content Container */}
      <main className="relative z-10 max-w-md mx-auto min-h-screen flex flex-col p-6 backdrop-blur-[2px] border-x border-white/5 shadow-2xl shadow-black">
         {children}
      </main>
    </div>
  );
};

export default Layout;
