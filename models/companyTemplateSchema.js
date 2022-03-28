/**
 * 公司模板实体
 */
const mongoose = require("mongoose");

const schema = mongoose.Schema({
  companyId: { type: mongoose.Types.ObjectId, ref: "companys", index: true }, // 公司Id
  type: String, // 模板类型 1 资产模板 2 故障模板
  moduleName: String, // module名
  content: String, // 模板信息
  createTime: String, // 创建时间
});

module.exports = mongoose.model("companyTemplate", schema, "companyTemplate"); // 模型名 schema 数据库集合名
