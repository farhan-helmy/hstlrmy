import { router, publicProcedure } from "../trpc";
import { z } from 'zod';

const products = [
  {
    id: 'abc124',
    name: 'Earthen Bottle',
    href: '#',
    price: '48',
    imageSrc: 'https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-01.jpg',
    imageAlt: 'Tall slender porcelain bottle with natural clay textured body and cork stopper.',
    isEnabled: false,
  },
  {
    id: 'abc123',
    name: 'Nomad Tumbler',
    href: '#',
    price: '35',
    imageSrc: 'https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-02.jpg',
    imageAlt: 'Olive drab green insulated bottle with flared screw lid and flat top.',
    isEnabled: false,
  },
  {
    id: 'abc122',
    name: 'Focus Paper Refill',
    href: '#',
    price: '89',
    imageSrc: 'https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-03.jpg',
    imageAlt: 'Person using a pen to cross a task off a productivity paper card.',
    isEnabled: false,
  },
  {
    id: 'abc121',
    name: 'Machined Mechanical Pencil',
    href: '#',
    price: '50',
    imageSrc: 'https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-04.jpg',
    imageAlt: 'Hand holding black machined steel mechanical pencil with brass tip and top.',
    isEnabled: false,
  },
  // More products...
]

const productOneChoose = [{
  id: 'abc124',
  name: 'Zip Tote Basket',
  price: '140',
  rating: 4,
  images: [
    {
      id: 1,
      name: 'Angled view',
      src: 'https://tailwindui.com/img/ecommerce-images/product-page-03-product-01.jpg',
      alt: 'Angled front view with bag zipped and handles upright.',
    },
    // More images...
  ],
  colors: [
    { name: 'Washed Black', bgColor: 'bg-gray-700', selectedColor: 'ring-gray-700' },
    { name: 'White', bgColor: 'bg-white', selectedColor: 'ring-gray-400' },
    { name: 'Washed Gray', bgColor: 'bg-gray-500', selectedColor: 'ring-gray-500' },
  ],
  description: `
    <p>The Zip Tote Basket is the perfect midpoint between shopping tote and comfy backpack. With convertible straps, you can hand carry, should sling, or backpack this convenient and spacious bag. The zip top and durable canvas construction keeps your goods protected for all-day use.</p>
  `,
  details: [
    {
      name: 'Features',
      items: [
        'Multiple strap configurations',
        'Spacious interior with top zip',
        'Leather handle and tabs',
        'Interior dividers',
        'Stainless strap loops',
        'Double stitched construction',
        'Water-resistant',
      ],
    },
    // More sections...
  ],
}]

export const productRouter = router({
  getAll: publicProcedure
    .query(() => {
      return products;
    }),
  productById: publicProcedure
    .input(z.object({ id: z.string().nullish() }).nullish())
    .query(({ input }) => {
      return productOneChoose.find((product) => product.id === input?.id);
    }),
  toggleStatus: publicProcedure
    .input(z.object({ id: z.string().nullish() }).nullish())
    .mutation(({ input }) => {
      const product = products.find((product) => product.id === input?.id);
      if (product) {
        product.isEnabled = !product.isEnabled;
      }
      return product;
    }
    ),
});

