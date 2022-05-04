import { deployFactory, deployMold } from "../helpers/migrations";

// this is for using same script in both testing and deployment
export const main = async () => {
  const factory = await deployFactory();
  const mold = await deployMold();
  return { factory, mold };
};
