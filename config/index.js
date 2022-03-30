/**
 * 配置文件
 */
module.exports = {
  URL: "mongodb://127.0.0.1:27017/operation_db", // 数据库地址
  unlessList: [
    /^\/api\/app\/login/,
    /^\/api\/addRouter/,
    /^\/api\/addCompany/,
    /^\/api\/applet\/template/,
    /^\/api\/oss\/upload/,
    /^\/api\/applet\/reportFault/,
    /^\/applet\/*/,
  ], // 接口白名单
};
