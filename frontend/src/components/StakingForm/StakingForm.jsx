import { useAccount } from 'wagmi'

import AmountInput from "../AmountInput/AmountInput";
import { ConnectButton } from '@rainbow-me/rainbowkit';


export default function StakingForm() {
    const { address, isConnected } = useAccount();
    console.log(address);
    console.log(isConnected);
    return (
        <>
            <div className="min-h-80 flex justify-center items-center">
                <div className="max-w-sm p-6 bg-blue border border-gray-200 rounded-lg shadow">
                    <div className="my-2">
                        <AmountInput />
                    </div>
                    <div className="my-2">
                        {isConnected ? (
                            <div></div>
                        ) : (
                            <ConnectButton />
                        )}
                    </div>

                </div>
            </div>
        </>
    );
}