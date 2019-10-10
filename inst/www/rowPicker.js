var rowPickerBinding = new Shiny.InputBinding();
$.extend(rowPickerBinding, {
  find: function(scope) {
    return $(scope).find(".rowPicker");
  },
  initialize: function(el){
    //  Initialize any data values here
    var inputId1=el.id;
    var inputId2=el.id+'-list';
    var downId=el.id+"-scrollDown";
    var upId=el.id+"-scrollUp";
    var rowScroller = new RowPickerScrollBaR( inputId1, inputId2, downId, upId, 22);
    // add to element
    $(el).data("rowScroller", rowScroller);
    $(el).data("keys",{
				    	altKey:   false,
                        shiftKey: false,
                        ctrlKey:  false,
                        metaKey:  false
    });

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
    $(el).data('rowScroller').reAdjustPos();
  },
  getValue: function(el) {
    let selected = $(el).data("rowList").getSelected();
    let group =    $(el).data("rowList").getGroup();
    let order =    $(el).data("rowList").getRowButtonsAll();
    let keys  =    $(el).data("keys");
    return {
      selected: JSON.stringify(selected),
      group: JSON.stringify(group),
      order: JSON.stringify(order),
      keys:  JSON.stringify(keys)
    };
  },
  setValue: function(el, value) {
    // used for updating input control
    if(!!value.count){
      if(value.count>0){
        $(el).data("rowList").populateRows(value.count);
        $(el).data("rowScroller").reAdjustPos();
      } else {
        $(el).data("rowList").clearRows();
        $(el).data("rowScroller").reAdjustPos();
      }
    }
    if(!!value.clearRows){
      $(el).data("rowList").clearRows();
      $(el).data("rowScroller").reAdjustPos();
    }
    if(!!value.renumber){
      $(el).data("rowList").renumberTibRows();
    }
    if(!!value.insertRow){
      let index=Number(value.insertRow);
      $(el).data("rowList").insertRow(index);
      $(el).data("rowList").renumberTibRows();
      $(el).data("rowScroller").reAdjustPos();
    }
    if(!!value.deleteRow){
      let index=Number(value.deleteRow);
      $(el).data("rowList").deleteRow(index);
      $(el).data("rowList").renumberTibRows();
      $(el).data("rowScroller").reAdjustPos();
    }
    if(!!value.addToGroup){
      console.log('addToGroup');
      let index=Number(value.addToGroup);
      $(el).data("rowList").addToGroup(index);
    }
    if(!!value.removeFromGroup){
      let index=Number(value.removeFromGroup);
      $(el).data("rowList").removeFromGroup(index);
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
    if(!!data.addToGroup){
      this.setValue(el, {addToGroup:data.addToGroup});
    }
    if(!!data.removeFromGroup){
      this.setValue(el, {removeFromGroup:data.removeFromGroup});
    }
  },
  getType: function(el){
    return "rowPickerBinding";
  }
});

// REGISTER INPUT BINDING
Shiny.inputBindings.register(rowPickerBinding);
