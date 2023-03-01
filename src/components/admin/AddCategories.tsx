import { CheckBadgeIcon, CheckCircleIcon, TrashIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { trpc } from "../../utils/trpc";
import AddCategoryForm from "./AddCategoryForm";
import { useEffect, useRef, useState } from "react";
import { Switch } from "@headlessui/react";
import useNotificationStore from "../../store/notification";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ')
}

const AddCategory: React.FC = () => {
  const [openAddCategoryForm, setOpenAddCategoryForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTextIndex, setSelectedTextIndex] = useState<number>();
  const [categoryName, setCategoryName] = useState("");
  const categories = trpc.products.getCategories.useQuery();
  const toggleCategoryStatus = trpc.products.toggleCategoryStatus.useMutation();
  const delCategory = trpc.products.deleteCategory.useMutation()
  const updateCategory = trpc.products.updateCategory.useMutation();

  const notificationStore = useNotificationStore();

  const toggleCategory = (id: string) => {
    toggleCategoryStatus.mutateAsync({ id })
      .then(() => {
        categories.refetch();
      });
  }

  const deleteCategory = (id: string) => {

    delCategory.mutateAsync({ id })
      .then(() => {
        categories.refetch();
      });
  }

  const handleTextClick = (name: string, idx: number) => {
    if (idx === selectedTextIndex) {
      setSelectedTextIndex(undefined);
    } else {
      setSelectedTextIndex(idx);
      setCategoryName(name);
    }
  };

  const updateCategoryName = (categoryId: string) => {
    updateCategory.mutateAsync({ id: categoryId, name: categoryName })
      .then(() => {
        setSelectedTextIndex(undefined);
        categories.refetch();
      })
      .then(() => {
        notificationStore.showNotification({
          title: "Category Updated",
          message: "Category name has been updated",
          success: true,
          show: true,
        });
      })
  };

  useEffect(() => {
    categories.refetch();
  }, [categories, openAddCategoryForm])

  return (
    <div>

      <AddCategoryForm openAddCategoryForm={openAddCategoryForm} setOpenAddCategoryForm={setOpenAddCategoryForm} />
      <div className="border rounded-md border-gray-200 bg-white px-4 py-5 sm:px-6">
        <div className="-ml-4 -mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap">
          <div className="ml-4 mt-2">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Categories</h3>
          </div>
          <div className="ml-4 mt-2 flex-shrink-0">
            <button
              onClick={() => setOpenAddCategoryForm(true)}
              className="relative inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Add Category
            </button>
          </div>
        </div>
      </div>
      <div className="overflow-hidden bg-white shadow sm:rounded-md" >
        <ul role="list" className="divide-y divide-gray-200">
          {categories.data?.map((category, idx) => (
            <li key={category.id}>
              <div className="flex items-center px-4 py-4 sm:px-6">
                {selectedTextIndex === idx ? (
                  <div className="flex min-w-0 flex-1 items-center">
                    <div className="flex flex-row gap-2">
                      <input type="text" className="border rounded-md border-gray-200 bg-white" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} />
                      <div className="flex flex-row justify-between gap-1">
                        <button>
                          <XMarkIcon className="h-4 w-4 text-red bg-red-400 rounded-full" onClick={() => setSelectedTextIndex(undefined)} />
                        </button>
                        <button>
                          <CheckCircleIcon className="h-4 w-4 text-green-200 bg-green-400 rounded-full" onClick={() => updateCategoryName(category.id)} />
                        </button>

                      </div>

                    </div>

                  </div>
                ) : (
                  <div className="flex min-w-0 flex-1 items-center" >
                    <div className="min-w-0 flex-1 md:grid md:grid-cols-2 md:gap-4" onClick={() => handleTextClick(category.name, idx)} >
                      <p className="truncate text-sm font-medium">{category.name}</p>
                    </div>
                  </div>
                )}

                <div className="flex flex-row gap-2">
                  <div>
                    <Switch
                      checked={category.isActive}
                      onChange={() => toggleCategory(category.id)}
                      className={classNames(
                        category.isActive ? 'bg-indigo-600' : 'bg-gray-200',
                        'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                      )}
                    >
                      <span className="sr-only">Use setting</span>
                      <span
                        aria-hidden="true"
                        className={classNames(
                          category.isActive ? 'translate-x-5' : 'translate-x-0',
                          'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                        )}
                      />
                    </Switch>
                  </div>
                  <div>
                    <button onClick={() => deleteCategory(category.id)}>
                      <TrashIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default AddCategory;