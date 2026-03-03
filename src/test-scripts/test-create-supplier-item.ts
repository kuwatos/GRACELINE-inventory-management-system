import "dotenv/config";
import { createSupplier } from "../entity/supplier/supplier.repository";
async function main() {
  const data = {
    supplierName: "Mark Lawrence",
    supplierMobile: "2024",
    supplierLandline: "9999",
  };

  try {
    const inserted = await createSupplier(data);
    console.log("Inserted:", inserted);
  } catch (err) {
    console.error("Error running test:", err);
    process.exitCode = 1;
  }
}

main();
