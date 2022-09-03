/**
 * 公司模板筛选项接口
 */
const router = require('koa-router')();
const CompanyTemplate = require('../../models/companyTemplateSchema');
const util = require('../../utils/util');
const lodash = require('lodash');

router.post('/template/filter', async (ctx) => {
  try {
    const { type } = ctx.request.body;
    const { user } = ctx.state;
    const res = await CompanyTemplate.findOne({ companyId: user.companyId, type });
    const template = JSON.parse(res.content);
    let result = [];
    lodash.toPairs(template).map((item) => {
      if (item[1]?.hasFilter) {
        result.push({ label: item[0], options: item[1]?.options });
      }
    });
    ctx.body = util.success(result);
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;
