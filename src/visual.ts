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
        this.target.appendChild(tableContainer);

        // Create and append a table to the container
        this.table = document.createElement("table");
        this.table.style.width = "100%";
        this.table.style.borderCollapse = "collapse";
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

    public update(options: VisualUpdateOptions) {
        this.formattingSettings = this.formattingSettingsService.populateFormattingSettingsModel(VisualFormattingSettingsModel, options.dataViews[0]);

        console.log('Visual update', options);
        
        // Clear previous table content
        this.table.innerHTML = "";

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
                    headerCell.style.border = "1px solid black"; // Border for header cells
                    headerCell.style.padding = "8px"; // Padding for header cells
                    headerCell.style.textAlign = "left"; // Left align header cells\
                    // Hide header cells for "Month" and "Day"
                    if (category.source.displayName !== "Year") {
                        headerCell.style.display = "none"; // Hide the header cell
                    }
                    headerRow.appendChild(headerCell);
                });

                // Append header row to the table
                this.table.appendChild(headerRow);
                const firstCell: HTMLTableCellElement = document.createElement("td");
                const firstRow: HTMLTableRowElement = document.createElement("tr");

                firstCell.textContent = categorical.categories[0].values[0]?.toString() || ""; // Get the first value
                firstCell.style.border = "1px solid black"; // Border for the cell
                firstCell.style.padding = "8px"; // Padding for the cell
                firstRow.appendChild(firstCell);
                this.table.appendChild(firstRow);
                    // Create a hidden cell for dropdown content

                    /*
                    const dropdownCell: HTMLTableCellElement = document.createElement("td");
                    dropdownCell.colSpan = categorical.categories.length; // Span across all columns
                    dropdownCell.textContent = categorical.categories[1].values[0].toString();
                    dropdownCell.style.display = "none"; // Hide it initially
                    dropdownCell.style.border = "1px solid black"; // Border for the dropdown cell
                    dropdownCell.style.padding = "8px"; // Padding for the dropdown cell
                    dropdownCell.style.backgroundColor = "#f9f9f9"; // Optional styling

                    this.table.appendChild(dropdownCell);
                    */
                   // Populate the dropdown table with rows from categorical.categories[1].values
                   // Create a new table for dropdown content
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
                    /*
                    distinctValues.forEach(value => {
                        const dropdownRow: HTMLTableRowElement = document.createElement("tr");
                        const dropdownCell: HTMLTableCellElement = document.createElement("td");
                        
                        dropdownCell.textContent = value; // Use the distinct value
                        dropdownCell.style.border = "1px solid black"; // Border for dropdown cells
                        dropdownCell.style.padding = "8px"; // Padding for dropdown cells
                        dropdownRow.appendChild(dropdownCell);

                        // Add a click event listener to the dropdown row
                        dropdownRow.style.cursor = "pointer"; // Change cursor to pointer for better UX
                        dropdownRow.onclick = () => {
                            // Define your action here when a row is clicked
                            console.log(`You clicked on: ${value}`); // Example action: log the value
                            // You can also display more details or perform any other actions
                        };

                        // Append the dropdown row to the dropdown table
                        dropdownTable.appendChild(dropdownRow);
                    });*/

                    // Now populate the dropdown table with rows from distinct values
