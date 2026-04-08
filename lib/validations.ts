import { de } from "date-fns/locale";
import * as z from "zod";

// 1. THE ESSENTIALS (Physical Product Details)
export const baseItemSchema = z.object({
  productName: z
    .string()
    .min(3, "Product name must be at least 3 characters")
    .max(100, "Product name must be at most 100 characters"),

  category1: z
    .string()
    .trim()
    .min(1, "Invalid category")
    .max(25, "Invalid category"),

  category2: z.union([z.literal(""), z.string().trim().min(1).max(25)]).optional(),
  category3: z.union([z.literal(""), z.string().trim().min(1).max(25)]).optional(),
  category4: z.union([z.literal(""), z.string().trim().min(1).max(25)]).optional(),
  category5: z.union([z.literal(""), z.string().trim().min(1).max(25)]).optional(),
  measurement: z.string().min(1, "Please select a unit of measurement"),

  productDesc: z
    .string()
    .trim()
    .max(500, "Description is too long")
    .optional(),

  productQuantity: z.coerce
    .number()
    .int("Quantity must be a whole number")
    .min(0, "Quantity cannot be negative")
    .default(0),

  reorderLevel: z.coerce
    .number()
    .int("Reorder level must be a whole number")
    .min(1, "Level must at least be 1")
    .max(1000, "You exceeded the maximum level"),
});

// 2. NEW ITEM (Essentials + Sourcing)
export const newItemSchema = baseItemSchema.extend({
  supplierId: z.coerce
    .number()
    .int()
    .min(1, "Please select a supplier"),

  unitPrice: z.coerce
    .number()
    .positive("Price must be greater than 0")
    .transform((val) => val.toFixed(2)),
});

// 3. EDIT ITEM (Essentials + Identity + Adjustments)
export const editItemSchema = baseItemSchema
  .extend({
    newQuantity: z.coerce
      .number()
      .int()
      .min(0, "Quantity cannot be negative")
      .optional(),
      
    reason: z.string().trim().optional(),
  });

//=============== SUPPLIER =================
// The base rules for a supplier
const baseSupplierSchema = z.object({
  name: z.string().trim().min(2, "Supplier name must be at least 2 characters"),
  supplierLandline: z
    .string()
    .trim()
    .min(7, "Landline number must be at least 7 digits")
    .max(15, "Landline number must be at most 15 digits")
    .optional()
    .or(z.literal("")), // Allow empty string as well
  supplierEmail: z
    .string()
    .trim()
    .email("Please enter a valid email address")
    .optional()
    .or(z.literal("")), // Allow empty string as well
  supplierMobile: z
    .string()
    .trim().min(7, "Mobile number must be at least 7 digits")
    .max(15, "Mobile number must be at most 15 digits")

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
});

export const newOrderSchema = baseOrderSchema;
export const editOrderSchema = baseOrderSchema;

export const baseReportSchema = z.object({
  reportType: z.string().min(1, "Please select a report type"),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
});
//Project Form Validation
export const projectFormSchema = z.object({
  projectName: z.string().min(3, "Project name must be at least 3 characters"),
});

export type ProjectFormValues = z.infer<typeof projectFormSchema>;


export const baseSupplierItemSchema = z.object({
  supplierId: z.coerce.number().int().min(1, "Please select a valid supplier"),
  unitPrice: z
    .string()
    .trim()
    .min(1, "Price is required")
    .regex(
      /^\d+(\.\d{1,2})?$/,
      "Invalid price format (e.g., 1450.00)"
    )
    .refine((val) => {
      const num = parseFloat(val);
      return num >= 0.01;
    }, "Price must be at least 0.01")
    .refine((val) => {
      const num = parseFloat(val);
      return num <= 9999999.99;
    }, "Price exceeds the maximum limit of 9,999,999.99"),
});
export const newSupplierItemSchema = baseSupplierItemSchema.extend({
  productId: z.coerce.number().int().min(1, "Please select a valid product"),
});
export const editSupplierItemSchema = baseSupplierItemSchema;
