import { InventoryManager } from '@/components/features/inventory/inventory-manager'
import React from 'react'
import { readItems } from '@/src/entity/item/item.query'
import { readSuppliers } from '@/src/entity/supplier/supplier.query';
import {findCategories, findMeasurement} from '@/src/entity/item/item.repository';
async function page() {
  const items = await readItems();
  const suppliers = await readSuppliers();
  const categories = await findCategories();
  const measurements = await findMeasurement();
  const supplierOptions = suppliers.map(s => ({
    id: s.supplierId,
    name: s.supplierName
  }));
  const categoryOptions = categories.map(c => ({
    name: c.name
  }));
  const measurementOptions = measurements.map(m => ({
    name: m.name
  }));

  return (
    <InventoryManager 
    data={items} 
    suppliers={supplierOptions} 
    categories={categoryOptions}
    measurements={measurementOptions}
/>
  )
}

export default page