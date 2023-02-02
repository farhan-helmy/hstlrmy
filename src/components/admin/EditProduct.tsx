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

import React, { Fragment, useEffect, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { ExclamationCircleIcon } from '@heroicons/react/20/solid'
import { useForm } from 'react-hook-form';
import { useS3Upload } from 'next-s3-upload';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { trpc } from '../../utils/trpc';
import EditVariant from './EditVariant';
import 'react-quill/dist/quill.snow.css';
import dynamic from 'next/dynamic';
import ComboBox from './ComboBox';
import type { Category } from './ComboBox';

const QuillNoSSRWrapper = dynamic(
  () => {
    return import('react-quill');
  },
  { ssr: false }
);

type EditProductProps = {
  id: string
  editProductOpen: boolean
  setEditProductOpen: (value: boolean) => void
}

const schema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.string(),
  weight: z.string().min(1, { message: "Weight is required" }).max(100),
  description: z.string().min(1, { message: "Description is required" }),
  imageSrc: z.string().min(1, { message: "Image is required" }).max(10000),
})

export type Variant = {
  name: string | null
  imageSrc?: string
}
type ProductFormInputs = {
  id: string | null
  name: string | null
  price: string | null
  weight: string | null
  description: string | null
  imageSrc?: string
}

export default function EditProduct({ editProductOpen, setEditProductOpen, id }: EditProductProps) {
  const [editVariantOpen, setEditVariantOpen] = useState(false)
  const [productId, setProductId] = useState("")
  const [htmlDescription, setHtmlDescription] = useState("")
  const [submitCategory, setSubmitCategory] = useState<Category>([])

  const updateProduct = trpc.products.updateProduct.useMutation({
    onSuccess: () => {
      setEditProductOpen(false);
    },
    onError: (err) => {
      console.log(err)
    }
  });

  const attachProduct = trpc.products.attachProductToCategory.useMutation()
  const product = trpc.products.getProduct.useQuery({ id });
  const detachCategories = trpc.products.removeAllCategories.useMutation()

  const { register, setValue, reset, getValues, handleSubmit, formState: { errors } } = useForm<ProductFormInputs>({ resolver: zodResolver(schema), mode: 'onBlur', defaultValues: { imageSrc: "" } });

  const { uploadToS3 } = useS3Upload();

  const onProductImageChange = async (e: any) => {
    if (!e.currentTarget.files) return;
    const file = e.target.files[0];
    const { url } = await uploadToS3(file);

    setValue("imageSrc", url);
  };

  const onSubmit = (data: any) => {
    // console.log(data)
    updateProduct.mutateAsync(data)
    if (submitCategory.length > 0) {
      submitCategory.forEach((category: any) => {
        console.log(category)
        attachProduct.mutateAsync({ productId: data.id, categoryId: category.id })
      })
    }else{
      detachCategories.mutateAsync({ productId: data.id })
    }

  };

  useEffect(() => {
    product.refetch();
  }, [editProductOpen])

  useEffect(() => {
    if (product.data) {
      reset();
      setProductId(product.data.id)
      setValue("id", product.data.id);
      setValue("name", product.data.name);
      setValue("price", String(product.data.price));
      setValue("weight", String(product.data.weight));
      setValue("description", product.data.description);
      setHtmlDescription(product.data?.description as string);
      product.data.images.forEach((image: any) => {
        setValue("imageSrc", image.src);
      })
    }
  }, [product.data, reset, setValue])

  useEffect(() => {
    setValue("description", htmlDescription);
  }, [htmlDescription, product.data?.description, setValue])

  return (
    <>
      <Transition.Root show={editProductOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setEditProductOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>
          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden w-full rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6">
                  <form className="space-y-8 divide-y divide-gray-200" onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-8 divide-y divide-gray-200">
                      <div>
                        <div>
                          <h3 className="text-lg font-medium leading-6 text-gray-900">Details</h3>
                          <p className="mt-1 text-sm text-gray-500">
                            Fill up product details.
                          </p>
                        </div>

                        <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                          <div className="sm:col-span-4">
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                              Name
                            </label>
                            <div className="relative mt-1 flex rounded-md shadow-sm">
                              <input
                                {...register("name", { required: true })}
                                type="text"
                                autoComplete="productName"
                                aria-invalid={errors.name ? "true" : "false"}
                                className="block w-full rounded-md border-gray-300 pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              />
                              {errors.name?.message && <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                              </div>}
                            </div>
                            <p className="mt-2 text-sm text-red-600">{errors.name?.message}</p>

                          </div>
                          <div className="sm:col-span-3">
                            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                              Price
                            </label>
                            <div className="relative mt-1 rounded-md shadow-sm">
                              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <span className="text-gray-500 sm:text-sm">RM</span>
                              </div>
                              <input
                                {...register("price", { required: true })}
                                type="number"
                                className="block w-full rounded-md border-gray-300 pl-9 pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                placeholder="0.00"
                                aria-describedby="price-currency"
                              />
                              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                <span className="text-gray-500 sm:text-sm" id="price-currency">
                                  MYR
                                </span>
                                {errors.price?.message && <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />}
                              </div>
                            </div>
                            <p className="mt-2 text-sm text-red-600">{errors.price?.message}</p>
                          </div>
                          <div className="sm:col-span-3">
                            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                              Weight
                            </label>
                            <div className="relative mt-1 rounded-md shadow-sm">
                              <input
                                {...register("weight", { required: true })}
                                type="number"
                                className="block w-full rounded-md border-gray-300 pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                placeholder=""
                                aria-describedby="price-currency"
                              />
                              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                <span className="text-gray-500 sm:text-sm" id="price-currency">
                                  KG
                                </span>
                                {errors.weight?.message && <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />}
                              </div>
                            </div>
                            <p className="mt-2 text-sm text-red-600">{errors.weight?.message}</p>
                          </div>
                          <div className="sm:col-span-6">
                            <label htmlFor="about" className="block text-sm font-medium text-gray-700">
                              Description
                            </label>
                            <div className="mt-1">
                              {/* <textarea
                                {...register("description", { required: true })}
                                rows={3}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                defaultValue={''}
                              /> */}
                              <QuillNoSSRWrapper theme="snow" value={htmlDescription} onChange={setHtmlDescription} />
                            </div>
                            <p className="mt-2 text-sm text-gray-500">Enter product description.</p>
                            <p className="mt-2 text-sm text-red-600">{errors.description?.message}</p>
                          </div>
                          <div className="sm:col-span-6">
                            <label htmlFor="cover-photo" className="block text-sm font-medium text-gray-700">
                              Product photo
                            </label>

                            {getValues("imageSrc") === "" ? (<div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
                              <div className="space-y-1 text-center">
                                <svg
                                  className="mx-auto h-12 w-12 text-gray-400"
                                  stroke="currentColor"
                                  fill="none"
                                  viewBox="0 0 48 48"
                                  aria-hidden="true"
                                >
                                  <path
                                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                                <div className="flex text-sm text-gray-600">
                                  <label
                                    htmlFor="product-image-upload"
                                    className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
                                  >
                                    <span>Upload a file</span>
                                    <input type="file" name="product-image-upload" id="product-image-upload" className="sr-only" onChange={(e) => onProductImageChange(e)} />

                                  </label>

                                  <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                              </div>
                            </div>) : (<div>
                              <div className="sm:col-span-6">
                                <label htmlFor="cover-photo" className="block text-sm font-medium text-gray-700">
                                  Preview
                                </label>
                                <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300">
                                  <div className="space-y-1 text-center">
                                    <label
                                      htmlFor="product-image-update"
                                      className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
                                    >
                                      <img src={getValues("imageSrc")}
                                        alt="preview"
                                        className="mx-auto text-gray-400"
                                      />
                                      <input type="file" name="product-image-update" id="product-image-update" className="sr-only" onChange={(e) => onProductImageChange(e)} />
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </div>)}
                          </div>
                          <div className="sm:col-span-6">
                            <ComboBox id={productId} setSubmitCategory={setSubmitCategory} />
                          </div>
                        </div>
                      </div>

                    </div>

                    <div className="pt-5">
                      <div className="flex justify-end">
                        <button
                          onClick={() => setEditProductOpen(false)}
                          type="button"
                          className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                          Update
                        </button>
                      </div>
                    </div>
                  </form>
                  <button
                    onClick={() => setEditVariantOpen(true)}
                    className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >Edit Variant</button>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
      <EditVariant editVariantOpen={editVariantOpen} setEditVariantOpen={setEditVariantOpen} id={productId} />
    </>

  )
}
