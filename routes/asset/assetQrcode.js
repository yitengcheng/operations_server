/**
 * 资产二维码接口
 */
const router = require("koa-router")();
const CompanyTemplate = require("../../models/companyTemplateSchema");
const util = require("../../utils/util");
const log4j = require("../../utils/log4");
const mongoose = require("mongoose");
const config = require("../../config");
const qr = require("qr-image");
const tts = require("text-to-svg").loadSync();
const path = require("path");
const sharp = require('sharp');

router.post("/assets/downOneQr", async (ctx) => {
  try {
    const { id, key } = ctx.request.body;
    const { user } = ctx.state;
    const companyTemplate = await CompanyTemplate.findOne({ companyId: user.companyId, type: "1" });
    if (!companyTemplate) {
      ctx.body = util.fail("", "请先设置公司资产模板");
      return;
    }
    let schema = await util.schemaProperty(companyTemplate.content);
    const db = mongoose.createConnection(config.URL);
    let assetsModule = db.model(companyTemplate.moduleName, schema, companyTemplate.moduleName);
    const asset = await assetsModule.findById(new mongoose.Types.ObjectId(id));
    const tSvg = Buffer.from(tts.getSVG(asset?.[key], {
      x: 0,
      y: 0,
      fontSize: 30,
      anchor: "top",
    }));
    const qrImage = await sharp(qr.imageSync(`https://yyyw.qiantur.com/applet/companyId=${user.companyId}&assetsId=${id}`, { type: "png" })).resize({ width: 520, height: 520 }).toBuffer();
    const resQR = await sharp(path.join(__dirname, "../../public/images/source.png"))
    .composite([
      {
        input: tSvg,
        top: 890,
        left: 150,
      },
      {
        input: qrImage,
        top: 340,
        left: 150,
      }
    ]).withMetadata() // 在输出图像中包含来自输入图像的所有元数据(EXIF、XMP、IPTC)。
    .webp({
      quality: 90
    }) //使用这些WebP选项来输出图像。
    // .toFile(path.join(__dirname, `../../public/images/${id}.png`))
    .toBuffer()
    .catch(err => {
      console.log(err)
    });
    const imgBase64 = resQR?.toString("base64");
    ctx.body = util.success({ imgBase64: `data:image/png;base64,${imgBase64}` });
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;
