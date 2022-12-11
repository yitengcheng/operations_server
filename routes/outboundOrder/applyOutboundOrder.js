/**
 * 申领物品接口
 */
const router = require('koa-router')();
const util = require('../../utils/util');
const outboundOrderItemSchema = require('../../models/outboundOrderItemSchema');
const outboundOrderSchema = require('../../models/outboundOrderSchema');
const goodsSchema = require('../../models/goodsSchema');
const employeesSchema = require('../../models/employeesSchema');
const branchQuotaSchema = require('../../models/branchQuotaSchema');
const lodash = require('lodash');
const dayjs = require('dayjs');
const auditUserSchema = require('../../models/auditUserSchema');
const auditStatusSchema = require('../../models/auditStatusSchema');

router.post('/outboundOrder/applyOutboundOrder', async (ctx) => {
  try {
    const { orderNo, remark, goodIds } = ctx.request.body;
    const { user } = ctx.state;
    const employee = await employeesSchema.findById(user._id);
    const newOutboundOrder = await outboundOrderSchema.create({
      orderNo,
      receiveUser: user._id,
      remark,
      receiveDepartment: employee?.departmentId,
      belongs: user?.belongs ?? user._id,
      delFlag: false,
      status: 1,
      applyTime: new Date(),
    });
    let outboundItems = [];
    for (const good of goodIds) {
      const res = await outboundOrderItemSchema.create({
        belongs: user?.belongs ?? user._id,
        delFlag: false,
        outboundOrderId: newOutboundOrder._id,
        goodId: good?.id,
        goodNum: good?.goodNum,
      });
      outboundItems.push(res._id);
    }
    let auditStatusList = [];
    let status = 1;
    const localAuditList = await auditUserSchema.findOne({ belongs: user?.belongs ?? user._id });
    if (localAuditList?.auditUserList) {
      for (const localAudit of localAuditList?.auditUserList) {
        const res = await auditStatusSchema.create({
          belongs: user?.belongs ?? user._id,
          delFlag: false,
          auditUser: localAudit,
          auditStatus: 1,
          outboundOrderId: newOutboundOrder._id,
        });
        auditStatusList.push(res._id);
      }
    } else {
      status = 3;
    }
    await outboundOrderSchema.updateOne(
      { _id: newOutboundOrder._id },
      {
        outboundItems: outboundItems,
        auditStatusList: auditStatusList,
        numberTotal: lodash.sumBy(goodIds, 'goodNum'),
        amountTotal: lodash.sumBy(goodIds, (o) => {
          return o.goodNum * o.price;
        }),
        status: status,
      },
    );

    ctx.body = util.success({}, '物品已申领，请等待审核');
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;
