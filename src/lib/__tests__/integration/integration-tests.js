/**
 * @jest-environment jsdom
 */

require("@testing-library/jest-dom");
const domTesting = require("@testing-library/dom");
const userEvent = require("@testing-library/user-event").default;
const GenerateChartImg = require(`${__dirname}/../../../lib/generateChartImg`);

const fs = require("fs");
const { request } = require("http");
require("whatwg-fetch");

function initDOMFromFiles(htmlPath, jsPath) {
    const html = fs.readFileSync(htmlPath, "utf8");
    document.open();
    document.write(html);
    document.close();

    jest.isolateModules(() => {
        require(jsPath);
    });
}

test("Adding values in the chart builder works correctly", async function () {
    const user = userEvent.setup();

    initDOMFromFiles(
        `${__dirname}/../../../line/line.html`,
        `${__dirname}/../../../line/line.js`
    );

    xInputs = domTesting.getAllByLabelText(document, "X");
    yInputs = domTesting.getAllByLabelText(document, "Y");
    const addButton = domTesting.getByText(document, "+");

    await userEvent.type(xInputs[0], "1");
    await userEvent.type(yInputs[0], "2");
    await userEvent.click(addButton);

    xInputs = domTesting.getAllByLabelText(document, "X");
    yInputs = domTesting.getAllByLabelText(document, "Y");

    await userEvent.type(xInputs[1], "3");
    await userEvent.type(yInputs[1], "4");
    await userEvent.click(addButton);

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

    initDOMFromFiles(
        `${__dirname}/../../../line/line.html`,
        `${__dirname}/../../../line/line.js`
    );

    xInputs = domTesting.getAllByLabelText(document, "X");
    yInputs = domTesting.getAllByLabelText(document, "Y");
    const xLabel = domTesting.getByLabelText(document, "X label");
    const yLabel = domTesting.getByLabelText(document, "Y label");
    const chartTitle = domTesting.getByLabelText(document, "Chart title");
    const addButton = domTesting.getByText(document, "+");
    const colorPicker = domTesting.getByLabelText(document, "Chart color");
    const clearButton = domTesting.getByText(document, "Clear chart data");
    const originalColor = colorPicker.value;

    await userEvent.type(xInputs[0], "1");
    await userEvent.type(yInputs[0], "2");
    await userEvent.click(addButton);

    xInputs = domTesting.getAllByLabelText(document, "X");
    yInputs = domTesting.getAllByLabelText(document, "Y");

    await userEvent.type(xInputs[1], "3");
    await userEvent.type(yInputs[1], "4");

    await userEvent.type(xLabel, "X");
    await userEvent.type(yLabel, "Y");
    await userEvent.type(chartTitle, "Title");
    colorPicker.value = "#ff0000";

    await userEvent.click(clearButton);

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

test("Alerts displayed for missing chart data", async function () {
    const user = userEvent.setup();

    initDOMFromFiles(
        `${__dirname}/../../../line/line.html`,
        `${__dirname}/../../../line/line.js`
    );

    const spy = jest.spyOn(window, "alert");
});

/*
 test("Data correctly sent to chart generation function", async function () {
    const user = userEvent.setup();
 
    initDOMFromFiles(
        `${__dirname}/../../../line/line.html`, `${__dirname}/../../../line/line.js`
    );
 
    xInputs = domTesting.getAllByLabelText(document, "X");
    yInputs = domTesting.getAllByLabelText(document, "Y");
    const xLabel = domTesting.getByLabelText(document, "X label");
    const yLabel = domTesting.getByLabelText(document, "Y label");
    const chartTitle = domTesting.getByLabelText(document, "Chart title");
    const addButton = domTesting.getByText(document, "+");
    const colorPicker = domTesting.getByLabelText(document, "Chart color");
    const generateButton = domTesting.getByText(document, "Generate chart");
    const generateChartImgSpy = jest.spyOn(GenerateChartImg, "generateChartImg");
 
    await userEvent.type(xInputs[0], "1");
    await userEvent.type(yInputs[0], "2");
    await userEvent.click(addButton);
    
    xInputs = domTesting.getAllByLabelText(document, "X");
    yInputs = domTesting.getAllByLabelText(document, "Y");
 
    await userEvent.type(xInputs[1], "3");
    await userEvent.type(yInputs[1], "4");

    await userEvent.type(xLabel, "X");
    await userEvent.type(yLabel, "Y");
    await userEvent.type(chartTitle, "Title");
    colorPicker.value = '#ff0000';

    await userEvent.click(generateButton);

    expect(generateChartImgSpy).toHaveBeenCalledWith('line', [[1, 2], [3, 4]], 'X', 'Y', 'Title', '#ff0000');

    generateChartImgSpy.mockRestore();
 });
*/
