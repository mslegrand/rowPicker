
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
        rtv<-list(
          selected=as.numeric(jsonlite::fromJSON(x$selected)),
          order=as.numeric(jsonlite::fromJSON(x$order)),
          group=as.numeric(jsonlite::fromJSON(x$group))
        )
        return(rtv)
      }
    }
  )
  HTML("")
}


#' constructs a rowPicker with the given count
#'
#' @param inputId the id of this shiny input
#' @param count the number of initial row entries
#' @export
rowPicker<-function(inputId, count){

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
      'data-count'=toJSON(as.numeric(count)),
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

#' updates the RowPicker
#'
#' @param count reset with value count many rows
#' @param renumber change row numbers to be sequential
#' @param clearRows reset with 0 rows
#' @param insertRow insertRow at index = value of insertRow
#' @param deleteRow deleteRow at index = value of deleteRow
#' @param selectRow selectRow at index = value of selectRow
#' @export
updateRowPicker<-function(session, inputId, ...){
  mssg<-list(...)
  # print(mssg)
  session$sendInputMessage(inputId, mssg)
}

