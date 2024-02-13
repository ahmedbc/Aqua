export default function AmountInput({ amount, setAmount, ethBalance }) {
  
  const adjustAmount = async (percentage) => {
    const newAmount = (ethBalance.formatted * percentage); // Use toFixed(4) to limit to 4 decimal places
    setAmount(newAmount.toString());
  }

  return (
    <div>
      <label htmlFor="price" className="block text-sm font-medium leading-6 text-gray-900">
        Price
      </label>
      <div className="relative mt-2 rounded-md shadow-sm">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <svg className="w-4 h-4 me-2 -ms-1 text-[#626890]" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="ethereum" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="currentColor" d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
        </div>
        <input
          type="text"
          name="price"
          id="price"
          className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button
          className="absolute right-28 top-1/2 transform -translate-y-1/2 bg-blue-400 text-white px-2 py-0.5 text-[10px] rounded focus:outline-none hover:bg-blue-500"
          onClick={() => adjustAmount(0.25)}
        >
          25%
        </button>
        <button
          className="absolute right-16 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white px-2 py-1 text-[12px] rounded focus:outline-none hover:bg-blue-600"
          onClick={() => adjustAmount(0.75)}
        >
          75%
        </button>

        <button
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-3 py-1 rounded text-[14px] focus:outline-none hover:bg-blue-700"
          onClick={() => adjustAmount(1)}
        >
          MAX
        </button>
      </div>
    </div>
  )
}
