import { z } from "zod"

export const ProductInput = z.object({
  id: z.string().optional(),
  name: z.string(),
  price: z.string(),
  weight: z.string(),
  imageSrc: z.string(),
  description: z.string(),
  variant: z.array(
    z.object({
      name: z.string().min(1, { message: "Variant name is required" }).max(100),
      imageSrc: z.string().min(1, { message: "Variant image is required" }).max(10000),
    })
  )
})

export const UpdateProductInput = z.object({
  id: z.string().optional(),
  name: z.string(),
  price: z.string(),
  weight: z.string(),
  imageSrc: z.string(),
  description: z.string(),
})