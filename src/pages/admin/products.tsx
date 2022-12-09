import type { ReactElement} from "react";
import { useState } from "react";
import { AdminLayout } from "../../components/layout/admin";
import { EnvelopeIcon, PhoneIcon, PencilSquareIcon, BoltIcon } from '@heroicons/react/20/solid'
import React from "react";
import type { NextPageWithLayout } from "../_app";
import { trpc } from "../../utils/trpc";
import { Switch } from '@headlessui/react'


function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

const Product: NextPageWithLayout = () => {

  const products = trpc.products.getAll.useQuery();
  const toggleStatus = trpc.products.toggleStatus.useMutation();

  const toggleProductStatus = async (id: string) => {
    await toggleStatus.mutateAsync({id});
    products.refetch();
  };


  return (
    <>
      <button
        type="button"
        className="mb-4 inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        <BoltIcon className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true" />
        Add Product
      </button>
      <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products.data?.map((product) => (
          <li
            key={product.id}
            className="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white text-center shadow"
          >
            <div className="flex flex-1 flex-col p-8">
              <img className="mx-auto h-32 w-32 flex-shrink-0 rounded-md" src={product.imageSrc} alt="" />
              <h3 className="mt-6 text-sm font-medium text-gray-900">{product.name}</h3>
              <dl className="mt-1 flex flex-grow flex-col justify-between">
                <dt className="sr-only">Title</dt>
                <dd className="text-sm text-gray-500">RM {product.price}</dd>
                <dt className="sr-only">Role</dt>
                <dd className="mt-3">
                  <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                    In Stock
                  </span>
                </dd>
                <dd className="mt-3">
                  <Switch
                    checked={product.isEnabled}
                    onChange={() => toggleProductStatus(product.id)}
                    className={classNames(
                      product.isEnabled ? 'bg-indigo-600' : 'bg-gray-200',
                      'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                    )}
                  >
                    <span className="sr-only">Use setting</span>
                    <span
                      className={classNames(
                        product.isEnabled ? 'translate-x-5' : 'translate-x-0',
                        'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                      )}
                    >
                      <span
                        className={classNames(
                          product.isEnabled ? 'opacity-0 ease-out duration-100' : 'opacity-100 ease-in duration-200',
                          'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity'
                        )}
                        aria-hidden="true"
                      >
                        <svg className="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 12 12">
                          <path
                            d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2"
                            stroke="currentColor"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                      <span
                        className={classNames(
                          product.isEnabled ? 'opacity-100 ease-in duration-200' : 'opacity-0 ease-out duration-100',
                          'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity'
                        )}
                        aria-hidden="true"
                      >
                        <svg className="h-3 w-3 text-indigo-600" fill="currentColor" viewBox="0 0 12 12">
                          <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
                        </svg>
                      </span>
                    </span>
                  </Switch>
                </dd>
              </dl>
            </div>
            <div>
              <div className="-mt-px flex divide-x divide-gray-200">
                <div className="flex w-0 flex-1">
                  <button
                    className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center rounded-bl-lg border border-transparent py-4 text-sm font-medium text-gray-700 hover:text-gray-500"
                  >
                    <PencilSquareIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    <span className="ml-3">Edit</span>
                  </button>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  )
}


Product.getLayout = function (page: ReactElement) {
  return (
    <AdminLayout>{page}</AdminLayout>
  )
};

export default Product;