// ==UserScript==
// id              www.amazon.com-b556bb6f-ee56-4bea-b588-998dc5bb4777@scriptish
// @namespace      http://userscript.org/~hitsmaxft
// @name           Kindle Library Powerpack
// @version        2.1.0
// @author         hitsmaxft<mfthits@gmail.com>
// @downloadURL    http://userscripts.org/scripts/source/130289.user.js
// @updateURL      http://userscripts.org/scripts/source/130289.user.meta.js
// @description    batch delete item from personal documents library for Amazon kindle
// @grant          none
// @run-at         document-end
// @include        https://www.amazon.com/*
// ==/UserScript==
//


// changelog
// 2012-11-23  show 10000 items in list ^_^, no any pagination~
// 2012-08-11  send to device supported
//             bugfix: orginal text animation callback not work while sending documents
// #todo
// - issue: style improving

(function () {
    'use strict';

    if (!/digital\/fiona\/manage/.test(window.location.href)) {
        //console.log("not kindle library")
        return;
    }

    var addBatchHandler = function () {
        var addCheckBox = function () {
            //now display items up to 10k
            window.ykl.displaySize = 10000;
            var classTr = "rowHeaderCollapsed";
            var trs = document.getElementsByClassName(classTr);
            var metaBox = document.createElement('input');
            metaBox.type = "checkbox";
            metaBox.className = "removeCheckBox";
            metaBox.style.margin = "0";
            var index;
            for (index = 0; index < trs.length; index++) {
                var curTr = trs[index];
                var firstTD = curTr.getElementsByTagName('td')[0];
                if (firstTD.getElementsByTagName("input").length === 0) {
                    var newBox = metaBox.cloneNode(true);
                    var rowIndex = /Row([0-9]+)/.exec(curTr.id)[1];
                    newBox.id = "idChecked" + rowIndex;
                    newBox.setAttribute("number", rowIndex);
                    firstTD.appendChild(newBox);
                }
            }
        };
        var mklToolkit = jQuery("<div id=\"mklToolkit\"></div>");

        var idMonitor = function () { };
        //add link in personal document library
        var metalink = document.createElement('a');
        var relink = document.createElement('a');
        var ckAll, invckAll, sendAll;
        metalink.setAttribute('href', '#');
        metalink.style.marginLeft = "10px";
        metalink.style.marginRight = "10px";
        var rmlink = metalink.cloneNode(true);

        rmlink.style.color = "red";
        rmlink.textContent = "Remove checked items!";
        var doRemove = function () {
            var a = document.getElementsByClassName('rowBodyCollapsed');
            var i;
            for (i = 0; i < a.length; i++) {
                var rowIndex = /Row([0-9]+)/.exec(a[i].id)[1];
                if (document.getElementById("idChecked" + rowIndex).checked !== false) {
                    Fion.deleteItem('deleteItem_' + a[i].getAttribute('asin'));
                    //Fion.deleteItem('deleteItem_'+a[i].getAttribute('asin'));
                    //console.log('deleteItem_'+a[i].getAttribute('asin'))
                }
            }
            return;
        };
        rmlink.onclick = function () {
            if (confirm('remove all items in list?')) {
                doRemove();
            } else {
                return;
            }
        };
        ckAll = metalink.cloneNode(true);
        ckAll.textContent = "Check/Uncheck All";
        ckAll.id = "mkl_ckall";
        ckAll.onclick = function () {
            var cbs = jQuery(".removeCheckBox");
            cbs.attr("checked", !(cbs.filter(":checked").length > 0));
        };

        invckAll = metalink.cloneNode(true);
        invckAll.textContent = "Inverse";
        invckAll.id = "mkl_invall";
        invckAll.onclick = function () {
            var cbs = document.getElementsByClassName("removeCheckBox"), i;
            for (i = 0; i < cbs.length; i++) {
                cbs[i].checked = !cbs[i].checked;
            }
        };

        //device list for document deliveraty
        var deviceLists = jQuery("<select id=\"sendDevicesList\"></select>");
        var selections = jQuery("<span class=\"filters\">Your Devices:</span>");

        jQuery(yourDevices.ownedDeviceList)
            .filter(
                function (index) { return this.emailAddress.length > 0; }
            ).each(function () {
                deviceLists.append(
                    jQuery(
                        [
                            "<option value=\"",
                            this.accountID,
                            "\">",
                            this.name,
                            "</option>"
                        ].join("")
                    )
                );
            });
        selections.append(deviceLists);
        sendAll = jQuery(metalink.cloneNode(true)).click(
            function () {
                var contentName, deviceName, messageId, kindleName;
                var curOption = jQuery("#mklToolkit option:selected");
                deviceName = curOption.attr("value");
                kindleName = curOption.text();
                //message_id="kindle_pdoc"
                jQuery(".removeCheckBox").filter(':checked').each(function () {
                    contentName = jQuery("[id='Row" + this.getAttribute("number") + " expand']").attr("asin");
                    messageId = "singleItemSend" + "_" + contentName;

                    //text notification start
                    var sendingBoxId = "singleItemSend_" + contentName;
                    var sendingBox = document.getElementById(sendingBoxId);
                    sendingBox.innerHTML = mykJS.kindle_myk_popover_sending_60987; //"Sending..."
                    Fion.showActionMsgRow(sendingBoxId);
                    sendingBox.style.display = "block";
                    //text notification continue
                    console.log(contentName, deviceName, messageId, kindleName);
                    try {
                        Fion.sendToDevice(contentName, deviceName, messageId, kindleName);
                    } catch (e) {
                        sendingBox.innerHTML = e;
                    }
                });
            }
        ).text("Send All").attr("href", "#");

        //append handle element into page content
        var div_title = document.getElementById('orders-div');
        [
            rmlink, ckAll, invckAll,
            selections, sendAll
        ].forEach(
            function (obj) {
                mklToolkit.append(obj);
            }
        );

        div_title.insertBefore(mklToolkit[0], div_title.getElementsByTagName('h2')[0].nextSibling);
        window.setInterval(addCheckBox, 2000);
    };

    function contentEval(source, doEval, timeout) {
        //util function, eval script in current page source
        doEval = doEval || false;
        timeout = timeout || 0;
        if ('function' === typeof source && doEval) {
            source = '(' + source + ')();';
        }
        var script = document.createElement('script');
        script.setAttribute("type", "application/javascript");
        script.textContent = source;
        window.setTimeout(function () {
            document.body.appendChild(script);
            document.body.removeChild(script);
        }, timeout);
    }

    contentEval(addBatchHandler, true, 4000);
    //jQuery("#ordersList").ready(function(){contentEval(addBatchHandler, true , 4000)})
}());
