<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="efw" uri="efw" %> 
<!-- <上面两行的作用 > -->
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<title>データ導入</title>

	<!-- 如果连接没有设置名字，那么返回空白回复； 如果有设置名字，那么返回名字。 -->
	<efw:Client/>

	<script>
            (function ($) {
			//$.getUrlParam 获取 的是什么
                $.getUrlParam = function (name) {
                    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
                    var r = window.location.search.substr(1).match(reg);     //match() 方法可在字符串内检索指定的值，或找到一个或多个正则表达式的匹配。
                    // unescape(r[2])返回的是什么
					if (r != null) return unescape(r[2]); return null;
                }
            })(jQuery);//传入jQuery 的目的

			//debug:
            $(function(){
				//获取跳转页面链接里的参数 例如 路径 http://localhost/wx/auctionDetail?status=26&statusID=3 可以获取到status statusID的值
	            var shop = $.getUrlParam('shop');//shop 指的是什么
				//page 的作用
	            var page = "データ導入";

	            var t = page + "(" + shop + ")" + $("#pagehead").html();
				//html() 方法设置或返回被选元素的内容（innerHTML）
	            $("#pagehead").html(t);
				//val() 方法返回或设置被选元素的 value 属性。
	            $("#shop").val(shop);
			 
			});

			function searchHistory(){
				Efw('searchhistory');
			}

			function importData(){

				var rd = $("input[name='opt_type']:checked").val();

				Efw('uploadfile',{data:'liststock', liststock: rd});

			}

  	</script>
    <style>
      .upfile {
          border-top: 2px;
          border-right: 2px;
          border-left: 2px;
          border-bottom: 2px;
          border-style: solid;

      }
    </style>
</head>
<body style="background-color:ghostwhite;" onload="searchHistory();">

<div style="font-size: 30px;color: blue;display: inline-block;width: 100%" id="pagehead">
	<img src="img/home.png" style="width: 64px;height: 64px;" onclick="window.location.href = '/smartinfo2/'">
</div>
<div style="text-align: right;width: 70%;">
	<input type="button" id="import" style="width: 170px;height: 30px;" value="導入"
		onclick="Efw('master/importmaster')">
</div>
<table border="1" style="width: 70%;height: 70%;">
	<tr style="background-color:rgba(86, 86, 207, 0.696) ;">
		<th style="width:10%">No</th>
		<th style="width:20%">ファイル名称</th>
		<th style="width:10%">添付ファエル</th>
		<th style="width:50%">前回導入日時</th>
		<th style="width:10%">前回導入件数</th>
	</tr>
	<tr align="center" ; style="width: 400px;height: 30%;">
		<td>2</td>
		<td>22</td>
		<td>
			<input type="file" id="importfile_earnings" style="width: 400px;height: 30%;">
		</td>
		<td>222</td>
		<td>2222</td>
	</tr>
	<tr align="center">
		<td>3</td>
		<td>3</td>
		<td>
			<input type="file" id="importfile_earnings" style="width: 400px;height: 30%;">
		</td>
		<td>3</td>
		<td>3</td>
	</tr>
	<tr align="center">
		<td>4</td>
		<td>4</td>
		<td>
			<input type="file" id="importfile_earnings" style="width: 400px;height: 30%;">
		</td>
		<td>4</td>
		<td>4</td>
	</tr>
	<tr align="center">
		<td>5</td>
		<td>5</td>
		<td>
			<input type="file" id="importfile_earnings" style="width: 400px;height: 30%;">
		</td>
		<td>5</td>
		<td>5</td>
	</tr>
	<tr align="center">
		<td>6</td>
		<td>6</td>
		<td>
			<input type="file" id="importfile_earnings" style="width: 400px;height: 30%;">
		</td>
		<td>6</td>
		<td>6</td>
	</tr>
	<tr align="center">
		<td>7</td>
		<td>7</td>
		<td>
			<input type="file" id="importfile_earnings" style="width: 400px;height: 30%;">
		</td>
		<td>7</td>
		<td>7</td>
	</tr>
	<tr align="center">
		<td>8</td>
		<td>8</td>
		<td>
			<input type="file" id="importfile_earnings" style="width: 400px;height: 30%;">
		</td>
		<td>8</td>
		<td>8</td>
	</tr>
	<tr align="center">
		<td>9</td>
		<td>9</td>
		<td>
			<input type="file" id="importfile_earnings" style="width: 400px;height: 30%;">
		</td>
		<td>9</td>
		<td>9</td>
	</tr>
	<tr align="center">
		<td>10</td>
		<td>10</td>
		<td>
			<input type="file" id="importfile_earnings" style="width: 400px;height: 30%;">
		</td>
		<td>10</td>
		<td>10</td>
	</tr>
	<tr align="center">
		<td>11</td>
		<td>11</td>
		<td>
			<input type="file" id="importfile_earnings" style="width: 400px;height: 30%;">
		</td>
		<td>11</td>
		<td>11</td>
	</tr>
	<tr align="center">
		<td>12</td>
		<td>12</td>
		<td>
			<input type="file" id="importfile_earnings" style="width: 400px;height: 30%;">
		</td>
		<td>12</td>
		<td>12</td>
	</tr>
	<tr align="center">
		<td>13</td>
		<td>13</td>
		<td>
			<input type="file" id="importfile_earnings" style="width: 400px;height: 30%;">
		</td>
		<td>13</td>
		<td>13</td>
	</tr>
	<tr align="center">
		<td>14</td>
		<td>14</td>
		<td>
			<input type="file" id="importfile_earnings" style="width: 400px;height: 30%;">
		</td>
		<td>14</td>
		<td>14</td>
	</tr>
	<tr align="center">
		<td>15</td>
		<td>15</td>
		<td>
			<input type="file" id="importfile_earnings" style="width: 400px;height: 30%;">
		</td>
		<td>15</td>
		<td>15</td>
	</tr>
	<tr align="center">
		<td>16</td>
		<td>16</td>
		<td>
			<input type="file" id="importfile_earnings" style="width: 400px;height: 30%;">
		</td>
		<td>16</td>
		<td>16</td>
	</tr>
	<tr align="center">
		<td>17</td>
		<td>17</td>
		<td>
			<input type="file" id="importfile_earnings" style="width: 400px;height: 30%;">
		</td>
		<td>17</td>
		<td>17</td>
	</tr>
	<tr align="center">
		<td>18</td>
		<td>18</td>
		<td>
			<input type="file" id="importfile_earnings" style="width: 400px;height: 30%;">
		</td>
		<td>18</td>
		<td>18</td>
	</tr>


</table>
</body>
</html>