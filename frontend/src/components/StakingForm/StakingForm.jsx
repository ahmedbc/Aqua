// React
import { useState, useEffect } from "react"

// wagmi, viem
import { useAccount, useBalance } from 'wagmi'
import { prepareWriteContract, writeContract, readContract, waitForTransaction, getPublicClient } from '@wagmi/core'


// VIEM (pour les events)
import { parseEther } from 'viem'

import AmountInput from "../AmountInput/AmountInput";
import { ConnectButton } from '@rainbow-me/rainbowkit';
// Constants
import { aqETHcontractAddress, aqETHAbi, aquaContractAddress, aquaAbi } from '../../constants'
import WalletBalance from "./WalletBalance";

export default function StakingForm() {
    const { address, isConnected } = useAccount();

    const [amount, setAmount] = useState(0)
    const [ethBalance, setEthBalance] = useState(0)
    const [aqEthBalance, setAqEthBalance] = useState(0)

    const fetchTotalPooledEther = async () => {
        try {
            const data = await readContract({
                address: aquaContractAddress,
                abi: aquaAbi,
                functionName: 'getTotalPooledEther',
            })
            console.log(data);
            return data;
        } catch (error) {
            console.log(error);
        }
    }
    //fetchTotalPooledEther();

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
            console.log(data);
            return data;
        } catch (error) {
            console.log(error);
        }
    }

    //stakeETH()
    return (
        <>
            <div className="min-h-80 flex justify-center items-center">
                <div className="w-full max-w-lg p-6 bg-blue border border-gray-200 rounded-lg shadow">
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
                    <div className="my-2">
                        {isConnected ? (
                            <div>
                                <button
                                    type="button"
                                    onClick={withdrawETH}
                                    className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                >
                                    UnStake
                                </button>
                                <button
                                    type="button"
                                    onClick={stakeETH}
                                    className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                >
                                    Stake
                                </button>

                            </div>
                        ) : (
                            <ConnectButton />
                        )}
                    </div>

                </div>
            </div>
        </>
    );
}