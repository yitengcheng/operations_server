/**
 * 随机数据生成接口
 */
const router = require('koa-router')();
const InspectionReport = require('../../models/inspectionReportSchema');
const InspectionAddress = require('../../models/inspectionAddressSchema');
const User = require('../../models/userSchema');
const Role = require('../../models/roleSchema');
const CompanyTemplate = require('../../models/companyTemplateSchema');
const util = require('../../utils/util');
const _ = require('lodash');
const mock = require('mockjs');
const dayjs = require('dayjs');
const mongoose = require('mongoose');
const config = require('../../config');

router.post('/test/randomData', async (ctx) => {
  const db = mongoose.createConnection(config.URL);
  try {
    const { user } = ctx.state;
    const inspectionAddress = await InspectionAddress.find({ parentId: null });
    const role = await Role.findOne({ name: '运维工人' });
    const assetsTemplate = await CompanyTemplate.findOne({ companyId: user.companyId, type: '1' });
    const guzhangTemplate = await CompanyTemplate.findOne({ companyId: user.companyId, type: '2' });
    let schema = await util.schemaProperty(assetsTemplate.content);
    let guzhangSchema = await util.guzhangSchemaProperty(guzhangTemplate.content);

    let assetsModule = db.model(assetsTemplate.moduleName, schema, assetsTemplate.moduleName);
    let guzhangModule = db.model(guzhangTemplate.moduleName, guzhangSchema, guzhangTemplate.moduleName);

    for (let index = 0; index < 10; index++) {
      const inspectionParentId = _.sample(_.map(inspectionAddress, '_id'));
      const inspectionChildren = await InspectionAddress.find({ parentId: inspectionParentId });
      const inspectionChildrenId = _.sample(_.map(inspectionChildren, '_id'));
      const staff = await User.find({ roleId: role._id });

      const inspectionReport = new InspectionReport({
        companyId: user.companyId,
        parentId: inspectionParentId,
        childrenId: inspectionChildrenId,
        remark: mock.Random.cparagraph(),
        reportUser: _.sample(_.map(staff, '_id')),
        createTime: `2022-0${dayjs().add(1, 'month').month()}-${_.random(1, 30)}`,
      });
      inspectionReport.save();
      const asset = await assetsModule.create(util.createAssets(assetsTemplate.content));
      await guzhangModule.create(
        util.createGuzhang(guzhangTemplate.content, _.sample(_.map(staff, '_id')), asset._id),
      );
    }
    ctx.body = util.success({}, '生成成功');
  } catch (error) {
    ctx.body = util.fail(error.stack);
  } finally {
    db.close();
  }
});

module.exports = router;
