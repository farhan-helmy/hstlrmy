import create from 'zustand'
import { persist } from 'zustand/middleware'

export interface Item {
  id: string,
  name: string,
  href: string,
  price: string,
  imageSrc: string,
  imageAlt: string,

}

interface CartState {
  items: Item[]
  totalItems: number
  totalPrice: number
  addToCart: (item: Item) => void
  calculateTotalCartItemPrice: () => number
  removeAllItemsFromCart: () => void
}

const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      totalItems: 0,
      totalPrice: 0,
      addToCart: (item) => set((state) =>
      ({
        items: [...state.items, item],
        totalPrice: state.totalPrice + parseFloat(item.price),
        totalItems: state.totalItems + 1
      })),
      //calculate total price of all items in cart
      calculateTotalCartItemPrice: () => {
        let total = 0;
        if (useCartStore.getState().items.length > 0) {
          useCartStore.getState().items.forEach((item) => {
            total += parseFloat(item.price)
          })
        }
        return total;
      },
      removeAllItemsFromCart: () => set(() => ({ items: [] })),
    }),
    {
      name: 'cart'
    })
);

export default useCartStore;