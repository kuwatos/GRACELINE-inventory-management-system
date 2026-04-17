import { de } from "date-fns/locale";
import * as z from "zod";

//=============== ITEM =================
// 1. The Shared Base Schema (The strict rules for a Product)
export const baseItemSchema = z.object({
  supplierId: z.string().trim().min(1, "Please select a supplier"),
  category: z
    .string()
    .trim()
    .min(1, "Invalid category")
    .max(25, "Invalid category"),
  productName: z
    .string()
    .min(3, "Product name must be at least 3 characters")
    .max(100, "Product name must be at most 100 characters"),
  reorderLevel: z.coerce
    .number<number>()
    .int("Reorder level must be a whole number")
    .min(1, "Level must at least be 1")
    .max(1000, "You exceeded the maximum level"),
});

// 2. The New Item Schema (Just the base rules)
export const newItemSchema = baseItemSchema;

// 3. The Edit Item Schema (Base rules + Quantity & Reason)
export const editItemSchema = baseItemSchema
  .extend({
    newQuantity: z.coerce
      .number<number>()
      .int()
      .min(0, "Quantity cannot be negative")
      .optional(),
    reason: z.string().trim().optional(),
  })
  .partial();

//=============== SUPPLIER =================
// The base rules for a supplier
const baseSupplierSchema = z.object({
  name: z.string().trim().min(2, "Supplier name must be at least 2 characters"),
  contact: z
    .string()
    .trim()
    .min(2, "Contact person must be at least 2 characters"),
  email: z.string().trim().email("Please enter a valid email address"),
});

// Schema for New Supplier
export const newSupplierSchema = baseSupplierSchema;

// Schema for Edit Supplier
export const editSupplierSchema = baseSupplierSchema;

//=============== USER =================

// The base rules for a user
export const baseUserSchema = z.object({
  username: z.string().min(1, "Username is required"), // <-- ADD THIS LINE
  department: z.string().min(1, "Department is required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
});

// Schema for New User (Passwords are REQUIRED)
export const newUserSchema = baseUserSchema.extend({
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Please confirm password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Schema for Edit User (Passwords are OPTIONAL)
export const editUserSchema = baseUserSchema.extend({
  password: z.string().optional(),
  confirmPassword: z.string().optional(),
}).refine((data) => !data.password || data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

//=============== ORDER =================

// The rules for a single product line item
const orderProductSchema = z.object({
  productId: z.string().min(1, "Please select a product"),
  qty: z.coerce.number<number>().int().min(1, "Quantity must be at least 1"),
});

// The base rules for a Purchase Order
export const baseOrderSchema = z.object({
  supplier: z.string().min(1, "Supplier is required"),
  expected: z.string().min(1, "Delivery date is required"),
  products: z.array(orderProductSchema).min(1, "You must add at least one product"),
  projectName: z.string().optional(),
});

export const newOrderSchema = baseOrderSchema;
export const editOrderSchema = baseOrderSchema;

//Project Form Validation
export const projectFormSchema = z.object({
  name: z.string().min(3, "Project name must be at least 3 characters"),
});

export type ProjectFormValues = z.infer<typeof projectFormSchema>;

