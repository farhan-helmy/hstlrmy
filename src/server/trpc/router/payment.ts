import { publicProcedure, router } from "../trpc";
import { z } from 'zod';
import { securepaySign } from "../../../helper/utils";

export const paymentRouter = router({
  pay: publicProcedure
    .input(z.object({ email: z.string(), name: z.string(), phone_no: z.string(), product_description: z.string(), transaction_amount: z.string()}))
    .query(({ input }) => {
      console.log(input);
    }
  ),
});
