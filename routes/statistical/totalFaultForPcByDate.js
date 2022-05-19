/**
 * 根据日期统计巡检接口
 */
const router = require("koa-router")();
const CompanyTemplate = require("../../models/companyTemplateSchema");
const InspectionReport = require("../../models/inspectionReportSchema");
const util = require("../../utils/util");
const log4j = require("../../utils/log4");
const mongoose = require("mongoose");
const config = require("../../config");
const _ = require("lodash");
const dayjs = require("dayjs");

router.post("/statistical/count/inspectionByDate", async (ctx) => {
  try {
    const { user } = ctx.state;
    const res = await InspectionReport.aggregate()
      .match({
        companyId: mongoose.Types.ObjectId(user.companyId),
        createTime: {
          $gte: dayjs(dayjs().startOf("month")).toISOString(),
          $lte: dayjs(dayjs().endOf("month")).toISOString(),
        },
      })
      .group({ _id: "$createTime", count: { $sum: 1 } });
    ctx.body = util.success(res);
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;
