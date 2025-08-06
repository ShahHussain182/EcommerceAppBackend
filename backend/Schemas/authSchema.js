import { z } from "zod";
const emailSchema = z
  .string()
  .email({ message: "Invalid email address" })
  .min(5, { message: "Email must be at least 5 characters long" })
  .max(255,{message: "Email length exceeded."});
const passwordSchema =z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
      })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter",
      })
      .regex(/[0-9]/, { message: "Password must contain at least one number" })
      .regex(/[@$!%*?&#]/, {
        message: "Password must contain at least one special character",
      });
 const confirmPasswordSchema =  z
      .string()
      .min(8, {
        message: "Confirm Password must be at least 8 characters long",
      })
      .regex(/[A-Z]/, {
        message: "Confirm Password must contain at least one uppercase letter",
      })
      .regex(/[a-z]/, {
        message: "Confirm Password must contain at least one lowercase letter",
      })
      .regex(/[0-9]/, {
        message: "Confirm Password must contain at least one number",
      })
      .regex(/[@$!%*?&#]/, {
        message: "Confirm Password must contain at least one special character",
      });    
export const loginSchema = z
  .object({
    email: emailSchema.optional(),
    password: passwordSchema,
    phoneNumber: z.string().min(11).optional(),
  })
  .refine((data) => data.email || data.phoneNumber, {
    message: "Email is required if phone number is not provided.",
    path: ["email"],
  })
  .refine((data) => data.phoneNumber || data.email, {
    message: "Phone number is required if email is not provided.",
    path: ["phoneNumber"],
  });;
export const signupSchema = z
  .object({
    firstName: z
      .string()
      .min(4, { message: "Firstname must be at least 4 characters long" })
      .max(20, { message: "Firstname must be at most 20 characters long" }),
    lastName: z
      .string()
      .min(4, { message: "Lastname must be at least 4 characters long" })
      .max(20, { message: "Lastname must be at most 20 characters long" }),
    email: emailSchema,
    phoneNumber: z.string().min(11),
    password: passwordSchema,

    confirmPassword:confirmPasswordSchema,
    userName: z
      .string()
      .min(4, { message: "Username must be at least 4 characters long" })
      .max(20, { message: "Username must be at most 20 characters long" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
export const codeSchema = z.string().min(1).max(6);