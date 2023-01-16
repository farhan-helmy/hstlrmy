import type { NextPageWithLayout } from "../_app";
import { AdminLayout } from "../../components/layout/admin";
import OrderCard from "../../components/admin/OrderCard";
import { useEffect, useState } from "react";
import ShippingCard from "../../components/admin/ShippingCard";
import { trpc } from "../../utils/trpc";

const tabsData = [
  {
    label: "Processing",
  },
  {
    label: "Shipping",
  },
  {
    label: "Completed",
  },
];

interface Status {
  status: string
}
const Orders: NextPageWithLayout = () => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [orderStatus, setOrderStatus] = useState("")

  useEffect(() => {
    switch (activeTabIndex) {
      case 0:
        setOrderStatus("pending")
        break;
      case 1:
        setOrderStatus("shipping");
        break;
      case 2:
        console.log("completed");
        break;
      default:
        console.log("Processing");
    }
  }, [activeTabIndex]);

  return (
    <>
      <div className="flex justify-center items-center">
        <div className="flex w-2/5 flex-row bg-white overflow-hidden rounded-sm border-b mb-2 justify-between">
          {/* Loop through tab data and render button for each. */}
          {tabsData.map((tab, idx) => {
            return (
              <button
                key={idx}
                className={`w-1/4 pb-2 px-1 text-center transition-colors duration-300 border-b-2 font-medium text-xs uppercase ${idx === activeTabIndex
                  ? "border-purple-500"
                  : "border-transparent hover:border-gray-200"
                  }`}
                // Change the active tab on click.
                onClick={() => setActiveTabIndex(idx)}>
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
      {activeTabIndex === 0 &&
        (<>
          <OrderCard status={orderStatus} />
        </>
        )}
      {activeTabIndex === 1 &&
        (
          <>
            <OrderCard status={orderStatus} />
          </>
        )}

    </>
  )

}

Orders.getLayout = function (page) {
  return (
    <AdminLayout>{page}</AdminLayout>
  )
};

export default Orders;