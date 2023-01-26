import create from 'zustand'

interface ProductState {
  products: string[]
  addProduct: (product: string) => void
  productDesriptionForEdit: string
  updateProductDescription: (productDesriptionForEdit: string) => void
}

const useProductStore = create<ProductState>()(
  (set) => ({
    products: [],
    productDesriptionForEdit: '',
    addProduct: (product) => set((state) => ({ products: [...state.products, product] })),
    updateProductDescription: (productDesriptionForEdit) => set((state) => ({ productDesriptionForEdit })),
  })
);

export default useProductStore;