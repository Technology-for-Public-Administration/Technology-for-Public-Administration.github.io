 function toogleContent(id) {
     var s = "content" + id;
     var el = document.getElementById(s);
     if (el.style.display != 'none') {
         Element.hide(el);
         Element.removeClassName(el, 'btn-open');
     } else {
         Element.show(el);
         Element.addClassName(el, 'btn-open');
     }
     return false;
 }

 function showDefaultMail(length) {
     for (var i = 2; i <= length; i++) {
         var content_div = document.getElementById("content" + i);
         if (Element.visible(content_div)) {
             Element.hide(content_div);
         }
     }
 }

 function registerMail() {
     var fo = document.getElementById("registerForm");
     fo.submit();
     return false;
 }
 //��ȡ��mail
 function getNewMail(length, url_Str) {
     var content_length = length;
     for (var i = 1; i <= content_length; i++) {
         var content_div = document.getElementById("content" + i);
         var mail_content_tr = document.getElementById("mail_content" + i);
         var mailbox_value = document.getElementById("mailbox" + i);
         AsyForMaliContent(url_Str + "mailAccount=" + mailbox_value.value, mail_content_tr, i);
     }
 }
 //�첽����ʼ���Ϣ
 function AsyForMaliContent(url_str, ele_tr, i) {
     new Ajax.Request(url_str, {
         method: 'post',
         onSuccess: function(transport) {
             var text = transport.responseText;
             var json_Obj = text;
             constrMailList(ele_tr, json_Obj, i);
         }
     });
 }
 //�����ʼ��б�
 function constrMailList(ele_table, json, count) {
     var json_obj = eval("(" + json + ")");
     var newmailcount = 0; //���ʼ�����
     for (var i = 0; i < json_obj.length; i++) {
         var beanList = json_obj[i].newMailTitleList;
         for (var j = 0; j < beanList.length; j++) { //�ʼ�ʵ��
             newmailcount++;
             var mailbean = beanList[j];
             var maillink = mailbean.mailLink;
             var sender = mailbean.sender;
             var maildate = mailbean.mailDate;
             var tr_main_content = new Element("tr", {
                 width: '100%'
             }); //�ʼ���
             var aSender = new Element('td', {
                 'style': 'word-break:break-all',
                 width: '80',
                 align: 'center'
             });
             var aTitle = new Element('td', {
                 'style': 'word-break:break-all',
                 width: '120',
                 align: 'center'
             });
             var aMailDate = new Element('td', {
                 'style': 'word-break:break-all',
                 width: '170',
                 align: 'center'
             });

             var a_font_sender = new Element('font', {
                 style: 'padding:5px'
             });
             var a_font_title = new Element('font', {
                 color: '#0000FF',
                 style: 'padding:5px'
             });
             var a_font_aMailDate = new Element('font', {
                 style: 'padding:5px'
             });
             var a_href_title = new Element('a', {
                 target: '_blank'
             });
             //������������Ϣ
             a_font_sender.update(sender);
             aSender.insert(a_font_sender, 'content');
             tr_main_content.insert(aSender, 'content');
             //����������Ϣ
             a_font_title.update(mailbean.title);
             Element.writeAttribute(a_href_title, 'href', mailbean.mailLink);
             a_href_title.insert(a_font_title, 'content');
             aTitle.insert(a_href_title, 'content');
             tr_main_content.insert(aTitle, 'content');
             //��������������Ϣ
             a_font_aMailDate.update(mailbean.mailDate);
             aMailDate.insert(a_font_aMailDate, 'content');
             tr_main_content.insert(aMailDate, 'content');
             //��mailһ�м��뵽table��
             ele_table.appendChild(tr_main_content);
         }
     }
     var mailname = 'mail' + count;
     var newMailName = 'newMail' + count;
     var v = $(mailname).firstChild.nodeValue;
     var p = $(newMailName).firstChild.nodeValue;
     $(mailname).firstChild.nodeValue = parseInt(v) + parseInt(newmailcount);
     $(newMailName).firstChild.nodeValue = parseInt(p) + parseInt(newmailcount);
 }