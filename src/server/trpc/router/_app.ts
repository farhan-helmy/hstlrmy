import { router } from "../trpc";
import { authRouter } from "./auth";
import { exampleRouter } from "./example";
import { paymentRouter } from "./payment";
import { productRouter } from "./product";
import { shipmentRouter } from "./shipment";
import { leadsRouter } from "./leads";
import { orderRouter } from "./order";

export const appRouter = router({
  example: exampleRouter,
  auth: authRouter,
  products: productRouter,
  shipment: shipmentRouter,
  payment: paymentRouter,
  leads: leadsRouter,
  orders: orderRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
