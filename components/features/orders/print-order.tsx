import { OrderRecord } from "./order-history-table";
import Big from "big.js";

interface PrintOrderProps {
  order: OrderRecord;
}

export const PrintOrder = ({ order }: PrintOrderProps) => {
  const grandTotal = order.products.reduce((acc, p) => {
    try {
      return acc.plus(new Big(p.unitPrice).times(new Big(p.expectedQty)));
    } catch {
      return acc;
    }
  }, new Big(0)).toFixed(2);

  return (
    <div className="p-12 font-sans text-gray-900 bg-white min-h-screen">
      
      {/* Header */}
      <div className="flex items-start justify-between mb-10 pb-6 border-b-2 border-gray-900">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900">PURCHASE ORDER</h1>
          <p className="text-gray-500 mt-1 text-sm">GRACELINE INVENTORY MANAGEMENT</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-900">PO #{order.poId}</p>
          <span className={`inline-block mt-1 px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider
            ${order.status === "Complete" ? "bg-green-100 text-green-700" :
              order.status === "Incomplete" ? "bg-red-100 text-red-700" :
              order.status === "Awaiting Delivery" ? "bg-blue-100 text-blue-700" :
              "bg-gray-100 text-gray-600"}`}>
            {order.status}
          </span>
        </div>
      </div>

      {/* Order Info Grid */}
      <div className="grid grid-cols-3 gap-8 mb-10">
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Supplier</p>
          <p className="font-bold text-gray-900">{order.supplierName}</p>
        </div>
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Project</p>
          <p className="font-bold text-gray-900">{order.projectName ?? "—"}</p>
        </div>
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Date Placed</p>
          <p className="font-bold text-gray-900">{order.dateCreated}</p>
        </div>
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Expected Delivery</p>
          <p className="font-bold text-gray-900">{order.expectedDelivery}</p>
        </div>
        {order.dateReceived && (
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Actual Delivery</p>
            <p className="font-bold text-green-700">{order.dateReceived}</p>
          </div>
        )}
      </div>

      {/* Products Table */}
      <table className="w-full text-sm mb-10 border-collapse">
        <thead>
          <tr className="bg-gray-900 text-white">
            <th className="text-left px-4 py-3 font-bold rounded-tl-lg">Product</th>
            <th className="text-right px-4 py-3 font-bold">Unit Price</th>
            <th className="text-right px-4 py-3 font-bold">Expected Qty</th>
            {(order.status === "Complete" || order.status === "Incomplete") && (
              <th className="text-right px-4 py-3 font-bold">Received Qty</th>
            )}
            <th className="text-right px-4 py-3 font-bold rounded-tr-lg">Total</th>
          </tr>
        </thead>
        <tbody>
          {order.products.map((item, i) => {
            const rowTotal = (() => {
              try {
                return new Big(item.unitPrice).times(new Big(item.expectedQty)).toFixed(2);
              } catch {
                return "0.00";
              }
            })();
            const isMismatch =
              (order.status === "Complete" || order.status === "Incomplete") &&
              item.expectedQty !== item.receivedQty;

            return (
              <tr key={item.orderProductId} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-4 py-3 font-medium border-b border-gray-100">{item.productName}</td>
                <td className="px-4 py-3 text-right border-b border-gray-100">₱{item.unitPrice.toFixed(2)}</td>
                <td className="px-4 py-3 text-right font-bold text-blue-700 border-b border-gray-100">{item.expectedQty}</td>
                {(order.status === "Complete" || order.status === "Incomplete") && (
                  <td className={`px-4 py-3 text-right font-bold border-b border-gray-100 ${isMismatch ? "text-red-500" : "text-green-600"}`}>
                    {item.receivedQty ?? "—"}
                  </td>
                )}
                <td className="px-4 py-3 text-right font-medium border-b border-gray-100">₱{rowTotal}</td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr className="bg-gray-900 text-white">
            <td colSpan={(order.status === "Complete" || order.status === "Incomplete") ? 4 : 3} className="px-4 py-3 font-bold text-right rounded-bl-lg">
              ORDER TOTAL
            </td>
            <td className="px-4 py-3 font-black text-right text-lg rounded-br-lg">₱{grandTotal}</td>
          </tr>
        </tfoot>
      </table>

      {/* Footer */}
      <div className="mt-auto pt-10 border-t border-gray-200 flex justify-between text-xs text-gray-400">
        <p>Generated by Graceline Inventory Management System</p>
        <p>Printed: {new Date().toLocaleString("en-PH", { timeZone: "Asia/Manila" })}</p>
      </div>
    </div>
  );
};