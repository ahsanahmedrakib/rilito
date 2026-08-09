import * as yup from "yup";

export const checkoutSchema = yup.object({
  name: yup.string().trim().required("Full name is required"),
  phone: yup
    .string()
    .required("Phone is required")
    .matches(/^01\d{9}$/, "Enter an 11-digit number starting with 01"),
  email: yup
    .string()
    .email("Enter a valid email")
    .transform((value, original) => (original === "" ? undefined : value)),
  address: yup.string().trim().required("Full address is required"),
  city: yup.string().required("Pick a city"),
  area: yup.string(),
  note: yup.string(),
});

export type CheckoutAddress = yup.InferType<typeof checkoutSchema>;