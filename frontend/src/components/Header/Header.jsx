import { ConnectButton } from '@rainbow-me/rainbowkit';
import Image from "next/image";

const Header = () => {
    return (
        <header className="">
            <nav className="mx-auto flex max-w-7xl items-center justify-between" aria-label="Global">
                <div className="hidden lg:flex lg:flex-1 lg:justify-start">
                    <Image
                        src="/images/logo.webp"
                        alt="Aqua"
                        width={130}
                        height={24}
                        priority
                    />
                </div>
                <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                    <ConnectButton />
                </div>
            </nav>
        </header>
    )
}

export default Header