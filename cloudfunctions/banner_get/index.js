const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

exports.main = async(event, context) => {
	return await db.collection('banner')
	  .where({position:event.position,open:'1'})
	  .get()
};
