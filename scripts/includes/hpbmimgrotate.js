var banner=new Array()
banner[0]='<img src="black_images/banner01.jpg" width="212" height="80" BORDER="0">'
banner[1]='<img src="black_images/banner02.jpg" width="212" height="80" BORDER="0">'
banner[2]='<img src="black_images/banner03.jpg" width="212" height="80" BORDER="0">'
banner[3]='<img src="black_images/banner04.jpg" width="212" height="80" BORDER="0">'
banner[4]='<img src="black_images/banner05.jpg" width="212" height="80" BORDER="0">'
banner[5]='<img src="black_images/banner06.jpg" width="212" height="80" BORDER="0">'
var whichbanner=Math.floor(Math.random()*(banner.length))
document.write(banner[whichbanner])
