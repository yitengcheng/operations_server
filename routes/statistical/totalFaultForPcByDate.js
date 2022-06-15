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
const quarterOfYear = require("dayjs/plugin/quarterOfYear");
dayjs.extend(quarterOfYear);

router.post("/statistical/count/inspectionByDate", async (ctx) => {
  try {
    const { user } = ctx.state;
    const { type } = ctx.request.body; // type 1 本月 2 本季度 3 本年
    let createTimeParams = {};
    if (type === 1) {
      createTimeParams = {
        $gte: dayjs(dayjs().startOf("month")).toDate(),
        $lte: dayjs(dayjs().endOf("month")).toDate(),
      };
    } else if (type === 2) {
      createTimeParams = {
        $gte: dayjs(dayjs().startOf("quarter")).toDate(),
        $lte: dayjs(dayjs().endOf("quarter")).toDate(),
      };
    } else if (type === 3) {
      createTimeParams = {
        $gte: dayjs(dayjs().startOf("year")).toDate(),
        $lte: dayjs(dayjs().endOf("year")).toDate(),
      };
    }
    const res = await InspectionReport.aggregate()
      .match({
        companyId: mongoose.Types.ObjectId(user.companyId),
        createTime: createTimeParams,
      })
      .group({ _id: { $dateToString: { format: "%Y-%m-%d", date: "$createTime" } }, count: { $sum: 1 } });
    ctx.body = util.success(res);
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;
