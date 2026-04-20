
import { OrdersManager } from '@/components/features/orders/orders-manager'
import { getOrdersAction, getSuppliersAction, getSupplierProductsAction, getProjectsAction } from "@/lib/action/order.action";

export default async function OrdersPage() {
  const [orders, suppliers, supplierProducts, projects] = await Promise.all([
    getOrdersAction(),
    getSuppliersAction(),
    getSupplierProductsAction(),
    getProjectsAction(),
  ]);

  return (
      <OrdersManager
        initialOrders={orders}
        suppliers={suppliers}
        supplierProducts={supplierProducts}
        projects={projects}
      />
  );
}