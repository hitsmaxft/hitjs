// ==UserScript==
// id              www.amazon.com-b556bb6f-ee56-4bea-b588-998dc5bb4777@scriptish
// @name           Remove all personal documents
// @version        1.2
// @namespace      http://userscript.org/~hitsmaxft
// @author         hitsmaxft<mfthits@gmail.com>
// @description    batch delete item from personal documents library for Amazon kindle
// @include        https://www.amazon.com/*
// @grant          none
// run-at          document-end
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
                newBox.id = "idChecked" +rowIndex
                newBox.setAttribute("number", rowIndex)
                firstTD.appendChild(newBox)
            }
        }
    };

    var mklToolkit=jQuery("<div id=\"mklToolkit\"></div>");

    var idMonitor = function () { };
    //add link in personal document library
    var metalink = document.createElement('a');
    var relink = document.createElement('a');
    var ckAll,unckAll,invckAll, sendAll;
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
    rmlink.onclick = function(){
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

    var selections = jQuery("<select id=\"sendDevicesList\"></select>");
    jQuery(yourDevices.ownedDeviceList).filter(
        function(index){
            return (this.emailAddress.length>0)
        }
    ).each(
        function(){
            selections.append(
                jQuery(
                    Array.join([
                            "<option value=\"",
                            this.accountID,
                            "\">",
                            this.name,
                            "</option>"
                        ],
                        ""
                    )
                )
            );
        })
    sendAll = jQuery("<a></a>").click(
        function(){
            var content_name, device_name, message_id, kindle_name
            var cur_option = jQuery("#mklToolkit option:selected")
            device_name = cur_option.attr("value")
            kindle_name = cur_option.text()
            //message_id="kindle_pdoc"
            jQuery(".removeCheckBox").filter(':checked').each(function(){
                    //console.log(this)
                    //console.log("[id='Row" + this.getAttribute("number") + " expand']")
                    content_name = jQuery("[id='Row" + this.getAttribute("number") + " expand']").attr("asin");
                    message_id ="singleItemSend" + "_" + content_name
                    Fion.sendToDevice(content_name, device_name, message_id, kindle_name)
                    console.log(content_name, device_name, message_id, kindle_name)
                })
        }
    ).text("sendAll").attr("href", "javascript:void(0)")

    div_title = document.getElementById('orders-div')
    ;[
        rmlink, ckAll, unckAll, invckAll,
        selections, sendAll
    ].forEach(
        function(obj){
            mklToolkit.append(obj)
        }
    )

    div_title.insertBefore( mklToolkit[0], div_title.getElementsByTagName('h2')[0].nextSibling )
    window.setInterval(addCheckBox,2000)
}

function contentEval(source) {
    //util function, eval script in current page source
    var Eval = arguments[1] || false  
    var Timeout = arguments[2] || 0
    if ('function' == typeof source && Eval) {
        source = '(' + source + ')();'
    }
    var script = document.createElement('script')
    script.setAttribute("type", "application/javascript")
    script.textContent = source
    window.setTimeout(function(){
            document.body.appendChild(script);
            document.body.removeChild(script);
        },Timeout)
}

contentEval( addBatchHandler, true , 4000)
