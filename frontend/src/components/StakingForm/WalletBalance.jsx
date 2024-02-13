import { useEffect } from 'react';
import { useAccount, useBalance } from 'wagmi';
import { fetchBalance } from '@wagmi/core'

export default function WalletBalance({ ethBalance, aqEthBalance, setEthBalance, setAqEthBalance }) {
  const { address, isConnected } = useAccount();

  if (!isConnected) return;

  const { data: ethB, isError, isLoading } = useBalance({
    address: address,
    watch: true,
  });


  useEffect(() => {
    const fetchAqEthBalance = async () => {
      try {
        const aqEthB = await fetchBalance({
          address: address,
          token: process.env.NEXT_PUBLIC_AQETH_CONTRACT_ADDRESS,
        });
        setAqEthBalance(aqEthB);
      } catch (error) {
        console.error('Failed to fetch AQETH balance:', error);
      }
    }
    fetchAqEthBalance();

    setEthBalance(ethB);
  }, [ethB, address])

  return (
    <div>
      <div>Available to stake: {parseFloat(ethBalance.formatted).toFixed(6)} ETH</div>
      <div>Staked amount: {parseFloat(aqEthBalance.formatted).toFixed(6)} aqETH</div>
    </div>
  )

}