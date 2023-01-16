export default function ShippingCard() {
  return (
    <>
      <div className="flex justify-center items-center">
        <div className="flex w-2/5 flex-col bg-white overflow-hidden rounded-sm border-b mb-2">
          <div className="flex justify-between items-center px-2 py-2">
            <div className="text-xs font-extralight text-gray-700">#001 11/01/2023 at 10:109PM</div>
            <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
              Shipping
            </span>
          </div>
        
          <div className="px-2">
            <div className="uppercase text-xs text-blue-600 font-bold">Farhan</div>
            <div className="uppercase text-xs">012 - 345 6789</div>
          </div>
        </div>
      </div>
    </>
  )
}