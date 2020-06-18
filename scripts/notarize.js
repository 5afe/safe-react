const fs = require("fs");
const path = require("path");
const { notarize } = require("electron-notarize");
const envConfig = require('dotenv').config({path:path.join(__dirname, '../.env')});

Object.entries(envConfig.parsed || {}).forEach(([key, value]) => {
  process.env[key] = value;
});


module.exports = async function (params) {

    // Only notarize the app on Mac OS only.
  if (process.platform !== "darwin") {
    return;
  }
  // Same appId in electron-builder.
  let appId = "io.gnosis.safe.macos";
  let appPath = path.join(
    params.appOutDir,
    `${params.packager.appInfo.productFilename}.app`
  );
  if (!fs.existsSync(appPath)) {
    throw new Error(`Cannot find application at: ${appPath}`);
  }

  console.log(`Notarizing ${appId} found at ${appPath}`);

  try {
    await notarize({
      appBundleId: appId,
      appPath: appPath,
      appleId: process.env.APPLEID,
      appleIdPassword: process.env.APPLEIDPASS,
    });
  } catch (error) {
    console.error(error);
  }

  console.log(`Done notarizing ${appId}`);
};
