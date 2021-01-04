function exists(obj) {
	//if ((typeof obj !== 'undefined') && (obj !== null)) return true;
	var t=typeof obj;
	if ((t != 'undefined') && (obj != null)) return t;
		
	return false;
}

String.prototype.replaceAll = function (needle, replacement) {
	return this.replace(new RegExp(needle, 'g'), replacement);
}

function isNumeric(str) {
	var valid = "0123456789.";
	for (var i=0; i < str.length; i++) {
		if (valid.indexOf(str.charAt(i)) == -1)
			return false;
	}
	
	return true;
}

function isEmpty (str) {
	if ((str.length == 0) || (str == null))
		return true;
	
	return false; 
}	

function isEmail (str) {
   return ((str.indexOf(".") > 2) && (str.indexOf("@") > 0));
}

$(function() {
	$.ajaxSetup({
        error: function(jqXHR, exception) {
            if (jqXHR.status === 0) {
                alert('Not connected.\nVerify Network.');
            } else if (jqXHR.status == 404) {
                alert('Requested page not found. [404]');
            } else if (jqXHR.status == 500) {
                alert('Internal Server Error [500].');
            } else if (exception === 'parsererror') {
                alert('Request resulted in an invalid object. Request Failed!');
            } else if (exception === 'timeout') {
                alert('Time out error.');
            } else if (exception === 'abort') {
                alert('Ajax request aborted.');
            } else {
                alert('Uncaught Error.\n' + jqXHR.responseText);
            }
        }
    });
});

function getFields (data) {
	var i, tok, f=new Array(), fields=data.split('&');
	
	for (i=0; i < fields.length; i++) {
		tok=fields[i].split('=');
		if (tok[0].length > 0)
			f.push(tok[0]);
	}
	
	return f;
}

function getFormFields (form) {
	return getFields($(form).serialize());	
}

function serializeForm (frm) {
	var str='';
	var radio={};
	
	$(frm).find('input, select, textarea').each(function() {
		var tag=$(this).prop('tagName');
		var name=$(this).attr('name');
		
		if (tag == 'INPUT') {
			var type=$(this).attr('type');
			if ((type == 'checkbox') || (type == 'radio')) {
				if ($(this).is(':checked')) {
					var val=encodeURIComponent($(this).val());
					if ((val.length > 0) && (type == 'radio')) {
						if (!exists(radio[name])) {
							radio[name]=val;
						} else if (radio[name].length < 1) {
							radio[name]=val;
						}
						//str = str + (str.length > 0 ? '&' : '') + (name + '=' + val);
					} else {
						if (type != 'radio')
							str = str + (str.length > 0 ? '&' : '') + (name + '=');
					}
				} else {
					if (type == 'radio') {
						if (!exists(radio[name]))
							radio[name]='';
					} else {
						str = str + (str.length > 0 ? '&' : '') + (name + '=');
					}
				}
			} else {
				str = str + (str.length > 0 ? '&' : '') + (name + '=' + encodeURIComponent($(this).val()));
			}
		} else {		
			if (name.length > 0)
				str = str + (str.length > 0 ? '&' : '') + (name + '=' + encodeURIComponent($(this).val()));
		}
	});
	
	for (var i in radio) {
		str = str + (str.length > 0 ? '&' : '') + (i + '=' + radio[i]);
	}

	return str;
}

function request(frm, el, url, toggleCallback, okCallback) {
	var sendData=serializeForm(frm);
	var ids=getFields(sendData);
	if (el !== false)
		validationErrorReset(ids, el);
	
	if (exists(toggleCallback) == 'function')
		toggleCallback(false);
		
	$.ajax(url, {
		data: sendData,
		dataType: 'json',		
		//dataType: 'text',
		type: 'POST',
		contentType: 'application/x-www-form-urlencoded',
		async: true,
		cache: false,
		timeout: 10000,
		success: function(obj) {
			var errorMessage='';
			if (exists(obj['error']) !== false) {
				errorMessage=obj.error;
			}
			
			if (exists(toggleCallback) == 'function') 
				toggleCallback(true);			
			
			if (errorMessage.length > 0) {
				if (exists(okCallback) == 'function')
					okCallback(false, errorMessage);
			} else {
				if (exists(okCallback) == 'function')
					okCallback(false, false);
			}
		}
	});	
}
