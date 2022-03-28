/**
 * 角色实体
 */
const mongoose = require("mongoose");

const schema = mongoose.Schema({
  name: String, // 角色名
});

module.exports = mongoose.model("roles", schema, "roles"); // 模型名 schema 数据库集合名
