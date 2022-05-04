import { deployFactory } from "../helpers/migrations";

deployFactory()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
