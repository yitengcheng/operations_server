/**
 * 数据库连接
 */

const mongoose = require('mongoose');
const config = require('./index');
const log4j = require('../utils/log4')

async function main() {
  await mongoose.connect(config.URL);
}

main().catch((err) => log4j.error(`数据库连接失败:${err}`));
main().then(() => log4j.info(`数据库连接成功`));