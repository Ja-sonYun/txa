# WrappedOsascriptInTypescript
Wrap mac osascript of reminder and calendar in typescript

build with `npm build`  
run with `npm jxa`  

Currently, `npm jxa` will sync icloud Reminder and Calendar.  
Script will check top 5 todos from each reminder's list, and push them in to a Calendar,  
named "Todo" with due date, summary and etc.  
Pushed calendar event and checked todo's ids will be stored to tracking and use in the future for prevent duplicate events.  
  
Goal of this project is seperate jxa stuffs as the library.  
 
