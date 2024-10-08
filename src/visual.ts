/*
*  Power BI Visual CLI
*
*  Copyright (c) Microsoft Corporation
*  All rights reserved.
*  MIT License
*
*  Permission is hereby granted, free of charge, to any person obtaining a copy
*  of this software and associated documentation files (the ""Software""), to deal
*  in the Software without restriction, including without limitation the rights
*  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
*  copies of the Software, and to permit persons to whom the Software is
*  furnished to do so, subject to the following conditions:
*
*  The above copyright notice and this permission notice shall be included in
*  all copies or substantial portions of the Software.
*
*  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
*  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
*  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
*  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
*  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
*  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
*  THE SOFTWARE.
*/
"use strict";

import powerbi from "powerbi-visuals-api";
import { FormattingSettingsService } from "powerbi-visuals-utils-formattingmodel";
import "./../style/visual.less";

import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;

import { VisualFormattingSettingsModel } from "./settings";

export class Visual implements IVisual {
    private target: HTMLElement;
    private updateCount: number;
    private textNode: Text;
    private formattingSettings: VisualFormattingSettingsModel;
    private formattingSettingsService: FormattingSettingsService;
    private table: HTMLTableElement; // Table element for dynamic data

    constructor(options: VisualConstructorOptions) {
        console.log('Visual constructor', options);
        this.formattingSettingsService = new FormattingSettingsService();
        this.target = options.element;
        this.updateCount = 0;

        // Create a scrollable container for the table
        const tableContainer: HTMLElement = document.createElement("div");
        tableContainer.style.overflowY = "auto"; // Enable vertical scrolling
        
        tableContainer.style.maxHeight = "900px"; // Set a fixed max height for the scrollable area
        tableContainer.style.backgroundColor = '';
        this.target.appendChild(tableContainer);

        // Create and append a table to the container
        this.table = document.createElement("table");
        this.table.style.width = "100%";
        this.table.style.borderCollapse = "collapse";
        this.table.style.color = 'white';
        tableContainer.style.backgroundColor = "transparent"; // Set the background color to transparent

        tableContainer.appendChild(this.table);

        // Create paragraph to show update count
        /*
        if (document) {
            const new_p: HTMLElement = document.createElement("p");
            new_p.appendChild(document.createTextNode("Update count:"));
            const new_em: HTMLElement = document.createElement("em");
            this.textNode = document.createTextNode(this.updateCount.toString());
            new_em.appendChild(this.textNode);
            new_p.appendChild(new_em);
            this.target.appendChild(new_p);
        }*/
    }
    private getBackgroundColor(options: VisualUpdateOptions): string {
        const defaultColor = "transparent"; // Set default background color as transparent
        if (options.dataViews && options.dataViews[0] && options.dataViews[0].metadata.objects) {
            const colorSelector = options.dataViews[0].metadata.objects["colorSelector"];
            if (colorSelector && colorSelector["backgroundColor"]) {
                return colorSelector["backgroundColor"].toString(); // Return the selected color
            }
        }
        return defaultColor;
    }
    

