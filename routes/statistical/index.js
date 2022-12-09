const inspectionStatistical = require('./inspectionStatistical');
const assetCount = require('./assetCount');
const faultCount = require('./faultCount');
const totalAssetsCountForPc = require('./totalAssetsCountForPc');
const totalFaultCountForPc = require('./totalFaultCountForPc');
const totalReportCountForPc = require('./totalReportCountForPc');
const totalNormalReportCountForPc = require('./totalNormalReportCountForPc');
const totalServiceReportCountForPc = require('./totalServiceReportCountForPc');
const totalAssetsForPc = require('./totalAssetsForPc');
const totalFaultForPc = require('./totalFaultForPc');
const totalFaultForPcByDate = require('./totalFaultForPcByDate');
const totalAssetsByField = require('./totalAssetsByField');
const totalFaultByField = require('./totalFaultByField');
const totalFaultByFeildForPc = require('./totalFaultByFeildForPc');
// 库管统计相关接口
const stockStatisticalNumber = require('./stockStatisticalNumber');
const stockWarringStatistical = require('./stockWarringStatistical');

module.exports = {
  inspectionStatistical,
  assetCount,
  faultCount,
  totalAssetsCountForPc,
  totalFaultCountForPc,
  totalReportCountForPc,
  totalNormalReportCountForPc,
  totalServiceReportCountForPc,
  totalAssetsForPc,
  totalFaultForPc,
  totalFaultForPcByDate,
  totalAssetsByField,
  totalFaultByField,
  totalFaultByFeildForPc,
  stockStatisticalNumber,
  stockWarringStatistical,
};
