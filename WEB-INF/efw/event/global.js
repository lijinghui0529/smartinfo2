var global={};
global.name="システム初期化";

var addressList = file.readAllLines("templates/addressList.txt").split("\r\n");
/**
 * グローバルイベント実行関数
 */
global.fire=function(){


};
/**
 * ページング用データの取得<br>
 * <br>
 * select(groupId,getCountSqlId,getDataSqlId,searchCondition)
 * select(groupId,getCountSqlId,getDataSqlId,searchCondition,pageRows)
 * <br>
 * @パラメータ {String}
 *			groupId
 * @パラメータ {String}
 *			getCountSqlId レコードの総数
 * @パラメータ {String}
 *			getDataSqlId 毎ページの記録
 * @パラメータ {Object}
 *			searchCondition 検索条件
 * @パラメータ {String}
 *			pageRows 毎ページの行数
 * @return {Record}
 */
function getPageData(groupId,getCountSqlId,getDataSqlId,searchCondition,pageRows,jdbcResourceName) {
	if(pageRows == null){
		pageRows = 100;
	}
	// レコード総数の取得
	var cnt=db
	.select(
			groupId,																				// 外だしSQLファイル名
			getCountSqlId,																			// 总记录数取得しようのデータを検索するSQL名
			searchCondition,																		// 検索条件
			jdbcResourceName																		// jdbc接続名
	)
	.getValue("cnt");
	var pages = Number.parse((cnt/pageRows).format("0","UP"));
	
	if (pages<cnt/pageRows)pages = pages + 1;
	if (searchCondition.currentPage>pages)searchCondition.currentPage = pages;
	if (searchCondition.currentPage<1)searchCondition.currentPage = 1;
	searchCondition["offset"] = (searchCondition.currentPage - 1) * pageRows;
	searchCondition["limit"] = pageRows;
	if (searchCondition.orderBy != null){
		searchCondition[searchCondition.orderBy] = "true";
	}
	var pageData = db
	.select(
			groupId,																				// 外だしSQLファイル名
			getDataSqlId,																			// 总记录数取得しようのデータを検索するSQL名
			searchCondition,																		// 検索条件
			jdbcResourceName																		// jdbc接続名
	);
	searchCondition.allPages = pages;
	searchCondition.totalNumber = cnt;
	return pageData;
}

function getStandardAddress(address){

	var standardAddress = new Array();

	var address1 = address;
	var address2 = "";
	var address3 = "";

	var flg1 = false;

	for(var i = 0; i < addressList.length; i ++){

		if(address.indexOf(addressList[i]) >= 0){
			address1 = addressList[i];
			flg1 = true;
			break;
		}

	}

	if(flg1 == true){

		var lastAddress = address.substring(address1.length);

		address2 = shrinkAddress(lastAddress);

		address3 = lastAddress.substring(address2.length);



	}else{

		address1 = shrinkAddress(address1);

		address2 = address.substring(address1.length);

	}
	
	if(address1 == null || address1 == ""){
		address1 = " ";
	}
	if(address2 == null || address2 == ""){
		address2 = " ";
	}
	if(address3 == null || address3 == ""){
		address3 = " ";
	}

	standardAddress.push(address1);
	standardAddress.push(address2);
	standardAddress.push(address3);

	return standardAddress;
}

function shrinkAddress(address){
    // nullは空文字で返却
    //if(!address) return ""

    // 番地っぽい文字列を抽出する正規表現
    var pattern = /([0-9０-９]+|[一二三四五六七八九十百千万]+)*(([0-9０-９]+|[一二三四五六七八九十百千万]+)|(丁目|丁|番地|番|号|-|－|‐|ー|−|の|東|西|南|北){1,2})*(([0-9０-９]+|[一二三四五六七八九十百千万]}+)|(丁目|丁|番地|番|号){1,2})/;
    var result = address.match(pattern);
	// 番地っぽい文字列を抽出する
	var c = result[0];
	var p = address.indexOf(c) + c.length;

	// 番地っぽい文字列までを返却する
    return address.substring(0, p);
}

function outputMasterList(excel, selectResult, sheetName, productnameFlg){

	var shop_X = "B";
	var p_no_X = "C";
	var p_category_X = "D";
	var p_type_X = "E";
	var p_color_X = "F";
	var p_size_X = "G";
	var p_sku_X = "H";
	var p_asin_X = "I";
	var p_purchaseprice_X = "J";
	var p_name_X = "K";

	var row_from = 2;

	for(var i = 0;i < selectResult.length;i ++){

		var y = i + row_from;

		var shopnm = selectResult[i]["shopname"];

		var productno = selectResult[i]["productno"];
		var productdiv = selectResult[i]["productdiv"];
		var producttype = selectResult[i]["producttype"];

		var color = selectResult[i]["color"];
		var size = selectResult[i]["size"];

		var sku = selectResult[i]["sku"];
		var asin = selectResult[i]["asin"];

		var purchaseprice = selectResult[i]["purchaseprice"];

		var productname = selectResult[i]["productname"];

		excel.setCell(sheetName, shop_X + y, shopnm);

		excel.setCell(sheetName, p_no_X + y, productno);

		excel.setCell(sheetName, p_category_X + y, productdiv);

		excel.setCell(sheetName, p_type_X + y, producttype);

		excel.setCell(sheetName, p_color_X + y, color);

		excel.setCell(sheetName, p_size_X + y, size);

		excel.setCell(sheetName, p_sku_X + y, sku);

		excel.setCell(sheetName, p_asin_X + y, asin);

		excel.setCell(sheetName, p_purchaseprice_X + y, purchaseprice);

		if(productnameFlg){
			excel.setCell(sheetName, p_name_X + y, productname);
		}

	}

}

