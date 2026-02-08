// src/modules/items/item.routes.ts
import { Router } from "express";
import * as controller from "./supplier.controller";

const router = Router();

router.post("/", controller.createSupplier);

export default router;
