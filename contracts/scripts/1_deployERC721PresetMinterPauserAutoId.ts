import { deployMold } from "../helpers/migrations";

deployMold()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
