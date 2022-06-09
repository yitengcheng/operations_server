/**
 * 根据分类以及状态统计资产接口
 */
const router = require("koa-router")();
const CompanyTemplate = require("../../models/companyTemplateSchema");
const util = require("../../utils/util");
const log4j = require("../../utils/log4");
const mongoose = require("mongoose");
const config = require("../../config");
const _ = require("lodash");
const dayjs = require("dayjs");

router.post("/statistical/count/assetsByField", async (ctx) => {
  try {
    const { user } = ctx.state;
    const { classification, status } = ctx.request.body;
    const assetsTemplate = await CompanyTemplate.findOne({ companyId: user.companyId, type: "1" });
    let assetsSchema = await util.schemaProperty(assetsTemplate.content);
    const db = mongoose.createConnection(config.URL);
    let assetsModule = db.model(assetsTemplate.moduleName, assetsSchema, assetsTemplate.moduleName);
    const classifyRes = await assetsModule.aggregate().group({ _id: `$${classification}`, total: { $sum: 1 } });
    const classifyList = _.map(classifyRes, "_id");
    let res = {};
    for (const [index, classify] of classifyList.entries()) {
      res[classify] = {
        total: classifyRes?.[index]?.total,
        status: await assetsModule
          .aggregate()
          .match({ [classification]: classify })
          .group({ _id: `$${status}`, count: { $sum: 1 } }),
      };
    }
    ctx.body = util.success(res);
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;
