/**
 * @jest-environment jsdom
 */

require("@testing-library/jest-dom");
const domTesting = require("@testing-library/dom");
const userEvent = require("@testing-library/user-event").default;
jest.mock(`${__dirname}/../../generateChartImg.js`);

const fs = require("fs");
const { request } = require("http");
require("whatwg-fetch");

function initDOMFromFiles(htmlPath, jsPath) {
    const html = fs.readFileSync(htmlPath, "utf8");
    document.open();
    document.write(html);
    document.close();
    jest.isolateModules(function () {
        require(jsPath);
    });
}

beforeEach(function () {
    window.localStorage.clear();
    jest.resetModules();
    jest.restoreAllMocks();
});

test("Adding values in the chart builder works correctly", async function () {
    const user = userEvent.setup();

    initDOMFromFiles(`${__dirname}/../../../line/line.html`, `${__dirname}/../../../line/line.js`);

    let xInputs = domTesting.getAllByLabelText(document, "X");
    let yInputs = domTesting.getAllByLabelText(document, "Y");
    const addButton = domTesting.getByText(document, "+");

    await user.type(xInputs[0], "1");
    await user.type(yInputs[0], "2");
    await user.click(addButton);

    xInputs = domTesting.getAllByLabelText(document, "X");
    yInputs = domTesting.getAllByLabelText(document, "Y");

    await user.type(xInputs[1], "3");
    await user.type(yInputs[1], "4");
    await user.click(addButton);

    xInputs = domTesting.getAllByLabelText(document, "X");
    yInputs = domTesting.getAllByLabelText(document, "Y");

    expect(xInputs[0].value).toBe("1");
    expect(yInputs[0].value).toBe("2");
    expect(xInputs[1].value).toBe("3");
    expect(yInputs[1].value).toBe("4");
    expect(xInputs[2].value).toBe("");
    expect(yInputs[2].value).toBe("");
});

test("Clearing chart data works correctly", async function () {
    const user = userEvent.setup();

    initDOMFromFiles(`${__dirname}/../../../line/line.html`, `${__dirname}/../../../line/line.js`);

    let xInputs = domTesting.getAllByLabelText(document, "X");
    let yInputs = domTesting.getAllByLabelText(document, "Y");
    const xLabel = domTesting.getByLabelText(document, "X label");
    const yLabel = domTesting.getByLabelText(document, "Y label");
    const chartTitle = domTesting.getByLabelText(document, "Chart title");
    const addButton = domTesting.getByText(document, "+");
    const colorPicker = domTesting.getByLabelText(document, "Chart color");
    const clearButton = domTesting.getByText(document, "Clear chart data");
    const originalColor = colorPicker.value;

    await user.type(xInputs[0], "1");
    await user.type(yInputs[0], "2");
    await user.click(addButton);

    xInputs = domTesting.getAllByLabelText(document, "X");
    yInputs = domTesting.getAllByLabelText(document, "Y");

    await user.type(xInputs[1], "3");
    await user.type(yInputs[1], "4");

    await user.type(xLabel, "X");
    await user.type(yLabel, "Y");
    await user.type(chartTitle, "Title");
    colorPicker.value = "#ff0000";

    await user.click(clearButton);

    xInputs = domTesting.getAllByLabelText(document, "X");
    yInputs = domTesting.getAllByLabelText(document, "Y");

    expect(xInputs[0].value).toBe("");
    expect(yInputs[0].value).toBe("");
    expect(xInputs.length).toBe(1);
    expect(yInputs.length).toBe(1);
    expect(xLabel.value).toBe("");
    expect(xLabel.value).toBe("");
    expect(chartTitle.value).toBe("");
    expect(colorPicker).toHaveValue(originalColor);
});

