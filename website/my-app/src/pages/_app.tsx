"use client";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/react";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { polygon, polygonMumbai } from "wagmi/chains";
import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";

const chains = [polygon];

export const theme = extendTheme({
  colors: {
    brand: {
      200: "#12ff80",
      400: "#B0FFC9",
      600: "#00B460",
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 700,
        borderRadius: 0,
        color: "black",
        backgroundColor: "brand.200",
        _hover: {
          transform: "scale(1.02)",
          opacity: 0.95,
        },
      },
      variants: {
        secondary: {
          bg: "brand.400",
          _loading: {
            bg: "brand.400 !important",
          },
        },
        prime: {
          bg: "brand.200",
          _loading: {
            bg: "brand.200 !important",
          },
        },
      },
    },
  },
});

if (!process.env.NEXT_PUBLIC_WALLETCONNECT)
  throw new Error("Missing NEXT_PUBLIC_WALLETCONNECT");
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT;

const { provider } = configureChains(chains, [w3mProvider({ projectId })]);
const wagmiClient = createClient({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, version: 1, chains }),
  provider,
});
const ethereumClient = new EthereumClient(wagmiClient, chains);

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <CacheProvider>
        <ChakraProvider theme={theme}>
          <WagmiConfig client={wagmiClient}>
            <Component {...pageProps} />
          </WagmiConfig>
        </ChakraProvider>
      </CacheProvider>

      <Web3Modal
        themeMode="dark"
        projectId={projectId}
        ethereumClient={ethereumClient}
        themeVariables={{
          "--w3m-accent-color": "#003D1D",
          "--w3m-background-color": "#003D1D",
        }}
      />
    </>
  );
}
