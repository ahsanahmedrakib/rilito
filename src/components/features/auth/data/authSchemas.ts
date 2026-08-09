import * as yup from "yup";

export const loginSchema = yup.object({
  email: yup.string().email("Enter a valid email").required("Email is required"),
  password: yup.string().required("Password is required"),
});

export type LoginValues = yup.InferType<typeof loginSchema>;

export const registerSchema = yup.object({
  name: yup.string().trim().required("Name is required"),
  email: yup
    .string()
    .email("Enter a valid email")
    .transform((value, original) => (original === "" ? undefined : value)),
  phone: yup
    .string()
    .required("Phone is required")
    .matches(/^01\d{9}$/, "Enter an 11-digit number starting with 01"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "At least 6 characters"),
  confirm: yup
    .string()
    .required("Confirm your password")
    .oneOf([yup.ref("password")], "Passwords don't match"),
});

export type RegisterValues = yup.InferType<typeof registerSchema>;