/**
 * @jest-environment jsdom
 * 
 * Test the chart loading and saving functionality
 */

require("@testing-library/jest-dom");
const chartStorage = require("../chartStorage")


test("save a chart", () =>{
    chart = {
        type: "scatter",
        data: [
            { x: 1, y: 4 },
            { x: 2, y: 5 },
            { x: 3, y: 6 },
          ],
        xLabel: "TestX",
        yLabel: "TestY",
        title: "Test",
        color: "#ff4500"
    }
    chartIndex = 0
    // Save our generated chart to the localStorage
    chartStorage.saveChart(chart, chartIndex);

    // Take our created chart and add [] to make it look like it is part of a list as that is how the savedChart would look
    let stringifiedChart = "[" + JSON.stringify(chart) + "]"
    let savedChart = localStorage.getItem("savedCharts")
    expect(savedChart).toBe(stringifiedChart)
});

test("load all saved charts", () =>{
    // Create and save two new charts
    chart1 = {
        type: "scatter",
        data: [
            { x: 1, y: 4 },
            { x: 2, y: 5 },
            { x: 3, y: 6 },
          ],
        xLabel: "TestX",
        yLabel: "TestY",
        title: "Chart1",
        color: "#ff4500"
    }

    chart2 = {
        type: "scatter",
        data: [
            { x: 4, y: 7 },
            { x: 5, y: 8 },
            { x: 6, y: 9 },
          ],
        xLabel: "TestX",
        yLabel: "TestY",
        title: "Chart2",
        color: "#ff4500"
    }

    // Save our generated chart to the localStorage
    chartStorage.saveChart(chart1, 0);
    chartStorage.saveChart(chart2, 1);

    let savedCharts = chartStorage.loadAllSavedCharts();

    // Check to see if chart 1 was loaded correctly
    expect(savedCharts[0]).toStrictEqual(chart1);

    // Check to see if chart 2 was loaded correctly
    expect(savedCharts[1]).toStrictEqual(chart2)
});

test("load a saved chart", () =>{
    // Create and save two new charts
    chart1 = {
        type: "scatter",
        data: [
            { x: 1, y: 4 },
            { x: 2, y: 5 },
            { x: 3, y: 6 },
          ],
        xLabel: "TestX",
        yLabel: "TestY",
        title: "Chart1",
        color: "#ff4500"
    }

    chart2 = {
        type: "scatter",
        data: [
            { x: 4, y: 7 },
            { x: 5, y: 8 },
            { x: 6, y: 9 },
          ],
        xLabel: "TestX",
        yLabel: "TestY",
        title: "Chart2",
        color: "#ff4500"
    }

    // Save our generated chart to the localStorage
    chartStorage.saveChart(chart1, 0);
    chartStorage.saveChart(chart2, 1);

    // Attempt to load the chart with index 1
    let loadedChart = chartStorage.loadSavedChart(1);
    expect(loadedChart).toStrictEqual(chart2)
});

test("update current chart data", () =>{
    // Create and save two new charts
    chartData = {
        type: "scatter",
        data: [
            { x: 1, y: 4 },
            { x: 2, y: 5 },
            { x: 3, y: 6 },
          ],
        xLabel: "TestX",
        yLabel: "TestY",
        title: "Chart1",
        color: "#ff4500"
    }

    // Update the current chart
    chartStorage.updateCurrentChartData(chartData);

    let currentChart = localStorage.getItem("currentChartData")
    expect(currentChart).toBe(JSON.stringify(chartData))

    // Update our current chart with new data and check the value again
    newData = {
        type: "scatter",
        data: [
            { x: 4, y: 7 },
            { x: 5, y: 8 },
            { x: 6, y: 9 },
          ],
        xLabel: "TestX1",
        yLabel: "TestY1",
        title: "Chart2",
        color: "#ff4500"
    }

    // Update the current chart
    chartStorage.updateCurrentChartData(newData);

    let newChart = localStorage.getItem("currentChartData")
    expect(newChart).toBe(JSON.stringify(newData))
});

test("load current chart data", () =>{
    // Create and save two new charts
    chartData = {
        type: "scatter",
        data: [
            { x: 1, y: 4 },
            { x: 2, y: 5 },
            { x: 3, y: 6 },
          ],
        xLabel: "TestX",
        yLabel: "TestY",
        title: "Chart1",
        color: "#ff4500"
    }

    // Update the current chart
    chartStorage.updateCurrentChartData(chartData);

    let currentChart = localStorage.getItem("currentChartData")
    expect(currentChart).toBe(JSON.stringify(chartData))

    let loadedChart = chartStorage.loadCurrentChartData();
    expect(loadedChart).toStrictEqual(chartData);
});