var WebClipping = Class.create();
WebClipping.prototype = {
    initialize: function(element) {
        this.container = $(element);
        this.currentElement = null;
        this.tempElement = null;
        this.timer = null;
        this.undo = new Array();
        this.overlay = $('clippingOverlay');
        this.isIE = !!document.all;
        Event.observe(this.container, 'mousemove', this.processMouseMove.bindAsEventListener(this));
        Event.observe(this.container, 'mousedown', this.processMouseDown.bindAsEventListener(this));
        Event.observe(this.container, 'dblclick', this.processDblclick.bindAsEventListener(this));
        Event.observe(this.container, 'contextmenu', this.processContextmenu.bindAsEventListener(this));
    },
    processMouseMove: function(ev) {
        Event.stop(ev);
        var n;
        if (this.isIE) {
            Element.hide(this.overlay);
            n = this.getRect(document.elementFromPoint(ev.x, ev.y));
        } else
            n = this.getRect(ev.target);
        if (n != this.tempElement) {
            this.currentElement = n;
            this.synchronizeRect();
            this.tempElement = n;
        }
        if (this.isIE)
            Element.show(this.overlay);
    },
    processMouseDown: function(ev) {
        if (Event.isLeftClick(ev))
            this.timer = setTimeout(this.processSingleClick.bindAsEventListener(this), 400);
    },
    processSingleClick: function() {
        if (this.undo.length > 0) {
            this.currentElement = this.undo.pop();
            this.synchronizeRect();
            this.tempElement = this.currentElement;
        }
    },
    processDblclick: function() {
        clearTimeout(this.timer);
        //alert(this.currentElement.tagName);
        var nid = this.currentElement.getAttribute("nid");
        if (window.opener == null) {
            window.returnValue = nid;
        } else {
            if (nid != undefined || nid != null) {
                window.opener.onSelectCompleted(nid);
            }
        }

        window.close();
    },
    processContextmenu: function(ev) {
        Event.stop(ev);
        var pNode = this.currentElement.parentNode;
        if (!this.isBody()) {
            pNode = this.getRect(pNode);
            this.undo.push(this.currentElement);
            this.currentElement = pNode;
            this.synchronizeRect();
            this.tempElement = this.currentElement;
        }
        return false;
    },
    synchronizeRect: function() {
        if (this.isIE) {
            var p = Position.cumulativeOffset(this.currentElement);
            this.overlay.style.top = p[1] + 'px';
            this.overlay.style.left = p[0] + 'px';
            this.overlay.style.width = (this.currentElement.offsetWidth + (this.isBody() ? (document.documentElement.scrollLeft || document.body.scrollLeft) : 0)) + 'px';
            this.overlay.style.height = (this.currentElement.offsetHeight + (this.isBody() ? (document.documentElement.scrollTop || document.body.scrollTop) : 0)) + 'px';
        } else {
            Element.removeClassName(this.tempElement, 'highLight');
            Element.addClassName(this.currentElement, 'highLight');
        }
    },
    isBody: function() {
        return /^body$/i.test(this.currentElement.tagName);
    },
    getRect: function(node) {
        while (node && !/^body$|table|div/i.test(node.tagName))
            node = node.parentNode;
        return node;
    }
}

function showClipContent(ns, url, count, needShowMore) {
    try {
        var row, html = [];
        var content = Ext.getDom('t' + ns).value;
        var i = count ? parseInt(count) : 1000;
        var tpl = Ext.Template.from('tpl' + ns, {
            compiled: true
        });
        var re = new RegExp(Ext.getDom('reg' + ns).value, 'ig');
        while ((row = re.exec(content)) != null && i--) {
            html.push(tpl.applyTemplate(row));
        }
    } catch (e) {}
    if (needShowMore)
        html.push('<div class="clipMore"><a href="' + url + '" target="_blank"><img src="images/s.gif" alt=""/></a></div>');
    Ext.getDom('v' + ns).innerHTML = html.join('');
}


/*function showWebClipContent(url,tabindex){
	 Ext.Ajax.request({
        url:url,
        params:{tabindex:tabindex},
        success:function(response) {
        	var div=$("webClippingView");
        	var template;
        	var jsontext = response.responseText;
            var obj = Ext.decode(jsontext);
            if(obj['isReserveStyle'])div.Class="clipContent clipReset clearFix";
            if(obj['template']!='')template=obj['template'];
            else template='<div class="clipRow">{0}</div>';
            if(obj['regExp']=='')div.innerHTML=obj['content'];
            else div.innerHTML=['<textarea id="t<portlet:namespace />" style="display:none;">',obj['content'],'</textarea>',
            '<textarea id="reg<portlet:namespace />" style="display:none;">',obj['regExp'],'</textarea>',
            '<textarea id="tpl<portlet:namespace />" style="display:none;">',template,'</textarea>',
            '<div id="v<portlet:namespace />"></div>',
            '<script type="text/javascript">',
                'Ext.onReady(function(){showClipContent(','<portlet:namespace />',obj['url'],obj['count'],')});',
            '</script>'].join("");
            }
    });
    return false;
	}*/
function showWebClipContent(current, all) {
    for (i = 0; i < all; i++) {
        $('webClippingView' + i).style.display = "none";
    }
    $('webClippingView' + current).style.display = "";
}