import { router } from "../trpc";
import { authRouter } from "./auth";
import { exampleRouter } from "./example";
import { paymentRouter } from "./payment";
import { productRouter } from "./product";
import { shipmentRouter } from "./shipment";

export const appRouter = router({
  example: exampleRouter,
  auth: authRouter,
  products: productRouter,
  shipment: shipmentRouter,
  payment: paymentRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
