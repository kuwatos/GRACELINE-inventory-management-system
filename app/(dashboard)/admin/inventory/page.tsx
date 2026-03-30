import { InventoryManager } from '@/components/features/inventory/inventory-manager'
import React from 'react'
import { readItems } from '@/src/entity/item/item.query'

async function page() {
  const items = await readItems();

  return (
    <InventoryManager data={items}/>
  )
}

export default page