distinctValues.forEach(value => {
    const dropdownRow: HTMLTableRowElement = document.createElement("tr");
    const dropdownCell: HTMLTableCellElement = document.createElement("td");

    dropdownCell.textContent = value; // Use the distinct value
    dropdownCell.style.border = "1px solid black"; // Border for dropdown cells
    dropdownCell.style.padding = "8px"; // Padding for dropdown cells
    dropdownRow.appendChild(dropdownCell);

    // Add a click event listener to the dropdown row
    dropdownRow.style.cursor = "pointer"; // Change cursor to pointer for better UX
    dropdownRow.onclick = () => {
        // Create or toggle the dropdown content table
        let nestedTable = dropdownRow.querySelector(".nested-table") as HTMLTableElement;

        if (!nestedTable) {
            // Create the nested table if it doesn't exist
            nestedTable = document.createElement("table");
            nestedTable.className = "nested-table";
            nestedTable.style.borderCollapse = "collapse"; // Optional: make borders collapse
            nestedTable.style.width = "100%"; // Optional: make it full width
            nestedTable.style.border = "1px solid black"; // Optional: add a border to the dropdown table
            nestedTable.style.display = "block"; // Make it block level

            // Create a header row for the nested table
            const headerRow: HTMLTableRowElement = document.createElement("tr");
            const headerCell1: HTMLTableCellElement = document.createElement("th");
            headerCell1.textContent = "Detail 1"; // Replace with actual detail
            const headerCell2: HTMLTableCellElement = document.createElement("th");
            headerCell2.textContent = "Detail 2"; // Replace with actual detail
            headerCell1.style.border = "1px solid black"; // Border for header cells
            headerCell2.style.border = "1px solid black"; // Border for header cells
            headerRow.appendChild(headerCell1);
            headerRow.appendChild(headerCell2);
            nestedTable.appendChild(headerRow);

            // Populate the nested table with rows of data (example data)

            // Days
            for (let i = 0; i < 5; i++) { // Replace 5 with actual number of detail items
                const detailRow: HTMLTableRowElement = document.createElement("tr");
                const detailCell1: HTMLTableCellElement = document.createElement("td");
                detailCell1.textContent = `${value} Detail ${i + 1}`; // Replace with actual detail data
                const detailCell2: HTMLTableCellElement = document.createElement("td");
                detailCell2.textContent = `Value ${i + 1}`; // Replace with actual detail data
                detailCell1.style.border = "1px solid black"; // Border for detail cells
                detailCell2.style.border = "1px solid black"; // Border for detail cells
                detailRow.appendChild(detailCell1);
                detailRow.appendChild(detailCell2);
                nestedTable.appendChild(detailRow);
            }

            dropdownRow.appendChild(nestedTable); // Append the nested table to the row
        } else {
            // Toggle visibility
            nestedTable.style.display = nestedTable.style.display === "table" ? "none" : "table";
        }
    };

    // Append the dropdown row to the dropdown table
    dropdownTable.appendChild(dropdownRow);
});



                    // Initially hide the dropdown table
                    dropdownTable.style.display = "none"; // Hide it initially
                    // Add click event to the first row
                // Add click event to the first row
                        firstRow.onclick = () => {
                            // Toggle visibility of the dropdown table
                            if (dropdownTable.style.display === "none") {
                                dropdownTable.style.display = "table"; // Show the dropdown table
                            } else {
                                dropdownTable.style.display = "none"; // Hide the dropdown table
                            }
                        };
                    // Append the dropdown table to the main table
                    this.table.appendChild(dropdownTable);
                // Generate table rows based on values








                /* All Data Hidden

                const rowCount = categorical.categories[0].values.length; // Assume all categories have the same row count
                for (let i = 0; i < rowCount; i++) {
                    const dataRow: HTMLTableRowElement = document.createElement("tr");
                    categorical.categories.forEach(category => {
                        
                        const dataCell: HTMLTableCellElement = document.createElement("td");
                        dataCell.textContent = category.values[i]?.toString() + " , Category: " + categorical.categories[1].values[0] || ""; // Display the category value
                        dataCell.style.border = "1px solid black"; // Border for data cells
                        dataCell.style.padding = "8px"; // Padding for data cells
                        dataRow.appendChild(dataCell);
                    });
                    this.table.appendChild(dataRow);
                }


                */



            }
        }

        // Update the count display
        if (this.textNode) {
            this.textNode.textContent = (this.updateCount++).toString();
        }
    }

    public getFormattingModel(): powerbi.visuals.FormattingModel {
        return this.formattingSettingsService.buildFormattingModel(this.formattingSettings);
    }
}
