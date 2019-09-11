var rowPickerBinding = new Shiny.InputBinding();
$.extend(rowPickerBinding, {
  find: function(scope) {
    
    return $(scope).find(".rowPicker");
  },
  initialize: function(el){
    //  Initialize any data values here
    // here we initial Z and the current Index
    var inputId1=el.id;
    //console.log('inputId1='+el.id);
    var inputId2=el.id+'-list';
    //console.log('inputId2='+inputId2);
    var downId=el.id+"-scrollDown";
    //console.log('downId='+downId);
    var upId=el.id+"-scrollUp";
    ////console.log('downId='+upId);
    var rowScroller = new SnippetToolBaR( inputId1, inputId2, downId, upId, 32);
    
    $(el).data("rowScroller", rowScroller);
    
    $(el).data("rowScroller").reAdjustPos();
    $(rowScroller.downId).click(function(){$(el).data("rowScroller").onDownClick();});
    $(rowScroller.upId).click(function(){ $(el).data("rowScroller").onUpClick();});
    
    $(window).on('resize',function(e){  $(el).data("rowScroller").reAdjustPos(); });
    
	  $("#"+inputId2).sortable(
	    { 
	      update:function(event, ui){
	      console.log('hello');
	      $(el).trigger("change");
	    }
	    
	  } );

    let rpl = new RowPickerList(inputId1, inputId2);
    $(el).data("rowList", rpl);
    let count = $(el).attr(`data-count`);
    count=JSON.parse(count);
    $(el).data("rowList").populateRows(count);
    //this.(el, setValue
    $(el).data('rowScroller').reAdjustPos();
    
    //let iniRowList=$(el).attr(`data-rowList`); //extract attribute
    //$(el).data("rowList", JSON.parse(iniRowList)); //convert to an object and attach
    //$(el).data('Index',0); // set index
  },
  getValue: function(el) {
    let selected = $(el).data("rowList").getSelected();
    let group = $(el).data("rowList").getGroup();
    let order = $(el).data("rowList").getRowButtonsAll();
    return {
      selected: JSON.stringify(selected),
      group: JSON.stringify(group),
      order: JSON.stringify(order)
    };
  },
  setValue: function(el, value) { 
    // used for updating input control
    if(!!value.count){
      if(value.count>0){
        $(el).data("rowList").populateRows(value.count);
      } else {
        $(el).data("rowList").clearRows();
      }
    }
    if(!!value.clearRows){
      $(el).data("rowList").clearRows();
    }
    if(!!value.renumber){
      $(el).data("rowList").renumberTibRows();
    }
    if(!!value.insertRow){
      let index=Number(value.insertRow);
      $(el).data("rowList").insertRow(index);
      $(el).data("rowList").renumberTibRows();
    }
    if(!!value.deleteRow){
      let index=Number(value.deleteRow);
      $(el).data("rowList").deleteRow(index);
      $(el).data("rowList").renumberTibRows();
    }
    if(!!value.selectRow){
      let index=Number(value.selectRow);
      $(el).data("rowList").selectRow(index);
    }
  },
  subscribe: function(el, callback) {
    // notify server whenever change 
      $(el).on("change.rowPickerBinding", function(e) {
      callback(false);
    });
  },
  unsubscribe: function(el) {
    $(el).off(".rowPickerBinding");                              
  },
  receiveMessage: function(el, data) { //called by server when updating 
   
    if(!!data.count){
      let count = Number( data.count); 
      console.log('data.count='+JSON.stringify(count));
      this.setValue(el, {count: count});
    }
    if(!!data.renumber){
      this.setValue(el, {renumber:true});
    }
    if(!!data.clearRows){
      this.setValue(el, {clearRows: true});
    }
    if(!!data.insertRow){
      this.setValue(el, {insertRow:data.insertRow});
    }
    if(!!data.deleteRow){
      this.setValue(el, {deleteRow:data.deleteRow});
    }
    if(!!data.selectRow){
      this.setValue(el, {selectRow:data.selectRow});
    }
    
  },
  
  getType: function(el){ 
    return "rowPickerBinding";
  }
});

// REGISTER INPUT BINDING
Shiny.inputBindings.register(rowPickerBinding);
