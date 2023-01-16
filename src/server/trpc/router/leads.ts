import { sendMail } from "../../common/aws-ses";
import { sendWhatsapp } from "../../common/whatsappapi";
import { publicProcedure, router } from "../trpc";
import { z } from 'zod';

export const leadsRouter = router({
  sendEmail: publicProcedure
    .input(z.object({ name: z.string(), phone_number: z.string()}))
    .mutation(async ({ input }) => {
      const res = sendMail(input)
      return res
    }
  ),
  sendWhatsapp: publicProcedure
    .input(z.object({ name: z.string(), phone_number: z.string()}))
    .mutation(async ({ input }) => {
      const res = sendWhatsapp(input)
      return res
    }
  ),
});
