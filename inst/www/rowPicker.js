var rowPickerBinding = new Shiny.InputBinding();
$.extend(rowPickerBinding, {
  find: function(scope) {
    return $(scope).find(".rowPicker");
  },
  initialize: function(el){
    //  Initialize any data values here
    // console.log('initializing rowPicker with id='+el.id);
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
	      $(el).trigger("change");
	    }

	  } );

    let rpl = new RowPickerList(inputId1, inputId2);
    $(el).data("rowList", rpl);
    let count = $(el).attr(`data-count`);
    count=JSON.parse(count);
    $(el).data("rowList").populateRows(count);
    $(el).data("rowList").change();
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
      //console.log('count='+value.count);
      //console.log('typeof count='+typeof(value.count));
      let count=Number(value.count);
      if(count>0){
        $(el).data("rowList").populateRows(count);
        $(el).data("rowScroller").reAdjustPos();
      } else {
        $(el).data("rowList").clearRows();
        $(el).data("rowScroller").reAdjustPos();
      }
    }
    if(!!value.clearRows){
       // console.log('clearRows');
      $(el).data("rowList").clearRows();
      $(el).data("rowScroller").reAdjustPos();
    }
    if(!!value.renumber){
        // console.log('renumber');
      $(el).data("rowList").renumberTibRows();
    }
    if(!!value.insertRow){
        let rows=value.insertRow;
       // console.log('insertRow');
        if(!Array.isArray(rows)){ rows=[rows];}
        let index;
        for( index of rows){
            $(el).data("rowList").insertRow(index);
        }
        $(el).data("rowList").renumberTibRows();
        $(el).data("rowScroller").reAdjustPos();
    }
    if(!!value.deleteRow){
      //  console.log('deleteRow');
        let rows=value.deleteRow;
        if(!Array.isArray(rows)){ rows=[rows];}
        let index;
          for( index of rows){
              $(el).data("rowList").deleteRow(index);
          }
        $(el).data("rowList").renumberTibRows();
        $(el).data("rowScroller").reAdjustPos();
    }
    if(!!value.addToGroup){
      //  console.log('addToGroup');
      let rows=value.addToGroup;
     // console.log('shit rows='+JSON.toString(rows));
     // console.log('shit rows='+rows);
     // console.log('typeof rows='+typeof(rows));
     // console.log('Array.isArray(rows)='+Array.isArray(rows));
      if(!Array.isArray(rows)){ rows=[rows];}
      let index;
     // console.log('length rows='+rows.length);
      for( index of rows){
          $(el).data("rowList").addToGroup(index);
      }
    }
    if(!!value.removeFromGroup){
     //   console.log('removeFromGroup');
      let rows=value.removeFromGroup;
      if(!Array.isArray(rows)){ rows=[rows];}
      let index;
      for( index of rows){
          $(el).data("rowList").removeFromGroup(index);
      }
      //let index=Number(value.removeFromGroup);
     // $(el).data("rowList").removeFromGroup(index);
    }
    if(!!value.removeEntireGroup){
     //   console.log('removeEntireGroup');
       $(el).data("rowList").removeEntireGroup();
    }
    if(!!value.selectRow){
    // console.log('selectRow');
      let index=Number(value.selectRow);
      $(el).data("rowList").selectRow(index);
    }
   // console.log('change');
    $(el).data("rowList").change();
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
    // console.log(JSON.toString(data));
    this.setValue(el,data);
/*

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
    if(!!data.removeEntireGroup){
        this.setValue(el, {removeEntireGroup:data.removeEntireGroup});
    }
*/
  },
  getType: function(el){
    return "rowPickerBinding";
  }
});

// REGISTER INPUT BINDING
Shiny.inputBindings.register(rowPickerBinding);
