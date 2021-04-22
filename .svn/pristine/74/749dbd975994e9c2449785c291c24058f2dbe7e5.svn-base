# 使用说明

## 访问地址

启动本地服务器

`drawDemo.html?id=11`

id表示某个流程图

**发布时,将首页底部的 两个 mock 相关的 js 删除**

## 1、流程图接口

apiConfig.flowData

请求参数

```
{
	pid: 1 //流程图ID，为空表示新建
}
```

返回值
```
 {
	"pid": 1,	//该流程图的id，为空表示新建，不为空表示修改
	"data": {
	    "class": "go.GraphLinksModel",	//必传，写死
			"nodeDataArray": [ 	//节点信息
			{"category":"", "name":"百度", "icon":"1", "type":"", "key":-1,"url":"./test/test.html", "loc":"-218 121"},
			{"category":"", "name":"名字很长名字很长名", "icon":"3", "type":"", "key":-3,"url":"./test/test.html", "loc":"-186.00000000000006 238.99999999999994"},
			{
				"category":"",	//类型，默认为空
				"name":"谷歌", 	//名称
				"icon":"2", 	//图标，2表示为 2.png，后续可修改为图片地址
				"type":"", 	//type为0或者为空表示存在右键菜单，为1表示不存在
				"key":-2,			//活动id
				"url":"./test/test.html",	//跳转地址
				"loc":"-217 376",	//在画布中的位置信息
				"participatorflag":0,  //处理人页面是否修改，0代表没有
				"operationflag":0,  //按钮是否修改
				"materialflag":0,  //材料是否修改
				"info": {  //节点属性的字段
					"activityguid":"",//活动guid
					"status":"",//活动状态“已流转”，“未流转”
					"workflowactivity":"",//活动实体
					"participators":[{},{}],//活动对应处理人信息
					"operations":[{},{}],//活动对应按钮
					"materials":[{},{}]//活动对应材料
				}
			}
		 ],
		  "linkDataArray": [ 	//连线信息
			{
				"from":-1,  //-1表示key 
				"to":-3, 	//-3表示key
				"points":[-147,141,-147,151,-147,180,-115,180,-115,209,-115,219] //位置信息
			},
			{"from":-3, "to":-2, "points":[-115,259,-115,269,-115,307.5,-146,307.5,-146,346,-146,356]}
		 ]
	}
}
```

## 2、节点列表

apiConfig.nodeList

请求参数

```
{
	pid: 1 //流程图ID，为空表示新建
}
```

返回值

```
[
		{ 
			category: '',	//分类，默认为空
			name: '@first()',		
			"icon": '1',	//图标地址
			url:'./test/test.html',	//跳转地址
			"type": 0	//0 表示有右键菜单，1则无
		},
		...
	]
```


## 3、 保存接口

apiConfig.saveFlow

请求参数

请求参数同 流程图接口 中的返回数据，
pid存在则表示修改，不存在或者为空字符则表示新建

返回值：

```
{
	code: 200 //200表示成功
}
```


## 4、移动端追踪图


请求参数

```
{
	"messageitemguid": "消息标识",
	"type": "1" 	//如果要兼容老的流程图，那么可以加一个参数，表示新的一套流程图
}
```

返回值: 

**（）括号中表示对应原来的 字段**

```
{
	"custom": {
		"wfprops":{ // 流程基本信息 (wfprops)
　　　　　　"name":"流程名", (name)
　　　　　　"key":"processVersionGuid" (key)
　　　　},
		"nodedataarray": [	//节点列表 (nodes)
			{
				"category":"",	//类型，默认为空，备用，用于节点样式类型修改需求 (type)
				"name":"谷歌", 	//活动名称 (text.text)
				"transactor": "处理人", // (transactor)
				"icon":"2", 	//图标，2表示为 2.png，后续可修改为图片地址(原接口没有图标，只有类型)
				status: '', //1：未开始 2：进行中 3：已完成 4：超期
				"key":-2,			//活动id, 开始固定为1，结束固定为-1,其余按照实际情况 (id)
				"loc":"-217 376",	//在画布中的位置信息 (attr.x attr.y)
				"detail": [{  //活动信息(detail)
					"transactor": "处理人",
					"operationname": "操作",
	　　　　　　　　"createdate": "2018-04-08 12:00:00",
	　　　　　　　　"operationdate": "2018-04-08 12:00:00",
	　　　　　　　　"opinion": "意见",
	　　　　　　　　"sendername": "提交人",
					"pictures": [
						{
							"title": "标题1",
							"url": '图片地址'
						},
						...
					],
					"audios": [
						{
							"title":"音频名称",
							"time":"音频时长",
							"url": "音频地址"
						},
						...
					]
				},
				...
				]
			},
			...
		],
		"linkdataarray": [	//变迁线列表(actions)
			{
                "from":-1,  //-1表示key,也就是活动id (from)
                "to":-2,    //-2表示key,也就是活动id (to)
                "isdone": 1, //1表示完成，0表示未完成
                "points":[-147,141,-147,151,-147,180,-115,180,-115,209,-115,219] //位置信息(dots)
            },
            ...
		]
	},
	"status":{
　　　　"code":1,
　　　　"text":"请求成功"
　　}
}
```