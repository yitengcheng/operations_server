/**
 * 巡检统计接口
 */
const router = require("koa-router")();
const InspectionReport = require("../../models/inspectionReportSchema");
const util = require("../../utils/util");
const log4j = require("../../utils/log4");
const mongoose = require("mongoose");
const config = require("../../config");

router.post("/report/app/patrol", async (ctx) => {
  try {
    const { addressId } = ctx.request.body;
    const { user } = ctx.state;
    let params, lookupParams, matchParams;
    if (addressId) {
      matchParams = {
        companyId: new mongoose.Types.ObjectId(user.companyId),
        parentId: new mongoose.Types.ObjectId(addressId),
      };
      params = {
        _id: "$childrenId",
        count: { $sum: 1 },
      };
      lookupParams = {
        from: "inspectionAddress",
        localField: "_id",
        foreignField: "_id",
        as: "address",
      };
    } else {
      matchParams = {
        companyId: new mongoose.Types.ObjectId(user.companyId),
      };
      params = {
        _id: "$parentId",
        count: { $sum: 1 },
      };
      lookupParams = {
        from: "inspectionAddress",
        localField: "_id",
        foreignField: "_id",
        as: "address",
      };
    }
    const res = await InspectionReport.aggregate().match(matchParams).group(params).lookup(lookupParams);
    ctx.body = util.success(res);
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;
