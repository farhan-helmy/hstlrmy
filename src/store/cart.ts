import create from 'zustand'

export interface Item {
  id: string,
  name: string,
  href: string,
  price: number,
  imageSrc: string,
  imageAlt: string,

}

interface CartState {
  items: Item[]
  addToCart: (item: Item) => void
  calculateTotalCartItemPrice: () => number
}

const useCartStore = create<CartState>((set) => ({
  items: [],
  addToCart: (item) => set((state) => ({ items: [...state.items, item] })),
  //calculate total price of all items in cart
  calculateTotalCartItemPrice: () => {
    let total = 0;
    if (useCartStore.getState().items.length > 0) {
      useCartStore.getState().items.forEach((item) => {
        total += item.price
      })
    }
    return total;
  }
}));

export default useCartStore;