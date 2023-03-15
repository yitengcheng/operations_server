/**
 * 下载超限库存预警列表接口
 */
const router = require('koa-router')();
const goodsSchema = require('../../models/goodsSchema');
const util = require('../../utils/util');
const xlsx = require('xlsx');
const path = require('path');
const dayjs = require('dayjs');
const lodash = require('lodash');

router.post('/goods/downGoodWarringTable', async (ctx) => {
  try {
    const { user } = ctx.state;
    const { params } = ctx.request.body;
    const res = await goodsSchema
      .find({
        $or: [
          { $expr: { $gt: ['$inventoryNumber', '$inventoryMax'] } },
          { $expr: { $lt: ['$inventoryNumber', '$inventoryMin'] } },
        ],
        belongs: user?.belongs ?? user._id,
        delFlag: false,
      })
      .populate(['supplierId', 'unit', 'classification']);
    let excel = [];
    lodash.map(res, (item) => {
      excel.push({
        物品名称: item?.name ?? '暂无',
        物品分类: item?.classification?.name ?? '暂无',
        规格型号: item?.models ?? '暂无',
        单位: item?.unit?.name ?? '暂无',
        库存数量: item?.inventoryNumber ?? '暂无',
        库存上限: item?.inventoryMax ?? '暂无',
        库存下限: item?.inventoryMin ?? '暂无',
        备注: item?.remark ?? '暂无',
      });
    });
    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(excel);
    xlsx.utils.book_append_sheet(wb, ws, '超限库存预警汇总表');
    let fileName = `超限库存预警汇总表${dayjs().format('YYYYMMDDHHmmss')}.xlsx`;
    await xlsx.writeFile(wb, path.join(`${__dirname}../../../public/zip/${fileName}`));
    ctx.body = util.success({ url: `zip/${fileName}` });
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;