function importMasterList(f, shopname, sheetName){

	// マスタデータ全件削除
	var delResult = db.change(
		"MASTER",
		"delAllMaster",
		{shop:shopname}
	);
		
	// Excelファイル
	var excelXSSF = new Excel("upload/" + f);

	var shop_X = "B";
	var p_no_X = "C";
	var p_category_X = "D";
	var p_type_X = "E";
	var p_color_X = "F";
	var p_size_X = "G";

	var sku_X = "H";
	var asin_X = "I";

	var purchaseprice_X = "J";

	var row_from = 2;
	var row_to = 9999;

	var count = 0;
	
	for(var y = row_from;y <= row_to;y++){

		var shop = excelXSSF.getValue(sheetName, shop_X + y);
		var p_no = excelXSSF.getValue(sheetName, p_no_X + y);
		var p_category = excelXSSF.getValue(sheetName, p_category_X + y);
		var p_type = excelXSSF.getValue(sheetName, p_type_X + y);
		var p_color = excelXSSF.getValue(sheetName, p_color_X + y);
		var p_size = excelXSSF.getValue(sheetName, p_size_X + y);
		var sku = excelXSSF.getValue(sheetName, sku_X + y);
		var asin = excelXSSF.getValue(sheetName, asin_X + y);
		var purchaseprice = excelXSSF.getValue(sheetName, purchaseprice_X + y);

		if(shop == null || shop.length <= 0){
			break;
		}

		var insertResult = db.change(
			"MASTER",
			"insertMaster",
			{
				"col0" : count,
				"col1" : shopname,
				"col2" : p_no,
				"col3" : p_category,
				"col4" : p_type,
				"col5" : p_color,
				"col6" : p_size,
				"col7" : sku,
				"col8" : asin,
				"col9" : purchaseprice == null ? purchaseprice : purchaseprice.toFixed(2)
			}
		);

		count = count + 1;

	}

	return count;

}


// function outputProductForSmartKM(selectResult, deliveryFlg, purchaseFlg){

// 		// テンプレートにより、EXCELオブジェクトを作成する
// 		var excel = new Excel("templates/output_stock_smartkm.xlsx");

// 		var tempFilePathName = file.getTempFileName();

// 		var Y_from = 4;

// 		var sku_X = "C";
// 		var asin_X = "D";

// 		var productname_X = "G";

// 		var writePriceX = "H";
// 		var writeFBAX = "I";
// 		var writeFBMX = "J";
// 		var writeLocalStockX = "K";
// 		var writeOnboardStockX = "L";

// 		var writeSell7X = "M";
// 		var writeSell30X = "N";
// 		var writeSell60X = "O";
// 		var writeSell90X = "P";
// 		var writeSellWeekX = "Q";

// 		var writeFBAFlgX = "V";
// 		var writeDeliveryX = "S";
// 		var writePurchaseX = "S";

// 		for(var i = 0;i < selectResult.length;i ++){

// 			var sku = selectResult[i]["sku"];
// 			var asin = selectResult[i]["asin"];
// 			var productname = selectResult[i]["productname"];
// 			var price = selectResult[i]["price"];
// 			var fbaflg = "";

// 			var fba;
// 			if(selectResult[i]["fba"] == null || selectResult[i]["fba"].length == 0){
// 				fba = 0;
				
// 			}else{
// 				fba = parseInt(selectResult[i]["fba"]);
// 				fbaflg = "FBA";
// 			}

// 			var fbm;
// 			if(selectResult[i]["fbm"] == null || selectResult[i]["fbm"].length == 0){
// 				fbm = 0;
				
// 			}else{
// 				fbm = parseInt(selectResult[i]["fbm"]);
// 				fbaflg = "FBM";
// 			}

// 			var localstock;
// 			if(selectResult[i]["localstock"] == null || selectResult[i]["localstock"].length == 0){
// 				localstock = 0;
// 			}else{
// 				localstock = parseInt(selectResult[i]["localstock"]);
// 			}

// 			var onboardstock;
// 			if(selectResult[i]["onboard"] == null || selectResult[i]["onboard"].length == 0){
// 				onboardstock = 0;
// 			}else{
// 				onboardstock = parseInt(selectResult[i]["onboard"]);
// 			}

// 			var selled7 = selectResult[i]["selled7"];
// 			var selled30 = selectResult[i]["selled30"];
// 			var selled60 = selectResult[i]["selled60"];
// 			var selled90 = selectResult[i]["selled90"];
// 			var selledweek = selectResult[i]["selledweek"];

// 			var delivery = selectResult[i]["delivery"];

// 			var purchase = selectResult[i]["purchase"];

// 			var sheetNameList = [
// 				"廃止予定", 		"スマホ保護フィルム",	"カメラ保護",
// 				"スマホケース",		"花柄ケース",			"イヤホン",
// 				"タブレットケース",	"スマホリング",			"その他"];

// 			for(var sn = 0;sn < sheetNameList.length;sn ++){

// 				var sheetName = sheetNameList[sn];

// 				for(var y = Y_from;y <= 9999;y ++){

// 					var excel_sku = excel.getValue(sheetName, sku_X + y);
// 					var excel_asin = excel.getValue(sheetName, asin_X + y);

// 					if(excel_sku == null || excel_sku.length <= 0 || excel_asin == null || excel_asin.length <= 0){
// 						break;
// 					}

// 					if(excel_sku == sku && excel_asin == asin){

// 						excel.setCell(sheetName, writePriceX + y, price);

// 						excel.setCell(sheetName, writeFBAX + y, fba);

// 						excel.setCell(sheetName, writeFBMX + y, fbm);

// 						excel.setCell(sheetName, writeLocalStockX + y, localstock);

// 						excel.setCell(sheetName, writeOnboardStockX + y, onboardstock);

// 						excel.setCell(sheetName, writeSell7X + y, selled7);

// 						excel.setCell(sheetName, writeSell30X + y, selled30);

// 						excel.setCell(sheetName, writeSell60X + y, selled60);

// 						excel.setCell(sheetName, writeSell90X + y, selled90);

// 						excel.setCell(sheetName, writeSellWeekX + y, selledweek);

// 						excel.setCell(sheetName, writeFBAFlgX + y, fbaflg);

