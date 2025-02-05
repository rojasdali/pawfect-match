import { z } from "zod";

export const filterSchema = z
  .object({
    minAge: z.string().refine((val) => !val || Number(val) >= 0, {
      message: "Min age must be positive",
    }),
    maxAge: z.string().refine((val) => !val || Number(val) >= 0, {
      message: "Max age must be positive",
    }),
    breed: z.string(),
    location: z
      .object({
        city: z.string(),
        state: z.string(),
        zip_code: z.string(),
        display: z.string(),
        latitude: z.number(),
        longitude: z.number(),
      })
      .nullable()
      .optional(),
    distance: z
      .number()
      .nullable()
      .refine(
        (val) => val === null || (val >= 0 && val <= 500),
        "Distance must be between 0 and 500 miles"
      ),
  })
  .refine(
    (data) => {
      if (!data.minAge || !data.maxAge) return true;
      const min = Number(data.minAge);
      const max = Number(data.maxAge);
      return max >= min;
    },
    {
      message: "Max age must be greater than min age",
      path: ["maxAge"],
    }
  )
  .refine(
    (data) => {
      if (data.location) {
        return data.distance !== null;
      }
      return true;
    },
    {
      message: "Distance is required when location is selected",
      path: ["distance"],
    }
  );

export type Filters = z.infer<typeof filterSchema>;
