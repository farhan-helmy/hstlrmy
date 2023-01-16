/* eslint-disable @next/next/no-img-element */
import { Fragment, useEffect, useRef, useState } from "react";
import Link from 'next/link'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import type { Item } from '../store/cart';
import useCartStore from '../store/cart'
import { useClickAway } from 'react-use';

type SideShoppingCartProps = {
  cartOpen: boolean;
  setOpen: (value: boolean) => void;
  setCartOpen: (value: boolean) => void;
}

export const SideShoppingCart = ({ cartOpen, setOpen, setCartOpen }: SideShoppingCartProps) => {
  const ref = useRef(null)
  const [cartItems, setCartItems] = useState<Item[]>([])
  const [totalPrice, setTotalPrice] = useState(0)
  const cartStore = useCartStore()
  const itemState = useCartStore(state => state.items);
  const totalPriceState = useCartStore(state => state.totalPrice);

  useClickAway(ref, () => {
    setCartOpen(false)
  })

  useEffect(() => {
    setCartItems(itemState)
    setTotalPrice(totalPriceState)
  }, [itemState, totalPriceState])

  const removeItemFromCart = (id: string) => {
    cartStore.removeOneItemFromCart(id)
  }

  const calculateTotalPrice = () => {
    let total = 0
    cartItems.forEach(item => {
      total += parseFloat(item.price) * item.quantity
    })
    // round off total
    total = Math.round(total * 100) / 100
    return total
  }

  return (
    <Transition.Root show={cartOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl" ref={ref}>
                    <div className="flex-1 overflow-y-auto py-6 px-4 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-lg font-medium text-gray-900">Shopping cart</Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="-m-2 p-2 text-gray-400 hover:text-gray-500"
                            onClick={() => setCartOpen(false)}
                          >
                            <span className="sr-only">Close panel</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>

                      <div className="mt-8">
                        <div className="flow-root">
                          <ul role="list" className="-my-6 divide-y divide-gray-200">
                            {cartItems.map((product) => (
                              <li key={product.id} className="flex py-6">
                                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                  <img
                                    src={product.imageSrc}
                                    alt={product.imageAlt}
                                    className="h-full w-full object-cover object-center"
                                  />
                                </div>

                                <div className="ml-4 flex flex-1 flex-col">
                                  <div>
                                    <div className="flex justify-between text-base font-medium text-gray-900">
                                      <h3>
                                        <a href={product.href}>{product.name}</a>
                                      </h3>
                                      <p className="ml-4">RM {product.price}</p>
                                    </div>
                                    <p className="mt-1 text-sm text-gray-500"></p>
                                  </div>
                                  <div className="flex flex-1 items-end justify-between text-sm">
                                    <p className="text-gray-500">x{product.quantity}</p>

                                    <div className="flex">
                                      {/* <button
                                        type="button"
                                        className="font-medium text-indigo-600 hover:text-indigo-500"
                                        onClick={() => removeItemFromCart(product.id)}
                                      >
                                        Remove
                                      </button> */}
                                    </div>
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                          {cartItems.length !== 0 ? <div className="mt-6" onClick={() => cartStore.removeAllItemsFromCart()}>
                            <a
                              href="#"
                              className="flex items-center justify-center rounded-md px-6 py-3 text-base font-medium text-red-400 shadow-sm hover:bg-red-200"
                            >
                              Remove All Items
                            </a>
                          </div> : <div className="text-2xl text-center">Empty shopping cart, add some items</div>}

                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <p>Subtotal</p>
                        <p>RM {calculateTotalPrice()}</p>
                      </div>
                      <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
                      <div className="mt-6">
                        <Link
                          href="/checkout"
                          className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
                          
                        >
                          Checkout
                        </Link>
                      </div>
                      <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                        <p>
                          or
                          <button
                            type="button"
                            className="font-medium text-indigo-600 hover:text-indigo-500"
                            onClick={() => setCartOpen(false)}
                          >
                            Continue Shopping
                            <span aria-hidden="true"> &rarr;</span>
                          </button>
                        </p>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}