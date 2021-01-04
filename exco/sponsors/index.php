<?php
  $title = "2013 Exhibition Sponsors - ASO Savings &amp; Loans, PLC";
  
  include('../../resources/templates/header3.html');
?>
    <section id="maincontent">
      <menu>
        <div id="menu_holder">
          <ul class="hMenu">
            <li><a href="../">Home</a></li>
            <li><a href="#">Exhibition</a>
              <ul>
                <li><a href="#">Exhibition 2013</a>
                  <ul>
                    <li class="first activeTrail"><a href="#">2013 Sponsors</a></li>
                    <li><a href="../exhibit/exhibitors/">2013 Exhibitors</a></li>
                    <li><a href="../media/">Event Pictures/Videos</a></li>
                    <li><a href="../exhibit/faqs/">F.A.Qs</a></li>
                  </ul>
                </li>
                <li><a href="#">Exhibition 2012</a>
                  <ul>
                    <li><a href="2012/">2012 Sponsors</a></li>
                    <li><a href="../exhibit/2012/exhibitors/">2012 Exhibitors</a></li>
                    <li><a href="../exhibit/2012/">Event Pictures/Videos</a></li>
                  </ul>
                </li>
              </ul>
            </li>
            <li><a href="#">Conference</a>
              <ul>
                <li><a href="#">2013 Sponsors</a></li>
                <li><a href="../conf/speakers/">Conference Speakers</a></li>
                <li><a href="../media/conf/">Event Pictures/Videos</a></li>
                <li><a href="../media/conf/presentation/">Presentation Slides</a></li>
                <li><a href="../conf/faqs/">F.A.Qs</a></li>
              </ul>
            </li>
            <li><a href="../../mail/" target="_blank">Contact Us</a></li>
          </ul>
        </div>
        <div class="clearfix"></div> <!-- end: clearfix -->
      </menu>
      <article class="asocontent">
        <img src="../images/exhibition.png" alt="" width="675" height="100">
        <div class="exhibitcontent">
          <h2>2013 ASO Exhibition Sponsors</h2>
          <p class="smlred">Click for details</p>
          <?php
            $sponsors = array (
	          'Diamond' => array (
			    array('xado','Ado Bayero Royal City',''),
	            array('xaidc','ASO Investment &amp; Development Company','http://aidc.com.ng/'),
				array('xbnh','Brains &amp; Hammers','http://www.brainsandhammers.com/'),
				array('xmrb','Metro Realty &amp; Brokers',''),
				array('xspdc','System Property Development Consortium','http://www.spdconsortium.com/'),
				array('xurban','Urban Shelter','http://www.urbanshelternigeria.com/'),
				/*array('xdefault','',''),
				array('xdefault','',''),
				array('xdefault','',''),
				array('xdefault','',''),
				array('xdefault','',''),
				array('xdefault','','')*/
			  ),
			  'Gold' => array (
			    array('xaic','Abuja Investment Company Limited','http://www.abujainvestments.com/'),
				array('xbam','BAM Projects & Properties','http://www.bam-properties.com/'),
				array('xbarumark','Barumark Investment & Development Company Ltd.',''),
				array('xgph','Greater Port Harcourt City Development Authority','http://www.gphcity.com/'),
				array('xfmbn','Federal Mortgage Bank of Nigeria','http://www.fmbn.gov.ng/'),
				array('xupdc','UACN Property Development Company Plc ','http://www.updcplc.com/'),
				/*array('xdefault','',''),
				array('xdefault','',''),
				array('xdefault','',''),
				array('xdefault','',''),
				array('xdefault','',''),
				array('xdefault','','')*/
			  ),
			  'Silver' => array (
			    array('xfha','Federal Housing Authority','http://www.fha.gov.ng/'),
			    array('xnhis','National Health Insurance Scheme','http://www.nhis.gov.ng/'),
			    /*array('xdefault','',''),
				array('xdefault','',''),
				array('xdefault','',''),
				array('xdefault','',''),
				array('xdefault','',''),
				array('xdefault','',''),
				array('xdefault','',''),
				array('xdefault','','')*/
			  ),
			);		
		  ?>
          <div id="main">
            <div class="sponsorListHolder">
              <?php
			    foreach ($sponsors as $type => $data) {
				  echo '<div class="sponsorBlock">' .
				    '<div class="sponsorHeader"><h1>' . $type . ' Sponsors</h1></div>';					 
				  foreach ($data as $index => $company) {
				    echo '<div class="sponsor" title="click for details"> 
					<div class="sponsorFlip">
					  <img src="'.$company[0].'.png" alt="click for info" />
					</div>
					<div class="sponsorData"> 
					  <div class="sponsorDescription">
					    '.$company[1].'
					  </div> 
					  <div class="sponsorURL">
					    <a href="'.$company[2].'" target="_blank">Visit Page</a> 
				      </div>
					</div> 
				  </div>
				   ';				
				  }
				  echo "<div class=\"clearfix\"</div></div>";
			    }
		      ?>
              <div class="clearfix"></div> <!-- end: clearfix -->
            </div> <!-- end: sponsorListHolder -->
          </div> <!-- end: main -->
        </div> <!-- end: exhibitcontent -->
      </article>
      <div class="socialnetwork">
        <a href="https://www.facebook.com/asoplc" class="network fb" rel="tooltip" title="Facebook" target="_blank"></a>
        <a href="https://twitter.com/ASO_SAVINGS" class="network twitter" rel="tooltip" title="Twitter" target="_blank"></a>
        <a href="https://plus.google.com/u/0/b/106126146711350910477/106126146711350910477/posts" class="network gplus" rel="tooltip" title="Google+" target="_blank"></a>
        <a href="https://www.linkedin.com/company/aso-savings-&-loans-plc" class="network in" rel="tooltip" title="LinkedIn" target="_blank"></a>
        <a id="mail" href="../javascript_required" class="network email" rel="tooltip" title="Email"></a>
      </div> <!-- end: socialnetwork -->
      <div class="clearfix"></div> <!-- end: clearfix -->
      <script type="text/javascript" src="../../scripts/includes/jquery-1.7.1.min.js"></script>
      <script type="text/javascript" src="../scripts/jquery-ui.min.js"></script>
	  <script type="text/javascript" src="../scripts/jquery.flip.min.js"></script>
	  <script type="text/javascript" src="../scripts/script.js"></script>
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
<?php
    include('../../resources/templates/footer3.html');
?>