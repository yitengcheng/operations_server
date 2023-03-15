/**
 * 下载部门/人员领用汇总表接口
 */
const router = require('koa-router')();
const outboundOrderSchema = require('../../models/outboundOrderSchema');
const outboundOrderItemSchema = require('../../models/outboundOrderItemSchema');
const util = require('../../utils/util');
const lodash = require('lodash');
const xlsx = require('xlsx');
const path = require('path');
const dayjs = require('dayjs');

router.post('/outboundOrder/downAccessTable', async (ctx) => {
  try {
    const { user } = ctx.state;
    const { params } = ctx.request.body;
    const timeParams = util.timeQuery(params?.outboundTime, 'outboundTime');
    delete params?.outboundTime;
    const outboundOrders = await outboundOrderSchema.find({
      ...timeParams,
      ...params,
      belongs: user?.belongs ?? user._id,
      delFlag: false,
      status: 4,
    });
    const outboundIds = lodash.map(outboundOrders, '_id');
    const res = await outboundOrderItemSchema
      .find({ belongs: user?.belongs ?? user._id, delFlag: false, outboundOrderId: { $in: outboundIds } })
      .populate([{ path: 'goodId', populate: ['unit', 'classification'] }]);
    let excel = [];
    lodash.map(res, (item) => {
      excel.push({
        日期: item?.outboundTime ? dayjs(item?.outboundTime).format('YYYY年MM月DD日 HH:mm:ss') : '暂无',
        物品名称: item?.goodId?.name ?? '暂无',
        规格型号: item?.goodId?.models ?? '暂无',
        单位: item?.goodId?.unit?.name ?? '暂无',
        数量: item?.goodNum ?? '暂无',
        物品分类: item?.goodId?.classification?.name ?? '暂无',
        备注: item?.remark ?? '暂无',
      });
    });
    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(excel);
    xlsx.utils.book_append_sheet(wb, ws, '领用汇总表');
    let fileName = `领用汇总表${dayjs().format('YYYYMMDDHHmmss')}.xlsx`;
    await xlsx.writeFile(wb, path.join(`${__dirname}../../../public/zip/${fileName}`));
    ctx.body = util.success({ url: `zip/${fileName}` });
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;
