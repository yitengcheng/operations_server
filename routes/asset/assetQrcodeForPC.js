/**
 * PC端批量下载二维码接口
 */
const router = require("koa-router")();
const CompanyTemplate = require("../../models/companyTemplateSchema");
const Company = require("../../models/companySchema");
const util = require("../../utils/util");
const log4j = require("../../utils/log4");
const mongoose = require("mongoose");
const config = require("../../config");
const qr = require("qr-image");
const tts = require("text-to-svg").loadSync();
const path = require("path");
const sharp = require("sharp");
const fs = require("fs");
const _ = require("lodash");
const archiver = require("archiver");

router.post("/assets/downQr", async (ctx) => {
  const db = mongoose.createConnection(config.URL);
  try {
    const { showKey, classify } = ctx.request.body;
    const { user } = ctx.state;
    const company = await Company.findById(user.companyId);
    const companyTemplate = await CompanyTemplate.findOne({ companyId: user.companyId, type: "1" });
    if (!companyTemplate) {
      ctx.body = util.fail("", "请先设置公司资产模板");
      return;
    }
    let schema = await util.schemaProperty(companyTemplate.content);
    let assetsModule = db.model(companyTemplate.moduleName, schema, companyTemplate.moduleName);
    const assets = await assetsModule.find();
    assets.map(async (asset) => {
      const idKey = _.random(1, 9999);
      const reaPath = `../../public/zip/${company.companyName}/${asset?.[classify]}`;
      const absPath = path.resolve(__dirname, reaPath);
      fs.mkdirSync(absPath, { recursive: true });
      const tSvg = Buffer.from(
        tts.getSVG(asset?.[showKey], {
          x: 0,
          y: 0,
          fontSize: 30,
          anchor: "top",
        })
      );
      const qrImage = await sharp(
        qr.imageSync(`https://yyyw.qiantur.com/applet/companyId=${user.companyId}&assetsId=${asset._id}`, {
          type: "png",
        })
      )
        .resize({ width: 520, height: 520 })
        .toBuffer();

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
          },
        ])
        .withMetadata() // 在输出图像中包含来自输入图像的所有元数据(EXIF、XMP、IPTC)。
        .webp({
          quality: 90,
        }) //使用这些WebP选项来输出图像。
        .toFile(path.join(__dirname, `${reaPath}/${asset?.[showKey]}${idKey}.png`))
        // .toBuffer()
        .catch((err) => {
          console.log(err);
        });
    });
    const output = fs.createWriteStream(path.join(__dirname + `../../../public/zip/${company.companyName}.zip`));
    const archive = archiver("zip", {
      zlib: { level: 9 }, // Sets the compression level.
    });
    archive.pipe(output);
    archive.directory(path.join(__dirname + `../../../public/zip/${company.companyName}`), false);
    await archive.finalize();
    ctx.body = util.success({ url: `zip/${company.companyName}.zip` });
  } catch (error) {
    ctx.body = util.fail(error.stack);
  } finally {
    db.close();
  }
});

module.exports = router;
