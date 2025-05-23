import {
  AlchemyAccountsUIConfig,
  cookieStorage,
  createConfig,
} from "@account-kit/react";
import { baseSepolia, alchemy } from "@account-kit/infra";
// import { baseSepolia } from "viem/chains";
import { QueryClient } from "@tanstack/react-query";

const apiKey = import.meta.env.VITE_ALCHEMY_API_KEY;

const uiConfig: AlchemyAccountsUIConfig = {
  illustrationStyle: "outline",
  auth: {
    sections: [[{ type: "email" }], [{ type: "passkey" }]],
    addPasskeyOnSignup: false,
  },
};

export const config = createConfig(
  {
    // if you don't want to leak api keys, you can proxy to a backend and set the rpcUrl instead here
    // get this from the app config you create at https://dashboard.alchemy.com/accounts?utm_source=demo_alchemy_com&utm_medium=referral&utm_campaign=demo_to_dashboard
    transport: alchemy({ apiKey: apiKey }),
    chain: baseSepolia,
    ssr: false, // set to false if you're not using server-side rendering
    storage: cookieStorage,
    enablePopupOauth: true,
  },
  uiConfig
);

export const queryClient = new QueryClient();
