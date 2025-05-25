import React, { useState } from 'react';
import DashboardStats from './DashboardStats';
import RecentTransactions from './RecentTransactions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { useWeb3 } from '@/hooks/useWeb3';
import { 
  Plus, Upload, Check, LineChart, 
  AlertTriangle, ArrowRight, CreditCard,
  Globe, Clock,
  Wallet
} from 'lucide-react';
import { useContracts } from '@/hooks/useContracts';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import RiskDashboard from '../risk/RiskDashboard';
import RegulatoryAITabContent from './RegulatoryAITabContent';

const ContractStatusOverview = () => {
  const { contracts, isLoadingContracts } = useContracts();
  
  const countByStatus = {
    DRAFT: 0,
    AWAITING_FUNDS: 0,
    ACTIVE: 0, // Combine FUNDED and GOODS_SHIPPED
    COMPLETED: 0
  };
  
  if (contracts && Array.isArray(contracts) && !isLoadingContracts) {
    contracts.forEach((contract: any) => {
      if (contract.status === 'DRAFT') {
        countByStatus.DRAFT += 1;
      } else if (contract.status === 'AWAITING_FUNDS') {
        countByStatus.AWAITING_FUNDS += 1;
      } else if (['FUNDED', 'GOODS_SHIPPED', 'GOODS_RECEIVED'].includes(contract.status)) {
        countByStatus.ACTIVE += 1;
      } else if (contract.status === 'COMPLETED') {
        countByStatus.COMPLETED += 1;
      }
    });
  }
  
  return (
    <div className="mt-8">
      <Card className="shadow-md bg-gradient-to-r from-slate-50 to-slate-100">
        <CardHeader className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium leading-6 text-primary">Contract Portfolio Status</h3>
          <p className="max-w-2xl mt-1 text-sm text-gray-500">Asset distribution by contract status</p>
        </CardHeader>
        <CardContent className="px-4 py-5 border-t border-gray-200 sm:p-6">
          <div className="flex flex-col">
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <div>
                  <dl className="grid grid-cols-1 gap-5 sm:grid-cols-4">
                    <div className="px-4 py-5 overflow-hidden bg-white border-l-4 rounded-lg shadow-md sm:p-6 border-l-slate-500">
                      <dt className="text-sm font-medium text-gray-500 truncate">Draft</dt>
                      <dd className="mt-1 text-3xl font-semibold text-gray-900">
                        {isLoadingContracts ? '...' : countByStatus.DRAFT}
                      </dd>
                      <div className="mt-1 text-sm text-gray-500">Pending finalization</div>
                    </div>
                    <div className="px-4 py-5 overflow-hidden bg-white border-l-4 rounded-lg shadow-md sm:p-6 border-l-amber-500">
                      <dt className="text-sm font-medium text-gray-500 truncate">Escrow Required</dt>
                      <dd className="mt-1 text-3xl font-semibold text-gray-900">
                        {isLoadingContracts ? '...' : countByStatus.AWAITING_FUNDS}
                      </dd>
                      <div className="mt-1 text-sm text-gray-500">Awaiting deposit</div>
                    </div>
                    <div className="px-4 py-5 overflow-hidden bg-white border-l-4 rounded-lg shadow-md sm:p-6 border-l-primary">
                      <dt className="text-sm font-medium text-gray-500 truncate">Active</dt>
                      <dd className="mt-1 text-3xl font-semibold text-primary">
                        {isLoadingContracts ? '...' : countByStatus.ACTIVE}
                      </dd>
                      <div className="mt-1 text-sm text-gray-500">In-transit assets</div>
                    </div>
                    <div className="px-4 py-5 overflow-hidden bg-white border-l-4 rounded-lg shadow-md sm:p-6 border-l-green-600">
                      <dt className="text-sm font-medium text-gray-500 truncate">Completed</dt>
                      <dd className="mt-1 text-3xl font-semibold text-green-600">
                        {isLoadingContracts ? '...' : countByStatus.COMPLETED}
                      </dd>
                      <div className="mt-1 text-sm text-gray-500">Settled transactions</div>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
const QuickActions = () => {
  return (
    <div className="mt-8">
      <Card className="shadow-md bg-gradient-to-r from-slate-50 to-slate-100">
        <CardHeader className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium leading-6 text-primary">Stablecoin Actions</h3>
          <p className="max-w-2xl mt-1 text-sm text-gray-500">Manage your stablecoins on Base Network</p>
        </CardHeader>
        <CardContent className="px-4 py-5 border-t border-gray-200 sm:p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <a href="/stablecoin">
              <div className="relative flex items-center px-6 py-5 space-x-3 transition-all duration-200 bg-white border border-gray-200 rounded-lg shadow-md cursor-pointer hover:border-primary hover:shadow-lg">
                <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-md bg-primary">
                  <Wallet className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">Stablecoin Wallet</p>
                  <p className="text-sm text-gray-500">Manage USDC, USDT, and DAI on Base</p>
                </div>
              </div>
            </a>
            
            <a href="/documents/upload">
              <div className="relative flex items-center px-6 py-5 space-x-3 transition-all duration-200 bg-white border border-gray-200 rounded-lg shadow-md cursor-pointer hover:border-primary hover:shadow-lg">
                <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-md bg-slate-800">
                  <Upload className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">Secure Documents</p>
                  <p className="text-sm text-gray-500">Upload verification docs</p>
                </div>
              </div>
            </a>
            
            <a href="/invoice">
              <div className="relative flex items-center px-6 py-5 space-x-3 transition-all duration-200 bg-white border border-gray-200 rounded-lg shadow-md cursor-pointer hover:border-primary hover:shadow-lg">
                <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 bg-green-600 rounded-md">
                  <Check className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">Invoice Payments</p>
                  <p className="text-sm text-gray-500">Pay with stablecoins</p>
                </div>
              </div>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};


const RiskSummary = () => {
  return (
    <div className="mt-8">
      <Card className="border shadow-md border-amber-200 bg-amber-50/50">
        <CardContent className="p-4">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-start">
              <div className="p-2 mt-1 mr-3 rounded-full bg-amber-100">
                <AlertTriangle className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Trade Risk Assessment</h3>
                <p className="mt-1 text-gray-600">
                  AI-powered risk analysis has identified 3 potential issues in your trade portfolio that require attention.
                  These include geopolitical factors, payment reliability concerns, and shipping logistics vulnerabilities.
                </p>
              </div>
            </div>
            <Link href="/risk-dashboard">
              <Button className="whitespace-nowrap">
                View Risk Dashboard
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const Dashboard = () => {
  const { isLoggedIn } = useWeb3();
  const { contracts } = useContracts();
  const [activeTab, setActiveTab] = useState<string>('overview');

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between mb-6">
          <div className="p-1 border rounded-lg bg-primary/5 border-primary/10">
            <TabsList className="bg-transparent">
              <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:shadow-md rounded-md px-4 py-2.5">
                <CreditCard className="w-4 h-4 mr-2" />
                Financial Dashboard
              </TabsTrigger>
              <TabsTrigger value="risk" className="data-[state=active]:bg-white data-[state=active]:shadow-md rounded-md px-4 py-2.5">
                <LineChart className="w-4 h-4 mr-2" />
                Risk Intelligence
              </TabsTrigger>
              <TabsTrigger value="regulatory" className="data-[state=active]:bg-white data-[state=active]:shadow-md rounded-md px-4 py-2.5">
                <Globe className="w-4 h-4 mr-2" />
                Regulatory AI
              </TabsTrigger>
              <TabsTrigger value="transactions" className="data-[state=active]:bg-white data-[state=active]:shadow-md rounded-md px-4 py-2.5">
                <Wallet className="w-4 h-4 mr-2" />
                 Transactions
               </TabsTrigger>
            </TabsList>
          </div>
          <div className="text-sm text-gray-500 flex items-center bg-white px-3 py-1.5 rounded-md border border-gray-200 shadow-sm">
            <Clock className="w-4 h-4 mr-2 text-gray-400" />
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
        
        <TabsContent value="overview" className="mt-0 space-y-6">
          <DashboardStats />
          <RiskSummary />
          <ContractStatusOverview />
          <QuickActions />
        </TabsContent>
        
        <TabsContent value="risk" className="mt-0">
          <RiskDashboard />
        </TabsContent>
        
        <TabsContent value="regulatory" className="mt-0">
          <RegulatoryAITabContent />
        </TabsContent>
        <TabsContent value="transactions" className="mt-0">          
          <RecentTransactions />
       </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;