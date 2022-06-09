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

router.get("/downLoad", async (ctx) => {
  try {
    const output = fs.createWriteStream(path.join(__dirname + `../../../public/uploadLocal/123.zip`));
    const archive = archiver("zip", {
      zlib: { level: 9 }, // Sets the compression level.
    });
    archive.pipe(output);
    archive.directory(path.join(__dirname + `../../../public/uploadLocal`), false);
    await archive.finalize();
    ctx.body = util.success({ url: `uploadLocal/123.zip` });
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;
