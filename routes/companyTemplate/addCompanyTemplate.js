/**
 * 添加/修改 公司模板接口
 */
const router = require('koa-router')();
const CompanyTemplate = require('../../models/companyTemplateSchema');
const Company = require('../../models/companySchema');
const Role = require('../../models/roleSchema');
const util = require('../../utils/util');
const { pinyin } = require('pinyin-pro');
const dayjs = require('dayjs');

router.post('/template/insert', async (ctx) => {
  try {
    const { type, content, id } = ctx.request.body;
    const { user } = ctx.state;
    const role = await Role.findById(user.roleId);
    if (role.name === '运维工人') {
      ctx.body = util.fail('', '你的权限不能添加/修改模板');
      return;
    }
    const company = await Company.findById(user.companyId);
    if (!company) {
      ctx.body = util.fail('', '公司不存在，请联系管理员');
    }
    const moduleName = pinyin(`${company.companyName}${company.legalPersonName}${type === 1 ? '资产' : '故障'}`, {
      toneType: 'none',
      type: 'array',
    }).join('');
    if (id) {
      const updateRes = await CompanyTemplate.findByIdAndUpdate(id, { $set: { content } }, { new: true });
      if (updateRes) {
        ctx.body = util.success(updateRes, '修改成功');
      } else {
        ctx.body = util.fail('', '修改失败');
      }
    } else {
      const addRes = new CompanyTemplate({
        content,
        moduleName,
        companyId: user.companyId,
        type,
        createTime: dayjs().format('YYYY-MM-DD'),
      });
      addRes.save();
      ctx.body = util.success({}, '添加成功');
    }
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;
