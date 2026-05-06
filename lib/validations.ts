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

// 3. EDIT ITEM (Essentials + Identity + Adjustments)
export const editItemSchema = baseItemSchema.extend({
  reason: z.string().min(1, "Please provide a reason"),
  projectId: z.coerce.number().int().optional(),
}).superRefine((data, ctx) => {
  // If reason is project, but no valid projectId is provided
  if (data.reason === "project" && (!data.projectId || data.projectId <= 0)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Please select a target project",
      path: ["projectId"], // This puts the red error message under the project dropdown
    });
  }
});

//=============== SUPPLIER =================
// The base rules for a supplier
const baseSupplierSchema = z.object({
  name: z.string().trim().min(2, "Supplier name must be at least 2 characters"),
  supplierLandline: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .pipe(
      z.string().optional().refine((val) => {
        if (!val) return true; // Skip validation if empty/optional
        // PH Standard: 0 + Area Code + 7 or 8-digit number (Total 10 digits)
        return /^0\d{9}$/.test(val);
      }, "Landline must follow the format 0XXXXXXXXX (10 digits)")
    ),
  supplierEmail: z
    .string()
    .trim()
    .email("Please enter a valid email address")
    .optional()
    .or(z.literal("")), // Allow empty string as well
  supplierMobile: z
    .string()
    .trim()
    .min(1, "Mobile number is required")
    .regex(/^09\d{9}$/, "Mobile number must follow the format 09XXXXXXXXX (11 digits)"),

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
  username: z.string().min(6, "Username must be at least 6 characters"), // <-- ADD THIS LINE
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Please confirm password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Schema for Edit User (Passwords are OPTIONAL)
export const editUserSchema = baseUserSchema.extend({
  username: z.string().min(1, "Username must be at least 6 characters"), // <-- ADD THIS LINE
  password: z.string().optional(),
  confirmPassword: z.string().optional(),
}).refine((data) => !data.password || data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

//=============== ORDER =================

// The rules for a single product line item
const orderProductSchema = z.object({
  productId: z.coerce
    .number().int(),
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
  quantity: z.coerce.number<number>().int().min(1, "Quantity must be at least 1"),
});

const receiveProductSchema = z.object({
  productId: z.coerce
    .number().int(),
  quantity: z.coerce.number<number>().int().min(0, "Quantity cannot be negative"),
})


// The base rules for a Purchase Order
export const baseOrderSchema = z.object({
  supplierId: z.coerce
    .number()
    .int()
    .min(1, "Please select a supplier"),
  projectId: z.coerce
    .number()
    .int()
    .transform((val) => (val === 0 || val === null) ? undefined : val), // strip 0
  deliveryDate: z.coerce.date().min(new Date().setHours(0, 0, 0, 0), "Choose a delivery date, and it must be at least today"),
  products: z.array(orderProductSchema).min(1, "You must add at least one product"),
  projectName: z.string().optional(),
});

export const newOrderSchema = baseOrderSchema;
export const editOrderSchema = z.object({
  supplierId: z.coerce.number().int().min(1, "Please select a supplier"),
  projectId: z.coerce.number().int().min(0).optional(),
  deliveryDate: z.coerce.date()
    .min(new Date(new Date().setHours(0, 0, 0, 0)), "Choose a delivery date, and it must be at least today")
    .optional(),
  products: z.array(
    z.object({
      productId: z.coerce.number().int(),
      unitPrice: z
        .string()
        .trim()
        .min(1, "Price is required")
        .regex(/^\d+(\.\d{1,2})?$/, "Invalid price format (e.g., 1450.00)")
        .refine((val) => parseFloat(val) >= 0.01, "Price must be at least 0.01")
        .refine((val) => parseFloat(val) <= 9999999.99, "Price exceeds maximum"),
      quantity: z.coerce.number().int().min(1, "Quantity must be at least 1"),
    })
  ).min(1, "You must add at least one product"),
});

export const receiveOrderSchema = z.object({
  products: z.array(receiveProductSchema)
})

export const baseReportSchema = z.object({
  reportType: z.string().min(1, "Please select a report type"),
  dateStart: z.coerce.date(),
  dateEnd: z.coerce.date(),
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
  productId: z.coerce.number().int().min(1, "Please select a valid product")
});
export const newSupplierItemSchema = baseSupplierItemSchema;
export const editSupplierItemSchema = baseSupplierItemSchema;

export const reportSchema = z.object({
  reportType: z.string(),
  dateStart: z.string(), // Input type="date" gives a string
  dateEnd: z.string(),
}).refine((data) => {
  // Logic: End date must be greater than or equal to Start date
  return new Date(data.dateEnd) >= new Date(data.dateStart);
}, {
  message: "The End Date cannot be earlier than the Start Date.",
  path: ["dateEnd"], // This attaches the error message specifically to the dateEnd field
});