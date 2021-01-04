<?php
include('../../pages/templates/header3.html');
?>
<section id="maincontent">
  <menu>
	<div id="menu_holder">
	  <ul class="hMenu">
		<li><a href="../">Home</a></li>
		<li><a href="#">Exhibition</a>
		  <ul>
			<li><a href="../exhibit/">What to Expect</a></li>
			<li><a href="#">Fees &amp; Rates</a>
			  <ul>
				<li><a href="../exhibit/booth/">Booth Fees</a></li>
				<li><a href="../exhibit/advert/">Advertisement Rates</a></li>
				<li><a href="../exhibit/payment/">Payment Details</a></li>
			  </ul>
			</li>
			<li><a href="#">Sponsorship</a>
			  <ul>
				<li><a href="../exhibit/benefits/">Sponsorship Benefits</a></li>
				<!--<li><a href="../sponsors/">2013 Sponsors</a></li>-->
				<li><a href="../sponsors/2012/">Past Sponsors</a></li>
			  </ul>
			</li>
			<li class="first activeTrail"><a href="#">Register Now</a></li>
			<li><a href="../exhibit/faqs/">F.A.Q's</a></li>
			<li><a href="#">Exhibition 2012</a>
			  <ul>
				<li><a href="../exhibit/2012/exhibitors/">Past Exhibitors</a></li>
				<li><a href="../exhibit/2012/">Event Pictures/Videos</a></li>
			  </ul>
			</li>
		  </ul>
		</li>
		<li><a href="#">Conference</a>
		  <ul>
			<li><a href="../conf/">About the Conference</a></li>
			<!--<li><a href="../sponsors/">2013 Sponsors</a></li>-->
			<li><a href="#">Conference Speakers</a>
			  <ul>
				<li><a href="../conf/speakers/">2013 Conference Speakers</a></li>
				<li><a href="../conf/speakers/2012/">Past Conference Speakers</a></li>
			  </ul>
			</li>
			<li><a href="../conf/faqs/">F.A.Q's</a></li>
		  </ul>
		</li>
		<li><a href="../travel/">Hotel &amp; Travel</a></li>
		<li><a href="../../mail/contactform.php" target="_blank">Contact Us</a></li>
	  </ul>
	</div>
	<div class="clearfix"></div>
  </menu>
  <article class="asocontent">
	<div class="exhibitcontent">
      <div class="confirmwrap">
        <div class="confirmsec">
          <div style="font-size:15px; text-align:center;">
            <p>Thank you for registering.<br>
            <span class="smlblk">Please review the information you submitted below.  Also, please take time to review the next steps at the bottom of the page.</span></p>
          </div>
        <div>	<!-- end: confirmsec -->			
  <?php
              $translate=array (
                  'registrationid' => 'Registration Number',				
                  'total' => 'Registration Total',
                  'registra' => 'Registrant',
                  'username' => 'Full Name',
                  'email' => 'Email',
                  'phone' => 'Phone',
                  'fulladdress' => 'Full Address',
                  'advert' => 'Advert Placement In Event Brochure',
                  'industry' => 'Industry',    				
              );
  
              $val="Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
              foreach ($translate as $key => $display){
                echo "<label class=\"fontgrey\" for=\"$key\">$display:</label>\n" .
                       "<span id=\"$key\">$val</span><br><br>\n";
              }
  ?>			
              <label for="sponsorship" class="fontgrey">Sponsorship:</label>
              <span id="sponsorship">Diamond Sponsorship</span><br><br>
              <label class="fontgrey" for="booth">Booth:</label>
              <span id="booth">B34, B12</span><br/><br/>
                  
                <div style="margin-top:-10px;">
                  <p class="fontred"><b><u>NEXT STEPS:</u></b>
                    <ol class="fontred">
                      <li>We will CONTACT YOU to confirm your selections within 24 HOURS.</li>
                      <li>Once confirmed, please go to a nearby ASO branch and make payments within <b><u>24 hours</u></b> of our contact (using the registration number provided).<br><br><b><u>Please note</u></b>: We will no longer reserve your booth selection after 24 hours if payments have not been made, and you will be required to register again.</li>
                    </ol>
                  </p>
                  <p class="fontred" style="text-align:center;">Please make payments to:<br>
        <b>3rd ASO National Housing Exhibition &amp; Conference<br>ACCOUNT NO: 999011097717037</b><br>
                    or<br>
                    Are you an ASO Customer? <span class="redlink"><a href="https://asotib.asoplc.com/scripts/aso.dll" target="_blank">Pay online with ASO Internet Banking</a></span>
                  </p>
                </div>
              </div>
            </div>
			<div class="clearfix"></div>
          </div>
          <script type="text/javascript" src="../../scripts/includes/jquery-1.7.1.min.js"></script>
		  <script type="text/javascript" charset="utf-8">
              (function(){
                var tabs =document.getElementById('tabs');
				if (!tabs) return;
                var nav = tabs.getElementsByTagName('input');
                /** Hide all tabs **/
                function hideTabs(){
                  var tab = tabs.getElementsByTagName('div');
                  for(var i=0;i<=nav.length;i++){
                    if(tab[i].className == 'tab'){
                      tab[i].className = tab[i].className + ' hide';
                    }
                  }
                }
          
                /** Show the clicked tab **/
                function showTab(tab){
                  document.getElementById(tab).className = 'tab'
                }
                hideTabs(); /* hide tabs on load */
                /** Add click events **/
                for(var i=0;i<nav.length;i++){
                  nav[i].onclick = function(){
                  hideTabs();
                  showTab(this.className);
                }
              }
            })();
          </script>
          <script type="text/javascript" src="../../../scripts/includes/sliding.form.js"></script>
          <script type="text/javascript">
            function toggleVisibility(controlId){            var control = document.getElementById(controlId);            
                if(control.style.visibility == "visible" || control.style.visibility == "")                 
                  control.style.visibility = "hidden";            else                 
                  control.style.visibility = "visible";
                }
          </script>
          <script type="text/javascript">
              function hideme(controlId){            
                var control = document.getElementById(controlId);            
                if(control.style.visibility == "visible" || control.style.visibility == "")                 
                  control.style.visibility = "hidden";            else                 
                  control.style.visibility = "hidden";
                }
          </script>
          <script type="text/javascript">
              function showme(controlId){            
                var control = document.getElementById(controlId);            
                if(control.style.visibility == "visible" || control.style.visibility == "")                 
                  control.style.visibility = "visible";            else                 
                  control.style.visibility = "visible";
                }
          </script>
          <script type="text/javascript">
            var _gaq = _gaq || [];
            _gaq.push(['_setAccount', 'UA-28605460-1']);
            _gaq.push(['_trackPageview']);
        
            (function() {
              var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
              ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
              var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
             })();
          </script>
        </section>
		<div class="clear"></div>
		<script type="text/javascript">var registerOk=true;</script>
<?php
include('../../pages/templates/footer3.html');
?>