test("Alerts displayed for missing chart data and axis labels", async function () {
    // Setup for each test
    const user = userEvent.setup();
    initDOMFromFiles(`${__dirname}/../../../line/line.html`, `${__dirname}/../../../line/line.js`);

    // Add references to dom elements for later use
    const xLabel = domTesting.getByLabelText(document, "X label");
    const yLabel = domTesting.getByLabelText(document, "Y label");
    const generateGraph = domTesting.getByText(document, "Generate chart");
    let xInputs = domTesting.getAllByLabelText(document, "X");
    let yInputs = domTesting.getAllByLabelText(document, "Y");

    // Add spy to watch alert method
    const spy = jest.spyOn(window, "alert");
    spy.mockImplementation(function () {});

    // Generate graph and error message
    await user.click(generateGraph);

    // Re-grab all coordinates to ensure they are up to date
    xInputs = domTesting.getAllByLabelText(document, "X");
    yInputs = domTesting.getAllByLabelText(document, "Y");

    // Assertions
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy.mock.calls[0][0]).toBe("Error: No data specified!");
    expect(xLabel.value).toBe("");
    expect(yLabel.value).toBe("");
    expect(xInputs.length).toBe(1);
    expect(yInputs.length).toBe(1);
    expect(xInputs[0].value).toBe("");
    expect(yInputs[0].value).toBe("");

    // Release the alert function from the spy
    spy.mockRestore();
});

test("Alerts displayed for missing chart data", async function () {
    // Setup for each test
    const user = userEvent.setup();
    initDOMFromFiles(`${__dirname}/../../../line/line.html`, `${__dirname}/../../../line/line.js`);

    // Add references to dom elements for later use
    const xLabel = domTesting.getByLabelText(document, "X label");
    const yLabel = domTesting.getByLabelText(document, "Y label");
    const generateGraph = domTesting.getByText(document, "Generate chart");
    let xInputs = domTesting.getAllByLabelText(document, "X");
    let yInputs = domTesting.getAllByLabelText(document, "Y");

    // Add inputs
    await user.type(yLabel, "Placeholder for Y label");
    await user.type(xLabel, "Placeholder for X label");

    // Add spy to watch alert method
    const spy = jest.spyOn(window, "alert");
    spy.mockImplementation(function () {});

    // Generate graph and error message
    await user.click(generateGraph);

    // Re-grab all coordinates to ensure they are up to date
    xInputs = domTesting.getAllByLabelText(document, "X");
    yInputs = domTesting.getAllByLabelText(document, "Y");

    // Assertions
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy.mock.calls[0][0]).toBe("Error: No data specified!");
    expect(xLabel.value).toBe("Placeholder for X label");
    expect(yLabel.value).toBe("Placeholder for Y label");
    expect(xInputs.length).toBe(1);
    expect(yInputs.length).toBe(1);
    expect(xInputs[0].value).toBe("");
    expect(yInputs[0].value).toBe("");

    // Release the alert function from the spy
    spy.mockRestore();
});

test("Alerts displayed for missing chart axes", async function () {
    // Setup for each test
    const user = userEvent.setup();
    initDOMFromFiles(`${__dirname}/../../../line/line.html`, `${__dirname}/../../../line/line.js`);

    // Add references to dom elements for later use
    const xLabel = domTesting.getByLabelText(document, "X label");
    const yLabel = domTesting.getByLabelText(document, "Y label");
    const addPoint = domTesting.getByText(document, "+");
    const generateGraph = domTesting.getByText(document, "Generate chart");
    let xInputs = domTesting.getAllByLabelText(document, "X");
    let yInputs = domTesting.getAllByLabelText(document, "Y");

    // Add three coordinates
    await user.click(addPoint);
    await user.click(addPoint);
    await user.click(addPoint);

    // Re-grab all coordinate fields to ensure they are up to date
    xInputs = domTesting.getAllByLabelText(document, "X");
    yInputs = domTesting.getAllByLabelText(document, "Y");

    // Add coordinate inputs
    await user.type(xInputs[0], "4");
    await user.type(yInputs[0], "6");
    await user.type(xInputs[1], "1");
    await user.type(yInputs[1], "6");
    await user.type(xInputs[2], "9");
    await user.type(yInputs[2], "4");
    await user.type(xInputs[3], "2");
    await user.type(yInputs[3], "8");

    // Add spy to watch alert method
    const spy = jest.spyOn(window, "alert");
    spy.mockImplementation(function () {});

    // Generate graph and error message
    await user.click(generateGraph);

    // Re-grab all coordinates to ensure they are up to date
    xInputs = domTesting.getAllByLabelText(document, "X");
    yInputs = domTesting.getAllByLabelText(document, "Y");

    // Assertions
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy.mock.calls[0][0]).toBe("Error: Must specify a label for both X and Y!");
    expect(xLabel.value).toBe("");
    expect(yLabel.value).toBe("");
    expect(xInputs.length).toBe(4);
    expect(yInputs.length).toBe(4);
    expect(xInputs[0].value).toBe("4");
    expect(yInputs[0].value).toBe("6");
    expect(xInputs[1].value).toBe("1");
    expect(yInputs[1].value).toBe("6");
    expect(xInputs[2].value).toBe("9");
    expect(yInputs[2].value).toBe("4");
    expect(xInputs[3].value).toBe("2");
    expect(yInputs[3].value).toBe("8");

    // Release the alert function from the spy
    spy.mockRestore();
});

