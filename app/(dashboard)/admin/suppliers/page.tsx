import { SuppliersManager } from '@/components/features/suppliers/suppliers-manager'
import React from 'react'
import { readSuppliers } from '@/src/entity/supplier/supplier.query'

async function page() {
  const suppliers = await readSuppliers();
  return (
    <SuppliersManager data={suppliers}/>
  )
}

export default page