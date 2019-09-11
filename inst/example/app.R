#
# This is a Shiny web application. You can run the application by clicking
# the 'Run App' button above.
#
# Find out more about building applications with Shiny here:
#
#    http://shiny.rstudio.com/
#

library(shiny)
library(rowPicker)
# Define UI for application that draws a histogram
ui <- fluidPage(
    basicPage(
        rowPicker(inputId="myTibRowCntrl", size=5),
        fixedPanel(top=0, left=100,
           span( tags$b('selected:'),
                textOutput(outputId = 'selection')
            ),
           span( tags$b('group:'),
                 textOutput(outputId = 'group')
           ),
           span( tags$b('order:'),
                 textOutput(outputId = 'order')
           ),
           span( tags$b('count:'),
                 textOutput(outputId = 'count')
           ),
           numericInput(inputId = 'size',
                label='Reset Size',
                10, min = 0, max = 100, step = NA,
                width = 100
            ),
           actionButton(inputId='set', label='set'),
           actionButton(inputId='renumber', label='renumber')
        )
    )
)

# Define server logic required to draw a histogram
server <- function(input, output, session) {
    observeEvent(input$set,{
        count=input$size
        cat('size=',count,'\n')
        if(as.numeric(count)>0){
            updateRowPicker(session, "myTibRowCntrl", count= count)
        } else {
            updateRowPicker(session, "myTibRowCntrl", clearRows= TRUE)
        }

    })
    observeEvent(input$renumber,{
        updateRowPicker(session, "myTibRowCntrl", renumber = TRUE)
    })
    output$selection=renderText(input$myTibRowCntrl$selected)
    output$group=renderText(input$myTibRowCntrl$group)
    output$order=renderText(input$myTibRowCntrl$order)
    output$count=renderText('unknown')
}

# Run the application
shinyApp(ui = ui, server = server)
