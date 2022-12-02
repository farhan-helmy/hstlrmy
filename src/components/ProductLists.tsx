/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import type { FC } from "react"
import type { Item } from "../store/cart";
import useCartStore from "../store/cart";
import { trpc } from "../utils/trpc";

export const ProductLists: FC = () => {
  const cartStore = useCartStore();
  const products = trpc.products.getAll.useQuery();

  const addToCart = (product: Item) => {
    cartStore.addToCart(product);
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <h2 className="sr-only">Products</h2>

        <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {products.data?.map((product) => (
            <div key={product.id} className="group">
              <div className="aspect-w-4 aspect-h-3 overflow-hidden rounded-lg bg-gray-100">
                <img src={product.imageSrc} alt={product.imageAlt} className="object-cover object-center" />
                <div className="flex flex-col justify-center gap-4 items-end p-4 opacity-0 group-hover:opacity-100">
                  <Link href={`/products/${encodeURIComponent(product.id)}`} className="w-full rounded-md bg-blue-700 bg-opacity-75 py-2 px-4 text-center text-sm font-medium text-gray-900 backdrop-blur backdrop-filter" onClick={() => addToCart(product)}>
                    View Product
                  </Link>
                  <button className="w-full rounded-md bg-white bg-opacity-75 py-2 px-4 text-center text-sm font-medium text-gray-900 backdrop-blur backdrop-filter" onClick={() => addToCart(product)}>
                    Add to cart
                  </button>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between space-x-8 text-base font-medium text-gray-900">
                <h3 className="truncate hover:text-clip">
                     <span aria-hidden="true" className="inset-0" />
                    {product.name}               
                </h3>
                <p>RM{product.price}</p>
              </div>
              <p className="mt-1 text-sm text-gray-500">{product.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}