// 						if(deliveryFlg){
// 							excel.setCell(sheetName, writeDeliveryX + y, delivery);
// 						}

// 						if(purchaseFlg){
// 							excel.setCell(sheetName, writePurchaseX + y, purchase);
// 						}

// 						listedflg = true;

// 					}

// 				}

// 			}

// 			if(listedflg == false){

// 				excel.setCell("NEW", sku_X + newListY_from, sku);

// 				excel.setCell("NEW", asin_X + newListY_from, asin);

// 				excel.setCell("NEW", productname_X + newListY_from, productname);

// 				excel.setCell("NEW", writePriceX + newListY_from, price);

// 				excel.setCell("NEW", writeFBAX + newListY_from, fba);

// 				excel.setCell("NEW", writeFBMX + newListY_from, fbm);

// 				excel.setCell("NEW", writeLocalStockX + newListY_from, localstock);

// 				excel.setCell("NEW", writeOnboardStockX + newListY_from, onboardstock);

// 				excel.setCell("NEW", writeSell7X + newListY_from, selled7);

// 				excel.setCell("NEW", writeSell30X + newListY_from, selled30);

// 				excel.setCell("NEW", writeSell60X + newListY_from, selled60);

// 				excel.setCell("NEW", writeSell90X + newListY_from, selled90);

// 				excel.setCell("NEW", writeSellWeekX + newListY_from, selledweek);

// 				excel.setCell("NEW", writeFBAFlgX + newListY_from, fbaflg);

// 				if(deliveryFlg){
// 					excel.setCell("NEW", writeDeliveryX + newListY_from, delivery);
// 				}

// 				if(purchaseFlg){
// 					excel.setCell("NEW", writePurchaseX + newListY_from, purchase);
// 				}

// 				newListY_from = newListY_from + 1;

// 			}

// 		}

// 		excel.setActiveSheet(sheetNameList[0]).save(tempFilePathName);

// 		return tempFilePathName;

// }


