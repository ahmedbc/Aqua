//React
import { useEffect } from 'react';
// wagmi, viem
import { useAccount, useBalance } from 'wagmi';
import { fetchBalance } from '@wagmi/core'
import { formatUnits } from 'viem'


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
        const data = await fetchBalance({
          address: address,
          token: process.env.NEXT_PUBLIC_AQETH_CONTRACT_ADDRESS,
        });
        setAqEthBalance(formatUnits(data.value, 18));
      } catch (error) {
        console.error('Failed to fetch AQETH balance:', error);
      }
    }
    fetchAqEthBalance();

    setEthBalance(formatUnits(ethB.value, 18));
  }, [ethB, address])

 if(isLoading) return;
  return (
    <div className='mb-6'>
      <div>Available to stake: {ethBalance} ETH</div>
      <div>Staked amount: {aqEthBalance} aqETH</div>
    </div>
  )

}