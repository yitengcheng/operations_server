const putInStorage = require("./putInStorage");
const assetList = require("./assetList");
const delAsset = require("./delAsset");
const assetQrcode = require("./assetQrcode");
const assetQrcodeForPC = require("./assetQrcodeForPC");
const assetById = require("./assetById");
const assetListByField = require("./assetListByField");

module.exports = {
  putInStorage,
  assetList,
  delAsset,
  assetQrcode,
  assetQrcodeForPC,
  assetById,
  assetListByField,
};
