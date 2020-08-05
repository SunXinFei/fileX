import utils from '@app/utils';
const Database = require('better-sqlite3');
const fileXDB = new Database(utils.fileXDataPath, { verbose: console.log })

export default class DBManage {

  static dropTable(tableName) {
    const dropTable = fileXDB.prepare(`DROP TABLE IF EXISTS ${tableName}`);
    dropTable.run();
  }

  static createTable(tableName, tableColumns) {
    const createTable = fileXDB.prepare(`CREATE TABLE IF NOT EXISTS ${tableName} (${tableColumns})`);
    createTable.run();
  }

  static getUserToken(username, appType) {
    var stmt = fileXDB.prepare('select userID,username,tokenString from UserToken where username=? and appType=?');
    var row = stmt.get(username, appType);
    console.log('getUserToken: ' + JSON.stringify(row));
    return row;
  }
  
  static saveUserToken(username, appType, tokenString) {
    var stmt = fileXDB.prepare('select userID,username,tokenString from UserToken where username=? and appType=?');
    var row = stmt.get(username, appType);

    if (row) {
      console.log('存在，则更新');
      //存在，则更新
      var stmt = this.db.prepare("update UserToken set tokenString = ? where username=? and appType=?");
      stmt.run(tokenString, username, appType);
    } else {
      console.log('不存在，则插入');
      //不存在，则插入
      var stmt = this.db.prepare("INSERT INTO UserToken (userName,appType,tokenString) VALUES (?,?,?)");
      stmt.run(username, appType, tokenString);
    }
  }
}

/**初始化表结构 */
DBManage.createTable('UserToken', `id TEXT PRIMARY KEY,userID TEXT,username TEXT,tokenString TEXT, appType TEXT`);
