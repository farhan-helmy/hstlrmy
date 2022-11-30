import { router, publicProcedure } from "../trpc";

const products = [
  {
    id: 'abc124',
    name: 'Earthen Bottle',
    href: '#',
    price: 48,
    imageSrc: 'https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-01.jpg',
    imageAlt: 'Tall slender porcelain bottle with natural clay textured body and cork stopper.',
  },
  {
    id: 'abc123',
    name: 'Nomad Tumbler',
    href: '#',
    price: 35,
    imageSrc: 'https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-02.jpg',
    imageAlt: 'Olive drab green insulated bottle with flared screw lid and flat top.',
  },
  {
    id: 'abc122',
    name: 'Focus Paper Refill',
    href: '#',
    price: 89,
    imageSrc: 'https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-03.jpg',
    imageAlt: 'Person using a pen to cross a task off a productivity paper card.',
  },
  {
    id: 'abc121',
    name: 'Machined Mechanical Pencil',
    href: '#',
    price: 50,
    imageSrc: 'https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-04.jpg',
    imageAlt: 'Hand holding black machined steel mechanical pencil with brass tip and top.',
  },
  // More products...
]

export const productRouter = router({
  getAll: publicProcedure.query(() => {
    return products;
  }
  ),
});

