// React
import { useEffect } from "react"
// wagmi, viem
import { readContract } from '@wagmi/core'
import { formatUnits } from 'viem'
import { useBalance, useAccount } from 'wagmi'
// Constants
import { aqETHcontractAddress, aqETHAbi, aquaContractAddress, aquaAbi } from '../../constants'

export default function AquaStatistics({totalPooledEther, setTotalPooledEther}) {
    const { address, isConnected } = useAccount();
    const { data: ethB, isError, isLoading } = useBalance({
        address: address,
        watch: true,
      });
    
    useEffect(() => {
        const fetchTotalPooledEther = async () => {
            try {
                const data = await readContract({
                    address: aquaContractAddress,
                    abi: aquaAbi,
                    functionName: 'getTotalPooledEther',
                });
              
                setTotalPooledEther(formatUnits(data, 18));
                
            } catch (error) {
                console.error(error);
                setTotalPooledEther(0); 
            }
        };

        fetchTotalPooledEther();
    
    }, [ethB]);
    

    return (
        <div className="flex justify-center items-center mt-5">
            <div className="w-full max-w-lg mx-auto  border border-gray-200 rounded-lg shadow bg-black bg-opacity-10 ">
                <div className="p-4">
                    <div className="flex items-center justify-between">
                        <span className="text-lg font-medium">Aqua statistics</span>
                        {/* <a href="https://etherscan.io" target="_blank" className="text-blue-400 hover:text-blue-600 text-sm">View on Etherscan</a> */}
                    </div>
                    <div className="mt-2">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-light">Annual percentage rate</span>
                            <span className="text-lg font-semibold">3.7%</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-light">Total staked with Lido</span>
                            <span className="text-lg font-semibold">{totalPooledEther}</span>
                        </div>
                        {/* <div className="flex justify-between items-center">
                            <span className="text-sm font-light">Stakers</span>
                            <span className="text-lg font-semibold">368843</span>
                        </div> */}
                    </div>
                </div>
            </div>
        </div>
    )
}