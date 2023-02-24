/* eslint-disable @typescript-eslint/no-explicit-any */
import makeAnimated from 'react-select/animated';

import dynamic from 'next/dynamic'
const Select = dynamic(() => import("react-select"), {
  ssr: true,
})

export type Category = {
  id: string;
  name: string;
}[] | undefined

type ComboBoxProps = {
  setSubmitCategory: (e: Category) => void;
  categoriesOnProduct: Category;
  categories: Category;
}


const animatedComponents = makeAnimated();
const ComboBox = ({ setSubmitCategory, categoriesOnProduct, categories }: ComboBoxProps) => {

  const handleSubmit = (e: any) => {
    // console.log(e)
    setSubmitCategory(e);
  }
  return (
    <>
      <div className="mb-2">Update Categories</div>
        <Select
          closeMenuOnSelect={false}
          components={animatedComponents}
          defaultValue={categoriesOnProduct}
          isMulti
          options={categories}
          onChange={(e) => handleSubmit(e)}
          getOptionLabel={(option: any) => option.name}
          getOptionValue={(option: any) => option.id}
        />
    </>

  );
}

export default ComboBox;