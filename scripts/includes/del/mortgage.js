// Set the amount of scary interest you want to show (express 10% as 10)
var scareme = 10;

$(document).ready(function(){
	// The DOM is available so let's get started...

	// Update the HTML of the form to show the scary interest amount label
	$("#scareme").html(scareme+"%");

	// We remove the error message for non-JavaScript enabled browsers
	$("#noscript").remove();
	
	// Then show the form
	$("#calculator").css("display","block");



	// Clear the form when the clear button is pressed
	$("#clearbtn").click(function(){
		$("#calculator input:not(.button)").attr("value", ""); 
	});	

	// Calculate when the calc button is pressed
	$("#calcbtn").click(function(){
	
		// Grab the data the user has input
		var mortgageamount=$("#mortgageamount").val(); // Principal amount
		var mortgageterm=$("#mortgageterm").val(); // Term - number of years
		var interest=$("#interest").val(); // Rate of interest
		
		// Check fields have been completed
		if ((mortgageamount==null || mortgageamount.length==0) || (mortgageterm==null || mortgageterm.length==0) || (interest==null || interest.length==0)){
			alert("Some fields are missing");
			return;
		}
		
		// Check the fields meet validation
		if (!checkValid(mortgageamount, mortgageterm, interest)){
			return;
		}
		
		// We're still here so let's do the calculations
		doCalculate(mortgageamount, mortgageterm, interest, scareme);
	
	});
	


});


function floatIt(astring) {
	// Convert a number to have 2 decimal places
	var s = new String(astring);
	var i = s.indexOf('.');
	if (i != -1) {
		s = s.substr( 0, i+3 );
		if (s.length-i < 3)
			s = s + '0';
	}
	return s;
}

function isNumber(astring) {
	// Check a string is a number
	for (var i = 0; i < astring.length; i++) {
		var ch = astring.substring( i, i + 1)
		if ((ch < "0" || "9" < ch) && ch != '.') {
			return false;
		}
	}	
	return true

}

function checkValid(mortgageamount, mortgageterm, interest) {

	// Check the fields meet validity requirements
	if (mortgageamount<1000 || mortgageamount>99999999 || !isNumber(mortgageamount)){
		alert("The mortgage amount field is invalid. This must be a number: minimum 1000, maximum 99999999");
		return false;
	}

	if (mortgageterm<5 || mortgageterm>35 || !isNumber(mortgageterm)){
		alert("The mortgage repayment period field is invalid. This must be a number: minimum 5, maximum 35");
		return false;
	}

	if (interest<0.01 || interest>50 || !isNumber(interest)){
		alert("The interest rate field is invalid. This must be a number: minimum 0.01, maximum 50");
		return false;
	}

	return true;
}

function doCalculate(mortgageamount, mortgageterm, interest, scaryinterest) {
	// Set the interest to floating point equivs
	interest = interest / 100;
	scaryinterest = scaryinterest/100;

	// Do the sums and update the fields
	var amount = ((mortgageamount*interest)/12) * (1/(1-(Math.pow(1/(1+interest),mortgageterm))));
	$("#calcrepayment").attr("value", floatIt(amount));
	amount = ((mortgageamount*scaryinterest)/12) * (1/(1-(Math.pow(1/(1+scaryinterest),mortgageterm))));
	$("#scarycalcrepayment").attr("value", floatIt(amount));
	amount = (mortgageamount*interest)/12;
	$("#calcinterest").attr("value", floatIt(amount));
	amount = ((mortgageamount*scaryinterest)/12);
	$("#scarycalcinterest").attr("value", floatIt(amount));
	return false;
}
	