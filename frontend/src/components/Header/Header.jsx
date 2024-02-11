import { ConnectButton } from '@rainbow-me/rainbowkit';

const Header = () => {
    return (
        <header className="">
            <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
                <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                    <ConnectButton />
                </div>
            </nav>
        </header>
    )
}

export default Header