/* eslint-disable @next/next/no-img-element */
/*
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/typography'),
      require('@tailwindcss/aspect-ratio'),
    ],
  }
  ```
*/
import { useEffect, useState } from 'react'
import { RadioGroup, Tab } from '@headlessui/react'
import { HeartIcon } from '@heroicons/react/20/solid'
import NavBar from '../../components/NavBar'
import type { Item } from '../../store/cart';
import useCartStore from '../../store/cart'
import { trpc } from '../../utils/trpc'
import useNotificationStore from '../../store/notification'
import router, { useRouter } from 'next/router'
import Notification from "../../components/Notification";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export type ImageCollection = {
  id: string
  src: string,
  alt?: string,
  name: string
}

export type SelectedImage = {
  src?: string
  alt?: string
}

export type CheckoutVariant = {
  id: string
  name: string
  imageSrc: string
}
export default function ProductPage() {
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [selectedImage, setSelectedImage] = useState<SelectedImage>()
  const [imageCollections, setImageCollections] = useState<ImageCollection[]>([])
  const [quantity, setQuantity] = useState(1)
  const [checkoutVariant, setCheckoutVariant] = useState<CheckoutVariant>()

  const cartStore = useCartStore();
  // nextjs get id from url
  const { id } = useRouter().query;

  const productz = trpc.products.getProduct.useQuery({ id: id as string });
  const images = trpc.products.getImages.useQuery({ id: id as string });

  const notificationStore = useNotificationStore();

  const buyNow = (product: Item) => {

    console.log(product.variant)
    if (product.variant) {
      cartStore.addToCart(product)
      router.push('/checkout')
    }else{
      notificationStore.showNotification({
        title: "Error!",
        message: `Please choose product type`,
        success: false,
        show: true
      });
    }
  }

  const addToCart = (e: any, product: Item) => {
    if (product.variant) {
      e.preventDefault()
      cartStore.addToCart(product)
      notificationStore.showNotification({
        title: "Success!",
        message: `${product.name} added to cart`,
        success: true,
        show: true
      });
    }else{
      e.preventDefault()
      notificationStore.showNotification({
        title: "Error!",
        message: `Please choose product type`,
        success: false,
        show: true
      });
    }
  }


  const setForCheckout = (variants: ImageCollection) => {
    setSelectedImage({ src: variants.src as string, alt: variants.name })
    setCheckoutVariant({ id: variants.id, name: variants.name, imageSrc: variants.src as string })
  }

  useEffect(() => {
    if (images.data) {
      const imageCollection: any[] = [];
      images.data.forEach((image) => {
        image.images.forEach((img) => {
          imageCollection.push({
            id: image.id,
            src: img.src,
            alt: img.alt
          })
          setSelectedImage({
            src: img.src,
            alt: img.alt
          })
        })
        image.variants.forEach((variant) => {
          imageCollection.push({
            id: variant.id,
            src: variant.imageSrc
          })
        })
      })
      setImageCollections(imageCollection)
    }
  }, [images.data])


  return (
    <>
      <NavBar />
      <div className="bg-white">
        <div className="mx-auto max-w-2xl py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
            {/* Image gallery */}
            <Tab.Group as="div" className="flex flex-col-reverse">
              {/* Image selector */}
              <div className="mx-auto mt-6 hidden w-full max-w-2xl sm:block lg:max-w-none">
                <Tab.List className="grid grid-cols-4 gap-6">
                  {imageCollections.map((image) => (
                    <Tab
                      key={image.id}
                      className="relative flex h-24 cursor-pointer items-center justify-center rounded-md bg-white text-sm font-medium uppercase text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring focus:ring-opacity-50 focus:ring-offset-4"
                    >
                      {({ selected }) => (
                        <>
                          <span className="sr-only"> {image.id} </span>
                          <span className="absolute inset-0 overflow-hidden rounded-md" onClick={() => setSelectedImage({ src: image.src, alt: image.alt })}>
                            <img src={image.src} alt={image.alt} className="h-full w-full object-cover object-center" />
                          </span>
                          <span
                            className={classNames(
                              selected ? 'ring-indigo-500' : 'ring-transparent',
                              'pointer-events-none absolute inset-0 rounded-md ring-2 ring-offset-2'
                            )}
                            aria-hidden="true"
                          />
                        </>
                      )}
                    </Tab>
                  ))}
                </Tab.List>
              </div>

              <Tab.Panels className="aspect-w-1 aspect-h-1 w-full">

                <img
                  src={selectedImage?.src}
                  alt={selectedImage?.alt}
                  className="h-full w-full object-cover object-center sm:rounded-lg"
                />

              </Tab.Panels>
            </Tab.Group>

            {/* Product info */}
            <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">{productz.data?.name}</h1>

              <div className="mt-3">
                <h2 className="sr-only">Product information</h2>
                <p className="text-3xl tracking-tight text-gray-900">RM {productz.data?.price}</p>
              </div>

              {/* Reviews */}

              <div className="mt-6">

                <h3 className="sr-only">Description</h3>

                <div className="prose" dangerouslySetInnerHTML={{ __html: productz.data?.description as string }} />
                 
              </div>

              <form>
                {/* Color picker */}
                {/* <div>
                  <h2 className="text-sm font-medium text-gray-900">Color</h2>

                  <RadioGroup value={selectedColor} onChange={setSelectedColor} className="mt-2">
                    <RadioGroup.Label className="sr-only"> Choose a color </RadioGroup.Label>
                    <div className="flex items-center space-x-3">
                      {product.colors.map((color) => (
                        <RadioGroup.Option
                          key={color.name}
                          value={color}
                          className={({ active, checked }) =>
                            classNames(
                              color.selectedColor,
                              active && checked ? 'ring ring-offset-1' : '',
                              !active && checked ? 'ring-2' : '',
                              '-m-0.5 relative p-0.5 rounded-full flex items-center justify-center cursor-pointer focus:outline-none'
                            )
                          }
                        >
                          <RadioGroup.Label as="span" className="sr-only">
                            {' '}
                            {color.name}{' '}
                          </RadioGroup.Label>
                          <span
                            aria-hidden="true"
                            className={classNames(
                              color.bgColor,
                              'h-8 w-8 border border-black border-opacity-10 rounded-full'
                            )}
                          />
                        </RadioGroup.Option>
                      ))}
                    </div>
                  </RadioGroup>
                </div> */}

                {/* Size picker */}
                <div className="mt-8">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-medium text-gray-900">Colour</h2>

                  </div>

                  <RadioGroup value={selectedVariant} onChange={setSelectedVariant} className="mt-2">
                    <RadioGroup.Label className="sr-only"> Choose a size </RadioGroup.Label>
                    <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
                      {productz.data?.variants.map((variants) => (
                        <RadioGroup.Option
                          key={variants.name}
                          value={variants}
                          className={({ active, checked }) =>
                            classNames(
                              variants ? 'cursor-pointer focus:outline-none' : 'opacity-25 cursor-not-allowed',
                              active ? 'ring-2 ring-offset-2 ring-indigo-500' : '',
                              checked
                                ? 'bg-indigo-600 border-transparent text-white hover:bg-indigo-700'
                                : 'bg-white border-gray-200 text-gray-900 hover:bg-gray-50',
                              'border rounded-md py-3 px-3 flex items-center justify-center text-sm font-medium uppercase sm:flex-1'
                            )
                          }
                          disabled={!variants}
                          onClick={() => setForCheckout({ id: variants.id, src: variants.imageSrc as string, alt: variants.name, name: productz.data?.name + " " + "("+ variants.name + ")" })}

                        >
                          <RadioGroup.Label as="span">{variants.name}</RadioGroup.Label>
                        </RadioGroup.Option>
                      ))}
                    </div>
                  </RadioGroup>

                </div>
                {/* Quantity picker */}
                {selectedVariant && (
                  <div className="mt-4">
                    <label htmlFor="quantity" className="sr-only">
                      Quantity
                    </label>
                    <select
                      onChange={(e) => setQuantity(parseInt(e.target.value))}
                      id="quantity"
                      name="quantity"
                      className="rounded-md border border-gray-300 text-left text-base font-medium text-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                    >
                      <option value={1}>1</option>
                      <option value={2}>2</option>
                      <option value={3}>3</option>
                      <option value={4}>4</option>
                      <option value={5}>5</option>
                      <option value={6}>6</option>
                      <option value={7}>7</option>
                      <option value={8}>8</option>
                    </select>
                  </div>
                )}

                {/* <button className="mt-8 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 py-3 px-8 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2" onClick={() => addToCart({
                  name: productz.data?.name as string,
                  id: product.id,
                  price: product.price,
                  quantity: 1,
                  imageSrc: product.imageSrc,
                  imageAlt: product.imageAlt,
                  href: ""
                })}>
                  Add to cart
                </button> */}
                <div className="sm:flex-col1 mt-10 flex">
                  <button
                    onClick={(e) => addToCart(e, {
                      name:  checkoutVariant?.name as string,
                      id: checkoutVariant?.id,
                      price: productz.data?.price as unknown as string,
                      quantity: quantity,
                      imageSrc: checkoutVariant?.imageSrc as string,
                      imageAlt: checkoutVariant?.name as string,
                      href: "",
                      variant: checkoutVariant?.name
                    })}

                    className="flex max-w-xs flex-1 items-center justify-center rounded-md border border-transparent bg-indigo-600 py-3 px-8 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 sm:w-full"
                  >
                    Add to bag
                  </button>
                  <button
                    type="button"
                    className="ml-4 flex items-center justify-center rounded-md py-3 px-3 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                  >
                    <HeartIcon className="h-6 w-6 flex-shrink-0" aria-hidden="true" />
                    <span className="sr-only">Add to favorites</span>
                  </button>
                </div>


              </form>
              <div className="sm:flex-col1 mt-2 flex">
                <button
                  onClick={() => buyNow({
                    name: productz.data?.name as string,
                    id: productz.data?.id,
                    price: productz.data?.price as unknown as string,
                    quantity: quantity,
                    imageSrc: checkoutVariant?.imageSrc as string,
                    imageAlt: checkoutVariant?.name as string,
                    href: "",
                    variant: checkoutVariant?.name
                  })}
                  className="flex max-w-xs flex-1 items-center justify-center rounded-md border border-transparent bg-slate-600 py-3 px-8 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 sm:w-full"
                >
                  Buy Now
                </button>
              </div>
              {/* <section aria-labelledby="details-heading" className="mt-12">
                <h2 id="details-heading" className="sr-only">
                  Additional details
                </h2>

                <div className="divide-y divide-gray-200 border-t">
                  {product.details.map((detail) => (
                    <Disclosure as="div" key={detail.name}>
                      {({ open }) => (
                        <>
                          <h3>
                            <Disclosure.Button className="group relative flex w-full items-center justify-between py-6 text-left">
                              <span
                                className={classNames(open ? 'text-indigo-600' : 'text-gray-900', 'text-sm font-medium')}
                              >
                                {detail.name}
                              </span>
                              <span className="ml-6 flex items-center">
                                {open ? (
                                  <MinusIcon
                                    className="block h-6 w-6 text-indigo-400 group-hover:text-indigo-500"
                                    aria-hidden="true"
                                  />
                                ) : (
                                  <PlusIcon
                                    className="block h-6 w-6 text-gray-400 group-hover:text-gray-500"
                                    aria-hidden="true"
                                  />
                                )}
                              </span>
                            </Disclosure.Button>
                          </h3>
                          <Disclosure.Panel as="div" className="prose prose-sm pb-6">
                            <ul role="list">
                              {detail.items.map((item) => (
                                <li key={item}>{item}</li>
                              ))}
                            </ul>
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                  ))}
                </div>
              </section> */}
            </div>
          </div>
        </div>
      </div>
      <Notification show={notificationStore.show} title={notificationStore.title} message={notificationStore.message} success={notificationStore.success} />
    </>

  )
}
