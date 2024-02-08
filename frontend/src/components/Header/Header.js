import React from 'react'

const Header = () => {
    return (
        <header class="">
            <nav class="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
                <div class="hidden lg:flex lg:flex-1 lg:justify-end">
                    <a href="#" class="text-sm font-semibold leading-6 text-white-900">Log in <span aria-hidden="true">&rarr;</span></a>
                </div>
            </nav>
        </header>
    )
}

export default Header