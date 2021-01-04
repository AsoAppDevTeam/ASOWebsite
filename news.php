<?php

include('include/sql_select.php');

$rows = array();
while($row = mysql_fetch_array($sql_query))
{ 
    $rows[] = $row;
}

?>
<div class="maincontent">
  <div class="topbar">
    <a href="../../index.php">return to homepage</a>
  </div> <!-- end: topbar -->
  <div class="main_contain">
    <div class="main_left">
      <div class="page_title">
        <img src="../../resources/img/pageheaders/newsroom.png" alt="">
      </div> <!-- end: page_title -->
      <p id="pagetop" class="smlblk">click to view detail</p>
<!-- ************************************************* START NEWS HEADERLINE *************************************************** -->
<div class="newsheadlinesection">
<?php foreach($rows as $row) { ?>	
	<div class="newsheadline">
          <div class="headlinetitle">
            <p><a href="#news<?php echo $row['id']; ?>" onclick="smoothScroll('news<?php echo $row['id'] ?>'); return false"><?php echo $row['news_title']; ?></a></p>
          </div> <!-- end: headlinetitle -->
          <div class="headlinedate">
            <p><?php echo $row['date']; ?></p>
          </div> <!-- end: headlinedate -->
          <div class="clearfix"></div> <!-- end: clearfix -->
        </div>
<?php } ?>
</div><!-- end: newsheadlinesection -->
      <br><br>
      <p><span style="border-bottom: 1px solid #e9e9e9;"><span class="headerblk"><span style="color:#DA251D">News</span> Detail</span></span></p>
      <br><br>
<!-- ************************************************** END NEWS HEADERLINE **************************************************** -->
<!-- *************************************************** START NEWS DETAIL ***************************************************** -->
<div class="newsdetailsection">
<?php foreach($rows as $row) { ?>
        <div class="newsdetail" id="news<?php echo $row['id']; ?>">
          <div class="newsdetailheader">
            <p class="fontgrey"><?php echo stripslashes($row['news_title']); ?><br><span class="smlgray"><?php echo $row['date']; ?></span></p>
          </div> <!-- end: newsdetailheader -->
          <div class="newsdetailcontent">
            <?php echo stripslashes($row['pagecontent']); ?>
            <p class="backtotop" style="text-align:right;"><a href="#pagetop" onclick="smoothScroll('pagetop'); return false">back to top</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;<a href="#news36" onclick="smoothScroll('news<?php echo ($row['id']-1); ?>'); return false">go to next profile</a></p>
          </div> <!-- end: newsdetailcontent -->
          <div class="clearfix"></div> <!-- end: clearfix -->
        </div> <!-- end: newsdetail -->
<?php } ?>
</div><!-- end: newsdetailsection -->
<!-- **************************************************** END NEWS DETAIL ****************************************************** -->
    </div> <!-- div: main_left -->
    <div class="main_shadow">
      <div class="midshadowtop">
      </div> <!-- end: midshadowtop -->
      <div class="midshadowmid">
      </div> <!-- end: midshadowmid -->
      <div class="midshadowlow">
      </div> <!-- end: midshadowlow -->
      <div class="clearfix"></div> <!-- end: clearfix -->
    </div> <!-- div: main_shadow -->
    <div class="main_right">
      <div class="globalmenu">
        <script type="text/javascript">
