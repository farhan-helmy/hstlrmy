/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import type { FC } from "react";
import { trpc } from "../utils/trpc";
import LoadingSpinner from "./LoadingSpinner";
import { motion } from 'framer-motion'

export interface Product {
  id: string;
  name: string | null;
  price: number | null;
  images: {
    src: string;
    alt: string;
  }[]
  categories: {
    id: string;
    name: string;
  }[]
}

interface ProductListsProps {
  filteredProducts?: Product[]
}

export const ProductLists: FC<ProductListsProps> = ({ filteredProducts }: ProductListsProps) => {
  const products = trpc.products.getActiveProducts.useQuery();

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <h2 className="sr-only">Products</h2>
        {products.isLoading && (
          // loading spinner using tailwind
          <LoadingSpinner />
        )}


        <motion.div layout className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {filteredProducts?.map((product) => (
            <div key={product.id} className="">
              <div className="aspect-w-4 aspect-h-3 overflow-hidden rounded-lg bg-gray-100">
                <img src={product.images[0]?.src} alt={product.images[0]?.alt} className="object-cover object-center" />
                <div className="flex flex-col justify-center gap-4 items-end p-4 opacity-0 group-hover:opacity-100">
                  <Link href={`/products/${encodeURIComponent(product.id)}`} className="w-full rounded-md bg-blue-700 bg-opacity-75 py-2 px-4 text-center text-sm font-medium text-gray-900 backdrop-blur backdrop-filter">
                    View Product
                  </Link>
                  {/* <button className="w-full rounded-md bg-white bg-opacity-75 py-2 px-4 text-center text-sm font-medium text-gray-900 backdrop-blur backdrop-filter" onClick={() => addToCart({
                    name: product.name,
                    id: product.id,
                    price: product.price,
                    quantity: 1,
                    imageSrc: product.imageSrc,
                    imageAlt: product.imageAlt,
                    href: ""
                  })}>
                    Add to cart
                  </button> */}
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
        </motion.div>
      </div>
      {filteredProducts?.length === 0 && (
        <>
          <div className="h-screen">
            <div className="flex items-center justify-center py-12">
              <div className="bg-white border rounded-md flex items-center justify-center mx-4">
                <div className="flex flex-col items-center py-16">
                  <img className="px-4 hidden md:block" src="https://i.ibb.co/9Vs73RF/undraw-page-not-found-su7k-1-3.png" alt="" />
                  <img className="md:hidden" src="https://i.ibb.co/RgYQvV7/undraw-page-not-found-su7k-1.png" alt="" />
                  <h1 className="px-4 pt-8 pb-4 text-center text-5xl font-bold leading-10 text-gray-800">OOPS! </h1>
                  <p className="px-4 text-base leading-none text-center text-gray-600">Products not available.</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>

  )
}