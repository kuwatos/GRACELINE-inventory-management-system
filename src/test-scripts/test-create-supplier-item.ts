import "dotenv/config";
import { createUser } from "../entity/user/user.repository";
import {
  createPassword,
  updatePassword,
} from "../entity/password/password.repository";
async function main() {
  //   const user = {
  //     username: "Mark Lawrence",
  //     userType: "Admin",
  //   };

  //   try {
  //     const inserted = await createUser(user);
  //     console.log("Inserted:", inserted);
  //   } catch (err) {
  //     console.error("Error running test:", err);
  //     process.exitCode = 1;
  //   }

  const pw = {
    userId: 1, // Assuming the userId of the created user is 1
    password: "pogi part 3",
  };
  try {
    // const inserted = await createPassword(pw);
    const inserted = await updatePassword(pw);

    console.log("Inserted:", inserted);
  } catch (err) {
    console.error("Error running test:", err);
    process.exitCode = 1;
  }
}

main();
