/**
 * 批量录入出库单
 */
const router = require('koa-router')();
const util = require('../../utils/util');
const koaBody = require('koa-body');
const path = require('path');
const fs = require('fs');
const xlsx = require('xlsx');
const config = require('../../config');
const goodsSchema = require('../../models/goodsSchema');
const employeesSchema = require('../../models/employeesSchema');
const optionSchema = require('../../models/optionSchema');
const outboundOrderSchema = require('../../models/outboundOrderSchema');
const outboundOrderItemSchema = require('../../models/outboundOrderItemSchema');
const dayjs = require('dayjs');

router.post(
  '/upload/inserOutboundOrder',
  koaBody({
    // 支持文件格式
    multipart: true,
    formidable: {
      // 上传目录
      uploadDir: path.join(__dirname, '../../public/upload'),
      // 保留文件扩展名
      keepExtensions: true,
      maxFileSize: 52428800,
    },
  }),
  async (ctx) => {
    try {
      const { file } = ctx.request.files;
      const { user } = ctx.state;
      const workbook = xlsx.readFile(file.path);
      const data = xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
      for (const item of data) {
        let outboundType = await optionSchema.findOne({
          belongs: user?.belongs ?? user._id,
          delFlag: false,
          name: item?.['出库类型'],
          type: 2,
        });
        const employee = await employeesSchema.findOne({
          belongs: user?.belongs ?? user._id,
          delFlag: false,
          account: item?.['领用人账号'],
        });
        const newOutboundOrder = await outboundOrderSchema.create({
          outboundTime: dayjs(item?.['出库时间']).format('YYYY-MM-DD'),
          orderNo: `CK${dayjs().format('YYYYMMDDHHmmssSSS')}`,
          outboundType: outboundType?._id,
          receiveUser: employee?._id,
          receiveDepartment: employee?.departmentId,
          voucherUser: user._id,
          belongs: user?.belongs ?? user._id,
          delFlag: false,
          status: 4,
        });
        let good = await goodsSchema.findOne({
          belongs: user?.belongs ?? user._id,
          delFlag: false,
          name: item?.['物品名称'],
        });
        let classification = await optionSchema.findOne({
          belongs: user?.belongs ?? user._id,
          delFlag: false,
          name: item?.['物品分类'],
          type: 4,
        });
        let outboundItems = [];
        const outboundOrderItem = await outboundOrderItemSchema.create({
          belongs: user?.belongs ?? user._id,
          delFlag: false,
          outboundOrderId: newOutboundOrder._id,
          remark: item?.['备注'],
          goodId: good?.id,
          goodNum: item?.['领用数量'],
        });
        const localGood = await goodsSchema.findById(good?._id);
        if (localGood?.inventoryNumber < good?.goodNum) {
          await outboundOrderItemSchema.remove({ outboundOrderId: newOutboundOrder._id });
          await outboundOrderSchema.remove({ _id: newOutboundOrder._id });
          ctx.body = util.fail({}, `出库失败${localGood?.name}库存数量不足`);
          return;
        }
        await goodsSchema.findByIdAndUpdate(good?._id, { $inc: { inventoryNumber: item?.['领用数量'] * -1 } });
        outboundItems.push(outboundOrderItem._id);
        await outboundOrderSchema.updateOne(
          { _id: newOutboundOrder._id },
          {
            outboundItems: outboundItems,
            numberTotal: item?.['领用数量'],
            amountTotal: item?.['领用数量'] * good?.price,
          },
        );
      }
      fs.unlinkSync(file.path);
      ctx.body = util.success({}, `批量导入完成，请注意核查`);
    } catch (error) {
      ctx.body = util.fail(error.stack);
    }
  },
);

module.exports = router;
