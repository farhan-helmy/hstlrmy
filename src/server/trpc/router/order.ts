import { OrderInput } from "./types";
import { publicProcedure, router } from "../trpc";
import { sendOrderWhatsapp } from "../../common/whatsappapi";
import { z } from 'zod';

export const orderRouter = router({
  addOrder: publicProcedure
    .input(OrderInput)
    .mutation(async ({ input, ctx }) => {
      console.log("input", input);
      await ctx.prisma.order.create({
        data: {
          name: input?.leadName,
          phone: input?.phoneNumber,
          address: input?.address,
          address2: input?.address2,
          city: input?.city,
          state: input?.state,
          postalCode: input?.postalCode,
          country: input?.country,
          VariantsOnOrders: {
            create: input?.variants.map((item) => ({
              quantity: item.quantity,
              variantId: item.id,
            }))
          }
        }
      });

      return { ok: true, msg: "Order added" };
    }),
  sendWhatsappOrder: publicProcedure
    .input(z.object({ name: z.string(), item: z.string() }))
    .mutation(async ({ input, ctx }) => {
      sendOrderWhatsapp(input);
    }),
  getOrders: publicProcedure
    .input(z.object({status: z.string()}))
    .query(async ({ input, ctx }) => {
      const orders = await ctx.prisma.order.findMany({
        where: {
          status: input.status
        },
        include: {
          VariantsOnOrders: {
            include: {
              variant: true
            }
          }
        }
      });
      return orders;
    }),
  getOrder: publicProcedure
    .input(z.object({id: z.string()}))
    .query(async ({ input, ctx }) => {
      const order = await ctx.prisma.order.findUnique({
        where: {
          id: input.id
        },
        include: {
          VariantsOnOrders: {
            include: {
              variant: true
            }
          }
        }
      });
      return order;
    }),
})