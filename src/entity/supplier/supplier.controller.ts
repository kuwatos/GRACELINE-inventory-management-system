//It just adapts HTTP → service.

// src / modules / items / item.controller.ts;
import * as service from "./supplier.validation";

export async function createSupplier(req, res) {
  const item = await service.validateName(req.body);
  res.status(201).json(item);
}
