
if (!String.prototype.trim) {
String.prototype.trim=function(){return this.replace(/^\s+|\s+$/g, '');};

String.prototype.ltrim=function(){return this.replace(/^\s+/,'');};

String.prototype.rtrim=function(){return this.replace(/\s+$/,'');};

String.prototype.fulltrim=function(){return this.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g,'').replace(/\s+/g,' ');};
}
var reservedbooths=new Array();
var adverts=new Array('InsideFrontCover','InsideBackCover','OutsideBackCover','CenterSpread','InsidePage');
function checkAdverts(id) {
	var no=$('#nothanks');
	if ($(no).is(':checked') && id == 'nothanks') {
		for(var i=0; i < adverts.length; i++) {
			$('#' + adverts[i]).attr('checked',false);
		}
	} else {
		$(no).attr('checked',false);
	}
	
	return true;
}

function updateRegisteredDisplay(reserved) {
   reservedbooths=reserved;
	for(var i=0; i < adverts.length; i++) {
		var o=$('#' + adverts[i]);
		if (reservedbooths.indexOf(adverts[i]) != -1) {
			$(o).attr("disabled", true).attr('checked',false);
		} else {
			$(o).removeAttr("disabled");
		}
	}
   
	$('a.booth').each(function() {
		var num=getBoothId($(this).attr('class'));
		if ($(this).hasClass('reserved')) {
			if (reservedbooths.indexOf(num) == -1) {
				$(this).removeClass('reserved');
				if ($(this).hasClass('unavailable')) {
					$(this).unbind('click');
				} else {
					$(this).unbind('click').click(function() { selectbooth(false, getBoothId($(this).attr('class'))); });
				}
			}
		} else {
			if (reservedbooths.indexOf(num) != -1) {
				$(this).addClass('reserved').unbind('click');
			} else {
				if ($(this).hasClass('unavailable')) {
					$(this).unbind('click');
				} else {
					$(this).unbind('click').click(function() { selectbooth(false, getBoothId($(this).attr('class'))); });
				}			
			}
		}
	});
	
	
	for (var i=0; i < selects.length; i++) {
		var o=$('select[id=' + selects[i] + ']').find('option').each(function() {
			if (reservedbooths.indexOf($(this).val()) != -1) {
				$(this).attr("disabled","disabled");
				
				if ($(this).parent().val() == $(this).val()) {
					$(this).parent().val(0);
					var index=drops.indexOf(selects[i]);
					if (index != -1) {
						selected[index]=0;
						findCurrentDrop();
						alert("The booth " + $(this).val() + " has just been reserved, please choose another booth");
					}
				}
			} else {
				$(this).removeAttr("disabled");
			}
		});
	}
	
	findCurrentDrop();
}	
function updateRegisteredBooths() {
var response = '';
	$.ajax({
		type: "GET",   
        url: "http://www.asoplc.com/exco/register/register.php?reserved=1",   
		async: false,
		dataType: 'json',
		success : function(response)
		{
		   if ((typeof(response['error']) == 'undefined') || (response['error'] == null)) return;
		   if (response.error != '') {
				alert('Application Error: ' + response.error + "\nApplication Request Error: Please reload the page and try again");
				return;
		   } 		
		   if ((typeof(response['r']) == 'undefined') || (response['r'] == null)) return;
		   		   
		   if (response.r.length < 1) {
				for(var j in selects) {
					var o=$('select[id=' + selects[j] + '] option').each(function() {
						$(this).removeAttr("disabled");
					});
				}		   
		   } 
		   
		   updateRegisteredDisplay(response.r);
		}
	});	
	
	setTimeout(function() { updateRegisteredBooths(); }, 5*1000);
}

function selectsponsorship(type, reset) {
	if (!type) return;
	$('#boothinterfaces').show();
	$('.boothinterfacetext, .boothinterface').hide();
	$('#' + type + 'interface').show();
	var o=$('#' + type + 'text');
	if (o) $(o).show();	
	mtype=type;	
	
	var index=selectIndex[type];
	var selectone=selects[index];
	var selecttwo=selects[index]+1;
	if (reset) {
		var v=$('select[id=' + selectone + ']').val();
		var v2=$('select[id=' + selecttwo + ']').val();
		selectbooth(selectone, v);
		selectbooth(selecttwo, v2);
		selected=[v,v2];
		dropList=[false,false];
		dropString=[false,false];
	} else {
		selectbooth(selectone, 0);
		selectbooth(selecttwo, 0);
		selected=[0,0];
		dropList=[false,false];
		dropString=[false,false];
	}	
	
	findCurrentDrop();	
}

