import React, { FC, useEffect, useState } from "react";
import { MDBRow, MDBCol } from "mdbreact";

import LineGraphic from "../../LineGraphic";

// Right now TS can't cast [key: string]: string | number but it can cast [key: string]: any despite an interface only having strings and numbers
// https://stackoverflow.com/questions/37006008/typescript-index-signature-is-missing-in-type
interface Data {
  // [name: string]: string | number;
  [name: string]: any;
}

interface LineConfig {
  showPercentage: boolean;
  height: string;
  symbol?: string;
  dataKey: string;
  nameKey: string;
}

interface Props {
  data: Data[]; // TODO Potentially update data type to flattened form type,
  tokenSymbol: string;
}

export const MembersAnalytics: FC<Props> = ({ data, tokenSymbol }) => {
  const tokenConfig = {
    showPercentage: false,
    height: "0.5rem",
    symbol: tokenSymbol,
    dataKey: "tokens",
    nameKey: "address"
  };

  const reputationConfig = {
    showPercentage: false,
    height: "0.5rem",
    symbol: "REP",
    dataKey: "reputation",
    nameKey: "address"
  };

  const [totalTokenAmount, setTotalTokenAmount] = useState(0);
  const [totalReputationAmount, setTotalReputationAmount] = useState(0);

  useEffect(() => {
    let count = 0;
    data.map((element: Data) => {
      count += element[tokenConfig.dataKey] as number;
      return element;
    });
    setTotalTokenAmount(count);
  }, [data, tokenConfig.dataKey]);

  useEffect(() => {
    let count = 0;
    data.map((element: Data) => {
      count += element[reputationConfig.dataKey] as number;
      return element;
    });
    setTotalReputationAmount(count);
  }, [data, reputationConfig.dataKey]);

  interface BoxProps {
    name: string;
    total: number;
    config: LineConfig;
  }

  const Box: FC<BoxProps> = ({ name, total, config }) =>
    total === 0 ? null : (
      <MDBRow>
        <MDBCol size="4">
          <div>{name}</div>
        </MDBCol>
        <MDBCol size="8">
          <LineGraphic data={data} total={total} config={config} />
        </MDBCol>
      </MDBRow>
    );

  const AnalyticsBoxes: FC = () => {
    const reputationBox = (
      <Box
        name={"Reputation Distribution"}
        total={totalReputationAmount}
        config={reputationConfig}
      />
    );
    const tokenBox = (
      <Box
        name={`${tokenSymbol} Token Distribution`}
        total={totalTokenAmount}
        config={tokenConfig}
      />
    );

    if (totalReputationAmount === 0 && totalTokenAmount === 0) return null;

    return (
      <div style={{ paddingTop: "10px", paddingBottom: "10px" }}>
        {reputationBox}
        {totalReputationAmount !== 0 && totalTokenAmount !== 0 && <br />}
        {tokenBox}
      </div>
    );
  };

  return <AnalyticsBoxes />;
};
