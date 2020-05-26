// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

function formatTime2(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute].map(formatNumber).join(':')
}
function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// 云函数入口函数
exports.main = async (event, context) => {
  switch (event.action) {
    case 'getWXACode': {
      return getWXACode(event)
    }
    case 'sendNoticeMessage' :{
      return sendNoticeMessage(event)
    }
    default: {
      return
    }
  }
}

// 发送订阅消息
async function sendNoticeMessage(event){
  const sendResult = await cloud.openapi.subscribeMessage.send({
    touser: event.openid,
    templateId:'-eXbIPAyCDneRV0Fz0CmOQgIQdwR8sUQ9SbaJIcyUZQ',
    page: '/pages/search/search?back=1&name=' + encodeURIComponent(event.obj.name),
	lang:"zh_CN",
    data: {
	  thing2: {
		value: '您查询的垃圾已有人帮忙归类了！',
	  },
	  thing3: {
		value: event.obj.name + '是' + event.obj.type,
	  },
      date1: {
        value: formatTime2(new Date())
      },
    }
  })
  
  return sendResult

}

async function getWXACode(event) {

  // 此处将获取永久有效的小程序码，并将其保存在云文件存储中，最后返回云文件 ID 给前端使用

  const wxacodeResult = await cloud.openapi.wxacode.get({
    path: 'pages/openapi/openapi',
  })

  const fileExtensionMatches = wxacodeResult.contentType.match(/\/([^\/]+)/)
  const fileExtension = (fileExtensionMatches && fileExtensionMatches[1]) || 'jpg'

  const uploadResult = await cloud.uploadFile({
    // 云文件路径，此处为演示采用一个固定名称
    cloudPath: `wxacode_default_openapi_page.${fileExtension}`,
    // 要上传的文件内容可直接传入图片 Buffer
    fileContent: wxacodeResult.buffer,
  })

  if (!uploadResult.fileID) {
    throw new Error(`upload failed with empty fileID and storage server status code ${uploadResult.statusCode}`)
  }

  return uploadResult.fileID
}
