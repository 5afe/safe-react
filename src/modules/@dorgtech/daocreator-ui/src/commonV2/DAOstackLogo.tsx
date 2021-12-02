import React from "react";
const logo = require("../assets/logos/dao-logo-gray.svg");

const DAOstackLogo = () => {
  return (
    <div style={{ marginLeft: "31%" }}>
      <img style={styles.logo} src={logo} alt="dao-logo.svg" />
      <b style={styles.text}>Powered by DAOstack</b>
    </div>
  );
};

const styles = {
  logo: {
    marginRight: 20,
    width: 30
  },
  text: {
    color: "#2e88ee",
    fontSize: 20
  }
};

export default DAOstackLogo;
