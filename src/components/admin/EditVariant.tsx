import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { useS3Upload } from "next-s3-upload";
import { z } from "zod";
import { trpc } from "../../utils/trpc";

type EditVariantProps = {
  id: string;
  editVariantOpen: boolean;
  setEditVariantOpen: (open: boolean) => void;
};

export interface Variant {
  variant: {
    id: string
    name: string
    imageSrc: string
    add: boolean
    productId: string
  }[]
}

export type Variants = Array<Variant>

const schema = z.object({
  variant: z.array(z.object({
    id: z.string(),
    name: z.string().min(1, { message: "Variant name is required" }).max(100),
    imageSrc: z.string().min(1, { message: "Variant image is required" }).max(10000),
    add: z.boolean(),
    productId: z.string()
  }))
});

export default function EditVariant({ editVariantOpen, setEditVariantOpen, id }: EditVariantProps) {

  const { register, setValue, reset, getValues, control, handleSubmit, formState: { errors } }
    = useForm<Variant>({
      resolver: zodResolver(schema),
      mode: 'onBlur',
    });

  const product = trpc.products.getProduct.useQuery({ id });

  const addVariant = trpc.products.addVariant.useMutation({
    onSuccess: () => {
      product.refetch()
      
    },
    onError: (err) => {
      console.log(err)
    }
  });

  const removeVariant = trpc.products.removeVariant.useMutation({
    onSuccess: () => {
      console.log('success')
    },
    onError: (err) => {
      console.log(err)
    }
  });

  const { uploadToS3 } = useS3Upload();

  const { fields, append, remove } = useFieldArray({
    name: "variant",
    control
  })

  const onVariantImageChange = async (e: any, index: number) => {
    if (!e.currentTarget.files) return;
    const file = e.target.files[0];
    const { url } = await uploadToS3(file);

    setValue(`variant.${index}.imageSrc`, url);
  }

  const onRemoveVariant = (index: number) => {
    const variantId = getValues(`variant.${index}.id`)
  
    if(variantId === "") {
      remove(index)
      return
    }
    removeVariant.mutate({id: variantId})
    remove(index)
    product.refetch()
  }

  const onSubmit = async (data: Variant) => {
   addVariant.mutate(data)
  }

  useEffect(() => {
    if (editVariantOpen) {
      reset();
      product.data?.variants.forEach((variant: any) => {

        append({ id: variant.id, name: variant.name, imageSrc: variant.imageSrc, add: false, productId: variant.productId })
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editVariantOpen])

  

  return (
    <Transition.Root show={editVariantOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setEditVariantOpen}>
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
                  <div className="pt-8">
                    <div>
                      <h3 className="text-lg font-medium leading-6 text-gray-900">Variant</h3>
                      <p className="mt-1 text-sm text-gray-500">Add product variant</p>
                    </div>
                    <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                      <div className="sm:col-span-4">
                        {fields.map((field, index) => (
                          <div key={field.id}>
                            <div>
                              <div className="mt-1 mb-2 flex rounded-md shadow-sm">
                                <div className="relative flex flex-grow items-stretch focus-within:z-10">
                                  <input
                                    key={field.id}
                                    {...register(`variant.${index}.name` as const, {
                                      required: true
                                    })}
                                    type="text"
                                    className="block w-full rounded-none rounded-l-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    placeholder=""
                                  />
                                </div>
                                <button
                                  onClick={() => onRemoveVariant(index)}
                                  type="button"
                                  className="relative -ml-px inline-flex items-center space-x-2 rounded-r-md border border-gray-300 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                >
                                  -
                                </button>
                              </div>
                              <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 py-4 mb-2">

                                {getValues(`variant.${index}.imageSrc`) === "" ? (<div className="flex text-sm text-gray-600">
                                  <label
                                    htmlFor={`variant-image-${index}-upload`}
                                    className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
                                  >
                                    <span>+</span>
                                    <input {...register(`variant.${index}.imageSrc` as const, {
                                      required: true
                                    })} name={`variant-image-${index}-upload`} id={`variant-image-${index}-upload`} type="file" className="sr-only" onChange={(e) => onVariantImageChange(e, index)} />
                                  </label>
                                </div>) : (
                                  <div className="flex flex-col justify-center items-center">
                                    <label
                                      htmlFor="variant-image-update"
                                      className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
                                    >
                                      <img src={getValues(`variant.${index}.imageSrc`)} alt="" className="h-36 w-36" />
                                      <input type="file" name="variant-image-update" id="variant-image-update" className="sr-only" onChange={(e) => onVariantImageChange(e, index)} />
                                    </label>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                        <button
                          onClick={() =>
                            append({
                              id: "",
                              name: "",
                              imageSrc: "",
                              add: true,
                              productId: id
                            })
                          }
                          type="button"
                          className="inline-flex items-center rounded border border-transparent bg-indigo-600 px-2.5 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                          + Add
                        </button>
                      </div>
                    </div>
                  </div>
                  <button type="submit" className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">Save</button>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}