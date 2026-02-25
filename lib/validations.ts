import * as z from "zod";

// 1. The Shared Base Schema (The strict rules for a Product)
export const baseItemSchema = z.object({
  supplierId: z.string().min(1, "Please select a supplier"),
  category: z.string().min(1, "Invalid category").max(25, "Invalid category"),
  productName: z.string().min(3, "Product name must be at least 3 characters").max(100, "Product name must be at most 100 characters"),
  reorderLevel: z.coerce.number<number>().int("Reorder level must be a whole number").min(1, "Level must at least be 1").max(1000, "You exceeded the maximum level"),
});

// 2. The New Item Schema (Just the base rules)
export const newItemSchema = baseItemSchema;

// 3. The Edit Item Schema (Base rules + Quantity & Reason)
export const editItemSchema = baseItemSchema.extend({
  newQuantity: z.coerce.number<number>().int().min(0, "Quantity cannot be negative").optional(),
  reason: z.string().optional(),
});

// The base rules for a supplier
const baseSupplierSchema = {
  name: z.string().min(2, "Supplier name must be at least 2 characters"),
  contact: z.string().min(2, "Contact person must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
};

// Schema for New Supplier
export const newSupplierSchema = z.object({
  ...baseSupplierSchema,
});

// Schema for Edit Supplier
export const editSupplierSchema = z.object({
  ...baseSupplierSchema,
});