// This is where rules live, not SQL.

// src/modules/items/item.service.ts
import * as repo from "./supplier.repository";

export async function validateName(input: {
  supplierName: string;
  supplierContact: string;
}) {
  if (input.supplierName.length === 0) {
    throw new Error("Name cannot be negative");
  }

  return repo.createSupplier(input);
}
