# monthly-calendar

## Prototyping of Montyly Calendar

This is a prototype for building any type of Calendar such as Monthly(matrix), Monthly(sequential), 2-weeks, weekly.  

At first, trying to build matrix type of Monthly Calendar which assumes the following looking.  

2021 1
| Sun | Mon | Tue | Wed | Thu | Fri | Sat |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| 1 | 2 | 3 | 4 | 5 | 6 | 7 |
| 8 | 9 | 10 | 11 | 12 | 13 | 14 |
| 15 | 16 | 17 | 18 | 19 | 20 | 21 |
| 22 | 23 | 24 | 25 | 26 | 27 | 28 |
| 29 | 30 | | | | | |

## Logical structure

Here is a hierarchical structure of calendar.  

- top level calendar component
  - calendar navigation
    - previous month button
    - year selection
    - month selection
    - next month button
  - calendar table
    - calendar table header
      - [Sun, Mon, Tue, Wed, Thu, Fri, Sat]
    - calendar cells
      - calendar cell[7 x 6]
        - calendar date
        - holiday
        - event

## Visual requirement

Here is a requirement for visual parameter.  

- Color variants
  - Day off color : Reddish color (Sunday, Holiday)
  - Half Day color : Blue color (Saturday)
  - Full Day color : Dark color (Weekday: Monday through Friday)

- Border color variant : Gray for default, can be specified as parameter

- Day Of Week Header can be suppressed as option

- Start Day Of Week (weeks starts from Sunday or Monday) can be selected as option

## Operational requirement

The buttons (Previous Month and Next Month) and selections (Year Selection and Month Selection) determines 
which month of which year, and initial year and month will be the one contains today.  

Single click or double click on the date cell will emit the event to the page with date information and event associated event information.  


  
