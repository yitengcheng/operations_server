/**
 * 根据日期统计故障工单接口
 */
const router = require("koa-router")();
const CompanyTemplate = require("../../models/companyTemplateSchema");
const util = require("../../utils/util");
const log4j = require("../../utils/log4");
const mongoose = require("mongoose");
const config = require("../../config");
const _ = require("lodash");
const dayjs = require("dayjs");

router.post("/statistical/count/faultByDate", async (ctx) => {
  try {
    const { user } = ctx.state;
    const faultTemplate = await CompanyTemplate.findOne({ companyId: user.companyId, type: "2" });
    let faultSchema = await util.schemaProperty(faultTemplate.content);
    const db = mongoose.createConnection(config.URL);
    let faultModule = db.model(faultTemplate.moduleName, faultSchema, faultTemplate.moduleName);
    const res = await faultModule
      .aggregate()
      .match({
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
