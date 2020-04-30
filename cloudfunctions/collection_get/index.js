// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  
  if (event.database=='rubbish'){
    return await db.collection(event.database)
      .where({
        condition: event.condition.desc,
      })
      .get()

  }
  else if (event.database =='all_rubbish'){
    return await db.collection(event.database)
      .where({
        name: db.RegExp({
          regexp: event.condition.name.$regex,
          options: event.condition.name.$options
        })
      })
      .get()
  }

  
}