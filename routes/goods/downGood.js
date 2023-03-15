/**
 * 下载物品清单接口
 */
const router = require('koa-router')();
const goodsSchema = require('../../models/goodsSchema');
const util = require('../../utils/util');
const xlsx = require('xlsx');
const path = require('path');
const lodash = require('lodash');
const dayjs = require('dayjs');

router.post('/goods/downGood', async (ctx) => {
  try {
    const { user } = ctx.state;
    const { params } = ctx.request.body;
    let zeroParams = {};
    let fuzzyQuery = {};
    if (params?.keyword) {
      fuzzyQuery = util.fuzzyQuery(['name', 'models'], params?.keyword);
      delete params?.keyword;
    }
    if (params?.zero) {
      zeroParams = { inventoryNumber: { $gt: 0 } };
      delete params.zero;
    }
    const res = await goodsSchema
      .find(
        { ...params, ...zeroParams, ...fuzzyQuery, belongs: user?.belongs ?? user._id, delFlag: false },
        { _id: 0, __v: 0, delFlag: 0, belongs: 0 },
      )
      .populate(['supplierId', 'unit', 'classification']);
    let excel = [];
    lodash.map(res, (item) => {
      excel.push({
        物品名称: item?.name ?? '暂无',
        规格型号: item?.models ?? '暂无',
        单位: item?.unit?.name ?? '暂无',
        供应商: item?.supplierId?.name ?? '暂无',
        物品分类: item?.classification?.name ?? '暂无',
        是否为固定资产: item?.hasFixed ? '是' : '否',
        固定资产编号: item?.fixedNumber ?? '暂无',
        品牌: item?.brand ?? '暂无',
        单价: item?.price ?? '暂无',
        库存数量: item?.inventoryNumber ?? '0',
        库存上限: item?.inventoryMax ?? '0',
        库存下限: item?.inventoryMin ?? '0',
        备注: item?.remark ?? '暂无',
      });
    });
    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(excel);
    xlsx.utils.book_append_sheet(wb, ws, '物品');
    let fileName = `物品${dayjs().format('YYYYMMDDHHmmss')}.xlsx`;
    await xlsx.writeFile(wb, path.join(`${__dirname}../../../public/zip/${fileName}`));
    ctx.body = util.success({ url: `zip/${fileName}` });
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;
