var radios=new Array();
var checkboxes=new Array();
var checkboxCount=0;

var fieldsetCount=0;
var current = 1;
var prev = 1;
var total=0;

function exists(obj) {
	return ((typeof(obj) != 'undefined') && (obj != null));
}

function urldecode(str) {
	return decodeURIComponent((str + '').replace(/\+/g, '%20'));
}

function commafyNumber(number) {
	var withcommas = ( number + '' ).replace(/(^|[^\w.])(\d{4,})/g, function($0, $1, $2) {
		return $1 + $2.replace(/\d(?=(?:\d\d\d)+(?!\d))/g, "$&,");
	});
	return withcommas;
}

$(document).ready(function() {
	/*
	number of fieldsets
	*/
	fieldsetCount = $('#formElem').children().length;
	
	/*
	current position of fieldset / navigation link
	*/    
	/*
	sum and save the widths of each one of the fieldsets
	set the final sum as the total width of the steps element
	*/
	var stepsWidth	= 0;
    var widths 		= new Array();
	$('#steps .step').each(function(i){
        var $step 		= $(this);
		widths[i]  		= stepsWidth;
        stepsWidth	 	+= $step.width();
    });
	$('#steps').width(stepsWidth);
	
	$('#registerposted').val('');
	/*
	to avoid problems in IE, focus the first input of the form
	*/
	$('#formElem').children(':first').find(':input:first').focus();	
	
	/*
	show the navigation bar
	*/
	$('#navigation').show();
	
	/*
	when clicking on a navigation link 
	the form slides to the corresponding fieldset
	*/
    $('#navigation a').bind('click',function(e){
		var $this	= $(this);
		prev = current;
		$this.closest('ul').find('li').removeClass('selected');
        $this.parent().addClass('selected');
		/*
		we store the position of the link
		in the current variable	
		*/
		current = $this.parent().index() + 1;
		
		/*
		animate / slide to the next or to the corresponding
		fieldset. The order of the links in the navigation
		is the order of the fieldsets.
		Also, after sliding, we trigger the focus on the first 
		input element of the new fieldset
		If we clicked on the last link (confirmation), then we validate
		all the fieldsets, otherwise we validate the previous one
		before the form slided
		*/
		e.preventDefault();
		
        $('#steps').stop().animate({
            marginLeft: '-' + widths[current-1] + 'px'
        },500,function(){			
			if(current == 5) {
				validateSteps();
			} else {
				validateStep(prev);
			}
			$('#formElem').children(':nth-child('+ parseInt(current) +')').find(':input:first').focus();	
		});
    });
	
	/*
	clicking on the tab (on the last input of each fieldset), makes the form
	slide to the next step
	*/
	$('#formElem > fieldset').each(function(){
		var $fieldset = $(this);
		$fieldset.children(':last').find(':input').keydown(function(e){
			if (e.which == 9){
				$('#navigation li:nth-child(' + (parseInt(current)+1) + ') a').click();
				/* force the blur for validation */
				$(this).blur();
				e.preventDefault();
			}
		});
	});
		
	function calcTotal() {		
		var fields=urldecode($('#formElem').serialize()).split('&');
		var str='';
		var costs={'pksilver':300000, 'pkgold':750000,'pkdia':1500000};
		var advcosts={'InsideFrontCover':150000,'InsideBackCover':150000,'OutsideBackCover':180000,'CenterSpread':200000,'InsidePage':100000,'none':0};
		total=0;
		var waived=false;
		for (var i in fields) {
			var vals=fields[i].split('=');
/*
			if (vals[0] == 'errors') {
				if (vals[1] == 'true')
					return;
			}
*/			
			if (vals[0] == 'tab') {
				if (exists(costs[vals[1]])) {
					waived=true;
					total += costs[vals[1]];
				}
			}
			/*
			if ((vals[0] == 'dia2ndbooth') || (vals[0] == 'gld2ndbooth') || (vals[0] == 'slr2ndbooth') || (vals[0] == 'free2ndbooth')) {
				if (vals[1] != 0)
					total += 120000;
			}
			*/
			if (vals[0] == 'advert[]') {
				if (exists(advcosts[vals[1]])) {
					total += advcosts[vals[1]];
				}
			}
			
			str += vals[0] + ' = ' + vals[1] + "\n";
		}
		
		if (waived === false)
			total += 120000;
				
		$('#regtotal').html('N' + commafyNumber(total));
	}
	
	/*
	validates errors on all the fieldsets
	records if the Form has errors in $('#formElem').data()
	*/
	function validateSteps() {
		var FormErrors = false;		
		for(var i = 1; i < fieldsetCount; ++i){
			var error = validateStep(i);
			if(error == -1)
				FormErrors = true;
		}
		$('#formElem').data('errors',FormErrors);	
		$('#errors').val(FormErrors);
		calcTotal();
		
		
		if (!FormErrors) {
			$('#registerButton').attr('disabled', false);
			$('#navigation li:nth-child(5)').find('.error,.checked').remove();			
			$('<span class="checked"></span>').insertAfter($('#navigation li:nth-child(5) a'));		
		} else {
			$('#navigation li:nth-child(5)').find('.error,.checked').remove();			
			$('<span class="error"></span>').insertAfter($('#navigation li:nth-child(5) a'));
		}
	}
	
	/*
	validates one fieldset
	and returns -1 if errors found, or 1 if not
	*/
	function validateStep(step){
		if(step == fieldsetCount) return;
		
		if (step == 5) 
			return;		
		
		var error = 1;
		var hasError = false;
		
		var fieldset=$('#step' + step);
		radios=new Array();
		checkboxes=new Array();
			
		//group appropriate radios
		$(fieldset).find('input[type=radio]').each(function(){
			radios[this.name]=0;				
		});		
		
		//group appropriate checkboxes
		$(fieldset).find('input[type=checkbox]').each(function(){
			checkboxes[this.name]=0;
		});			
				
		$(fieldset).find(':input:not(button)').each(function(){
			var $this 		= $(this);
			var valueLength = jQuery.trim($this.val()).length;
						
			if (this.type == 'radio') {
				if ($this.is(':checked')) 
					radios[this.name]=1;
			} else if (this.type =='checkbox') {
				if ($this.is(':checked')) 
					checkboxes[this.name]=1;
			} else if (valueLength == '') {
				hasError = true;
				$this.css('background-color','#FFEDEF');
			} else {
				$this.css('background-color','#FFFFFF');				
			}
		});
		
		var radioChecked=0;
		var numRadios=0;
		for (var name in radios) {
			if (radios[name] == 1)
				radioChecked++;
			numRadios++;
		}
		if (radioChecked != numRadios) {
			hasError=true;
		}

		var checkboxesChecked=0;
		var numCheckboxes=0;
		for (var name in checkboxes) {
			if (checkboxes[name] == 1)
				checkboxesChecked++;
			numCheckboxes++;
		}
		if (step == 3) {
			if (checkboxesChecked < 1) {
				hasError=true;
			}
		} else if (step == 2) {
			var empty=0 | ($('#freebooths').val() != 0) | ($('#diamondbooths').val() != 0) | ($('#diamondbooths').val() != 0) | ($('#goldbooths').val() != 0) | ($('#slrbooths').val() != 0);
			if (!empty) {
				hasError=true;
			}
		} else {
			if (checkboxesChecked != numCheckboxes) {
				hasError=true;
			}
		}
		
		
		var $link = $('#navigation li:nth-child(' + parseInt(step) + ') a');
		$link.parent().find('.error,.checked').remove();
		
		var valclass = 'checked';
		if(hasError){
			error = -1;
			valclass = 'error';
		}
		$('<span class="'+valclass+'"></span>').insertAfter($link);
		$('#errors').val(error);
		
		return error;
	}
	
	/*
		this will monitor changes on section b's radio buttons so that clear booth choices can be made without over calculating totals that should be possible.
		i.e. gold booths and diamond booths both being selected.
	*/
	$('#tabs').find('input[type=radio]').each(function() {
		$(this).change(function() {
			var val=$(this).val();
			var cl=$(this).attr('class');
			var divs={'div0':['freebooths','free2ndbooth'],'div1':['diamondbooths','dia2ndbooth'],'div2':['goldbooths','gld2ndbooth'],'div3':['slrbooths','slr2ndbooth']};
		
			for (var i in divs) {
				for (var j in divs[i]) {
					$('#' + i).find('select[name=' + divs[i][j] + ']').val(0);
				}
			}
		});
	});
	
	$('#advert_5').click(function() {
		if ($(this).is(':checked')) {
			$('#step3').find('input[type=checkbox]').each(function() {
				if (this.id == 'advert_5')
					return;
					
				$(this).attr('checked',false);
			});
		}
	});
	$('#step3 input[type=checkbox]').each(function() {
		if (this.id == 'advert_5')
			return;
		$(this).click(function() {
			$('#advert_5').attr('checked',false);
		});
	});
	/*
	step3
	advert_5	
	<input type="checkbox" name="advert[]" value="Inside Front Cov
	*/
	
	/*
	if there are errors don't allow the user to submit
	*/
	$('#registerButton').attr('disabled', true);
	/*
	$('#registerButton').bind('click',function(e){
		e.preventDefault();
		
		var val=$('#errors').val();		
		if ((val.length < 1) || (val == 1) || (val == '')) {
			alert('Please correct the errors in the Form');
			return false;
		}	
	
		//gather up all form data and post to the system for processing
		$.post('/exhibition/register.php', $('#formElem').serialize(), function(data) {
			if (data.error) {
				alert('ERROR: ' + data.message);
			} else {
				$('#registerposted').val(data.message);
				$('#formElem').action='/exhibition/register.php';
				$('#formElem').submit();
				//alert('Thank you for registering! Your registration code is: ' + data.message);
			}
		}, 'json');
		$('#formElem').submit();
		return true;
	});
	*/	
});
