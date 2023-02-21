import { z } from "zod"

export const ProductInput = z.object({
  id: z.string().optional(),
  name: z.string(),
  price: z.string(),
  weight: z.string(),
  image: z.array(
    z.object({
      src: z.string().min(1, { message: "src name is required" }).max(1000),
    })
  ),
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

export const OrderInput = z.object({
  leadName: z.string().min(1).max(50),
  phoneNumber: z.string().min(1,).max(15),
  address: z.string().min(1, { message: "Address is required" }).max(1000),
  address2: z.string().min(1, { message: "Address2 is required" }).max(1000),
  city: z.string().min(1, { message: "City is required" }).max(50),
  state: z.string().min(1, { message: "State is required" }).max(100),
  country: z.string().min(1, { message: "Country is required" }).max(100),
  postalCode: z.string().min(1, { message: "Postal code is required" }).max(100),
  variants: z.array(z.object({
    id: z.string(),
    quantity: z.number(),
  }))
})