function outputProductForSmartBear(selectResult, deliveryFlg, purchaseFlg){

	// テンプレートにより、EXCELオブジェクトを作成する
	var excel=new Excel("templates/output_stock.xlsx");

	var tempFilePathName=file.getTempFileName();

	// レインコート
	var RC_labelY_from = 4;
	var RC_labelY_to = 36;
	var RC_labelX = ["F","G","H","I","J","K"];
	var RC_writeFBAStockX = ["L","M","N","O","P","Q"];
	var RC_writeFBMStockX = ["L","M","N","O","P","Q"];

	var RC_writeLocalStockX = ["R","S","T","U","V","W"];
	var RC_writeOnboardStockX = ["X","Y","Z","AA","AB","AC"];
	var RC_writeSell7X = ["AD","AE","AF","AG","AH","AI"];
	var RC_writeSell30X = ["AJ","AK","AL","AM","AN","AO"];
	var RC_writeSell60X = ["AP","AQ","AR","AS","AT","AU"];
	var RC_writeSell90X = ["AV","AW","AX","AY","AZ","BA"];
	var RC_writeSellWeekX = ["BB","BC","BD","BE","BF","BG"];
	var RC_writePriceX = ["CF","CG","CH","CI","CJ","CK"];
	var RC_writeFBAFlgX = ["CL","CM","CN","CO","CP","CQ"];
	var RC_writeDeliveryX = ["BN","BO","BP","BQ","BR","BS"];
	var RC_writePurchaseX = ["BN","BO","BP","BQ","BR","BS"];

	// パジャマ
	var PJ_labelY_from = 4;
	var PJ_labelY_to = 18;
	var PJ_labelX = ["F","G","H","I","J","K","L"];
	var PJ_writeFBAStockX = ["M","N","O","P","Q","R","S"];
	var PJ_writeFBMStockX = null;

	var PJ_writeLocalStockX = ["T","U","V","W","X","Y","Z"];
	var PJ_writeOnboardStockX = ["AA","AB","AC","AD","AE","AF","AG"];
	var PJ_writeSell7X = ["AH","AI","AJ","AK","AL","AM","AN"];
	var PJ_writeSell30X = ["AO","AP","AQ","AR","AS","AT","AU"];
	var PJ_writeSell60X = ["AV","AW","AX","AY","AZ","BA","BB"];
	var PJ_writeSell90X = ["BC","BD","BE","BF","BG","BH","BI"];
	var PJ_writeSellWeekX = ["BJ","BK","BL","BM","BN","BO","BP"];
	var PJ_writePriceX = ["CS","CT","CU","CV","CW","CX","CY"];
	var PJ_writeFBAFlgX = ["CZ","DA","DB","DC","DD","DE","DF"];
	var PJ_writeDeliveryX = ["BX","BY","BZ","CA","CB","CC","CD"];
	var PJ_writePurchaseX = ["BX","BY","BZ","CA","CB","CC","CD"];

	// 傘
	var UB_labelY_from = 4;
	var UB_labelY_to = 14;
	var UB_labelX = ["F"];
	var UB_writeStockX = ["G"];
	var UB_writeLocalStockX = ["H"];
	var UB_writeOnboardStockX = ["I"];
	var UB_writeSell7X = ["J"];
	var UB_writeSell30X = ["K"];
	var UB_writeSell60X = ["L"];
	var UB_writeSell90X = ["M"];
	var UB_writeSellWeekX = ["N"];
	var UB_writePriceX = ["S"];
	var UB_writeDeliveryX = ["P"];
	var UB_writePurchaseX = ["P"];

	// 雨靴
	var RB_labelY_from = 3;
	var RB_labelY_to = 80;
	var RB_labelX = ["H"];
	var RB_writeFBAStockX = ["I"];
	var RB_writeFBMStockX = null;

	var RB_writeLocalStockX = ["J"];
	var RB_writeOnboardStockX = ["K"];
	var RB_writeSell7X = ["L"];
	var RB_writeSell30X = ["M"];
	var RB_writeSell60X = ["N"];
	var RB_writeSell90X = ["O"];
	var RB_writeSellWeekX = ["P"];
	var RB_writePriceX = ["U"];
	var RB_writeFBAFlgX = ["V"];
	var RB_writeDeliveryX = ["R"];
	var RB_writePurchaseX = ["R"];

	// 靴下
	var W_labelY_from = 4;
	var W_labelY_to = null;
	var W_labelX = ["J"];
	var W_writePriceX = ["K"];
	var W_writeFBAStockX = ["L"];
	var W_writeFBMStockX = ["M"];

	var W_writeLocalStockX = ["N"];
	var W_writeOnboardStockX = ["O"];
	var W_writeSell7X = ["P"];
	var W_writeSell30X = ["Q"];
	var W_writeSell60X = ["R"];
	var W_writeSell90X = ["S"];
	var W_writeSellWeekX = ["T"];
	var W_writeFBAFlgX = ["Y"];
	var W_writeDeliveryX = ["V"];
	var W_writePurchaseX = ["V"];


	for(var i = 0;i < selectResult.length;i ++){

		var outputflg = false;

		// 商品管理番号
		var productno = selectResult[i]["productno"];

		// レインコート
		if(productno == "T001" || productno == "T002" || productno == "T003" || productno == "T004" 
		|| productno == "T005" || productno == "T006" || productno == "T007" || productno == "T008" 
		|| productno == "T009" || productno == "T010" || productno == "T011" || productno == "T012" || productno == "T013" ){

			// 情報設定
			outputflg = setInfoToExcel(excel, selectResult[i], "在庫（雨衣）", 
				RC_labelX, RC_labelY_from, RC_labelY_to,
				RC_writeFBAStockX, RC_writeFBMStockX, RC_writeLocalStockX, RC_writeOnboardStockX,
				RC_writeSell7X, RC_writeSell30X, RC_writeSell60X, RC_writeSell90X, RC_writeSellWeekX,
				RC_writePriceX, RC_writeDeliveryX, RC_writePurchaseX, RC_writeFBAFlgX, deliveryFlg, purchaseFlg
			);

		// パジャマ
		}else if(productno == "P001" || productno == "P002"){

			// 情報設定
			outputflg = setInfoToExcel(excel, selectResult[i], "在庫（居家服）", 
				PJ_labelX, PJ_labelY_from, PJ_labelY_to,
				PJ_writeFBAStockX, PJ_writeFBMStockX, PJ_writeLocalStockX, PJ_writeOnboardStockX,
				PJ_writeSell7X, PJ_writeSell30X, PJ_writeSell60X, PJ_writeSell90X, PJ_writeSellWeekX,
				PJ_writePriceX, PJ_writeDeliveryX, PJ_writePurchaseX, PJ_writeFBAFlgX, deliveryFlg, purchaseFlg
			);
		
		// // 傘
		// }else if(productno == "T206" || productno == "T207" || productno == "T208" 
		// || productno == "T209" || productno == "T101"){

		// 	// 情報設定
		// 	setInfoToExcel(excel, selectResult[i], "在庫（雨伞等）", 
		// 		UB_labelX, UB_labelY_from, UB_labelY_to,
		// 		UB_writeStockX, UB_writeLocalStockX, UB_writeOnboardStockX,
		// 		UB_writeSell7X, UB_writeSell30X, UB_writeSell60X, UB_writeSell90X, UB_writeSellWeekX,
		// 		UB_writePriceX, UB_writeDeliveryX, UB_writePurchaseX, deliveryFlg, purchaseFlg
		// 	);
			
		// 雨靴
		}else if(productno == "T101" || productno == "T301" || productno == "T302" || productno == "T303" 
		|| productno == "T306" || productno == "T308" || productno == "T309"){

			// 情報設定
			outputflg = setInfoToExcel(excel, selectResult[i], "在庫（雨靴等）", 
				RB_labelX, RB_labelY_from, RB_labelY_to,
				RB_writeFBAStockX, RB_writeFBMStockX, RB_writeLocalStockX, RB_writeOnboardStockX,
				RB_writeSell7X, RB_writeSell30X, RB_writeSell60X, RB_writeSell90X, RB_writeSellWeekX,
				RB_writePriceX, RB_writeDeliveryX, RB_writePurchaseX, RB_writeFBAFlgX, deliveryFlg, purchaseFlg
			);
			
		// 靴下
		}else if(productno != null && productno.length > 0 && productno.substring(0,1) == "W"){

			// 情報設定
			outputflg = setInfoToExcel(excel, selectResult[i], "在庫（袜子）", 
				W_labelX, W_labelY_from, W_labelY_to,
				W_writeFBAStockX, W_writeFBMStockX, W_writeLocalStockX, W_writeOnboardStockX,
				W_writeSell7X, W_writeSell30X, W_writeSell60X, W_writeSell90X, W_writeSellWeekX,
				W_writePriceX, W_writeDeliveryX, W_writePurchaseX, W_writeFBAFlgX, deliveryFlg, purchaseFlg
			);

		}else{
			// 情報設定
			outputflg = setInfoToExcelBySkuAsin(excel, selectResult[i], "在庫（其他）", deliveryFlg, purchaseFlg);
		}

		if(outputflg == false){
			writeInfoToExcel(excel, selectResult[i], "在庫（未登録）",  deliveryFlg, purchaseFlg);
		}


	}

	excel.setActiveSheet("在庫（雨衣）").save(tempFilePathName);

	return tempFilePathName;

}

