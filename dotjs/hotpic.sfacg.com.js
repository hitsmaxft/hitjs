// ==UserScript==
// @id             coldpic.sfacg.com-10d91cb4-1686-4609-ae45-303e3dcf1c18@scriptish
// @name           image autoload for sfacg.com
// @version        1.0
// @namespace      http://userscripts.org/~hitsmaxft
// @author         hitsmaxft
// @description    load all image in single page
// @include        http://*.sfacg.com/AllComic/*
// @run-at         document-end
// ==/UserScript==

var autoload = function(){
    var divContent = document.getElementById("content");
    divContent.style.backgroundColor="black";
    //#imgnode
    var clonenode = divContent.getElementsByTagName('a')[0].cloneNode(true);
    //clonenode.style="";
    //clonenode.href = 'javascript:void();';
    var nodes=divContent.childNodes; 

    //{{{clearup page content
    while(nodes.length>0){
        divContent.removeChild(nodes[0]);
    }
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
        link.appendChild(header);
        link.style.color="white";
        link.style.fontWeight="bold";
        //add preVolume
        if( true  ){
            link.href=preVolume;
            header.textContent="上一回";
            content.appendChild(link.cloneNode(true));
            header.textContent="下一回";
            link.href=nextVolume;
            content.appendChild(link.cloneNode(true));
            //document.body.insertBefore(link.cloneNode(true), content);
        }
    }

    var add_pic = function(){
        if (cur_pic_id>=max_pic_id){
            window.clearInterval(circleId);
            //console.log("Interval finished, cleanup...");
            add_chapterlink("next");
            return;
        }

        var newimg = document.createElement('img');
        var newtitle = document.createElement('h2');

        newtitle.style.color="white";
        newtitle.style.fontWeight="bold";
        //newtitle.textContent = "Page "+ (1 + cur_pic_id);
        faddLink(newtitle, cur_pic_id);
        divContent.appendChild(newtitle);

        newimg.src=picAy[cur_pic_id];
        newimg.id="img_"+ cur_pic_id.toString();
        divContent.appendChild(newimg);

        divContent.appendChild(document.createElement('hr'));
        cur_pic_id+=1;
        return true;
    }

    //**************start processing page
    add_chapterlink("pre");

    //first load
    if (add_pic()){
        //record interval id for auto existing
        circleId = window.setInterval(add_pic, 300);
    }

    //remove footer and advertisement
    document.body.removeChild(document.getElementById('foot'));
    divContent.style.bottom = '0';
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
contentEval(autoload, true);
