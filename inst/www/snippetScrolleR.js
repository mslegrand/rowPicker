
// cSnippetToolBarContainer > cSnippetToolBarList > snippetButton
function SnippetToolBaR(containerId, listId, buttonDownId, buttonUpId, itemHeight){
  this.containerId =  "#" +  containerId;
  this.listId      =  "#" +  listId;
  this.downId      =  "#" +  buttonDownId;
  this.upId        =  "#" +  buttonUpId;
  this.itemHeight  =  itemHeight;

  this.gHiddenHeight=0;
}

  SnippetToolBaR.prototype.getTopPos=function(){
    console.log('listId='+JSON.stringify(this.listId));
    return $(this.listId).position().top;
  };

  SnippetToolBaR.prototype.heightOfList=function(){
    return this.itemHeight*($(this.listId).children().length);
  };
  SnippetToolBaR.prototype.heightOfHidden = function(){
    var rtv =  this.heightOfList()-$(this.containerId).outerHeight();
    if(rtv<0){
      rtv=0;
    }
    return rtv;
  };
  SnippetToolBaR.prototype.reAdjustPos = function(){
    console.log('entering reAdjustPos');
    var deltaHidden = this.heightOfHidden() - this.gHiddenHeight;
    console.log('deltaHidden=' + deltaHidden);
    if( deltaHidden > 0 ){ // container got smaller, hidden increased
      // keep current position
      // show down
      $(this.downId).show();
    } else if( deltaHidden < 0 ){ // deltaHidden<=0; container grew, hidden decreased
      // slide list down by the amount -deltaHidden
      if(deltaHidden>-this.itemHeight){
        $(this.listId).animate({top:0},'fast');
      } else{
        $(this.listId).animate({top:"-="+ deltaHidden +"px"},'fast');
      }
    }
    console.log('getTopPos()=' + this.getTopPos() );
    if( this.getTopPos()>=-4){
      $(this.upId).hide();
    }
    if(this.heightOfHidden()<=4){
      $(this.downId).hide();
    }
	  this.gHiddenHeight=this.heightOfHidden();
  };


  SnippetToolBaR.prototype.onDownClick = function(){
    console.log('down click 0--');
    var m1 = $(this.containerId).outerHeight()-2*this.itemHeight;
    var m2 = (this.heightOfHidden()+ this.getTopPos());
    var delta = Math.min(m1,m2);
    if(m2<=m1){
      $(this.downId).fadeOut('slow');
      delta=delta+8;
    }
    $(this.listId).animate({top:"-=" + delta + "px"},'slow',function(){$(this.upId).fadeIn('slow');});
    $(this.upId).fadeIn('slow');
  };



  SnippetToolBaR.prototype.onUpClick = function() {
    console.log("tbUp click");
  	$(this.downId).fadeIn('slow');
    var delta = Math.min(-this.getTopPos(), $(this.containerId).outerHeight()-2*this.itemHeight );
    if(-this.getTopPos()<= $(this.containerId).outerHeight()-2*this.itemHeight ){
      $(this.upId).fadeOut('slow');
    }
    $(this.listId).animate({top:"+=" + delta +"px"},'slow',function(){});
  };




/*
var toggleClass(el, className){
	el.toggleCkass(className);
};
*/
//var rowClick=function(event){
//}

/*
#1. populate
#2. renumber
#3. sortable
#4. currentSelection
#5. currrentGroup
#6. insertAt
*/

function RowPickerList(containerId, listId){
  this.cID= "#" + containerId;
	this.ID =  "#" +  listId;
	this.SelectedRow=1;
	$(this.ID).sortable();

  this.change=function(){
    $(this.cID).trigger("change");
  };

	this.renumberTibRows=function(){
		$(this.ID+' li span').each( function(index, value){
			$(this).text(index+1);
		});
		this.change();
	};

	this.getRowButtonsAll=function(){
		 var tmp = $(this.ID).find('li span').map(function(i,e){
			return $(this).text();
		}).get();
		//console.log('tmp='+JSON.stringify(tmp));
		return(tmp);
	};

	this.getSelected=function(){
		 var tmp = $(this.ID).find('li.selected span').map(function(i,e){
			return $(this).text();
		}).get();
		//console.log('tmp='+JSON.stringify(tmp));
		return(tmp);
	};

	this.getGroup=function(){// need to track number of selected row.(){
		 var tmp = $(this.ID).find('li.group span').map(function(i,e){
			return $(this).text();
		}).get();
		return(tmp);
	};

	this.newRowButton=function(n){
		var span =$('<span />').html("<"+n);
		var cID = this.cID;
		var N=n;
		var li =$("<li />",{
			class:'tibRowButton',
			click:function(event){
				if( event.ctrlKey ){
					$(this).toggleClass('group');
				} else {
					$(this).parent().find(".selected").removeClass("selected");
					$(this).parent().find(".group").removeClass("group");
					$(this).toggleClass('selected');
				}
				$(cID).trigger("change");
			}
		}).append(span);
		return(li);
	};

	this.insertRow=function(rowNumber){ //rowNumber  is index+1
		// if index<nrow, find index and insert before
		// if index>nrow, append
		var nrow= $(this.ID+ ' li').length;
		var pos=rowNumber-1;
		var rowbutton= this.newRowButton(rowNumber);
		//console.log('-----------rowbutton=\n'+JSON.stringify(rowbutton));
		if(pos<nrow){
			$(this.ID + ' li:eq('+pos+')').before(rowbutton);
		} else { //append to end
			//alert('append rowbutton');
			$(this.ID).append(rowbutton);
		}
		this.selectRow(rowNumber);
		$(this.cID).trigger("change");
		//$(this).parent().find(".selected").removeClass("selected");


		//renumberTibRows();
	};

	this.deleteRow=function(rowNumber){
		var index=rowNumber-1;
		var nrow= $(this.ID+' li').length;


		if(index>=0 && index < nrow){
			let reset=false;
			if( $(this.ID+' li:eq('+index+')').hasClass('selected') ){
				reset=true;
			}
			$(this.ID+' li:eq('+index+')').remove();
			if(reset===true){
				index=Math.min(index, nrow-1);
				if(index>0){
					$(this.ID+' li:eq('+index+')').addClass('selected');
				}
				$(this.cID).trigger("change");
			}

		}
	};

	this.clearRows=function(){
		$(this.ID+' li').remove();
	};

	this.selectRow=function(rowNumber){
		$(this.ID).find(".selected").removeClass("selected");
		var pos=rowNumber-1;
		 $(this.ID+' li:eq('+pos+')').addClass('selected');
		 $(this.cID).trigger("change");
	};

	this.addToGroup=function(rowNumber){
	  var pos=rowNumber-1;
	  $(this.ID+' li:eq('+pos+')').addClass('group');
		$(this.cID).trigger("change");
	};

	this.removeFromGroup=function(rowNumber){
	  var pos=rowNumber-1;
	  $(this.ID+' li:eq('+pos+')').removeClass('group');
		$(this.cID).trigger("change");
	};

	this.populateRows=function(n){
		this.clearRows();
		for(var i=0;i<n;i++){
			var li=this.newRowButton('');
			$(this.ID).append(li);
		}
		this.renumberTibRows();
		this.selectRow(n);
		this.change();
	};
}

//
//todo
//  1. rename SnippetToolBaR => rowToolBaR
//  2. combine toolBar and PickerList
//  3. rename snippet js and css
