
import { OrdersManager } from '@/components/features/orders/orders-manager'
import { getOrdersAction, getSuppliersAction, getSupplierProductsAction } from "@/lib/action/order.action";

export default async function OrdersPage() {
  const [orders, suppliers, supplierProducts] = await Promise.all([
    getOrdersAction(),
    getSuppliersAction(),
    getSupplierProductsAction(),
  ]);

  return (
    <div className="p-8">
      <OrdersManager
        initialOrders={orders}
        suppliers={suppliers}
        supplierProducts={supplierProducts}
      />
    </div>
  );
}