function check2ndbooth() {
	var v=$(dropObj[1]).val();	
	selected[1]=v;
	if ((v != 0) && (v != 'undefined')) {
		showControls('remove');
	} else {
		showControls('add');
	}
}

function showControls(show) {
	var el={};
	var index=(show == 'remove') ? 0 : 1;
	
	switch (mtype) {
		case 'diamond':			
			el={'dia2ndbooth':[true,false],'diaaddanother':[false,true],'diaremoveanother':[true,false]};
		break;
		case 'gold':
			el={'gld2ndbooth':[true,false],'gldaddanother':[false,true],'gldremoveanother':[true,false]};
		break;
		case 'free':
			el={'free2ndbooth':[true,false],'freeaddanother':[false,true],'freeremoveanother':[true,false]};
		break;
		default:
			return;
	}	
	
	for (var i in el) {
		$('#' + i).css('visibility', el[i][index] ? 'visible' : 'hidden');
	}
}

var freebooths=["A1","A2","A3","A4","A5","A6","A7","A8","A9","A10","A11","A12","A13","A14","A15","A16","A17","A18","B1","B2","B3","B4","B5","B6","B7","B8","B9","B10","B11","B12","B17","B18","B19","B20","B21","B22","B23","B24","B25","B26","B27","B28","B29","B30","B31","B32","B33","B34","B35","B36","C1","C2","C3","C4","C5","C6","C7","C8","C9","C10","C11","C12","C17","C18","C19","C20","C21","C22","C23","C24","C25","C26","C27","C28","C29","C30","C31","C32","C33","C34","C35","C36","D1","D2","D3","D4","D5","D6","D7","D8","D9","D10","D11","D12","D13","D14","D15","D16","D17","D18"];
var sponsoredbooths=["B13","B14","B15","B16","C13","C14","C15","C16"];
var mtype=false;
var selects=Array('freebooths','free2ndbooth','diamondbooths','dia2ndbooth','goldbooths','gld2ndbooth','slrbooths','slr2ndbooth');
var selectIndex={'free': 0, 'diamond':2, 'gold':4};
var drops=new Array(), dropObj=new Array();
var selected=new Array(0,0), dropList=new Array(false,false), dropString=new Array();
var selIndex=0;
var currentDrop=false, currentDropObj=false;


function outputDisplay() {
	$('a.booth').removeClass('selected');
	for (var i=0; i < 2; i++) {
		$('a.booth.' + selected[i]).addClass('selected');
	}

/*	
	$('#sel').html('Selected: ' + selected + '<br/>' +
	                'Sponsor drops: ' + drops[0] + ' :: ' + drops[1] + '<br/>' +
					'Current Drop: ' + currentDrop + '<br/>' +
					'Selected Index: ' + selIndex + '<br/>' +
					'Drop Lists: <br/>' +
					'&nbsp;&nbsp;&nbsp;&nbsp;0 (' + dropString[0] + ')<br/>' +
					'&nbsp;&nbsp;&nbsp;&nbsp;1 (' + dropString[1] + ')<br/>' +
					'---<br/>'  +
	                '<br/><br/>');
*/					
}

function getBoothId(cname) {
	return cname.replace('booth', '').replace('double' ,'').replace('unavailable','').replace('reserved','').replace('selected','').trim();
}

