'use client'
// Tailwind
import { Inter } from "next/font/google";
import "./globals.css";
const inter = Inter({ subsets: ["latin"] });

// Rainbowkit
import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import {
  hardhat,
  sepolia,
} from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
const { chains, publicClient } = configureChains(
  [hardhat, sepolia],
  [
    publicProvider()
  ]
);
const { connectors } = getDefaultWallets({
  appName: 'AquaAlyra',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECTID,
  chains
});
const wagmiConfig = createConfig({
  autoConnect: false,
  connectors,
  publicClient
})



export default function RootLayout({ children }) {
  return (

    <html lang="en">
      <body className='bg-white'>
        <WagmiConfig config={wagmiConfig}>
          <RainbowKitProvider chains={chains}>
            {children}
          </RainbowKitProvider>
        </WagmiConfig>
      </body>
    </html>

  );
}