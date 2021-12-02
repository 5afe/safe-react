import * as React from "react";
import { ProviderOrGetter } from "@dorgtech/daocreator-lib";

import DAOcreatorV2 from "./DAOcreatorV2/index";

interface Props {
  setWeb3Provider?: ProviderOrGetter;
  noDAOstackLogo?: Boolean;
  redirectURL?: string;
  networks?: string;
}

const Index: React.FC<Props> = ({
  setWeb3Provider,
  noDAOstackLogo,
  redirectURL,
  networks,
}) => {
  return (
    <div className="daocreator-root">
      <DAOcreatorV2
        redirectURL={redirectURL}
        setWeb3Provider={setWeb3Provider}
        noDAOstackLogo={noDAOstackLogo}
        networks={networks}
      />
    </div>
  );
};

export default Index;
