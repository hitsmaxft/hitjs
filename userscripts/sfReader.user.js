// ==UserScript==
// @id             sfacg.com-10d91cb4-1686-4609-ae45-303e3dcf1c18@scriptish
// @name           image autoload for sfacg.com
// @version        1.2
// @namespace      http://userscripts.org/~hitsmaxft
// @author         hitsmaxft
// @description    load all image in single page
// @include        http://*.sfacg.com/AllComic/*
// @require        http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js
// @run-at         document-end
// @grant	   none
// ==/UserScript==
/*
 * 1.1 add links for chapter navigation
 */
( function ($) {
	var Main = function(){
		var self;

		var G ={
			imgs:[]
				,some:undefined
				,scroll:1
		};
		var waiting_time=3000; //xx ms

		var divMain = document.getElementById("content");
		divMain.style.position="inherit";
		divMain.style.backgroundColor="black";
		divMain.style.bottom = '0';
		var divContent = document.createElement("p");

		//#imgnode
		var clonenode = divMain.getElementsByTagName('a')[0].cloneNode(true);
		//clonenode.style="";
		//clonenode.href = 'javascript:void();';
		var nodes=divMain.childNodes; 

		//{{{clearup page content
		while(nodes.length>0){
			divMain.removeChild(nodes[0]);
		}
		divMain.appendChild(divContent);
		//}}}
		var interTime = 5;
		var cur_pic_id = 0;
		var max_pic_id = picCount;
		var circleId=0;

		var faddLink = function(head, count){
			var link_reload = document.createElement('a');
			link_reload.textContent = "Page " + (1 + cur_pic_id).toString();
			link_reload.href="javascript:reload_img("+count+")";
			head.appendChild(link_reload);
		}

		// 添加章节链接
		var add_chapterlink = function(pos){
			var header = document.createElement("h2");
			var link = document.createElement("a");
			var content = document.getElementById("content");
			var linkItem;
			var paginator = document.createElement("ul");
			var pageMark = document.createElement("li");
			pageMark.style.color="white"
				pageMark.id="pageMark";
			pageMark.textContent="第N页";
			paginator.style.position='fixed';
			paginator.style.top="0";
			paginator.style.left="0";
			var pItem = document.createElement("li");

			link.style.color="white";
			link.style.fontWeight="bold";
			pItem.style.listDecoration="none";
			pItem.style.float="left";

			link.href=preVolume;
			link.textContent="上一回";
			linkItem = pItem.cloneNode(true);
			linkItem.appendChild(link.cloneNode(true));
			paginator.appendChild(linkItem);

			link.textContent="下一回";
			link.href=nextVolume;
			linkItem = pItem.cloneNode(true);
			linkItem.appendChild(link.cloneNode(true));
			paginator.appendChild(linkItem);
			paginator.appendChild(pageMark);
			content.appendChild(paginator);

		}

		var add_pic = function(){
			if (cur_pic_id>=max_pic_id){
				window.clearInterval(circleId);
				//add_chapterlink("next");
				return;
			}

			var newimg = document.createElement('img');
			var newtitle = document.createElement('h2');

			newtitle.style.color="white";
			newtitle.style.fontWeight="bold";
			//newtitle.textContent = "Page "+ (1 + cur_pic_id);
			faddLink(newtitle, cur_pic_id);
			//divContent.appendChild(newtitle);

			newimg.src=picAy[cur_pic_id];
			newimg.id="img_"+ cur_pic_id.toString();

			G.imgs.push(newimg);
			divContent.appendChild(newimg);

			divContent.appendChild(document.createElement('hr'));
			cur_pic_id+=1;
			return true;
		}

		//**************start processing page
		add_chapterlink("pre");

		$(window).scroll( function() {
			G.scroll=1;
		} )

		var count_page_id = function (){
			console.log("scroll");
		}

		var show_id = function(evnt) {
			if ( G.scroll ==1 ) {
				var top = $(window).scrollTop() + window.innerWidth/3.0;

				var imgs = $("#content p img").toArray();
				console.log(imgs);
				for (var i in imgs) {
					if (
							top >= imgs[i].y
							&& top < parseInt(imgs[i].y) + parseInt(imgs[i].clientHeight)

					   ) {
						   $("#pageMark").text("第" + (parseInt(i)+1) + "页")
							   G.scroll = 0 
							   return 0
							   break;
					   }
				}
				G.scroll = 0 
			}
		}

		//first load
		if (add_pic()){
			//record interval id for auto existing
			circleId = window.setInterval(add_pic, waiting_time);

		}
		window.setInterval(show_id, 200);
		//remove footer and advertisement
		document.body.removeChild(document.getElementById('foot'));
		document.body.style.overflow="auto";
		document.head.style.overflow="auto";
		$("html").css("overflow", "auto").css("height","auto")
	};

	function reload_img(img_id){
		var img = document.getElementById("img_"+img_id);
		var orig_img = img.src;
		img.src="http://rs.sfacg.com/images/sflogo.gif";
		window.setTimeout(function(){img.src=orig_img;}, 400);

	}

	function contentEval(source, remove) {
		var Eval=arguments[1]?arguments[1]:false;  
		if ('function' == typeof source && Eval) {
			source = '(' + source + ')();'
		}
		var script = document.createElement('script');
		script.setAttribute("type", "application/javascript");
		script.textContent = source;
		document.body.appendChild(script);
		if(remove){
			document.body.removeChild(script);
		}
	}

	contentEval(reload_img, false);
	contentEval(Main, true);
})(jQuery);
