/**
 * 批量录入资产
 */
const router = require('koa-router')();
const util = require('../../utils/util');
const koaBody = require('koa-body');
const path = require('path');
const fs = require('fs');
const xlsx = require('xlsx');
const CompanyTemplate = require('../../models/companyTemplateSchema');
const customerSchema = require('../../models/customerSchema');
const { default: mongoose } = require('mongoose');
const config = require('../../config');

router.post(
  '/upload/insertAsstes',
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
    const db = mongoose.createConnection(config.URL);
    try {
      const { file } = ctx.request.files;
      const { user } = ctx.state;
      const companyTemplate = await CompanyTemplate.findOne({ companyId: user.companyId, type: '1' });
      if (!companyTemplate) {
        ctx.body = util.fail('', '请先设置公司资产模板');
        return;
      }
      let schema = await util.schemaProperty(companyTemplate.content);
      let assetsModule = db.model(companyTemplate.moduleName, schema, companyTemplate.moduleName);
      const workbook = xlsx.readFile(file.path);
      const data = xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
      let result = [];
      for (const item of data) {
        const res = await customerSchema.findOne({ name: item?.['所属客户'] });
        item['customerId'] = res?._id;
        delete item?.['所属客户'];
        result.push(item);
      }
      fs.unlinkSync(file.path);
      const res = await assetsModule.insertMany(result);
      ctx.body = util.success({}, `成功插入${res?.length ?? '0'}条`);
    } catch (error) {
      ctx.body = util.fail(error.stack);
    } finally {
      db.close();
    }
  },
);

module.exports = router;
