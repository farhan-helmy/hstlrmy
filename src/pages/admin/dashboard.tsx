import type { ReactElement } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { AdminLayout } from "../../components/layout/admin";
import { trpc } from "../../utils/trpc";

const tabs = [
  { name: 'Banner', href: '#', current: true },
  { name: 'Other settings', href: '#', current: false },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

const Dashboard = () => {
  const [currentTab, setCurrentTab] = useState(tabs[0]?.name)
  const [bannerText, setBannerText] = useState('')
  const addBannerText = trpc.products.setBannerText.useMutation()
  const getBannerText = trpc.products.getBannerText.useQuery()

  const submitBannerText = async () => {
    console.log(bannerText)
    addBannerText.mutateAsync({ name: "banner", value: bannerText }).then(() => {
      getBannerText.refetch()
    })
    // if the mutation is successful, refetch the query
  }

  useEffect(() => {
    setBannerText(getBannerText.data?.value as string)
  }, [addBannerText.isSuccess, getBannerText.data?.value])

  return (
    <div>
      <div className="border-b border-gray-200 pb-5 sm:pb-0">

        <div className="mt-3 sm:mt-4">
          <div className="sm:hidden">
            <label htmlFor="current-tab" className="sr-only">
              Select a tab
            </label>
            <select
              id="current-tab"
              name="current-tab"
              className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              defaultValue={tabs.find((tab) => tab.current)?.name}
            >
              {tabs.map((tab) => (
                <option key={tab.name}>{tab.name}</option>
              ))}
            </select>
          </div>
          <div className="hidden sm:block">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  onClick={() => console.log(tab.name)}
                  key={tab.name}
                  className={classNames(
                    tab.current
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                    'whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm'
                  )}
                  aria-current={tab.current ? 'page' : undefined}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>
      {currentTab === 'Banner' && (
        <div className="mt-5">
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <div className="px-4 py-5 sm:p-6">
              <div className="grid grid-cols-6 gap-6">
                <div className="col-span-6 sm:col-span-3">
                  <label
                    htmlFor="first-name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Set banner text
                  </label>
                  <input
                    onChange={(e) => setBannerText(e.target.value)}
                    type="text"
                    autoComplete="given-name"
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                  {
                    getBannerText.data?.value && (
                      <p className="mt-2 text-sm text-gray-500">Current banner text: {getBannerText.data?.value} </p>
                    )
                  }

                  <div className="pt-2">
                    <button
                      onClick={submitBannerText}
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

      )}
    </div>
  )
}

Dashboard.getLayout = function (page: ReactElement) {
  return (
    <AdminLayout>{page}</AdminLayout>
  )
};

export default Dashboard;