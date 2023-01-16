import { trpc } from "../../utils/trpc";

interface OrderCardProps {
  status: string
}

export default function OrderCard({ status }: OrderCardProps) {

  const orders = trpc.orders.getOrders.useQuery({ status });
  console.log(orders)
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-red-100 text-red-800"
      case "shipping":
        return "bg-yellow-100 text-yellow-800"
      case "completed":
        return "bg-green-100"
      default:
        return "bg-gray-100"
    }
  }
  return (
    <>
      {orders.data?.map((order) => (
        <div className="flex justify-center items-center" key={order.id}>
          <div className="flex w-2/5 flex-col bg-white overflow-hidden rounded-sm border-b mb-2 cursor-pointer" onClick={() => alert("gk")}>
            <div className="flex justify-between items-center px-2 py-2">
              <div className="text-xs font-extralight text-gray-700">#{order.count} {order.createdAt.toUTCString()}</div>
              <span className={`${getStatusColor(status)} uppercase inline-flex items-center rounded-full  px-2.5 py-0.5 text-xs font-medium`}>
                {status}
              </span>
            </div>

            <div className="px-2">
              <div className="uppercase text-xs text-blue-600 font-bold">{order.name}</div>
              <div className="uppercase text-xs py-1">{order.phone}</div>
            </div>
          </div>
        </div>
      ))
      }
    </>
  )
}