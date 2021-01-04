function City()
 {
   var CA=new Array("Any","Acton","Citrus Heights","ELK GROVE","Fair Oaks","FOLSOM","Lancaster","NORTH HIGHLANDS","Palmdale","Ripon","Riverside","Roseville","SACRAMENTO","Stockton");
var FL=new Array("Any","Tampa");
var IL=new Array("Any","Chicago");
var IN=new Array("Any","Carlisle","Carmel","Clinton","Indianapolis","Montezuma","Terre Haute");
var LA=new Array("Any","New Orleans");
var MI=new Array("Any","Detroit","Flint");
var MO=new Array("Any","Kansas City","St. Louis");
var NJ=new Array("Any","Trenton");
var OH=new Array("Any","Cleveland","Dayton","Trotwood");
var PA=new Array("Any","New Castle","Philadelphia");
var TN=new Array("Any","Chattanooga");

   var selectedBoxValue=document.frm.state.value;
   var i;
   var j;

   var cityLength=eval(selectedBoxValue).length;

   removeSelectboxOption();

   for(i=0;i<document.frm.state.options.length;i++)
   {
    if(selectedBoxValue==document.frm.state.options[i].value)
    {
      for(j=0;j<cityLength;j++)
      {
        document.frm.city.options[j]=new Option(eval(selectedBoxValue)[j],eval(selectedBoxValue)[j])
      }
    }
   }
 }

 function removeSelectboxOption()
 {
   var i;
   for(i=0;i<document.frm.city.options.length;i++)
   {
    document.frm.city.remove(i);
   }
 }