// src/modules/items/item.routes.ts
import { Router } from "express";
import * as controller from "./supplier.controller";

const router = Router();

router.post("/", controller.createSupplier);

export default router;

//EXAMPLE
// Routes define API endpoints.
// They answer:
// “When someone hits POST /users, what code runs?

// import { Router } from "express";
// import {
//   createSupplierController,
//   getAllSuppliersController,
//   getSupplierByIdController,
//   updateSupplierController,
//   deleteSupplierController,
// } from "./suppliers.controller";

// const router = Router();

// // CREATE
// router.post("/", createSupplierController);

// // READ ALL
// router.get("/", getAllSuppliersController);

// // READ ONE
// router.get("/:id", getSupplierByIdController);

// // UPDATE
// router.patch("/:id", updateSupplierController);

// // DELETE
// router.delete("/:id", deleteSupplierController);

// export default router;
