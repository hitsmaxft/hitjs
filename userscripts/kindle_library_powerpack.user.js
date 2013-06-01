// ==UserScript==
//
// @id              www.amazon.com-b556bb6f-ee56-4bea-b588-998dc5bb4777@scriptish
//
// @namespace      http://userscript.org/~hitsmaxft
//
// @name           Kindle Library Powerpack
//
// @version        2.6.1
//
// @author         hitsmaxft <mfthits@gmail.com>
//
// @description    tweaks for  Amazon kindle's personal documents library
//
// @grant          none
//
// @run-at         document-end
//
// @include        https://www.amazon.com/gp/*
//
// ==/UserScript==
//
// *changelog*
// 
// 2012-08-11
//
//   * send to device supported
//
// 2013-06-01
// 
//   * refactory with minor improments
//   * disable page freshing
//   * documents by docco
//
// *todo list*
//
// * issue: item limitation(DONE)
// * issue: lower performance
// * issue: buggy delete hook(NEW)

//Content Script
//----
//
(function(isUserScript) {
    //contentscript for userscript
    var contentScript = function() {

        //Basic setup
        //------

        //Testing on url
        //determie it works only in libray
        if (!/digital\/fiona\/manage/.test(window.location.href)) {
            console.log("not kindle library")
            return
        }

        //globals, make effections on default actions
        //items in list up to 200
        window.ykl.displaySize = 100;
        window.pageList.pageSize = 100;
        window.doMyFlush = 0;
        //Hook Delete Action
        eval("Fion.deleteItem =" + Fion.deleteItem.toString().replace(
                'window.location.reload();',
                'console.log("deleted "+ contentName); window.myFlushTable(contentName)') + ";")


        //Utils
        //------

        //Hook default action on deleting items
        window.myFlushTable = function(name) {
            name = name.split('_')[1]
            for (var key in itemCache.theData) {
                if (itemCache.theData[key].asin == name) {
                    itemCache.theData.splice(key, 1)
                    console.log("remove item from cache ")
                }
            }
            if (parseInt(window.doMyFlush) < 1) {
                console.log("repage");
                pageList.init()
                pageList.gotopage(1)
            } else {
                window.doMyFlush = window.doMyFlush - 1;
                console.log("reduce doMyFlush");
            }
        }

        var classTr = "rowHeaderCollapsed";
        var metaBox = document.createElement('input');
        metaBox.type = "checkbox";
        metaBox.className = "removeCheckBox";
        metaBox.style.margin = "0";

        //Check and add checkbox for each item
        //20 items in a time
        var addCheckBox = function() {
            var trs = document.getElementsByClassName(classTr);
            var length = trs.length
            for (var index = 0; index <length ; index++) {
                var curTr = trs[index];
                var firstTD = curTr.getElementsByTagName('td')[0];
                if (firstTD.getElementsByTagName("input").length == 0) {
                    var newBox = metaBox.cloneNode(true);
                    var rowIndex = /Row([0-9]+)/.exec(curTr.id)[1];
                    newBox.id = "idChecked" + rowIndex
                    newBox.setAttribute("number", rowIndex)
                    firstTD.appendChild(newBox)
                }
            }
        }

        //Batch deleting checked items
        var DoRemove = function() {
            var a = document.getElementsByClassName('rowBodyCollapsed');
            var ditem = []
            for (var i = 0; i < a.length; i++) {
                rowIndex = /Row([0-9]+)/.exec(a[i].id)[1];
                var item = document.getElementById("idChecked" + rowIndex)
                if (item && item.checked != false) {

                    ditem.push(a[i].getAttribute('asin'))
                }
            };
            if (ditem.length > 0) {
                window.doMyFlush = ditem.length - 1;
                for (var i in ditem) {
                    Fion.deleteItem('deleteItem_' + ditem[i]);
                }
            }
        }

        //Main Process
        //----

        var mklToolkit = jQuery("<div id=\"mklToolkit\"></div>")
        var idMonitor = function() {}

        //add link in personal document library
        var metalink = document.createElement('a');
        var relink = document.createElement('a');
        var ckAll, invckAll, sendAll;
        metalink.setAttribute('href', 'javascript:void(0);');
        metalink.style.marginLeft = "10px";
        metalink.style.marginRight = "10px";
        var rmlink = metalink.cloneNode(true);

        rmlink.style.color = "red";
        rmlink.text = "Remove checked items!";
        rmlink.onclick = function() {
            if (confirm('remove all items in list?')) {
                DoRemove();
            } else {
                return;
            }
        };
        ckAll = metalink.cloneNode(true);
        ckAll.text = "Check/unCheck All";
        ckAll.id = "mkl_ckall"
        ckAll.onclick = function() {
            var cbs = jQuery(".removeCheckBox")
            cbs.attr("checked", !(cbs.filter(":checked").length > 0))
        }

        invckAll = metalink.cloneNode(true);
        invckAll.text = "Inverse";
        invckAll.id = "mkl_invall"
        invckAll.onclick = function() {
            var cbs = document.getElementsByClassName("removeCheckBox");
            for (var i = 0; i < cbs.length; ++i) {
                cbs[i].checked = !cbs[i].checked;
            }
        }

        //device list for document deliveraty
        var deviceLists = jQuery("<select id=\"sendDevicesList\"></select>")
        var selections = jQuery("<span class=\"filters\">you Devices:</span>")

        jQuery(yourDevices.ownedDeviceList)
            .filter(function(index) {
                return (this.emailAddress.length > 0)
            }).each(function() {
                deviceLists.append(
                    jQuery(
                        Array.join([
                                "<option value=\"",
                                this.accountID,
                                "\">",
                                this.name,
                                "</option>"
                            ],
                            "")));
            })
        selections.append(deviceLists);
        sendAll = jQuery(metalink.cloneNode(true)).click(function() {
                var contentName, deviceName, messageId, kindleName
                var curOption = jQuery("#mklToolkit option:selected")
                deviceName = curOption.attr("value")
                kindleName = curOption.text()
                //message_id="kindle_pdoc"
                jQuery(".removeCheckBox").filter(':checked').each(function() {
                        contentName = jQuery("[id='Row" + this.getAttribute("number") + " expand']").attr("asin");
                        messageId = "singleItemSend" + "_" + contentName

                        //text notification start
                        var sendingBoxId = "singleItemSend_" + contentName;
                        var sendingBox = document.getElementById(sendingBoxId);
                        sendingBox.innerHTML = mykJS.kindle_myk_popover_sending_60987; //"Sending..."
                        Fion.showActionMsgRow(sendingBoxId);
                        sendingBox.style.display = "block";
                        //text notification continue
                        console.log(contentName, deviceName, messageId, kindleName)
                        try {
                            Fion.sendToDevice(contentName, deviceName, messageId, kindleName)
                        } catch (e) {
                            sendingBox.innerHTML = e;
                        }
                    })
            }).text("sendAll").attr("href", "javascript:void(0)")

        //Append handle element into page content
        div_title = document.getElementById('orders-div')
        ;[
            rmlink, ckAll, invckAll,
            selections, sendAll
        ].forEach(function(obj) {
                mklToolkit.append(obj)
            })

        console.log("add toolkit ui and checkbox timer")
        div_title.insertBefore(mklToolkit[0], div_title.getElementsByTagName('h2')[0].nextSibling)
        window.setInterval(addCheckBox, 200)

        //Refresh list
        pageList.gotopage(1)
    }

    //Content Script Utils
    //------

    //insert content scripts
    function contentEval(source, eval, timeout) {
        if (!/digital\/fiona\/manage/.test(window.location.href)) {
            console.log("not kindle library")
            return 
        }
        //util function, eval script in current page source
        var Eval = eval || false
        var Timeout = timeout || 0
        if ('function' == typeof source && Eval) {
            source = '(' + source + ')();'
        }
        var script = document.createElement("script")
        script.setAttribute("type", "application/javascript")
        script.textContent = source
        script.id = "KindleLPP"
        window.setTimeout(function() {
                document.body.appendChild(script);
                //document.body.removeChild(script);
            }, Timeout)
    }
    //Execute script content
    contentEval(contentScript, true, 8000)
    //jQuery("#ordersList").ready(function(){contentEval(addBatchHandler, true , 4000)})

})(true)
//with js-beautify(sourcecode beautify) and docco (html document) from npm
