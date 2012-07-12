// ==UserScript==
// @id             www.amazon.com-b556bb6f-ee56-4bea-b588-998dc5bb4777@scriptish
// @name           Remove all personal documents
// @version        1.2
// @namespace      http://userscript.org/~hitsmaxft
// @author         hitsmaxft<mfthits@gmail.com>
// @description    batch delete item from personal documents library for Amazon kindle
// @include        https://www.amazon.com/*
// @run-at         document-end
// -require			http://userscripts.org/usocheckup/130289.js
// ==/UserScript==
//

var addBatchHandler = function(){
    var addCheckBox = function () {
        var classTr = "rowHeaderCollapsed";
        var trs = document.getElementsByClassName(classTr);
        var metaBox = document.createElement('input');
        metaBox.type="checkbox";
        metaBox.className = "removeCheckBox";
        metaBox.style.margin="0";
        for(var index =0 ; index<trs.length; index++ ){
            var curTr =trs[index] ;
            var firstTD = curTr.getElementsByTagName('td')[0];
            if (firstTD.getElementsByTagName("input").length == 0 ) {
                var newBox = metaBox.cloneNode(true);
                var rowIndex = /Row([0-9]+)/.exec(curTr.id)[1];
                newBox.id = "idChecked" +rowIndex;
                firstTD.appendChild(newBox);
            }
        }
    };

    var idMonitor = function () { };
    //add link in personal document library
    var metalink = document.createElement('a');
    var relink = document.createElement('a');
    var ckAll,unckAll,invckAll;
    metalink.setAttribute('href', 'javascript:void(0);');
    metalink.style.marginLeft="20px";
    var rmlink = metalink.cloneNode(true);

    rmlink.style.color="red";
    rmlink.text="Remove checked items!";

    rmlink.onclick = function(){
        var DoRemove = function(){
            var a=document.getElementsByClassName('rowBodyCollapsed');
            for(var i =0; i < a.length; i++) {
                rowIndex = /Row([0-9]+)/.exec(a[i].id)[1];
                if ( document.getElementById("idChecked"+rowIndex).checked != false ){
                    Fion.deleteItem('deleteItem_'+a[i].getAttribute('asin'));
                    //console.log('deleteItem_'+a[i].getAttribute('asin'))
                }
            };
            return;
        }
        if(confirm('remove all items in list?')){
            DoRemove();
        } else {
            return;
        }
    };
    ckAll = metalink.cloneNode(true);
    ckAll.text="Check All";
    ckAll.onclick = function(){
        var cbs = document.getElementsByClassName("removeCheckBox");
        for(var i = 0 ; i< cbs.length; ++i ){
            cbs[i].checked=true;
        }
    }

    unckAll = metalink.cloneNode(true);
    unckAll.text="Uncheck All";
    unckAll.onclick = function(){
        var cbs = document.getElementsByClassName("removeCheckBox");
        for(var i = 0 ; i< cbs.length; ++i ){
            cbs[i].checked=false;
        }
    }
    invckAll = metalink.cloneNode(true);
    invckAll.text="Inverse";
    invckAll.onclick = function(){
        var cbs = document.getElementsByClassName("removeCheckBox");
        for(var i = 0 ; i< cbs.length; ++i ){
            cbs[i].checked=!cbs[i].checked;
        }
    }

    div_title = document.getElementById('orders-div');
    div_title.insertBefore( invckAll, div_title.getElementsByTagName('h2')[0].nextSibling );
    div_title.insertBefore( unckAll, div_title.getElementsByTagName('h2')[0].nextSibling );
    div_title.insertBefore( ckAll, div_title.getElementsByTagName('h2')[0].nextSibling );
    div_title.insertBefore( rmlink, div_title.getElementsByTagName('h2')[0].nextSibling );
    window.setInterval(addCheckBox,2000);
};

function contentEval( source) {
    //util function, eval script in current page source
    var Eval=arguments[1]?arguments[1]:false;  
    if ('function' == typeof source && Eval) {
        source = '(' + source + ')();'
    }
    var script = document.createElement('script');
    script.setAttribute("type", "application/javascript");
    script.textContent = source;
    document.body.appendChild(script);
    document.body.removeChild(script);
}

contentEval( addBatchHandler, true );

