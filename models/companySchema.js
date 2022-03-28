/**
 * 公司实体
 */
const mongoose = require("mongoose");

const schema = mongoose.Schema({
  companyName: String, // 公司名
  legalPersonName: String, // 法人名
  contactPhone: String, // 联系方式
  SMSPlatformId: String, // 短信平台抬头ID
});

module.exports = mongoose.model("companys", schema, "companys"); // 模型名 schema 数据库集合名