function disablebooths(type) {	
	switch(type) {
		case 'diamond':			
			if (selIndex != 0) {
				for (var i=0; i < sponsoredbooths.length; i++) {
					var booth=sponsoredbooths[i];				
					var a=$('a.booth.' + booth + '.double');
					$(a).removeClass('unavailable').addClass('unavailable').unbind('click');
				}
			
				for (var i=0; i < freebooths.length; i++) {
					var booth=freebooths[i];
					var a=$('a.booth.' + freebooths[i]);
					if ($(a).hasClass('reserved')) continue;
					
					$(a).removeClass('unavailable').unbind('click').click(function() { selectbooth(false, getBoothId($(this).attr('class'))); });
				}					
			} else {
				for (var i=0; i < sponsoredbooths.length; i++) {
					var booth=sponsoredbooths[i];				
					var a=$('a.booth.' + booth + '.double');
					if ($(a).hasClass('reserved')) continue;
					
					$(a).removeClass('unavailable').unbind('click').click(function() { selectbooth(false, getBoothId($(this).attr('class'))); });
				}

				for (var i=0; i < freebooths.length; i++) {
					var booth=freebooths[i];
					var a=$('a.booth.' + freebooths[i]);
					$(a).removeClass('unavailable').addClass('unavailable').unbind('click');
				}
			}
		break;
		default: {
			for (var i=0; i < sponsoredbooths.length; i++) {
				var a=$('a.booth.' + sponsoredbooths[i] + '.double');
				$(a).removeClass('unavailable').addClass('unavailable').unbind('click');	
			}
			
			for (var i=0; i < freebooths.length; i++) {
				var booth=freebooths[i];
				var a=$('a.booth.' + freebooths[i]);
				if ($(a).hasClass('reserved')) continue;
				
				$(a).removeClass('unavailable').unbind('click').click(function() { selectbooth(false, getBoothId($(this).attr('class'))); });
			}
		} break;
	}
	$('a.booth.selected').unbind('click').click(function() { selectbooth(false, getBoothId($(this).attr('class'))); });
} 

function getDropLists() {
	for (var i=0; i < 2; i++) {
		if (dropList[i] == false) {
			var vals=new Array();
			var str='';
			$(dropObj[i]).find('option').each(function() {
				var v=$(this).val();
				var count=0;
				if (v != 0) {
					vals[count++]=$(this).val();
					str += ((str.length > 0) ? ', ' : '') + $(this).val();
				}
			});
			
			dropList[i]=vals;
			dropString[i]=str;
		}
	}
}

function findCurrentDrop() {
	var index=selectIndex[mtype];
	drops[0]=selects[index];
	drops[1]=selects[index+1];

	dropObj[0]=$('select[id=' + drops[0] + ']');
	dropObj[1]=$('select[id=' + drops[1] + ']');
	var v=$(dropObj[0]).val();
	var v2=$(dropObj[1]).val();
	
	selIndex=0;
	if (v != 0) {
		if (v != 'undefined')
			selIndex=1;		
	}
	
	currentDrop=drops[selIndex];
	currentDropObj=dropObj[selIndex];

	if ((v != 0) && (v != 'undefined')) {
		selected[0]=v;
	} else {
		selected[0]=0;
	}
	
	if ((v2 != 0) && (v2 != 'undefined')) {
		selected[1]=v2;
	} else {
		selected[1]=0;
	}
		
	getDropLists();
	
	disablebooths(mtype);
	check2ndbooth();
	outputDisplay();
}

function initMap() {
	var val=false;
	$('.sponsoroption').each(function() {
		if ($(this).is(':checked'))
			val=$(this).attr('id');
	});	
	selectsponsorship(val, false);		
	
	updateRegisteredBooths();
	
	findCurrentDrop();
	//check2ndbooths();
}

function removesecondbooth() {
	var s=dropObj[1];
	selected[1]=0;
	$(dropObj[1]).val(0);
	findCurrentDrop();
}

function selectbooth(drop, booth) {
    if (typeof(booth) == 'undefined') return;

	if (drop == false) {
		selected[selIndex]=booth;
		$(dropObj[selIndex]).val(booth);
		findCurrentDrop();
	} else {
		selected[selIndex]=booth;		
		$(dropObj[selIndex]).val(booth);
		findCurrentDrop();
	}
}

$(function(){	
	$('a.booth').removeClass('unavailable');
	
	$('.sponsoroption').click(function() {
		selectsponsorship($(this).attr('id'), true);
		return true;
	});	

	for(var i in selects) {
		$('select[id=' + selects[i] + ']').change(function() {
			selectbooth($(this).attr('id'), $(this).val());
		});
	}
	
	initMap();	
});