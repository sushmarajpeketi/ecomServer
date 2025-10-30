import { z } from "zod";

export const productValidationSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  image: z.url("Invalid image URL").nullable().optional(),
  price: z.coerce.number().min(0, "Price must be greater than 0"),
  category:z.string().min(2,"category should be greater than 2 words")
});
