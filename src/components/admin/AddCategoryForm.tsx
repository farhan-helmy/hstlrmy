import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { trpc } from '../../utils/trpc'

interface AddCategoryFormProps {
  openAddCategoryForm: boolean
  setOpenAddCategoryForm: (open: boolean) => void
}

const AddCategoryForm: React.FC<AddCategoryFormProps> = ({ openAddCategoryForm, setOpenAddCategoryForm }) => {

  const [categoryName, setCategoryName] = useState('')

  const addCategory = trpc.products.storeCategory.useMutation();

  return (
    <Transition.Root show={openAddCategoryForm} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpenAddCategoryForm}>
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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white shadow-xl transition-all text-left p-4 w-1/2 ">
                <label
                  htmlFor="first-name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Insert category name
                </label>
                <input
                  onChange={(e) => setCategoryName(e.target.value)}
                  type="text"
                  autoComplete="given-name"
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />


                <div className="pt-2">
                  <button
                    onClick={() => addCategory.mutateAsync({ name: categoryName }).then(() => setOpenAddCategoryForm(false))}
                    className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Save
                  </button>
                  {addCategory.isError && (
                    <p className="mt-2 text-sm text-red-500">Error: field must not be empty</p>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

export default AddCategoryForm
