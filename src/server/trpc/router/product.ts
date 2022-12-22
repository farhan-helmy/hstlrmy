import { router, publicProcedure } from "../trpc";
import { z } from 'zod';
import { ProductInput, UpdateProductInput } from "./types";

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
    .query(async ({ ctx }) => {
      const products = await ctx.prisma.product.findMany({
        include: {
          images: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
      return products;
    }),
  getProduct: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const product = await ctx.prisma.product.findUnique({
        where: {
          id: input?.id
        },
        include: {
          images: true,
          variants: {
            orderBy: {
              name: 'desc'
            }
          }
        }
      });
      return product;
    }),
  getActiveProducts: publicProcedure
    .query(async ({ ctx }) => {
      const products = await ctx.prisma.product.findMany({
        where: {
          isActive: true
        },
        include: {
          images: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
      return products;
    }),
  productById: publicProcedure
    .input(z.object({ id: z.string().nullish() }).nullish())
    .query(({ input }) => {
      return productOneChoose.find((product) => product.id === input?.id);
    }),
  toggleStatus: publicProcedure
    .input(z.object({ id: z.string() }).nullish())
    .mutation(async ({ input, ctx }) => {
      const product = await ctx.prisma.product.findUniqueOrThrow({
        where: {
          id: input?.id,
        },
      });

      if (product.isActive) {
        await ctx.prisma.product.update({
          where: {
            id: input?.id,
          },
          data: {
            isActive: false,
          }
        });
      } else {
        await ctx.prisma.product.update({
          where: {
            id: input?.id,
          },
          data: {
            isActive: true,
          }
        });
      }

      return product;
    }
    ),
  addProduct: publicProcedure
    .input(ProductInput)
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.product.create({
        data: {
          name: input?.name,
          price: parseFloat(input?.price),
          weight: parseFloat(input?.weight),
          description: input?.description,
          images: {
            create: [
              {
                src: input?.imageSrc,
                alt: input?.name,
              }
            ]
          },
          variants: {
            createMany: {
              data: [
                ...input?.variant.map((variant) => ({
                  name: variant.name,
                  imageSrc: variant.imageSrc,
                  type: "color",
                }))
              ]
            }
          }
        },
      });
    }),
  updateProduct: publicProcedure
    .input(UpdateProductInput)
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.product.update({
        where: {
          id: input?.id,
        },
        data: {
          name: input?.name,
          price: parseFloat(input?.price),
          weight: parseFloat(input?.weight),
          description: input?.description,
          images: {
            updateMany: {
              where: {
                productId: input?.id,
              },
              data: {
                src: input?.imageSrc,
                alt: input?.name,
              }
            }
          },
        },
      });
    }),
  addVariant: publicProcedure
    .input(z.object({
      variant: z.array(z.object({
        id: z.string(),
        name: z.string().min(1),
        imageSrc: z.string().min(1),
        add: z.boolean(),
        productId: z.string()
      }))
    }))
    .mutation(async ({ input, ctx }) => {
      input?.variant.forEach(async (variant) => {
        if (variant.add) {
          await ctx.prisma.variant.create({
            data: {
              name: variant.name,
              imageSrc: variant.imageSrc,
              productId: variant.productId,
              type: "color",
            },
          });
        } else {
          await ctx.prisma.variant.update({
            where: {
              id: variant.id,
            },
            data: {
              name: variant.name,
              imageSrc: variant.imageSrc,
            },
          });
        }
      })
    }),
  removeVariant: publicProcedure
    .input(z.object({
      id: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.variant.delete({
        where: {
          id: input?.id,
        },
      });
    }
    ),
});

