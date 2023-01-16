import create from 'zustand'
import { persist } from 'zustand/middleware'

export interface Item {
  id?: string,
  name: string,
  href: string,
  price: string,
  imageSrc: string,
  imageAlt: string,
  variant?: string,
  quantity: number
}

interface CartState {
  items: Item[]
  totalItems: number
  totalPrice: number
  addToCart: (item: Item) => void
  removeAllItemsFromCart: () => void
  removeOneItemFromCart: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
}

const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      totalItems: 0,
      totalPrice: 0,
      addToCart: (item) => set((state) =>
      ({
        // if item already exist just add quantity
        items: state.items.find((i) => i.id === item.id)
          ? state.items.map((i) => i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i)
          : [...state.items, item],
        // update total price and total items
        totalItems: state.totalItems + item.quantity,
        totalPrice: state.totalPrice + (parseFloat(item.price) * item.quantity)
      })),
      removeAllItemsFromCart: () => set(() => ({ items: [], totalItems: 0, totalPrice: 0 })),
      removeOneItemFromCart: (id) => set((state) => ({
        items: state.items.filter((item) => item.id !== id),
        totalItems: state.totalItems - 1,
        totalPrice: state.totalPrice - parseFloat(state.items.find((item) => item.id === id)?.price || '0')
      })),
      updateQuantity: (id, quantity) => set((state) => {
        const item = state.items.find((item) => item.id === id)
        if (item) {
          item.quantity = quantity
        }
        return {
          items: [...state.items],
          totalItems: state.totalItems + 1,
          totalPrice: state.totalPrice + (parseFloat(item?.price || '0'))
        }
      },
      )
    }),
    {
      name: 'cart'
    })
);

export default useCartStore;