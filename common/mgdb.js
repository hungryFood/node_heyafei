const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
module.exports = (opts,callback)=>{
    opts = opts || {};
    opts.url = opts.url || 'mongodb://localhost:27017';
    opts.dbName = opts.dbName || "object";
    opts.collection = opts.collection || "admin"
    MongoClient.connect(opts.url,{useNewUrlParser:true},function(err,client){
        if(!err){
            const db = client.db(opts.dbName);
            const collection = db.collection(opts.collection);
            callback(collection,client,ObjectID);
            // client.close();
        }else{
            console.log("我是mgdb错误",err);
        }
    })
}