function writeInfoToExcel(excel, selectRecord, sheetName, deliveryFlg, purchaseFlg){

	var sku = selectRecord["sku"];
	var asin = selectRecord["asin"];
	var color = selectRecord["color"];
	var size = selectRecord["size"];
	var productname = selectRecord["productname"];
	var localstock = returnQuantity(selectRecord["localstock"]);
	var fba = returnQuantity(selectRecord["fba"]);
	var fbm = returnQuantity(selectRecord["fbm"]);
	var onboard = returnQuantity(selectRecord["onboard"]);
	var selled7 = returnQuantity(selectRecord["selled7"]);
	var selled30 = returnQuantity(selectRecord["selled30"]);
	var selled60 = returnQuantity(selectRecord["selled60"]);
	var selled90 = returnQuantity(selectRecord["selled90"]);
	var selledweek = returnNumber(selectRecord["selledweek"]);
	var price = returnJPPrice(selectRecord["price"]);
	var delivery = returnQuantity(selectRecord["delivery"]);
	var purchase = returnQuantity(selectRecord["purchase"]);

	var fbaflg = "FBM";
	if (selectRecord["fba"] == null && selectRecord["fbm"] != null){
		fbaflg = "FBM";
	}else if (selectRecord["fba"] != null && selectRecord["fbm"] == null){
		fbaflg = "FBA";
	}else{
		if (parseInt(selectRecord["fba"]) > 0 && parseInt(selectRecord["fbm"]) == 0){
			fbaflg = "FBA";
		}else if (parseInt(selectRecord["fba"]) == 0 && parseInt(selectRecord["fbm"]) > 0){
			fbaflg = "FBM";
		}
	}

	// var fbaflg = selectRecord["fba"] == null ? "FBM" : "FBM";

	var Y_from = 4;
	var Y_to = 9999;

	var sku_X = "C";
	var asin_X = "D";

	var color_X = "E";
	var size_X = "F";
	
	var writeProductNameX = "G";

	var writePriceX = "H";
	var writeFBAX = "I";
	var writeFBMX = "J";
	var writeLocalStockX = "K";
	var writeOnboardStockX = "L";

	var writeSell7X = "M";
	var writeSell30X = "N";
	var writeSell60X = "O";
	var writeSell90X = "P";
	var writeSellWeekX = "Q";

	var writeFBAFlgX = "V";
	var writeDeliveryX = "S";
	var writePurchaseX = "S";

	// 在庫情報シート
	for(var y = Y_from;y <= Y_to;y ++){

		var excel_sku = excel.getValue(sheetName, sku_X + y);
		var excel_asin = excel.getValue(sheetName, asin_X + y);

		if(excel_sku == null || excel_sku.length <= 0 || excel_asin == null || excel_asin.length <= 0){

			// SKU
			setExcelValue(excel, sheetName, sku_X + y, sku);
			// ASIN
			setExcelValue(excel, sheetName, asin_X + y, asin);
			// 色
			setExcelValue(excel, sheetName, color_X + y, color);
			// サイズ
			setExcelValue(excel, sheetName, size_X + y, size);
			// 商品名称
			setExcelValue(excel, sheetName, writeProductNameX + y, productname);
			// 商品価格
			setExcelValue(excel, sheetName, writePriceX + y, price);
			// FBA在庫数量
			setExcelValue(excel, sheetName, writeFBAX + y, fba);
			// FBM在庫数量
			setExcelValue(excel, sheetName, writeFBMX + y, fbm);
			// ローカル在庫
			setExcelValue(excel, sheetName, writeLocalStockX + y, localstock);
			// ONBOARD在庫
			setExcelValue(excel, sheetName, writeOnboardStockX + y, onboard);
			// 販売数量(直近70日間)
			setExcelValue(excel, sheetName, writeSell7X + y, selled7);
			// 販売数量(直近30日間)
			setExcelValue(excel, sheetName, writeSell30X + y, selled30);
			// 販売数量(直近60日間)
			setExcelValue(excel, sheetName, writeSell60X + y, selled60);
			// 販売数量(直近90日間)
			setExcelValue(excel, sheetName, writeSell90X + y, selled90);
			// 販売数量(週間平均値)
			setExcelValue(excel, sheetName, writeSellWeekX + y, selledweek);
			// 販売方式
			setExcelValue(excel, sheetName, writeFBAFlgX + y, fbaflg);
			// 仕入数量
			if(deliveryFlg){
				setExcelValue(excel, sheetName, writeDeliveryX + y, delivery);
			}
			// 仕入数量
			if(purchaseFlg){
				setExcelValue(excel, sheetName, writePurchaseX + y, purchase);
			}

			break;
		}

	}

} 


