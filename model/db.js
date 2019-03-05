const MongoClient = require('mongodb').MongoClient
const ObjectID=require('mongodb').ObjectID
const Config = require('./config')

class Db {
    static getInstance() { // 单例
        if (!Db.instance) {
            Db.instance = new Db()
        }
        return Db.instance
    }
    constructor() {
        this.dbClient = '' // 属性：放DB对象
        this.connect() // 实例化时就连接数据库
    }
    connect() {
        const _that = this
        return new Promise((resolve, reject) => {
            if (!_that.dbClient) { // 解决数据库多次连接的问题
                MongoClient.connect(Config.url, (err, client) => {
                    if (err) {
                        reject(err)
                    } else {
                        _that.dbClient = client.db(Config.dbName)
                        resolve(_that.dbClient)
                    }
                })
            } else {
                resolve(_that.dbClient)
            }
        })
    }
    find(collectionNM, json) {
        return new Promise((resolve, reject) => {
            this.connect().then((db) => {
                let result = db.collection(collectionNM).find(json)
                result.toArray(function (err, docs) {
                    if (err) {
                        reject(err)
                    }
                    resolve(docs)
                })
            })
        })
    }
    update(collectionNM, json1, json2) {
        return new Promise((resolve, reject) => {
            this.connect().then((db) => {
                // db.user.update({json1},{$set:{json2}})
                db.collection(collectionNM).updateOne(json1, {
                    $set: json2
                }, (err, result) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(result)
                    }
                })
            })
        })
    }
    insert(collectionNM, json) {
        return new Promise((resolve, reject) => {
            this.connect().then((db) => {
                db.collection(collectionNM).insertOne(json, function (err, result) {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(result)
                    }
                })
            })
        })
    }
    remove(collectionNM, json){
        return new Promise((resolve, reject) => {
            this.connect().then((db) => {
                db.collection(collectionNM).removeOne(json, function (err, result) {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(result)
                    }
                })
            })
        })
    }
    getObjectID(id){ //mongodb里查询_id，把字符串转换成对象
        return new ObjectID(id)
    }
}

module.exports = Db.getInstance()