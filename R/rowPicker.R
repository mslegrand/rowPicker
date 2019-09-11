initRowPickerHandler<-function(){
  addResourcePath(
    prefix = 'rowPicker', directoryPath = system.file('www', package='rowPicker')
  )
  try({ removeInputHandler("rowPickerBinding") })

  shiny::registerInputHandler(
    "rowPickerBinding",
    function(x, shinysession, name) {
      if(is.null(x)) {
        return(NULL)
      } else {
        #selected<-jsonlite::fromJSON(x$selected)
        print(x)
        # return(res)
        return(x)
      }
    }
  )
  HTML("")
}



rowPicker<-function(inputId, size){

  tagList(
    singleton(
      tags$head(
        initRowPickerHandler(),
        tags$link(rel = "stylesheet", type = "text/css", href = "rowPicker/tibRow.css"),
        tags$link(rel = "stylesheet", type = "text/css", href = "rowPicker/snippet.css"),
        tags$script(src = 'shared/jqueryui/jquery-ui.min.js'),
        tags$script(src="rowPicker/snippetScrolleR.js"),
        tags$script(src="rowPicker/rowPicker.js")
      )
    ),
    div(
      id=inputId,
      'data-count'=toJSON(as.numeric(size)),
      class="rowPicker cSnippetToolBarContainer leftAlign",
      tags$ul(
        id=paste0(inputId,'-list'), #"tibRowButtons",
        class="cSnippetToolBarList",
        tags$li(
          class='tibRowButton',
          onclick="alert('999')",
          span(999)
        )
      ),
      div( id=paste0(inputId,'-scrollUp'), class='snippetButton  cTop center',
           span('class'="glyphicon glyphicon-chevron-up")
      ),
      div( id=paste0(inputId,"-scrollDown"), class='snippetButton cBottom center',
           span('class'="glyphicon glyphicon-chevron-down")
      )
    )
  )
}


updateRowPicker<-function(session, inputId, ...){
  mssg<-list(...)
  print(mssg)
  session$sendInputMessage(inputId, mssg)
}

