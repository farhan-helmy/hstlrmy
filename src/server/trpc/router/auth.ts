import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../trpc";
import { signToken } from "../../../common/jwt";

export const authRouter = router({
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session;
  }),
  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
  login: publicProcedure
  .input(z.object({ username: z.string(), password: z.string() }))
  .mutation(async ({ ctx, input }) => {
    const { username, password } = input;
    if (username === "admin" && password === "admin") {
      const token = signToken({ username });
      console.log(token)
    }else{
      return "error"
    }
  }),
});