    public update(options: VisualUpdateOptions) {
        this.formattingSettings = this.formattingSettingsService.populateFormattingSettingsModel(VisualFormattingSettingsModel, options.dataViews[0]);  
        // Clear previous table content
        this.table.innerHTML = "";
        // Retrieve the background color
        const backgroundColor = this.getBackgroundColor(options);
            
        // Apply the background color to the visual's container
        this.table.style.backgroundColor = backgroundColor;
        // Generate table header
        if (options.dataViews && options.dataViews.length > 0) {
            const dataView = options.dataViews[0];
            const categorical = dataView.categorical;
            if (categorical && categorical.categories) {
                const headerRow: HTMLTableRowElement = document.createElement("tr");

                // Create headers based on categories
                categorical.categories.forEach(category => {
                    const headerCell: HTMLTableCellElement = document.createElement("th");
                    headerCell.textContent = category.source.displayName;
                    headerCell.style.border = "1px solid white"; // Border for header cells
                    headerCell.style.textAlign = "left"; // Left align header cells\
                    // Hide header cells for "Month" and "Day"
                    if (category.source.displayName !== "Year" || "HC as today" || "Resign Employee" || "Balance HC" ) {
                        headerCell.style.display = "none"; // Hide the header cell
                    }
                    headerRow.appendChild(headerCell);
                });

                // Append header row to the table
                this.table.appendChild(headerRow);

                // Create the new row and cell that will be inserted before the current row
              // Create the header row with specific titles
                    const newheaderRow: HTMLTableRowElement = document.createElement("tr");

                    const headers = ["Year", "HC as today", "Resign Employee", "Balance HC"];

                    // Loop through the headers array to create and append header cells
                    headers.forEach(header => {
                        const headerCell: HTMLTableCellElement = document.createElement("th");
                        headerCell.textContent = header;
                        headerCell.style.border = "1px solid white"; // Add border for the header
                        newheaderRow.appendChild(headerCell);
                    });

                    // Append the header row to the table
                    this.table.appendChild(newheaderRow);
                    // Year 2024
                    /*
                const firstCell: HTMLTableCellElement = document.createElement("td");
                const firstRow: HTMLTableRowElement = document.createElement("tr");

                firstCell.textContent = categorical.categories[0].values[0]?.toString() || ""; // Get the first value
                firstCell.style.border = "1px solid white"; // Border for the cell
                firstRow.appendChild(firstCell);
                this.table.appendChild(firstRow);
                */
               // Year 2024

               // Create the first row
const firstRow: HTMLTableRowElement = document.createElement("tr");

// Create the first cell and append it to the first row
const firstCell: HTMLTableCellElement = document.createElement("td");
firstCell.textContent = categorical.categories[0].values[0]?.toString() || ""; // Get the first value
firstCell.style.border = "1px solid white"; // Border for the first cell
firstRow.appendChild(firstCell);

// Create the second cell
const secondCell2: HTMLTableCellElement = document.createElement("td");
secondCell2.textContent = "Second Cell Content"; // Set content for the second cell
secondCell2.style.border = "1px solid white"; // Border for the second cell
firstRow.appendChild(secondCell2); // Append the second cell to the first row

// Create the third cell
const thirdCell2: HTMLTableCellElement = document.createElement("td");
thirdCell2.textContent = "Third Cell Content"; // Set content for the third cell
thirdCell2.style.border = "1px solid white"; // Border for the third cell
firstRow.appendChild(thirdCell2); // Append the third cell to the first row


// Create the third cell
const thirdCell3: HTMLTableCellElement = document.createElement("td");
thirdCell3.textContent = "Third Cell Content"; // Set content for the third cell
thirdCell3.style.border = "1px solid white"; // Border for the third cell
firstRow.appendChild(thirdCell3); // Append the third cell to the first row


// Append the entire row to the table
this.table.appendChild(firstRow);



                ///////////////////////////////////////////
                   
                    const dropdownTable: HTMLTableElement = document.createElement("table");
                    dropdownTable.style.width = "100%"; // Optional: make the dropdown table take full width
                    dropdownTable.style.borderCollapse = "collapse"; // Collapse borders
                    dropdownTable.style.display = "block"; // Make it block level

                                // Create a Set to hold distinct values
                    const distinctValues: Set<string> = new Set();

                    // Populate the Set with unique values from categorical.categories[1].values
                    for (let i = 0; i < categorical.categories[1].values.length; i++) {
                        const value = categorical.categories[1].values[i]?.toString() || ""; // Get each value
                        distinctValues.add(value); // Add to Set (automatically handles duplicates)
                    }


                    // Now populate the dropdown table with rows from distinct values
distinctValues.forEach(value => {
    const dropdownRow: HTMLTableRowElement = document.createElement("tr");
    const dropdownCell: HTMLTableCellElement = document.createElement("td");

    dropdownCell.textContent = value; // Use the distinct value
    dropdownCell.style.border = "1px solid white"; // Border for dropdown cells
    dropdownCell.style.padding = "8px"; // Padding for dropdown cells
    dropdownRow.appendChild(dropdownCell);
//


    // Add a click event listener to the dropdown row
    dropdownRow.style.cursor = "pointer"; // Change cursor to pointer for better UX
    dropdownRow.onclick = () => {
        // Create or toggle the dropdown content table
        const rowValue = dropdownRow.textContent?.trim(); // Assuming value is in the row's text

        let nestedTable = dropdownRow.querySelector(".nested-table") as HTMLTableElement;
        // Day
        if (!nestedTable) {
            // Create the nested table if it doesn't exist
            nestedTable = document.createElement("table");
            nestedTable.className = "nested-table";
            nestedTable.style.borderCollapse = "collapse"; // Optional: make borders collapse
            nestedTable.style.width = "100%"; // Optional: make it full width
            nestedTable.style.border = "1px solid white"; // Optional: add a border to the dropdown table
            nestedTable.style.display = "block"; // Make it block level
            // Days
    // Loop through the data and check for a match with rowValue

    /*
    for (let i = 0; i < categorical.categories[1].values.length; i++) {
        // Compare current value with rowValue
        const category1Value = categorical.categories[1].values[i]?.toString();
        if (category1Value === rowValue) {
            // If it matches, create a new row with the corresponding value from categories[2]
            const detailRow: HTMLTableRowElement = document.createElement("tr");

            // First detail cell with rowValue
            //const detailCell1: HTMLTableCellElement = document.createElement("td");
            //detailCell1.textContent = `${rowValue} Detail ${i + 1}`; // Use rowValue here
            //detailCell1.style.border = "1px solid black"; // Border for detail cells

            // Second detail cell with the corresponding value from categorical.categories[2]
            const detailCell1: HTMLTableCellElement = document.createElement("td");
            detailCell1.textContent = `${rowValue} ` + categorical.categories[2].values[i]?.toString(); // Get the matching value from categories[2]
            detailCell1.style.border = "1px solid black"; // Border for detail cells

            // Append the cells to the row
            //detailRow.appendChild(detailCell1);
            detailRow.appendChild(detailCell1);

            // Append the detail row to the nested table
            nestedTable.appendChild(detailRow);
             // Create a new row (tr) and cell (td) for the corresponding value from categories[2]
                const newRow: HTMLTableRowElement = document.createElement("tr");
                const newCell: HTMLTableCellElement = document.createElement("td");
                newCell.textContent = `Matching Value: ${categorical.categories[2].values[i]?.toString()}`; // Use categories[2] value
                newCell.style.border = "1px solid black"; // Border for new cell
                newRow.style.display = "none"; // Initially hidden
                newRow.appendChild(newCell);

                // Append the new row to the nested table
                nestedTable.appendChild(newRow);

                // Add a click event to the first detail row to toggle the visibility of the second row
                detailRow.onclick = () => {
                    // Toggle the visibility of the new row
                    newRow.style.display = (newRow.style.display === "none") ? "table-row" : "none";
                };
        }
    } */


        for (let i = 0; i < categorical.categories[1].values.length; i++) {
            // Compare current value with rowValue
            const category1Value = categorical.categories[1].values[i]?.toString(); // Month
            const category2Value = categorical.categories[2].values[i]?.toString(); // Day
            
            if (category1Value === rowValue) { // When rowValue matches with Month
                // If it matches, create a new row with the corresponding value from categories[2] (Day)
                const detailRow: HTMLTableRowElement = document.createElement("tr");
        
                // First detail cell with rowValue (Month)
                const detailCell1: HTMLTableCellElement = document.createElement("td");
                // 天數
                // Ho Weng Yin
                detailCell1.textContent = ` ${i + 1}`; // Use rowValue (Day here)

                detailCell1.style.border = "1px solid white"; // Border for detail cells
                detailCell1.style.backgroundColor = '';
                detailRow.appendChild(detailCell1);
        
                // Append the first detail cell to the row
                nestedTable.appendChild(detailRow);
        
                // Create a new row (tr) and cell (td) for the corresponding value from categories[2] (Day)
                const newRow: HTMLTableRowElement = document.createElement("tr");
                const newCell: HTMLTableCellElement = document.createElement("td");
                newCell.textContent = ` ${category1Value} and ${category2Value}`; // Use categories[2] value (Day)
                // Each Day Date
            // Assume rowValue is already defined or passed in the context
            for (let x = 0; x < categorical.categories[1].values.length; x++) {
                const category1Value = categorical.categories[1].values[x]?.toString(); // Month

                for (let y = 0; y < categorical.categories[2].values.length; y++) {
                    const category2Value = categorical.categories[2].values[y]?.toString(); // Day

                    //console.log(`Index x: ${x}, Month = ${category1Value}, Index y: ${y}, Day = ${category2Value}`); // Log both loop values

                    // Check for matching conditions (optional)
                    if (category1Value === rowValue && category2Value === category2Value) {
                        //newCell.textContent = ` atch found at x: ${x}, y: ${y} + " "${category1Value} and ${category2Value}`; // Use categories[2] value (Day)
                        newCell.textContent = categorical.categories[3].values[x].toString();
                        newCell.style.border = "1px solid white"; // Border for new cell
                        newRow.style.display = "none"; // Initially hidden
                        newRow.appendChild(newCell);

                    }
                }
            }


                //
             
        
                // Append the new row to the nested table
                nestedTable.appendChild(newRow);
                nestedTable.style.backgroundColor = '';

                // Add a click event to the first detail row to toggle the visibility of the second row
                detailRow.onclick = () => {
                    // Toggle the visibility of the new row
                    newRow.style.display = (newRow.style.display === "none") ? "table-row" : "none";
                };
            }
        }
            

            dropdownRow.appendChild(nestedTable); // Append the nested table to the row
        } else {
            // Toggle visibility
            nestedTable.style.backgroundColor = '';
            nestedTable.style.display = nestedTable.style.display === "table" ? "none" : "table";

        }
    };

    // Append the dropdown row to the dropdown table
    dropdownTable.appendChild(dropdownRow);
});



             
                    /*































                    */
                  // Create the cell that will hold the dropdown table
// Create the first cell that will hold the dropdown table
const dropdownCell: HTMLTableCellElement = document.createElement("td");

// Create the row that will hold the cells
const dropdownRow: HTMLTableRowElement = document.createElement("tr");

// Append the dropdown table into the first cell
dropdownCell.appendChild(dropdownTable); // 'dropdownTable' is appended to the first <td>

// Style the first cell as needed
dropdownCell.style.border = "1px solid white"; // Border for the cell
dropdownCell.style.padding = "8px"; // Padding for the cell

// Append the first cell to the row
dropdownRow.appendChild(dropdownCell);

// Create the second cell
const secondCell: HTMLTableCellElement = document.createElement("td");

// Set content for the second cell
secondCell.textContent = "Second Cell Content"; // You can set the content or leave it empty

// Style the second cell as needed
secondCell.style.border = "1px solid white"; // Border for the second cell
secondCell.style.padding = "8px"; // Padding for the second cell

// Append the second cell to the row
dropdownRow.appendChild(secondCell);

// Create the third cell
const thirdCell: HTMLTableCellElement = document.createElement("td");

// Set content for the third cell
thirdCell.textContent = "Third Cell Content"; // Set the content or leave it empty

// Style the third cell as needed
thirdCell.style.border = "1px solid white"; // Border for the third cell
thirdCell.style.padding = "8px"; // Padding for the third cell

// Append the third cell to the row
dropdownRow.appendChild(thirdCell);

// Create the fourth cell
const fourthCell: HTMLTableCellElement = document.createElement("td");

// Set content for the fourth cell
fourthCell.textContent = "Fourth Cell Content"; // Set the content or leave it empty

// Style the fourth cell as needed
fourthCell.style.border = "1px solid white"; // Border for the fourth cell
fourthCell.style.padding = "8px"; // Padding for the fourth cell

// Append the fourth cell to the row
dropdownRow.appendChild(fourthCell);

// Append the row to the main table (assuming 'this.table' is the main table)
this.table.appendChild(dropdownRow);



                /*















                */

       // Initially hide the dropdown table
       dropdownTable.style.display = "none"; // Hide it initially
       dropdownCell.style.display = "none";
       secondCell.style.display = 'none';
       thirdCell.style.display = 'none';
       fourthCell.style.display = 'none';
       // Add click event to the first row
   // Add click event to the first row
           firstRow.onclick = () => {
               // Toggle visibility of the dropdown table
               if (dropdownTable.style.display === "none") {
                   dropdownTable.style.display = "table"; // Show the dropdown table
                   dropdownCell.style.display = "table-cell";
                   secondCell.style.display = "table-cell";   // Make the secondCell visible
                    thirdCell.style.display = "table-cell";    // Make the thirdCell visible
                    fourthCell.style.display = 'table-cell';

               } else {
                   dropdownTable.style.display = "none"; // Hide the dropdown table
                   dropdownCell.style.display = "none";

                   secondCell.style.display = "none";   // Make the secondCell visible
                   thirdCell.style.display = "none";    // Make the thirdCell visible
                   fourthCell.style.display = 'none';

               }
           };
       // Append the dropdown table to the main table
       // Create a cell within the row


            }
        }
        
    }

    public getFormattingModel(): powerbi.visuals.FormattingModel {
        return this.formattingSettingsService.buildFormattingModel(this.formattingSettings);
    }
}
