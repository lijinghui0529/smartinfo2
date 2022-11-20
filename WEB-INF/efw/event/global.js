var global = {};
global.name = "システム初期化";

/**
 * グローバルイベント実行関数
 */
global.fire = function () {



};
function excute(flg_file01, flg_file02, flg_file03, flg_file04, flg_file05, flg_file06,
				flg_file07, flg_file08, flg_file09, flg_file10, flg_file11, flg_file12,
				flg_file13, flg_file14, flg_file15, flg_file16, flg_file17, flg_file18) {
		if(flg_file02){
			h1();
		}
		if(flg_file04){
			h2();
		}
		if(flg_file14){
			h3();
		}
		if(flg_file15){
			h4();
		}
		
}

function h1() {
	var today = new Date();
	var nowTime = today.format("yyyy-MM-dd HH:mm:ss");

	var deleteResult = db.change(//插入 删除用change ,检索用select;
		"IMPORT",
		"deleteFile_h1",
		{
			"shopId": "Smart-Bear",

		}
	);//导入数据去重数据

	var insertResult = db.change(//插入 删除用change ,检索用select;
		"IMPORT",
		"insertFile_h1",
		{
			"shopId": "Smart-Bear",
			"aaa": nowTime,
		}
	);//导入数据库
}
function h2() {

	var today = new Date();
	var nowTime = today.format("yyyy-MM-dd HH:mm:ss");

	var deleteResult = db.change(//插入 删除用change ,检索用select;
		"IMPORT",
		"deleteFile_h2",
		{
			"shopId": "Smart-Bear",

		}
	);//导入数据去重数据

	var insertResult = db.change(//插入 删除用change ,检索用select;
		"IMPORT",
		"insertFile_h2",
		{
			"shopId": "Smart-Bear",
			"aaa": nowTime,
		}
	);//导入数据库

}
function h3() {

	var today = new Date();
	var nowTime = today.format("yyyy-MM-dd HH:mm:ss");

	var deleteResult = db.change(//插入 删除用change ,检索用select;
		"IMPORT",
		"deleteFile_h3",
		{
			"shopId": "Smart-Bear",

		}
	);//导入数据去重数据

	var insertResult = db.change(//插入 删除用change ,检索用select;
		"IMPORT",
		"insertFile_h3",
		{
			"shopId": "Smart-Bear",
			"aaa": nowTime,
		}
	);//导入数据库

}
function h4() {

	var today = new Date();
	var nowTime = today.format("yyyy-MM-dd HH:mm:ss");

	var deleteResult = db.change(//插入 删除用change ,检索用select;
		"IMPORT",
		"deleteFile_h4",
		{
			"shopId": "Smart-Bear",

		}
	);//导入数据去重数据

	var insertResult = db.change(//插入 删除用change ,检索用select;
		"IMPORT",
		"insertFile_h4",
		{
			"shopId": "Smart-Bear",
			"aaa": nowTime,
		}
	);//导入数据库

}





