<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="efw" uri="efw" %> 

<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<title>データ導入</title>
	<script src="jquery-3.6.0.min.js"></script>
	<efw:Client/>

	<script>
        function init(){
			Efw('import/initimport');
		}
		function setInit(objectname,importdate,importcount){
			$("#"+objectname).html(importdate);
			$("#"+objectname).next().html(importcount);
		}

			// function searchHistory(){
			// 	Efw('searchhistory');
			// }

			// function importData(){

			// 	var rd = $("input[name='opt_type']:checked").val();

			// 	Efw('uploadfile',{data:'liststock', liststock: rd});

			// }

  	</script>
    <style>
      /* .upfile {
          border-top: 2px;
          border-right: 2px;
          border-left: 2px;
          border-bottom: 2px;
          border-style: solid;

      } */
    </style>
</head>
<body style="background-color:ghostwhite;" onload="init()">

<div style="font-size: 30px;color: blue;display: inline-block;width: 100%" id="pagehead">
	データ導入
	<img src="img/home.png" style="width: 64px;height: 64px;" onclick="window.location.href = '/smartinfo2/'">
</div>
<div style="text-align: right;width: 90%;">
	<input type="button" id="import" style="width: 170px;height: 30px;background-color: rgb(199, 199, 227);" value="導入"
		onclick="Efw('import/importfile')">
</div>
<table border="1" style="width: 90%;height: 70%;">
	<tr style="background-color:rgba(86, 86, 207, 0.696) ;">
		<th style="width:10%">No</th>
		<th style="width:55%">ファイル名称</th>
		<th style="width:5%">添付ファイル</th>
		<th style="width:20%">前回導入日時</th>
		<th style="width:10%">前回導入件数</th>
		
	</tr>
	<tr align="center" ; style="width: 400px;height: 30%;">
		<td>1</td>
		<td>すべての出品商品のレポート</td>
		<td>
			<input type="file" id="importfile_01" style="width: 400px;height: 30%;">
		</td>
		<td id="file01"></td><!---  动态显示怎么实现    --->
		<td></td>
	</tr>
	<tr align="center">
		<td>2</td>
		<td>全注文レポート</td>
		<td>
			<input type="file" id="importfile_02" style="width: 400px;height: 30%;">
		</td>
		<td id="file02"></td>
		<td></td>
	</tr>
	<tr align="center">
		<td>3</td>
		<td>FBA在庫レポート</td>
		<td>
			<input type="file" id="importfile_03" style="width: 400px;height: 30%;">
		</td>
		<td id="file03"></td>
		<td></td>
	</tr>
	<tr align="center">
		<td>4</td>
		<td>ペイメントレポート</td>
		<td>
			<input type="file" id="importfile_04" style="width: 400px;height: 30%;">
		</td>
		<td id="file04"></td>
		<td></td>
	</tr>
	<tr align="center">
		<td>5</td>
		<td>FBA未出荷レポート</td>
		<td>
			<input type="file" id="importfile_05" style="width: 400px;height: 30%;">
		</td>
		<td id="file05"></td>
		<td></td>
	</tr>
	<tr align="center">
		<td>6</td>
		<td>Qoo10未出荷レポート</td>
		<td>
			<input type="file" id="importfile_06" style="width: 400px;height: 30%;">
		</td>
		<td id="file06"></td>
		<td></td>
	</tr>
	<tr align="center">
		<td>7</td>
		<td>日付別_売上およびトラフィック</td>
		<td>
			<input type="file" id="importfile_07" style="width: 400px;height: 30%;">
		</td>
		<td id="file07"></td>
		<td></td>
	</tr>
	<tr align="center">
		<td>8</td>
		<td>日付別_詳細ページ 売上・トラフィック</td>
		<td>
			<input type="file" id="importfile_08" style="width: 400px;height: 30%;">
		</td>
		<td id="file08"></td>
		<td></td>
	</tr>
	<tr align="center">
		<td>9</td>
		<td>日付別_パフォーマンス</td>
		<td>
			<input type="file" id="importfile_09" style="width: 400px;height: 30%;">
		</td>
		<td id="file09"></td>
		<td></td>
	</tr>
	<tr align="center">
		<td>10</td>
		<td>ASIN別_詳細ページ 売上・トラフィック</td>
		<td>
			<input type="file" id="importfile_10" style="width: 400px;height: 30%;">
		</td>
		<td id="file10"></td>
		<td></td>
	</tr>
	<tr align="center">
		<td>11</td>
		<td>FBA在庫出荷レポート</td>
		<td>
			<input type="file" id="importfile_11" style="width: 400px;height: 30%;">
		</td>
		<td id="file11"></td>
		<td></td>
	</tr>
	<tr align="center">
		<td>12</td>
		<td>出荷レポート</td>
		<td>
			<input type="file" id="importfile_12" style="width: 400px;height: 30%;">
		</td>
		<td id="file12"></td>
		<td></td>
	</tr>
	<tr align="center">
		<td>13</td>
		<td>手数料見積り額レポート</td>
		<td>
			<input type="file" id="importfile_13" style="width: 400px;height: 30%;">
		</td>
		<td id="file13"></td>
		<td></td>
	</tr>
	<tr align="center">
		<td>14</td>
		<td>在庫保管手数料レポート</td>
		<td>
			<input type="file" id="importfile_14" style="width: 400px;height: 30%;">
		</td>
		<td id="file14"></td>
		<td></td>
	</tr>
	<tr align="center">
		<td>15</td>
		<td>長期在庫保管手数料請求額レポート</td>
		<td>
			<input type="file" id="importfile_15" style="width: 400px;height: 30%;">
		</td>
		<td id="file15"></td>
		<td></td>
	</tr>
	<tr align="center">
		<td>16</td>
		<td>返品レポート</td>
		<td>
			<input type="file" id="importfile_16" style="width: 400px;height: 30%;">
		</td>
		<td id="file16"></td>
		<td></td>
	</tr>
	<tr align="center">
		<td>17</td>
		<td>返送推奨レポート</td>
		<td>
			<input type="file" id="importfile_17" style="width: 400px;height: 30%;">
		</td>
		<td id="file17"></td>
		<td></td>
	</tr>
	<tr align="center">
		<td>18</td>
		<td>返送所有権の放棄依頼の詳細レポート</td>
		<td>
			<input type="file" id="importfile_18" style="width: 400px;height: 30%;">
		</td>
		<td id="file18"></td>
		<td></td>
	</tr>


</table>
</body>
</html>