import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/HomePage";
import ContractsPage from "@/pages/ContractsPage";
import ContractDetailsPage from "./pages/ContractDetailsPage";
import DocumentsPage from "@/pages/DocumentsPage";
import WalletPage from "@/pages/WalletPage";
import Layout from "@/components/layout/Layout";
import { useWeb3 } from "./hooks/useWeb3";
import { AppProvider } from "./context/AppContext";
import { Web3Provider } from "./context/Web3Context";
import LogisticsPage from "./pages/LogisticsPage";
import { cookieToInitialState } from "@account-kit/core";
import { config } from "../config";
import { Providers } from "./pages/provider";
// Import stablecoin components
// import StablecoinWallet from "./components/wallet/StablecoinWallet";
// import StablecoinInvoice from "./components/invoice/StablecoinInvoice";
import InvoicePage from "@/components/invoice/InvoicePage";
import { useMemo } from "react";

// Auth-protected route component
const PrivateRoute = ({
  component: Component,
  path,
  ...rest
}: {
  component: React.ComponentType<any>;
  path: string;
}) => {
  const { isLoggedIn } = useWeb3();

  return (
    <Route
      path={path}
      {...rest}
      component={(params: any) =>
        isLoggedIn ? <Component {...params} /> : <Redirect to="/" />
      }
    />
  );
};

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={HomePage} />

        {/* Contract routes */}
        <Route path="/contracts" component={ContractsPage} />
        <Route path="/contracts/new" component={ContractsPage} />
        <Route path="/contracts/:id">
          {(params) => <ContractDetailsPage contractId={params.id} />}
        </Route>

        {/* Document routes */}
        <Route path="/documents" component={DocumentsPage} />
        <Route path="/documents/upload" component={DocumentsPage} />

        {/* Wallet routes */}
        <Route path="/wallet" component={WalletPage} />

        {/* Invoice routes */}
        <Route path="/invoices" component={InvoicePage} />

        {/* Logistics routes */}
        <Route path="/logistics" component={LogisticsPage} />

        {/* Other routes */}
        <Route path="/api">
          {() => <NotFound customMessage="API documentation coming soon" />}
        </Route>
        <Route path="/docs">
          {() => <NotFound customMessage="Documentation coming soon" />}
        </Route>
        <Route>{() => <NotFound customMessage="Page not found" />}</Route>
      </Switch>
    </Layout>
  );
}

const getInitialState = () => {
  if (typeof document === "undefined") return undefined;
  const cookie = document.cookie;
  return cookieToInitialState(config, cookie);
};

function App() {
  const initialState = useMemo(() => getInitialState(), []);

  return (
    <AppProvider>
      <Web3Provider>
        <Providers initialState={initialState}>
          <Router />
          <Toaster />
        </Providers>
      </Web3Provider>
    </AppProvider>
  );
}

export default App;
