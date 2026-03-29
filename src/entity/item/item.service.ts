import { createItem } from "./item.repository";
import { createSupplierItem } from "../supplier_item/supplier_item.repository";

export async function createItemService(data: {
  productName: string;
  productCategory1: string;
  productCategory2?: string;
  productCategory3?: string;
  productCategory4?: string;
  productCategory5?: string;
  productDesc?: string;
  productQuantity?: number;
  reorderLevel?: number;
  supplierId: number;
  unitPrice: string;
}) {
  const item = await createItem({
    productName: data.productName,
    productCategory1: data.productCategory1,
    productCategory2: data.productCategory2,
    productCategory3: data.productCategory3,
    productCategory4: data.productCategory4,
    productCategory5: data.productCategory5,
    productDesc: data.productDesc,
    productQuantity: data.productQuantity,
    reorderLevel: data.reorderLevel,
  });

  const itemId = item.productId;

  await createSupplierItem({
    productId: itemId,
    supplierId: data.supplierId,
    unitPrice: data.unitPrice,
  });
}
