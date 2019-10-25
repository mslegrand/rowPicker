
// cRowPickerScrollBaRContainer > cRowPickerScrollBaRList > snippetButton
function RowPickerScrollBaR(containerId, listId, buttonDownId, buttonUpId, itemHeight){
  this.containerId =  "#" +  containerId;
  this.listId      =  "#" +  listId;
  this.downId      =  "#" +  buttonDownId;
  this.upId        =  "#" +  buttonUpId;
  this.itemHeight  =  itemHeight;

  this.gHiddenHeight=0;
}

  RowPickerScrollBaR.prototype.getTopPos=function(){
    return $(this.listId).position().top;
  };

  RowPickerScrollBaR.prototype.heightOfList=function(){
    return this.itemHeight*($(this.listId).children().length);
  };
  RowPickerScrollBaR.prototype.heightOfHidden = function(){
    var rtv =  this.heightOfList()-$(this.containerId).outerHeight();
    if(rtv<0){
      rtv=0;
    }
    return rtv;
  };
  RowPickerScrollBaR.prototype.reAdjustPos = function(){
    console.log('entering reAdjustPos');
    var deltaHidden = this.heightOfHidden() - this.gHiddenHeight;
    console.log('deltaHidden=' + deltaHidden);
    if( deltaHidden > 0 ){ // container got smaller, hidden increased
      // keep current position
      // show down
      $(this.downId).show();
    } else if( deltaHidden < 0 ){ // deltaHidden<=0; container grew, hidden decreased
      // slide list down
      if(this.heightOfHidden()<=0){
         $(this.listId).animate({top:0},'fast');
         $(this.upId).hide();
         $(this.downId).hide();
      } else if( this.getTopPos()<= -this.heightOfHidden()-6){
         $(this.listId).animate({top:-this.heightOfHidden()-6},'fast');
         $(this.downId).hide();
      }
    }

    if( this.getTopPos()>=-4){
      $(this.upId).hide();
    }
    if(this.heightOfHidden()<=4){
      $(this.downId).hide();
    }
	  this.gHiddenHeight=this.heightOfHidden();
  };


  RowPickerScrollBaR.prototype.onDownClick = function(){
    //console.log('down click 0--');
    var delta  = 0.5*$(this.containerId).outerHeight();
    var tp = this.getTopPos() - delta;
    if( ( tp + this.heightOfHidden() )<=0 ){
        tp = -this.heightOfHidden()-6;
        $(this.downId).fadeOut('slow');
    }
    $(this.listId).animate({top: tp },'slow',function(){$(this.upId).fadeIn('slow');});
    $(this.upId).fadeIn('slow');
  };



  RowPickerScrollBaR.prototype.onUpClick = function() {
    //console.log("tbUp click");
  	$(this.downId).fadeIn('slow');
    var delta = Math.min(-this.getTopPos(), $(this.containerId).outerHeight()-2*this.itemHeight );
    if(-this.getTopPos()<= $(this.containerId).outerHeight()-2*this.itemHeight ){
      $(this.upId).fadeOut('slow');
    }
    $(this.listId).animate({top:"+=" + delta +"px"},'slow',function(){});
  };



function RowPickerList(containerId, listId){
  this.cID= "#" + containerId;
	this.ID =  "#" +  listId;
	this.SelectedRow=1;
	$(this.ID).sortable({ tolerance:6, distance:10  });

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
					$(this).addClass('group');
					$(this).parent().find(".selected").addClass("group");
					$(this).parent().find(".selected").removeClass("selected");
					$(this).toggleClass('selected');
				} else {
					$(this).parent().find(".selected").removeClass("selected");
					$(this).parent().find(".group").removeClass("group");
					$(this).toggleClass('selected');
				}
				$(cID).data("keys",{
				    	altKey:   !!event.altKey,
                        shiftKey: !!event.shiftKey,
                        ctrlKey:  !!event.ctrlKey,
                        metaKey:  !!event.metaKey
				});
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

	this.removeEntireGroup=function(){
	    console.log('inside rowPickerBaR.js: removeEntireGroup')
	  var pos;
	  for ( pos=0; pos<$(this.ID+ ' li').length; pos++){
	      $(this.ID+' li:eq('+pos+')').removeClass('group');
	  }
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
//  1. rename RowPickerScrollBaR => rowToolBaR
//  2. combine toolBar and PickerList
//  3. rename snippet js and css
