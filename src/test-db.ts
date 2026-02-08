import * as supplierValidation from "./entity/supplier/supplier.validation";

async function test() {
  try {
    console.log("Testing supplier creation...");
    const newSupplier = await supplierValidation.validateName({
      supplierName: "",
      supplierContact: "marklawrence@email.com",
    });
    console.log("New supplier created:", newSupplier);
  } catch (error) {
    console.error("Error creating supplier:", error);
  }
}

test();
