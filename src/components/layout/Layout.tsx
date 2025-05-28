import React, { ReactNode } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { useWeb3 } from '@/hooks/useWeb3';
import { useAppContext } from '@/hooks/useAppContext';
import { AlertCircle } from 'lucide-react';


interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { isKYCCompleted, kycStatus } = useAppContext();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <main className="flex-1 overflow-y-auto bg-gray-50 min-h-[calc(100vh-4rem)]">
          <div className="py-6">
            <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;