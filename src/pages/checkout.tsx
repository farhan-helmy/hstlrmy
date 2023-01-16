/* eslint-disable @next/next/no-img-element */
/*
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }
  ```
*/
import { Fragment, useEffect, useRef, useState } from 'react'
import { RadioGroup, Transition } from '@headlessui/react'
import { CheckCircleIcon, ExclamationCircleIcon, TrashIcon } from '@heroicons/react/20/solid'
import type { NextPage } from 'next'
import { checkPhoneNumber, securepaySign } from '../helper/utils'
import Alert from '../components/Alerts'
import type { NotificationProps } from '../components/Notification'
import type { Item } from '../store/cart';
import { trpc } from '../utils/trpc'
import { env } from '../env/client.mjs'
import useCartStore from '../store/cart'
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { SubmitHandler } from 'react-hook-form';
import { useFieldArray, useForm } from 'react-hook-form';
import { sendOrderWhatsapp } from '../server/common/whatsappapi'

const deliveryMethods = [
  { id: 1, title: 'Standard', turnaround: '3–4 business days', price: 'RM 5.50' },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

interface CheckoutData {
  email: string
  name: string
  phone_no: string
  product_description: string
  transaction_amount: number
  token: string
  checksum: string
  order_number: string
}

export const schema = z.object({
  leadName: z.string().min(1).max(50),
  phoneNumber: z.string().min(1,).max(15),
  address: z.string().min(1, { message: "Address is required" }).max(1000),
  address2: z.string().min(1, { message: "Address2 is required" }).max(1000),
  city: z.string().min(1, { message: "City is required" }).max(50),
  state: z.string().min(1, { message: "State is required" }).max(100),
  country: z.string().min(1, { message: "Country is required" }).max(100),
  postalCode: z.string().min(1, { message: "Postal code is required" }).max(100),
  variants: z.array(z.object({
    id: z.string(),
    quantity: z.number(),
  }))
})


const Checkout: NextPage = () => {
  const [openShippingInformation, setOpenShippingInformation] = useState(false)
  const [openNameInformation, setOpenNameInformation] = useState(false)
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState(deliveryMethods[0])
  const [phoneNumber, setPhoneNumber] = useState('')
  const [leadName, setLeadName] = useState('')
  const [notification, setNotification] = useState<NotificationProps>({ title: '', message: '', success: false, show: false })
  const [checkoutData, setCheckoutData] = useState<CheckoutData>({
    email: '',
    name: '',
    phone_no: '',
    product_description: '',
    transaction_amount: 0,
    token: '',
    checksum: '',
    order_number: ''
  })
  const [confirmOrder, setConfirmOrder] = useState(false)
  const [cartItems, setCartItems] = useState<Item[]>([])
  const [totalPrice, setTotalPrice] = useState(0)
  const [finalStep, setFinalStep] = useState(false)
  const itemState = useCartStore(state => state.items);
  const totalPriceState = useCartStore(state => state.totalPrice);
  const sendMail = trpc.leads.sendEmail.useMutation()
  const sendWhatsapp = trpc.leads.sendWhatsapp.useMutation()
  const addOrder = trpc.orders.addOrder.useMutation()
  const sendWhatsappOrder = trpc.orders.sendWhatsappOrder.useMutation()

  useEffect(() => {
    setCartItems(itemState)
    setTotalPrice(totalPriceState)
  }, [itemState, totalPriceState])


  const calculateTotalPrice = () => {
    let total = 0
    cartItems.forEach(item => {
      total += parseFloat(item.price) * item.quantity
    })
    // round off total
    total = Math.round(total * 100) / 100
    return total
  }

  const continueNameInformation = (e: any) => {
    e.preventDefault()
    if (checkPhoneNumber(phoneNumber)) {
      setOpenNameInformation(true)
    } else {
      setNotification({
        title: 'Please enter a valid phone number',
        message: 'Please enter a valid phone number',
        success: false,
        show: true,
      })

      setTimeout(() => {
        setNotification({
          title: '',
          message: '',
          success: false,
          show: false,
        })
      }, 2000)
    }
  }

  const submitLeads = async (e: any) => {
    e.preventDefault()
    // submit data using whatsapp api
    sendMail.mutateAsync({
      name: leadName,
      phone_number: phoneNumber,
    }).then(res => {
      console.log(res)
      if (res.ok) {
        setOpenShippingInformation(true)
        console.log(openShippingInformation)
      }
    })

    sendWhatsapp.mutateAsync({
      name: leadName,
      phone_number: phoneNumber,
    }).then(res => {
      console.log(res)
    }
    )
  }
  const securePayformRef = useRef<HTMLFormElement>(null);

  const submit = () => {
    securePayformRef.current?.requestSubmit()
  }

  const checkoutItem = () => {
    const ordernum = crypto.randomUUID()
    const amount = parseFloat(calculateTotalPrice() as unknown as string)
    const sign = securepaySign({
      email: '',
      name: leadName,
      phone_no: phoneNumber,
      product_description: 'This is test product',
      transaction_amount: amount,
      order_number: ordernum
    })

    setCheckoutData({
      email: '',
      name: leadName,
      phone_no: phoneNumber,
      product_description: 'This is test product',
      transaction_amount: amount,
      token: env.NEXT_PUBLIC_SECUREPAY_AUTH_TOKEN as never,
      checksum: sign,
      order_number: ordernum
    })

    setConfirmOrder(true)

  };

  type CheckoutFormInput = {
    leadName: string
    phoneNumber: string
    address: string
    address2: string
    city: string
    state: string
    country: string
    postalCode: string
    variants: {
      id: string
      quantity: number
    }[]
  }

  const { register, handleSubmit, formState: { errors }, control } = useForm<CheckoutFormInput>({resolver: zodResolver(schema), mode: 'onBlur' });
  const { append } = useFieldArray({
    name: "variants",
    control
  })

  useEffect(() => {
    cartItems.forEach((item: any) => {
      append({ id: item.id, quantity: item.quantity })
    })
  }, [append, cartItems])


  const onSubmit: SubmitHandler<CheckoutFormInput> = data => {
    const whatsappData: any[] = []
    console.log(data)
    cartItems.forEach((item: any) => {
      console.log(item)
      whatsappData.push(item.name)
    })
    addOrder.mutateAsync(data)
    .then(async res => {
      if (res.ok) {
        setFinalStep(true)
        sendWhatsappOrder.mutate({name: leadName, item: whatsappData.join(', ')})
      }
    })
  };

  return (
    <div className="bg-white h-full">

      <div className="mx-auto max-w-2xl px-4 pt-16 pb-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <h2 className="sr-only">Checkout</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
          <div>
            <div>
              <h2 className="text-lg font-medium text-gray-900">Contact information</h2>

              <div className="mt-4">
                <label htmlFor="phone-number" className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 flex items-center">
                    <label htmlFor="country" className="sr-only">
                      Country
                    </label>
                    <select
                      autoComplete="countryMobile"
                      className="h-full rounded-md border-transparent bg-transparent py-0 pl-3 pr-7 text-gray-500 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                      <option>MY</option>
                    </select>
                  </div>
                  <input
                    {...register("phoneNumber", { required: true })}
                    type="text"
                    className="block w-full rounded-md border-gray-300 pl-16 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="+60"
                    onChange={e => setPhoneNumber(e.target.value)}
                    disabled={openShippingInformation}
                  />
                </div>
                <Alert title={notification.title} success={notification.success} show={notification.show} />
                {openNameInformation ? (
                  <>
                    <label htmlFor="lead-name" className="mt-2 block text-sm font-medium text-gray-700">
                      Name
                    </label><div className="relative mt-1 rounded-md shadow-sm">
                      <input
                        {...register("leadName", { required: true })}
                        disabled={openShippingInformation}
                        type="text"

                        className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        onChange={e => setLeadName(e.target.value)} />
                    </div>
                    <button
                      onClick={(e) => submitLeads(e)}
                      className={openShippingInformation ? `hidden` : `mt-6 w-full rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500`}
                    >
                      Submit
                    </button>
                  </>) : <button
                    onClick={(e) => continueNameInformation(e)}
                    className="mt-6 w-full rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
                  >
                  Continue
                </button>}

              </div>
            </div>
            <div className="mt-10 border-t border-gray-200 pt-10">
              <h2 className="text-lg font-medium text-gray-900">Shipping information</h2>
            </div>
            <Transition.Root show={openShippingInformation} as={Fragment}>
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-y-1/2 opacity-0 sm:translate-y-0 sm:translate-x-1/2"
                enterTo="translate-y-0 opacity-100 sm:translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-y-0 opacity-100 sm:translate-x-0"
                leaveTo="translate-y-1/2 opacity-0 sm:translate-y-0 sm:translate-x-1/2"
              >

                <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                  <div className="sm:col-span-2">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                      Address
                    </label>
                    <div className="mt-1">
                      <input
                        {...register("address", { required: true })}
                        type="text"

                        autoComplete="street-address"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                      {errors.address?.message && <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                      </div>}
                    </div>
                    <p className="mt-2 text-sm text-red-600">{errors.address?.message}</p>
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="apartment" className="block text-sm font-medium text-gray-700">
                      Apartment, suite, jalan, etc.
                    </label>
                    <div className="mt-1">
                      <input
                        {...register("address2", { required: true })}
                        type="text"

                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                      {errors.address2?.message && <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                      </div>}
                    </div>
                    <p className="mt-2 text-sm text-red-600">{errors.address2?.message}</p>
                  </div>

                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                      City
                    </label>
                    <div className="mt-1">
                      <input
                        {...register("city", { required: true })}
                        type="text"

                        autoComplete="address-level2"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                      {errors.city?.message && <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                      </div>}
                    </div>
                    <p className="mt-2 text-sm text-red-600">{errors.city?.message}</p>
                  </div>

                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                      Country
                    </label>
                    <div className="mt-1">
                      <select
                        {...register("country", { required: true })}

                        autoComplete="country-name"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      >
                        <option>Malaysia</option>
                      </select>
                      {errors.country?.message && <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                      </div>}
                    </div>
                    <p className="mt-2 text-sm text-red-600">{errors.country?.message}</p>
                  </div>

                  <div>
                    <label htmlFor="region" className="block text-sm font-medium text-gray-700">
                      State / Province
                    </label>
                    <div className="mt-1">
                      <input
                        {...register("state", { required: true })}
                        type="text"

                        autoComplete="address-level1"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                      {errors.state?.message && <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                      </div>}
                    </div>
                    <p className="mt-2 text-sm text-red-600">{errors.state?.message}</p>
                  </div>

                  <div>
                    <label htmlFor="postal-code" className="block text-sm font-medium text-gray-700">
                      Postal code
                    </label>
                    <div className="mt-1">
                      <input
                        {...register("postalCode", { required: true })}
                        type="text"

                        autoComplete="postal-code"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                      {errors.postalCode?.message && <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                      </div>}
                    </div>
                    <p className="mt-2 text-sm text-red-600">{errors.postalCode?.message}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <button
                      type="submit"
                      className={`mt-6 w-full rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500`}
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </ Transition.Child>
            </Transition.Root>

            <div className="mt-10 border-t border-gray-200 pt-10">
              <RadioGroup value={selectedDeliveryMethod} onChange={setSelectedDeliveryMethod}>
                <RadioGroup.Label className="text-lg font-medium text-gray-900">Delivery method</RadioGroup.Label>

                <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                  {deliveryMethods.map((deliveryMethod) => (
                    <RadioGroup.Option
                      key={deliveryMethod.id}
                      value={deliveryMethod}
                      className={({ checked, active }) =>
                        classNames(
                          checked ? 'border-transparent' : 'border-gray-300',
                          active ? 'ring-2 ring-indigo-500' : '',
                          'relative flex cursor-pointer rounded-lg border bg-white p-4 shadow-sm focus:outline-none'
                        )
                      }
                    >
                      {({ checked, active }) => (
                        <>
                          <span className="flex flex-1">
                            <span className="flex flex-col">
                              <RadioGroup.Label as="span" className="block text-sm font-medium text-gray-900">
                                {deliveryMethod.title}
                              </RadioGroup.Label>
                              <RadioGroup.Description
                                as="span"
                                className="mt-1 flex items-center text-sm text-gray-500"
                              >
                                {deliveryMethod.turnaround}
                              </RadioGroup.Description>
                              <RadioGroup.Description as="span" className="mt-6 text-sm font-medium text-gray-900">
                                {deliveryMethod.price}
                              </RadioGroup.Description>
                            </span>
                          </span>
                          {checked ? <CheckCircleIcon className="h-5 w-5 text-indigo-600" aria-hidden="true" /> : null}
                          <span
                            className={classNames(
                              active ? 'border' : 'border-2',
                              checked ? 'border-indigo-500' : 'border-transparent',
                              'pointer-events-none absolute -inset-px rounded-lg'
                            )}
                            aria-hidden="true"
                          />
                        </>
                      )}
                    </RadioGroup.Option>
                  ))}
                </div>
              </RadioGroup>
            </div>


          </div>

          {/* Order summary */}
          <div className="mt-10 lg:mt-0">
            <h2 className="text-lg font-medium text-gray-900">Order summary</h2>

            <div className="mt-4 rounded-lg border border-gray-200 bg-white shadow-sm">
              <h3 className="sr-only">Items in your cart</h3>
              <ul role="list" className="divide-y divide-gray-200">
                {cartItems.length !== 0 ? cartItems.map((product) => (
                  <li key={product.id} className="flex py-6 px-4 sm:px-6">
                    <div className="flex-shrink-0">
                      <img src={product.imageSrc} alt={product.imageAlt} className="w-20 rounded-md" />
                    </div>

                    <div className="ml-6 flex flex-1 flex-col">
                      <div className="flex">
                        <div className="min-w-0 flex-1">
                          <h4 className="text-sm">
                            <a href={product.href} className="font-medium text-gray-700 hover:text-gray-800">
                              {product.name}
                            </a>
                          </h4>
                          {/* <p className="mt-1 text-sm text-gray-500">{product.color}</p>
                          <p className="mt-1 text-sm text-gray-500">{product.size}</p> */}
                        </div>

                        <div className="ml-4 flow-root flex-shrink-0">
                          <button
                            type="button"
                            className="-m-2.5 flex items-center justify-center bg-white p-2.5 text-gray-400 hover:text-gray-500"
                          >
                            <span className="sr-only">Remove</span>
                            <TrashIcon className="h-5 w-5" aria-hidden="true" />
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-1 items-end justify-between pt-2">
                        <p className="mt-1 text-sm font-medium text-gray-900">RM {product.price}</p>


                      </div>
                      <p className="text-gray-500 text-sm">x{product.quantity}</p>
                    </div>
                  </li>
                )) : <>
                  <div>
                    <div className="text-3xl ml-4">Cart is empty</div>
                  </div>
                </>}
              </ul>
              {
                cartItems.length !== 0 ? <><dl className="space-y-6 border-t border-gray-200 py-6 px-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <dt className="text-sm">Subtotal</dt>
                    <dd className="text-sm font-medium text-gray-900">RM {calculateTotalPrice()}</dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-sm">Shipping</dt>
                    <dd className="text-sm font-medium text-gray-900">RM 5.50</dd>
                  </div>
                  <div className="flex items-center justify-between border-t border-gray-200 pt-6">
                    <dt className="text-base font-medium">Total</dt>
                    <dd className="text-base font-medium text-gray-900">RM {calculateTotalPrice() + parseFloat('5.50')}</dd>
                  </div>
                </dl><div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                    {
                      confirmOrder ? <button
                        onClick={() => submit()}
                        type="submit"
                        className="w-full rounded-md border border-transparent bg-indigo-600 py-3 px-4 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
                      >
                        Pay
                      </button> :
                        <button
                          onClick={() => checkoutItem()}
                          type="submit"
                          disabled={finalStep ? false : true}
                          className={`w-full rounded-md border border-transparent ${finalStep ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-600 hover:bg-gray-700-700'} py-3 px-4 text-base font-medium text-white shadow-sm  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50`}
                        >
                          {finalStep ? 'Confirm Order' : 'Please fill in all the details'}
                        </button>
                    }
                  </div></> : <></>
              }
            </div>
          </div>
        </form >
        <form ref={securePayformRef} method="POST" action='https://sandbox.securepay.my/api/v1/payments'>
          <input type="hidden" name="buyer_name" value={checkoutData.name} />
          <input type="hidden" name="buyer_email" value={checkoutData.email} />
          <input type="hidden" name="token" value={checkoutData.token} />
          <input type="hidden" name="transaction_amount" value={checkoutData.transaction_amount} />
          <input type="hidden" name="checksum" value={checkoutData.checksum} />
          <input type="hidden" name="callback_url" value="" />
          <input type="hidden" name="redirect_url" value="" />
          <input type="hidden" name="order_number" value={checkoutData.order_number} />
          <input type="hidden" name="buyer_phone" value={checkoutData.phone_no} />
          <input
            type="hidden"
            name="product_description"
            value={checkoutData.product_description}
          />
          <input
            type="hidden"
            name="redirect_post"
            value=""
          />
        </form>
      </div >
    </div >
  )
}

export default Checkout;