<!--
stm_bm(["menu02d0",900,"../../scripts/menu","blank.gif",0,"","",0,0,250,0,140,1,1,1,"","",0,0,1,2,"hand","hand","",1,25],this);
stm_bp("p0",[1,4,0,0,2,0,0,0,92,"",-2,"",-2,50,0,0,"#999999","#DA251C","",3,1,2,"#666666"]);
stm_ai("p0i0",[2,"","op1_off.png","op1_on.png",200,28,0,"","_self","","","","",0,0,0,"","",0,0,0,1,1,"#DA251C",1,"#DA251C",0,"","",3,3,0,0,"#000000","#FFFFFF","#FFFFFF","#FFFFFF","8pt Arial","8pt Arial",0,0,"","","","",0,0,0]);
stm_bpx("p1","p0",[1,2,-400,0,2,3,0,0,100,"",-2,"",-2,50,0,0,"#999999","#CCCCCC","",3,1,1]);
stm_aix("p1i0","p0i0",[0,"Products Overview","","",-1,-1,0,"../products/","_self","","","","",0,0,0,"","",0,0,0,0,1,"#FFFFFF",1,"#CCCCCC",0,"","",3,3,0,0,"#000000","#FFFFFF","#000000","#FFFFFF","8pt Verdana","8pt Verdana"]);
stm_aix("p1i1","p1i0",[0,"Home Finance Solutions","","",-1,-1,0,"../products/home-finance.php"]);
stm_aix("p1i2","p1i0",[0,"Individual Banking Solutions","","",-1,-1,0,"../products/individual-banking.php"]);
stm_aix("p1i3","p1i0",[0,"Business Banking Solutions","","",-1,-1,0,"../products/business-banking.php"]);
stm_aix("p1i4","p1i0",[0,"E-Banking Solutions","","",-1,-1,0,"../products/e-banking.php"]);
stm_aix("p1i5","p1i0",[0,"Real Estate Investment Banking","","",-1,-1,0,"../products/real-estate.php"]);
stm_ep();
stm_aix("p0i1","p0i0",[2,"","op2_off.png","op2_on.png",200,28,0,"http://mls.asoplc.com/"]);
stm_aix("p0i2","p0i0",[2,"","op3_off.png","op3_on.png"]);
stm_bpx("p2","p1",[1,2,-337]);
stm_aix("p2i0","p1i0",[0,"Questions & Answers","","",-1,-1,0,"../service/faqs.php"]);
stm_aix("p2i1","p1i0",[0,"Branch/ATM Location","","",-1,-1,0,"../service/"]);
stm_aix("p2i2","p1i0",[0,"Contact Us","","",-1,-1,0,"../../mail/contactform.php"]);
stm_ep();
stm_aix("p0i3","p0i0",[2,"","op4_off.png","op4_on.png"]);
stm_bpx("p3","p1",[1,2,-348]);
stm_aix("p3i0","p1i0",[0,"Corporate Governance","","",-1,-1,0,"../investors/"]);
stm_aix("p3i1","p1i0",[0,"Ratings","","",-1,-1,0,"../investors/coverageratings.php"]);
stm_aix("p3i2","p1i0",[0,"Financials","","",-1,-1,0,"../investors/asofinancials.php"]);
stm_aix("p3i3","p1i0",[0,"Questions & Inquiries","","",-1,-1,0,"../../mail/contactform.php"]);
stm_ep();
stm_aix("p0i4","p0i0",[2,"","op5_off.png","op5_on.png"]);
stm_bpx("p4","p1",[1,2,-279]);
stm_aix("p4i0","p1i0",[0,"Newsroom","","",-1,-1,0,"index.php"]);
stm_aix("p4i1","p1i0",[0,"Downloads","","",-1,-1,0,"asodownloads.php"]);
stm_ep();
stm_ep();
stm_em();
//-->
</script>
      </div> <!-- end: globalmenu -->
      <div style="display:block; height:3px; width:250px;"></div>
      <div class="menubottom2">
        <script type="text/javascript" language="JavaScript">
      <!--
      function parseNavigation(ob) {
      toBeBrokenDown = ob.options[ob.selectedIndex].value.split("|");

      targetWindow = toBeBrokenDown[0];
      targetURL    = toBeBrokenDown[1];

      if (targetWindow!=='') {
          window.open(targetURL,targetWindow,'toolbar=1,location=1,directories=1,status=1,menubar=1,scrollbars=1,resizable=1,width=400,height=300');
ob.selectedIndex = 0;
      } else {		
          window.open(targetURL,'_top')
      }
  }
//-->
</script>
        <form name="form" id="form" action="">
          <select class="searchfont" onchange="parseNavigation(this)" style="width:208px; padding:2px;">
            <option selected="selected">Quick Links</option>
            <option value="|../promos/">ASO Promotions</option>
            <option value="|../../exhibition/">ASO Exhibition</option>
            <option value="|../service/faqs.php">FAQ's</option>
            <option value="|../info/affordability_calculator.php">Affordability Calculator</option>
            <option value="|../company/">About ASO</option>
            <option value="|../products/individual-banking.php">Individual Banking Solutions</option>
            <option value="|../products/business-banking.php">Business Banking Solutions</option>
            <option value="|../products/home-finance.php">Home Finance Solutions</option>
            <option value="|../investors/">Investor Relations</option>
            <option value="|../company/asocareers.php">Careers</option>
            <option value="VenWin|../../resources/downloads/SCMVendorQuestionnaire.pdf">Vendor Questionnaire</option>
            <option value="|../info/site_credits.php">Site Credits</option>
          </select>
        </form>
      </div> <!-- end: menubottom -->
      <div class="infoheader">
        <img src="../../resources/img/infoheaders/ad5.png" alt="">
      </div> <!-- end: infoheader -->
      <div class="sidebarbtm">
      </div> <!-- end: sidebarbtm -->
      <div class="clearfix"></div> <!-- end: clearfix -->
    </div> <!-- div: main_right -->
    <div class="clearfix"></div> <!-- end: clearfix -->
  </div> <!-- end: main_contain -->
  <script type="text/javascript"> 
    function currentYPosition() {
      if (self.pageYOffset)
        return self.pageYOffset;
        if (document.documentElement && document.documentElement.scrollTop)
        return document.documentElement.scrollTop;
        if (document.body.scrollTop)
        return document.body.scrollTop;
        return 0;
    }
    function elmYPosition(eID) {
      var elm  = document.getElementById(eID);
      var y    = elm.offsetTop;
      var node = elm;
      while (node.offsetParent && node.offsetParent != document.body) {
        node = node.offsetParent;
        y   += node.offsetTop;
      } return y;
}
function smoothScroll(eID) {
var startY   = currentYPosition();
var stopY    = elmYPosition(eID);
var distance = stopY > startY ? stopY - startY : startY - stopY;
if (distance < 100) {
  scrollTo(0, stopY); return;
}
var speed = Math.round(distance / 100);
if (speed >= 20) speed = 50;
var step  = Math.round(distance / 25);
var leapY = stopY > startY ? startY + step : startY - step;
var timer = 0;
if (stopY > startY) {
  for ( var i=startY; i<stopY; i+=step ) {
      setTimeout("window.scrollTo(0, "+leapY+")", timer * speed);
      leapY += step; if (leapY > stopY) leapY = stopY; timer++;
  } return;
}
for ( var i=startY; i>stopY; i-=step ) {
  setTimeout("window.scrollTo(0, "+leapY+")", timer * speed);
  leapY -= step; if (leapY < stopY) leapY = stopY; timer++;
}
}
  </script>
</div> <!-- end: maincontent -->