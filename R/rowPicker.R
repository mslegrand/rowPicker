library(jsonlite)

try({ removeInputHandler("rowPickerBinding") })

rowPicker<-function(inputId, size){
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
}


updateRowPicker<-function(session, inputId, ...){
  mssg<-list(...)
  print(mssg)
  session$sendInputMessage(inputId, mssg)
}

shiny::registerInputHandler(
  "rowPickerBinding", 
  function(x, shinysession, name) {
    
    if(is.null(x)) {
      return(NULL)
    } else {
      #selected<-jsonlite::fromJSON(x$selected)
      print(x)
      # # Parse return value from JSON into R format dataframe
      # colors_df <- jsonlite::fromJSON(x)
      # 
      # # Extract the values of the data frame as a list
      # res <- list()  
      # 
      # res[["fill"]] <- colors_df$value[
      #   which(grepl(colors_df$name,pattern="fill"))
      #   ]
      # res[["border"]] <- colors_df$value[
      #   which(grepl(colors_df$name,pattern="border"))
      #   ]
      # 
      # return(res)
      return(x)
    }
  }
)