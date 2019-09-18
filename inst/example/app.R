#
# This is a Shiny web application. You can run the application by clicking
# the 'Run App' button above.
#
# Find out more about building applications with Shiny here:
#
#    http://shiny.rstudio.com/
#

library(shiny)
library(jsonlite)
library(rowPicker)
# Define UI for application that draws a histogram
ui <- fluidPage(
    basicPage(

        rowPicker(inputId="myTibRowCntrl", count=5),
        fixedPanel(top=10, left=100,

           div(  tags$b('selected:'),
                div(style="display:inline-block;vertical-align:top;",
                    textOutput(outputId = 'selection'))
            ),
           div( tags$b('group:'),
                 div(style="display:inline-block;vertical-align:top;",
                 textOutput(outputId = 'group'))
           ),
           div( tags$b('order:'),
                 div(style="display:inline-block;vertical-align:top;",
                 textOutput(outputId = 'order'))
                ,actionButton(inputId='renumber', label='renumber')
           ),
           div( tags$b('count:'),
                 div(style="display:inline-block;vertical-align:top;",
                 textOutput(outputId = 'count'))
            ),
            div(style="display:inline-block;vertical-align:top;",
                numericInput(inputId = 'size',
                        label='Reset Count',
                        10, min = 0, max = 100, step = NA,
                        width = 100
                ),
                div(style="display:inline-block;vertical-align:top;",
                    actionButton(inputId='set', label='set count')
                )
           ),
           div( numericInput(inputId = 'selectedInput',
                             label='selectedInput',
                             1, min = 0, max = 100, step = NA,
                             width = 100
           ),
           actionButton(inputId='resetSelected', label='resetSelected') ),
           div(
               numericInput(inputId = 'rowPosInput',
                             label='rowPosInput',
                             1, min = 0, max = 100, step = NA,
                             width = 100
               ),
               actionButton(inputId='insertRow', label='insertRow') ,
               actionButton(inputId='removeRow', label='removeRow')
           )
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
    output$count=renderText(length(input$myTibRowCntrl$order))
    observeEvent(input$resetSelected,{
        updateRowPicker(session, "myTibRowCntrl", selectRow = input$selectedInput)
    })
    observeEvent(input$insertRow,{
        pos<-input$rowPosInput
        newVal=sample.int(100,1)
        updateRowPicker(session, "myTibRowCntrl", insertRow = pos)
    })
    observeEvent(input$removeRow,{
        pos<-input$rowPosInput
        updateRowPicker(session, "myTibRowCntrl", deleteRow = pos)
    })
}

# Run the application
shinyApp(ui = ui, server = server)
