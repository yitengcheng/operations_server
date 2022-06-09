const inspectionStatistical = require("./inspectionStatistical");
const assetCount = require("./assetCount");
const faultCount = require("./faultCount");
const totalCountForPc = require("./totalCountForPc");
const totalAssetsForPc = require("./totalAssetsForPc");
const totalFaultForPc = require("./totalFaultForPc");
const totalFaultForPcByDate = require("./totalFaultForPcByDate");
const totalAssetsByField = require("./totalAssetsByField");

module.exports = {
  inspectionStatistical,
  assetCount,
  faultCount,
  totalCountForPc,
  totalAssetsForPc,
  totalFaultForPc,
  totalFaultForPcByDate,
  totalAssetsByField,
};
