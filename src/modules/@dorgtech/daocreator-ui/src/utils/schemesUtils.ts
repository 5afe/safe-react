import { SchemesForm } from "@dorgtech/daocreator-lib";

export interface SimpleOption {
  text: string;
  checked: boolean;
}

export const getSimpleOptions = (form: SchemesForm) => {
  if (form.$.length === 0) return [];

  const {
    proposingRepReward,
    votersReputationLossRatio,
    minimumDaoBounty,
    daoBountyConst
  } = form.$[0].$.votingMachine.values;

  const simpleOptions: SimpleOption[] = [
    { text: "Reward successful proposer", checked: Number(proposingRepReward) > 0 },
    {
      text: "Reward correct voters and penalize incorrect voters",
      checked: Number(votersReputationLossRatio) > 0
    },
    {
      text: "Auto-incentivize proposal curation",
      checked: Number(minimumDaoBounty) > 0.000001 && Number(daoBountyConst) >= 1 // TODO Update after daostack lets us use 0
    }
  ];

  return simpleOptions;
};
