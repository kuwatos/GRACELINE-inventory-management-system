import { InventoryManager } from '@/components/features/inventory/inventory-manager'
import React from 'react'
import { readItems } from '@/src/entity/item/item.query'
import { readSuppliers } from '@/src/entity/supplier/supplier.query';
import {findCategories} from '@/src/entity/item/item.repository';
async function page() {
  const items = await readItems();
  const suppliers = await readSuppliers();
  const categories = await findCategories();
  const supplierOptions = suppliers.map(s => ({
    id: s.supplierId,
    name: s.supplierName
  }));
  const categoryOptions = categories.map(c => ({
    name: c.name
  }));

  return (
    <InventoryManager data={items} suppliers={supplierOptions} categories={categoryOptions}/>
  )
}

export default page