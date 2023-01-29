import makeAnimated from 'react-select/animated';

import dynamic from 'next/dynamic'
const Select = dynamic(() => import("react-select"), {
  ssr: false,
})


export type Category = {
  id: string;
  name: string;
}[]

type ComboBoxProps = {
  categoriesSelected: any;
  categories: any;
  submitCategory: Category;
  setSubmitCategory: (e: Category) => void;
}


const animatedComponents = makeAnimated();
const ComboBox = ({ categoriesSelected, setSubmitCategory, categories}: ComboBoxProps) => {

  const handleSubmit = (e: any) => {
    console.log(e)
    setSubmitCategory(e);
  }
  return (
    <>
    <div className="mb-2">Update Categories</div>
      <Select
        closeMenuOnSelect={false}
        components={animatedComponents}
        defaultValue={categoriesSelected}
        isMulti
        options={categories}
        onChange={(e) => handleSubmit(e)}
      />
    </>
    
  );
}

export default ComboBox;