test("Data correctly sent to chart generation function", async function () {
    // Setup for each test
    const user = userEvent.setup();

    // Create mock
    jest.mock(`${__dirname}/../../generateChartImg.js`);
    const generateChartImgSpy = require(`${__dirname}/../../generateChartImg.js`);
    generateChartImgSpy.mockImplementation(function () {
        return "http://placekitten.com/480/480";
    });

    // Init files
    initDOMFromFiles(`${__dirname}/../../../line/line.html`, `${__dirname}/../../../line/line.js`);

    // Set variables to access DOM elements later
    let xInputs = domTesting.getAllByLabelText(document, "X");
    let yInputs = domTesting.getAllByLabelText(document, "Y");
    const xLabel = domTesting.getByLabelText(document, "X label");
    const yLabel = domTesting.getByLabelText(document, "Y label");
    const chartTitle = domTesting.getByLabelText(document, "Chart title");
    const addButton = domTesting.getByText(document, "+");
    const colorPicker = domTesting.getByLabelText(document, "Chart color");
    const generateButton = domTesting.getByText(document, "Generate chart");

    // Add extra coord slots
    await user.click(addButton);
    await user.click(addButton);
    await user.click(addButton);

    // Reset input references
    xInputs = domTesting.getAllByLabelText(document, "X");
    yInputs = domTesting.getAllByLabelText(document, "Y");

    // Input coordinates
    await user.type(xInputs[0], "4");
    await user.type(yInputs[0], "6");
    await user.type(xInputs[1], "1");
    await user.type(yInputs[1], "6");
    await user.type(xInputs[2], "9");
    await user.type(yInputs[2], "4");
    await user.type(xInputs[3], "2");
    await user.type(yInputs[3], "8");

    // Set extraneous chart data
    await user.type(xLabel, "X");
    await user.type(yLabel, "Y");
    await user.type(chartTitle, "Title");
    await domTesting.fireEvent.input(colorPicker, {
        target: { value: "#ff0000" },
    });

    // Generate graph
    await user.click(generateButton);

    // Assertions
    expect(generateChartImgSpy.mock.calls[0][0]).toBe("line");
    expect(generateChartImgSpy.mock.calls[0][1]).toContainEqual({ x: "4", y: "6" });
    expect(generateChartImgSpy.mock.calls[0][1]).toContainEqual({ x: "1", y: "6" });
    expect(generateChartImgSpy.mock.calls[0][1]).toContainEqual({ x: "9", y: "4" });
    expect(generateChartImgSpy.mock.calls[0][1]).toContainEqual({ x: "2", y: "8" });
    expect(generateChartImgSpy.mock.calls[0][1].length).toBe(4);
    expect(generateChartImgSpy.mock.calls[0][2]).toBe("X");
    expect(generateChartImgSpy.mock.calls[0][3]).toBe("Y");
    expect(generateChartImgSpy.mock.calls[0][4]).toBe("Title");
    expect(generateChartImgSpy.mock.calls[0][5]).toBe("#ff0000");
    expect(generateChartImgSpy.mock.results[0].value).toBe("http://placekitten.com/480/480");

    generateChartImgSpy.mockRestore();
});
