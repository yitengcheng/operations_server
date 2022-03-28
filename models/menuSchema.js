/**
 * 菜单实体
 */
const mongoose = require("mongoose");

const schema = mongoose.Schema({
  name: String, // 菜单路径
  menuType: String, // 菜单类型 M 底部导航 C 普通路由
  roleId: [{ type: mongoose.Types.ObjectId, ref: "roles" }], // 角色Id
});

module.exports = mongoose.model("menus", schema, "menus"); // 模型名 schema 数据库集合名
