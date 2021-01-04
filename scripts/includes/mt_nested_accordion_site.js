window.addEvent('domready', function() {
var accordion = new Accordion('div.t1', 'div.t2', {
start:'all-closed',
opacity: false,
duration: 100,
alwaysHide: true,
onActive: function(togglers, stretchers){
togglers.setStyle('background-image', 'url(../../resources/img/global/title_bkgd.png)');
togglers.setStyle('border-top', '1px #C3C3C3 solid');
togglers.setStyle('border-right', '1px #C3C3C3 solid');
togglers.setStyle('border-left', '1px #C3C3C3 solid');
togglers.setStyle('background-color', '#CCCCCC');
},
onBackground: function(togglers, stretchers){
togglers.setStyle('background-color', '#FFFFFF');
togglers.setStyle('background-image', 'none');
togglers.setStyle('border-top', 'none');
togglers.setStyle('border-right', 'none');
togglers.setStyle('border-left', 'none');
stretchers.setStyle('height', stretchers.offsetHeight);
$$('div.t3').setStyle('height','0');//you close all sub accordion
}
}, $('sidebar'));
var accordion1 = new Accordion('div.t3o', 'div.t3', {
start:'all-closed',
opacity: false,
duration: 100,
alwaysHide: true,
onActive: function(togglers, stretchers){
togglers.getParent().setStyle("height", "auto");
},
onBackground: function(togglers, stretchers){
stretchers.setStyle('height',stretchers.offsetHeight);
}
}, $('sidebar'));
});