import { router, publicProcedure } from "../trpc";
import { z } from 'zod';

export const shipmentRouter = router({
 getShipmentPricing: publicProcedure
  .input(z.object({ weight: z.number().nullish() }).nullish())
  .query(({ input }) => {
    return input?.weight;
    }
  ),

});
