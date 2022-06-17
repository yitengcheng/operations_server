/**
 * 故障工单总数接口
 */
const router = require("koa-router")();
const CompanyTemplate = require("../../models/companyTemplateSchema");
const util = require("../../utils/util");
const log4j = require("../../utils/log4");
const mongoose = require("mongoose");
const config = require("../../config");
const dayjs = require("dayjs");
const quarterOfYear = require("dayjs/plugin/quarterOfYear");
dayjs.extend(quarterOfYear);

router.post("/report/app/fault", async (ctx) => {
  const db = mongoose.createConnection(config.URL);
  try {
    const { user } = ctx.state;
    const { type } = ctx.request.body; // type 1 本月 2 本季度 3 本年
    const companyTemplate = await CompanyTemplate.findOne({ companyId: user.companyId, type: "2" });
    if (!companyTemplate) {
      ctx.body = util.fail("", "请先设置公司故障模板");
      return;
    }
    let createTimeParams = {};
    if (type === 1) {
      createTimeParams = {
        createTime: { $gte: dayjs(dayjs().startOf("month")).toDate(), $lte: dayjs(dayjs().endOf("month")).toDate() },
      };
    } else if (type === 2) {
      createTimeParams = {
        createTime: {
          $gte: dayjs(dayjs().startOf("quarter")).toDate(),
          $lte: dayjs(dayjs().endOf("quarter")).toDate(),
        },
      };
    } else if (type === 3) {
      createTimeParams = {
        createTime: {
          $gte: dayjs(dayjs().startOf("year")).toDate(),
          $lte: dayjs(dayjs().endOf("year")).toDate(),
        },
      };
    }
    let schema = await util.guzhangSchemaProperty(companyTemplate.content);
    let faultModule = db.model(companyTemplate.moduleName, schema, companyTemplate.moduleName);
    const faultTotal = await faultModule.countDocuments(createTimeParams);
    const faultCompleteTotal = await faultModule.countDocuments({ status: 2, ...createTimeParams });
    const faultPendingTotal = await faultModule.countDocuments({ status: 1, ...createTimeParams });
    const faultRefuseTotal = await faultModule.countDocuments({ status: 3, ...createTimeParams });
    ctx.body = util.success({ faultTotal, faultCompleteTotal, faultPendingTotal, faultRefuseTotal });
  } catch (error) {
    ctx.body = util.fail(error.stack);
  } finally {
    db.close();
  }
});

module.exports = router;
