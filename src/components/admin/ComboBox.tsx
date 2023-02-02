import makeAnimated from 'react-select/animated';

import dynamic from 'next/dynamic'
import { trpc } from '../../utils/trpc';
const Select = dynamic(() => import("react-select"), {
  ssr: false,
})


export type Category = {
  id: string;
  name: string;
}[]

type ComboBoxProps = {
  id: string;
  setSubmitCategory: (e: Category) => void;
}


const animatedComponents = makeAnimated();
const ComboBox = ({setSubmitCategory, id}: ComboBoxProps) => {
 const getCategoriesData = trpc.products.getCategories.useQuery()
 const getCategoriesOnProduct = trpc.products.getProduct.useQuery({id})
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
        defaultValue={getCategoriesOnProduct.data?.categories}
        isMulti
        options={getCategoriesData.data}
        onChange={(e) => handleSubmit(e)}
        getOptionLabel={(option: any) => option.name}
        getOptionValue={(option: any) => option.id}
      />
    </>
    
  );
}

export default ComboBox;