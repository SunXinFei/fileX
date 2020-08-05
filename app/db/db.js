import utils from '@app/utils';
import { resolve } from 'path'
const Database = require('better-sqlite3');
import fs from  "fs";
const initSql = fs.readFileSync(resolve(__dirname, '../app/db/db.sql'), 'utf8');

export default class DBManage {
  constructor(options = {}) {
    this.options = options
    this.dbClient = null
    this.init()
  }

  init() {
    console.log(utils.fileXDataPath,'fileXDataPath')
    this.dbClient = new Database(utils.fileXDataPath, { verbose: console.log })
    this.dbClient.exec(initSql);
  }

  dropTable(tableName) {
    const dropTable = this.dbClient.prepare(`DROP TABLE IF EXISTS ${tableName}`);
    dropTable.run();
  }

  createTable(tableName, tableColumns) {
    const createTable = this.dbClient.prepare(`CREATE TABLE IF NOT EXISTS ${tableName} (${tableColumns})`);
    createTable.run();
  }
  /**
   * 通过路径获取文件表id
   * @param {Object} file 
   * @return {String} fileId
   */
  getFilePathId(file) {
    let stmt = this.dbClient.prepare('select id from file where path=? and isDelete=0');
    let row = stmt.get(file.path);
    if (row) {
      return row.id
    } else {
      let stmt = this.dbClient.prepare("INSERT INTO file (id,path,modificationTime,desc) VALUES (?,?,?,?)");
      stmt.run(file.id, file.path, file.modificationTime, file.desc);
      return file.id
    }
  }
  /**
   * 获取文件描述
   * @param {Object} file 文件对象
   * @return {String} desc 文件描述
   */
  getDesc(file){
    let fileId = this.getFilePathId(file)
    let stmt = this.dbClient.prepare('select desc from file where id=? and isDelete=0');
    let row = stmt.get(fileId);
    return row.desc
  }
  /**
   * 保存文件描述
   * @param {Object} file 文件对象
   * @param {String} desc 文件描述
   */
  saveDesc(file, desc){
    let fileId = this.getFilePathId(file)
    //存在，则更新
    let stmt = this.dbClient.prepare("update file set desc=? where id=?");
    stmt.run(desc, fileId);
  }

  saveTags(fileId, tags) {
    var stmt = this.dbClient.prepare('select userID,username,tokenString from UserToken where username=? and appType=?');
    var row = stmt.get(username, appType);

    if (row) {
      console.log('存在，则更新');
      //存在，则更新
      var stmt = this.dbClient.prepare("update UserToken set tokenString = ? where username=? and appType=?");
      stmt.run(tokenString, username, appType);
    } else {
      console.log('不存在，则插入');
      //不存在，则插入
      var stmt = this.db.prepare("INSERT INTO UserToken (userName,appType,tokenString) VALUES (?,?,?)");
      stmt.run(username, appType, tokenString);
    }
  }

  getTags() {

  }

  getUserToken(username, appType) {
    var stmt = this.dbClient.prepare('select userID,username,tokenString from UserToken where username=? and appType=?');
    var row = stmt.get(username, appType);
    console.log('getUserToken: ' + JSON.stringify(row));
    return row;
  }

  saveUserToken(username, appType, tokenString) {
    var stmt = this.dbClient.prepare('select userID,username,tokenString from UserToken where username=? and appType=?');
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