function setInfoToExcelBySkuAsin(excel, selectRecord, sheetName, deliveryFlg, purchaseFlg){

	var labelno = selectRecord["label"];
	var sku = selectRecord["sku"];
	var asin = selectRecord["asin"];
	var localstock = returnQuantity(selectRecord["localstock"]);
	var fba = returnQuantity(selectRecord["fba"]);
	var fbm = returnQuantity(selectRecord["fbm"]);
	var onboard = returnQuantity(selectRecord["onboard"]);
	var selled7 = returnQuantity(selectRecord["selled7"]);
	var selled30 = returnQuantity(selectRecord["selled30"]);
	var selled60 = returnQuantity(selectRecord["selled60"]);
	var selled90 = returnQuantity(selectRecord["selled90"]);
	var selledweek = returnNumber(selectRecord["selledweek"]);
	var price = returnJPPrice(selectRecord["price"]);
	var delivery = returnQuantity(selectRecord["delivery"]);
	var purchase = returnQuantity(selectRecord["purchase"]);

	var fbaflg = "FBM";
	if (selectRecord["fba"] == null && selectRecord["fbm"] != null){
		fbaflg = "FBM";
	}else if (selectRecord["fba"] != null && selectRecord["fbm"] == null){
		fbaflg = "FBA";
	}else{
		if (parseInt(selectRecord["fba"]) > 0 && parseInt(selectRecord["fbm"]) == 0){
			fbaflg = "FBA";
		}else if (parseInt(selectRecord["fba"]) == 0 && parseInt(selectRecord["fbm"]) > 0){
			fbaflg = "FBM";
		}
	}

	//var fbaflg = fba != null ? "FBA" : "FBM";

	var Y_from = 4;
	var Y_to = 9999;

	var sku_X = "C";
	var asin_X = "D";

	var writePriceX = "H";
	var writeFBAX = "I";
	var writeFBMX = "J";
	var writeLocalStockX = "K";
	var writeOnboardStockX = "L";

	var writeSell7X = "M";
	var writeSell30X = "N";
	var writeSell60X = "O";
	var writeSell90X = "P";
	var writeSellWeekX = "Q";

	var writeFBAFlgX = "V";
	var writeDeliveryX = "S";
	var writePurchaseX = "S";

	// 在庫情報シート
	for(var y = Y_from;y <= Y_to;y ++){

		var excel_sku = excel.getValue(sheetName, sku_X + y);
		var excel_asin = excel.getValue(sheetName, asin_X + y);

		if(excel_sku == null || excel_sku.length <= 0 || excel_asin == null || excel_asin.length <= 0){
			break;
		}

		if(excel_sku == sku && excel_asin == asin){

			// 商品価格
			setExcelValue(excel, sheetName, writePriceX + y, price);
			// FBA在庫数量
			setExcelValue(excel, sheetName, writeFBAX + y, fba);
			// FBM在庫数量
			setExcelValue(excel, sheetName, writeFBMX + y, fbm);
			// ローカル在庫
			setExcelValue(excel, sheetName, writeLocalStockX + y, localstock);
			// ONBOARD在庫
			setExcelValue(excel, sheetName, writeOnboardStockX + y, onboard);
			// 販売数量(直近70日間)
			setExcelValue(excel, sheetName, writeSell7X + y, selled7);
			// 販売数量(直近30日間)
			setExcelValue(excel, sheetName, writeSell30X + y, selled30);
			// 販売数量(直近60日間)
			setExcelValue(excel, sheetName, writeSell60X + y, selled60);
			// 販売数量(直近90日間)
			setExcelValue(excel, sheetName, writeSell90X + y, selled90);
			// 販売数量(週間平均値)
			setExcelValue(excel, sheetName, writeSellWeekX + y, selledweek);
			// 販売方式
			setExcelValue(excel, sheetName, writeFBAFlgX + y, fbaflg);
			// 仕入数量
			if(deliveryFlg){
				setExcelValue(excel, sheetName, writeDeliveryX + y, delivery);
			}
			// 仕入数量
			if(purchaseFlg){
				setExcelValue(excel, sheetName, writePurchaseX + y, purchase);
			}
			return true;

		}

	}

	return false;

} 

function setInfoToExcel(excel, selectRecord, sheetName, labelX, labelY_from, labelY_to, writeFBAStockX, writeFBMStockX, writeLocalStockX, writeOnboardStockX,
	writeSell7X, writeSell30X, writeSell60X, writeSell90X, writeSellWeekX, writePriceX, writeDeliveryX, writePurchaseX, writeFBAFlgX, deliveryFlg, purchaseFlg){

	var labelno = selectRecord["label"];
	var localstock = returnQuantity(selectRecord["localstock"]);
	var fba = returnQuantity(selectRecord["fba"]);
	var fbm = returnQuantity(selectRecord["fbm"]);
	var onboard = returnQuantity(selectRecord["onboard"]);
	var selled7 = returnQuantity(selectRecord["selled7"]);
	var selled30 = returnQuantity(selectRecord["selled30"]);
	var selled60 = returnQuantity(selectRecord["selled60"]);
	var selled90 = returnQuantity(selectRecord["selled90"]);
	var selledweek = returnNumber(selectRecord["selledweek"]);
	var price = returnJPPrice(selectRecord["price"]);
	var delivery = returnQuantity(selectRecord["delivery"]);
	var purchase = returnQuantity(selectRecord["purchase"]);

	var y_to = labelY_to == null ? 9999 : labelY_to;

	var fbaflg = "FBM";
	if (selectRecord["fba"] == null && selectRecord["fbm"] != null){
		fbaflg = "FBM";
	}else if (selectRecord["fba"] != null && selectRecord["fbm"] == null){
		fbaflg = "FBA";
	}else{
		if (parseInt(selectRecord["fba"]) > 0 && parseInt(selectRecord["fbm"]) == 0){
			fbaflg = "FBA";
		}else if (parseInt(selectRecord["fba"]) == 0 && parseInt(selectRecord["fbm"]) > 0){
			fbaflg = "FBM";
		}
	}

	//var fbaflg = fba != null ? "FBA" : "FBM";

	//var writeFBAFlgX = "V";

	// 在庫情報シート
	for(var x = 0;x < labelX.length;x ++){
		for(var y = labelY_from;y <= y_to;y ++){

			var excellabelno = excel.getValue(sheetName, labelX[x] + y);
			if(excellabelno == null){
				if(labelY_to == null){
					break;
				}else{
					continue;
				}
			}
			if(excellabelno == labelno){
				// 商品価格
				setExcelValue(excel, sheetName, writePriceX[x]+y, price);
				// FBA在庫数量
				setExcelValue(excel, sheetName, writeFBAStockX[x]+y, fba);

				if(writeFBMStockX != null){
					// FBM在庫数量
					setExcelValue(excel, sheetName, writeFBMStockX[x]+y, fbm);
				}

				// ローカル在庫
				setExcelValue(excel, sheetName, writeLocalStockX[x]+y, localstock);
				// ONBOARD在庫
				setExcelValue(excel, sheetName, writeOnboardStockX[x]+y, onboard);
				// 販売数量(直近7日間)
				setExcelValue(excel, sheetName, writeSell7X[x]+y, selled7);
				// 販売数量(直近30日間)
				setExcelValue(excel, sheetName, writeSell30X[x]+y, selled30);
				// 販売数量(直近60日間)
				setExcelValue(excel, sheetName, writeSell60X[x]+y, selled60);
				// 販売数量(直近90日間)
				setExcelValue(excel, sheetName, writeSell90X[x]+y, selled90);
				// 販売数量(週間平均値)
				setExcelValue(excel, sheetName, writeSellWeekX[x]+y, selledweek);
				// 販売方式
				setExcelValue(excel, sheetName, writeFBAFlgX[x]+y, fbaflg);
				if(deliveryFlg){
					// 仕入数量
					setExcelValue(excel, sheetName, writeDeliveryX[x]+y, delivery);
				}

				if(purchaseFlg){
					// 仕入数量
					setExcelValue(excel, sheetName, writePurchaseX[x]+y, purchase);
				}

				return true;
			}
		}
	}

	return false;
}


