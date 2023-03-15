/**
 * 下载库存收发结存汇总列表接口
 */
const router = require('koa-router')();
const goodsSchema = require('../../models/goodsSchema');
const util = require('../../utils/util');
const xlsx = require('xlsx');
const path = require('path');
const dayjs = require('dayjs');
const lodash = require('lodash');
const outboundOrderItemSchema = require('../../models/outboundOrderItemSchema');
const godownEntryItemSchema = require('../../models/godownEntryItemSchema');

router.post('/goods/downGoodBalanceTable', async (ctx) => {
  try {
    const { user } = ctx.state;
    const { time } = ctx.request.body;
    const outboundTimeParams = util.timeQuery(time, 'outboundTime');
    const godownEntryTimeParams = util.timeQuery(time, 'storageTime');
    const goods = await goodsSchema.find({ belongs: user?.belongs ?? user._id, delFlag: false }).populate(['unit']);
    let res = [];

    for (const good of goods) {
      const outboundItemsList = await outboundOrderItemSchema
        .find({
          belongs: user?.belongs ?? user._id,
          delFlag: false,
          goodId: good?._id,
        })
        .populate([{ path: 'outboundOrderId', match: { status: 4, ...outboundTimeParams } }]);
      const godownEntryItemsList = await godownEntryItemSchema
        .find({
          belongs: user?.belongs ?? user._id,
          delFlag: false,
          goodId: good?._id,
        })
        .populate([{ path: 'godownEntryId', match: { status: 1, ...godownEntryTimeParams } }]);
      res.push({ ...good?._doc, outboundItemsList, godownEntryItemsList });
    }
    let data = [];
    res?.map((item) => {
      data.push({
        key: item?._id,
        goodName: item?.name,
        goodModels: item?.models,
        goodUnit: item?.unit?.name,
        outboundNum: lodash.sumBy(
          lodash.filter(item?.outboundItemsList, (o) => {
            return !lodash.isNull(o?.outboundOrderId);
          }),
          'goodNum',
        ),
        godownEntryNum: lodash.sumBy(
          lodash.filter(item?.godownEntryItemsList, (o) => {
            return !lodash.isNull(o?.godownEntryId);
          }),
          'goodNum',
        ),
        goodPrice: item?.price,
        inventoryNumber: item?.inventoryNumber,
        startNumber:
          item?.inventoryNumber +
          lodash.sumBy(
            lodash.filter(item?.outboundItemsList, (o) => {
              return !lodash.isNull(o?.outboundOrderId);
            }),
            'goodNum',
          ) -
          lodash.sumBy(
            lodash.filter(item?.godownEntryItemsList, (o) => {
              return !lodash.isNull(o?.godownEntryId);
            }),
            'goodNum',
          ),
      });
    });
    let excel = [];
    lodash.map(data, (item) => {
      excel.push({
        物品名称: item?.goodName ?? '暂无',
        规格: item?.goodModels ?? '暂无',
        单位: item?.goodUnit ?? '暂无',
        期初库存: item?.startNumber ?? '暂无',
        本期入库: item?.godownEntryNum ?? '暂无',
        本期出库: item?.outboundNum ?? '暂无',
        期末库存: item?.inventoryNumber ?? '暂无',
      });
    });
    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(excel);
    xlsx.utils.book_append_sheet(wb, ws, '收发结存汇总表');
    let fileName = `收发结存汇总表${dayjs().format('YYYYMMDDHHmmss')}.xlsx`;
    await xlsx.writeFile(wb, path.join(`${__dirname}../../../public/zip/${fileName}`));
    ctx.body = util.success({ url: `zip/${fileName}` });
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;
