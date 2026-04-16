import { SupplierItemManager } from '@/components/features/supplier-item/supplier-item-manager'
import React from 'react'
import { readItemsWithSupplier } from '@/src/entity/supplier_item/supplier_item.query'
import { readSuppliersAndId } from '@/src/entity/supplier/supplier.query';
import { readItemsAndId } from '@/src/entity/item/item.query';

async function page() {
  const supplierItems = await readItemsWithSupplier();
  const suppliers = await readSuppliersAndId();
  const products = await readItemsAndId();
  return (
    <SupplierItemManager data={supplierItems} suppliers={suppliers} products={products} />
  )
}

export default page