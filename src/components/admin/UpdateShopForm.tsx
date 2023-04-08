import {useState} from "react";
import {trpc} from "../../utils/trpc";

const UpdateShopForm = () => {
  const [shopName, setShopName] = useState('');
  const addShopName = trpc.shop.setName.useMutation()
  const getShopName = trpc.shop.getName.useQuery()
  const submitShopName = () => {
    addShopName.mutateAsync({ name: "shop", value: shopName })
      .then(() => {
        getShopName.refetch()

      })
  }
  return(
    <div className="mt-5">
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-6 gap-6">
            <div className="col-span-6 sm:col-span-3">
              <label
                htmlFor="first-name"
                className="block text-sm font-medium text-gray-700"
              >
                Set shop name
              </label>
              <input
                onChange={(e) => setShopName(e.target.value)}
                type="text"
                autoComplete="given-name"
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
              {
                getShopName.data?.value && (
                  <p className="mt-2 text-sm text-gray-500">Current shop name: {getShopName.data?.value} </p>
                )
              }
              <div className="pt-2">
                <button
                  onClick={submitShopName}
                  className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    )
}

export default UpdateShopForm;