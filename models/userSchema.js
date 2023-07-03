/**
 * 用户实体
 */
const mongoose = require('mongoose');

const schema = mongoose.Schema({
  nickName: String, // 用户姓名
  password: String, // 用户密码
  username: String, // 登录账户
  avatar: String, // 用户头像
  sex: Number, // 性别
  phonenumber: String, // 电话号码
  registrationId: String, // 推送ID
  companyId: { type: mongoose.Types.ObjectId, ref: 'companys' }, // 公司Id
  roleId: { type: mongoose.Types.ObjectId, ref: 'roles' }, // 角色Id
  status: {
    // 状态 0 启用 1 未启用
    type: Number,
    default: 0,
  },
  loginDate: String, // 上次登录时间
  customerList: [{ type: mongoose.Types.ObjectId, ref: 'customers', default: [] }], // 运维人员负责的客户
});

module.exports = mongoose.model('users', schema, 'users'); // 模型名 schema 数据库集合名