function returnQuantity(quantity){

	if(quantity == null || quantity == "" || quantity == "0" || quantity == 0){
		return null;
	}
	return parseInt(quantity);
}

function returnJPPrice(price){

	if(price == null || price == "" || price == "0" || price == 0){
		return null;
	}
	return parseInt(price);
}

function returnNumber(decimalNumber){

	if(decimalNumber == null || decimalNumber == ""){
		return null;
	}

	return parseFloat(decimalNumber);
}

function setExcelValue(excel, sheetName, station, value){

	if(value != null){
		excel.setCell(sheetName, station, value);
	}

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



function importProductInfoForSmartBear(shopname, excelXSSF, stockFlg, deliveryFlg, purchaseFlg, no){

	var RC_labelX = ["F","G","H","I","J","K"];
	var RC_skuX = [null,null,null,null,null,null];
	var RC_asinX = [null,null,null,null,null,null];

	var RC_localStockX = ["R","S","T","U","V","W"];
	var RC_onboardStockX = ["X","Y","Z","AA","AB","AC"];
	var RC_deliveryX = ["BN","BO","BP","BQ","BR","BS"];
	var RC_purchaseX = ["BN","BO","BP","BQ","BR","BS"];
	//var RC_priceX = ["CF","CG","CH","CI","CJ","CK"];
	var RC_priceX = ["L","M","N","O","P","Q"];

	var RC_labelY_from = 4;
	var RC_labelY_to = 36;

	importProductInfo(shopname, excelXSSF, "在庫（雨衣）", 
		RC_labelX, RC_skuX, RC_asinX, RC_localStockX, RC_onboardStockX, RC_deliveryX, RC_purchaseX, RC_priceX, RC_labelY_from, RC_labelY_to, 
		stockFlg, deliveryFlg, purchaseFlg, no);


	var PJ_labelX = ["F","G","H","I","J","K","L"];
	var PJ_skuX = [null,null,null,null,null,null,null];
	var PJ_asinX = [null,null,null,null,null,null,null];

	var PJ_localStockX = ["T","U","V","W","X","Y","Z"];
	var PJ_onboardStockX = ["AA","AB","AC","AD","AE","AF","AG"];
	var PJ_deliveryX = ["BX","BY","BZ","CA","CB","CC","CD"];
	var PJ_purchaseX = ["BX","BY","BZ","CA","CB","CC","CD"];
	//var PJ_priceX = ["CF","CG","CH","CI","CJ","CK"];
	var PJ_priceX = ["M","N","O","P","Q","R","S"];

	var PJ_labelY_from = 4;
	var PJ_labelY_to = 18;

	importProductInfo(shopname, excelXSSF, "在庫（居家服）", 
		PJ_labelX, PJ_skuX, PJ_asinX, PJ_localStockX, PJ_onboardStockX, PJ_deliveryX, PJ_purchaseX, PJ_priceX, PJ_labelY_from, PJ_labelY_to, 
		stockFlg, deliveryFlg, purchaseFlg, no);


	// var UB_labelX = ["F"];
	// var UB_skuX = [null];
	// var UB_asinX = [null];

	// var UB_localStockX = ["H"];
	// var UB_onboardStockX = ["I"];
	// var UB_deliveryX = ["P"];
	// var UB_purchaseX = ["P"];
	// //var UB_priceX = ["S"];
	// var UB_priceX = ["H"];

	// var UB_labelY_from = 4;
	// var UB_labelY_to = 14;

	// importProductInfo(shopname, excelXSSF, "在庫（雨伞等）", 
	// 	UB_labelX, UB_skuX, UB_asinX, UB_localStockX, UB_onboardStockX, UB_deliveryX, UB_purchaseX, UB_priceX, UB_labelY_from, UB_labelY_to, 
	// 	stockFlg, deliveryFlg, purchaseFlg, no);

	var RB_labelX = ["H"];
	var RB_skuX = [null];
	var RB_asinX = [null];

	var RB_localStockX = ["J"];
	var RB_onboardStockX = ["K"];
	var RB_deliveryX = ["R"];
	var RB_purchaseX = ["R"];
	//var RB_priceX = ["U"];
	var RB_priceX = ["J"];

	var RB_labelY_from = 3;
	var RB_labelY_to = null;

	importProductInfo(shopname, excelXSSF, "在庫（雨靴等）", 
	RB_labelX, RB_skuX, RB_asinX, RB_localStockX, RB_onboardStockX, RB_deliveryX, RB_purchaseX, RB_priceX, RB_labelY_from, RB_labelY_to, 
	stockFlg, deliveryFlg, purchaseFlg, no);

	var W_labelX = ["J"];
	var W_skuX = [null];
	var W_asinX = [null];

	var W_localStockX = ["N"];
	var W_onboardStockX = ["O"];
	var W_deliveryX = ["V"];
	var W_purchaseX = ["V"];
	var W_priceX = ["K"];

	var W_labelY_from = 4;
	var W_labelY_to = null;

	importProductInfo(shopname, excelXSSF, "在庫（袜子）", 
	W_labelX, W_skuX, W_asinX, W_localStockX, W_onboardStockX, W_deliveryX, W_purchaseX, W_priceX, W_labelY_from, W_labelY_to, 
	stockFlg, deliveryFlg, purchaseFlg, no);

	var labelX = [null];
	var skuX = ["C"];
	var asinX = ["D"];

	var localStockX = ["K"];
	var onboardStockX = ["L"];
	var deliveryX = ["S"];
	var purchaseX = ["S"];
	//var priceX = ["H"];
	var priceX = ["Z"];

	var labelY_from = 4;
	var labelY_to = null;

	importProductInfo(shopname, excelXSSF, "在庫（其他）", 
		labelX, skuX, asinX, localStockX, onboardStockX, deliveryX, purchaseX, priceX, labelY_from, labelY_to, 
		stockFlg, deliveryFlg, purchaseFlg, no);


}

// function importProductInfoForSmartKM(shopname, excelXSSF, stockFlg, deliveryFlg, purchaseFlg, no){

// 	var sheetNameArr = [
// 		"NEW","スマホ保護フィルム","カメラ保護","スマホケース",
// 		"花柄ケース","イヤホン","タブレットケース","スマホリング","その他"];

// 	for(var i = 0;i < sheetNameArr.length;i ++){

// 		var sheetName = sheetNameArr[i];

// 		var labelX = [null];
// 		var skuX = ["C"];
// 		var asinX = ["D"];

// 		var localStockX = ["K"];
// 		var onboardStockX = ["L"];
// 		var deliveryX = ["S"];
// 		var purchaseX = ["S"];
// 		var priceX = ["H"];

// 		var labelY_from = 4;
// 		var labelY_to = null;

// 		importProductInfo(shopname, excelXSSF, sheetName, 
// 			labelX, skuX, asinX, localStockX, onboardStockX, deliveryX, purchaseX, priceX, labelY_from, labelY_to, 
// 			stockFlg, deliveryFlg, purchaseFlg, no);

// 	}
	
// }


function importProductInfo(shopname, excelXSSF, sheetName, 
	labelX, skuX, asinX, localStockX, onboardStockX, deliveryX, purchaseX, priceX, labelY_from, labelY_to, 
	stockFlg, deliveryFlg, purchaseFlg, no){

	var y_to = labelY_to == null ? 9999 : labelY_to;

	for(var y = labelY_from;y <= y_to;y++){

		for(var x = 0;x < labelX.length;x ++){

			var label = excelXSSF.getValue(sheetName, labelX[x] + y);
			var sku = excelXSSF.getValue(sheetName, skuX + y);
			var asin = excelXSSF.getValue(sheetName, asinX + y);

			if((sku == null || sku.length <= 0) && (asin == null || asin.length <= 0) && (label == null || label.length == 0)){
				if(labelY_to == null){
					break;
				}else{
					continue;
				}
			}

			var localstock = excelXSSF.getValue(sheetName, localStockX[x] + y);
			var onboardstock = excelXSSF.getValue(sheetName, onboardStockX[x] + y);
			var delivery = excelXSSF.getValue(sheetName, deliveryX[x] + y);
			var purchase = excelXSSF.getValue(sheetName, purchaseX[x] + y);
			var price = excelXSSF.getValue(sheetName.replaceAll('在庫','入荷'), priceX[x] + y);

			if(stockFlg){
				if(localstock == null || localstock.length == 0){
					localstock = "0";
				}
				if(onboardstock == null || onboardstock.length == 0){
					onboardstock = "0";
				}

				insertStockDetail(shopname, label, sku, asin, localstock, onboardstock)
			}

			if(deliveryFlg){
				if(delivery == null || delivery.length == 0 || delivery == 0 || delivery == "0"){
					continue;
				}
	
				insertDeliveryDetail(shopname, label, sku, asin, delivery, no);
			}

			if(purchaseFlg){
				if(purchase == null || purchase.length == 0 || purchase == 0 || purchase == "0"){
					continue;
				}
				if(price == null || price.length == 0){
					price = "0";
				}	
	
				insertPurchaseDetail(shopname, label, sku, asin, purchase, price, no);
			}
		}

	}


}



function insertStockDetail(shopname, label, sku, asin, localstock, onboardstock){

	if(sku == null || sku.length <= 0 || asin == null || asin.length <= 0){

		var detailResult = db.select(
			"UPLOAD",
			"searchSKUASIN",
			{
				label:label,
				shop:shopname
			}
		).getArray();
		if(detailResult == null || detailResult.length <= 0){
			return;
		}
	
		sku = detailResult[0]["sku"];
		asin = detailResult[0]["asin"];

	}

	var delResult = db.change(
		"UPLOAD",
		"delLocalstock",
		{
			"sku":sku,
			"asin":asin
		}
	);

	var insResult = db.change(
		"UPLOAD",
		"insLocalstock",
		{
			"localstock":localstock,
			"onboardstock":onboardstock,
			"sku":sku,
			"asin":asin
		}
	);

}

function insertDeliveryDetail(shopname, label, sku, asin, delivery, deliveryno){

	if(sku == null || sku.length <= 0 || asin == null || asin.length <= 0){

		var detailResult = db.select(
			"UPLOAD",
			"searchSKUASIN",
			{
				label:label,
				shop:shopname
			}
		).getArray();
		if(detailResult == null || detailResult.length <= 0){
			return;
		}
	
		sku = detailResult[0]["sku"];
		asin = detailResult[0]["asin"];

	}

	var insResult = db.change(
		"DELIVERY",
		"insertDeliveryDetail",
		{
			"col0":deliveryno,
			"col1":sku,
			"col2":asin,
			"col3":delivery
		}
	);

}


function insertPurchaseDetail(shopname, label, sku, asin, purchase, price, purchaseno){

	if(sku == null || sku.length <= 0 || asin == null || asin.length <= 0){

		var detailResult = db.select(
			"UPLOAD",
			"searchSKUASIN",
			{
				label:label,
				shop:shopname
			}
		).getArray();
		if(detailResult == null || detailResult.length <= 0){
			return;
		}
	
		sku = detailResult[0]["sku"];
		asin = detailResult[0]["asin"];

	}

	var insResult = db.change(
		"PURCHASE",
		"insertPurchaseDetail",
		{
			"col0":purchaseno,
			"col1":sku,
			"col2":asin,
			"col3":parseFloat(price).toFixed(2),
			"col4":purchase,
			"col5":(parseFloat(price) * purchase).toFixed(2)
		}
	);

}