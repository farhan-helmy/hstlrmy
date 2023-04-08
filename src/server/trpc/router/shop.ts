import { publicProcedure, router } from "../trpc";
import {z} from 'zod';

export const shopRouter = router({
  setName: publicProcedure
    .input(z.object({ name: z.string(), value: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.settings.upsert({
        where: {
          name: input?.name,
        },
        update: {
          value: input?.value,
        },
        create: {
          name: input?.name,
          value: input?.value,
        }
      });
      return { ok: true, msg: "Shop name updated" };
    }),
  getName: publicProcedure
    .query(async ({ input, ctx }) => {
      const name = await ctx.prisma.settings.findUnique({
        where: {
          name: "shop"
        }
      });
      return name;
    }),
});