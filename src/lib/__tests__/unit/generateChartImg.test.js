/**
* @jest-environment ./src/fixjsdomenvironment.js
*/

require("@testing-library/jest-dom");
require("whatwg-fetch")
const generateChartImg = require("../../generateChartImg");

test("chart image generation", async function() {

    // Create the chart we are using to test
    type = "scatter"
    data = [
        { x: 1, y: 4 },
        { x: 2, y: 5 },
        { x: 3, y: 6 },
    ]
    xLabel = "TestX"
    yLabel = "TestY"
    title = "Chart1"
    color = "#ff4500"

    let url = await generateChartImg(type, data, xLabel, yLabel, title, color)
    expect(url.length).toBeGreaterThan(0)
});