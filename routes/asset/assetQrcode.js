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
const svg2png = require("svg2png");
const images = require("images");
const path = require("path");

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
    const asset = await assetsModule.findById(id);
    const tSvg = tts.getSVG(asset?.[key], {
      x: 0,
      y: 0,
      fontSize: 30,
      anchor: "top",
    });
    const margin = 160; // 二维码的左右边距
    const top = 340; // 二维码距顶部的距离
    const sourceImage = images(path.join(__dirname, "../../public/images/source.png"));
    const w = sourceImage.width(); // 模板图片的宽度
    const resQR = await svg2png(tSvg)
      .then((rst) => {
        const textImage = images(rst);
        const qrImage = images(
          qr.imageSync(`https://yyyw.qiantur.com/applet/companyId=${user.companyId}&assetsId=${id}`, { type: "png" })
        ).size(w - margin * 2); // 二维码的尺寸为：模板图片的宽度减去左右边距
        return (
          sourceImage
            .draw(qrImage, margin, top) // 二维码的位置：x=左边距，y=top
            .draw(textImage, (w - textImage.width()) / 2, top + qrImage.height() + 5) // 底部文字，x为居中显示，y=top+二维码的高度+10
            // .save("test.png", { quality: 90 });
            .encode("png", { quality: 90 })
        );
      })
      .catch((e) => console.error(e));
    const imgBase64 = resQR?.toString("base64");
    ctx.body = util.success({ imgBase64: `data:image/png;base64,${imgBase64}` });
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;
