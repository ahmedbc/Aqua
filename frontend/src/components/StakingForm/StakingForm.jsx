// React
import { useState } from "react"
// wagmi, viem, Rainbowkit
import { useAccount } from 'wagmi'
import { prepareWriteContract, writeContract } from '@wagmi/core'
import { parseEther } from 'viem'
import { ConnectButton } from '@rainbow-me/rainbowkit';
// Constants
import { aqETHcontractAddress, aqETHAbi, aquaContractAddress, aquaAbi } from '../../constants'
// Components
import WalletBalance from "../WalletBalance/WalletBalance";
import AmountInput from "../AmountInput/AmountInput";

export default function StakingForm() {
    const { address, isConnected } = useAccount();

    const [amount, setAmount] = useState(0)
    const [ethBalance, setEthBalance] = useState(0)
    const [aqEthBalance, setAqEthBalance] = useState(0)

    const stakeETH = async () => {

        try {
            const config = await prepareWriteContract({
                address: aquaContractAddress,
                abi: aquaAbi,
                functionName: 'stakeETH',
                value: parseEther(amount),
                account: address
            })
            const data = await writeContract(config)
            console.log(data);
            return data;
        } catch (error) {
            console.log(error);
        }
    }

    const withdrawETH = async () => {
        try {
            const config = await prepareWriteContract({
                address: aquaContractAddress,
                abi: aquaAbi,
                functionName: 'withdrawETH',
                args: [parseEther(amount)],
                account: address
            })
            const data = await writeContract(config)
            return data;
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <div className="min-h-80 flex justify-center items-center">
                <div className="w-full max-w-lg p-6 border border-gray-200 rounded-lg shadow bg-black bg-opacity-10">
                    {isConnected ? (
                        <div className="my-2">
                            <WalletBalance
                                ethBalance={ethBalance}
                                aqEthBalance={aqEthBalance}
                                setEthBalance={setEthBalance}
                                setAqEthBalance={setAqEthBalance}>
                            </WalletBalance>
                        </div>
                    ) : (
                        <></>
                    )}
                    <div className="my-2">
                        <AmountInput amount={amount} setAmount={setAmount} ethBalance={ethBalance} />
                    </div>
                    <div className="mb-2 mt-6 flex justify-center items-center">
                        {isConnected ? (
                            <div className="justify-center">
                                <button
                                    type="button"
                                    onClick={withdrawETH}
                                    className="text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                                >
                                    UnStake
                                </button>                               
                                <button
                                    type="button"
                                    onClick={stakeETH}
                                    className="text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                                >
                                    Stake
                                </button>

                            </div>
                        ) : (
                            <div className="mt-5 mb-2 flex justify-center items-center h-full">

                                <ConnectButton />

                            </div>

                        )}

                    </div>
                    <div className="flex justify-center items-center">
                        <div className="w-full max-w-lg mx-auto   ">
                            <div className="p-4">
                                
                                <div className="mt-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-light">Exchange rate</span>
                                        <span className="text-lg font-light">1 ETH = 1.1 aqETH</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-light">Max transaction cost</span>
                                        <span className="text-lg font-light">$8</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-light">Reward fee </span>
                                        <span className="text-lg font-light">5%</span>
                                    </div>
                                    
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}