
const Footer = () => {
    return (
        <footer className="py-4">
            <div className="max-w-screen-xl mx-auto px-4 flex items-center justify-between">

                <div className="flex items-center">

                    <img src="/path-to-your-logo.png" alt="Logo" className="mr-3 h-6 sm:h-9" />

                    <ul className="flex items-center space-x-4">
                        <li><a href="#" className="text-white text-sm hover:underline">Terms of Use</a></li>
                        <li><a href="#" className="text-white text-sm hover:underline">Privacy Notice</a></li>
                    </ul>
                </div>

                <div className="text-white text-sm">
                    &copy; Aqua v0.29.0
                </div>
            </div>
        </footer>
    )
}

export default Footer