/*
 * This module contains the "chart builder", which connects to and controls
 * the UI for building a chart.
 */
require("./chartBuilder.css")

const generateChartImg = require("../lib/generateChartImg")
const sortPoints = require("../lib/sortPoints")
const chartStorage = require("../lib/chartStorage")

/**
 * This function runs the chart builder.  It must only be called within a
 * document that contains all the needed UI elements.  Currently, these
 * elements are all contained within the <div class="chart-builder"> in
 * line.html, bar.html, and scatter.html.
 */
module.exports = function runChartBuilder(type) {
    /*
     * Grab references to the important UI elements.
     */
    const xyDataGrid = document.getElementById("x-y-data-grid")
    const xLabelInput = document.getElementById("x-label-input")
    const yLabelInput = document.getElementById("y-label-input")
    const xValueInputs = document.getElementsByClassName("x-value-input")
    const yValueInputs = document.getElementsByClassName("y-value-input")
    const addValuesBtn = document.getElementById("add-values-btn")
    const chartTitleInput = document.getElementById("chart-title-input")
    const chartColorInput = document.getElementById("chart-color-input")
    const generateChartBtn = document.getElementById("generate-chart-btn")
    const clearChartBtn = document.getElementById("clear-chart-btn")
    const saveChartBtn = document.getElementById("save-chart-btn")
    const chartDisplay = document.getElementById("chart-display")

    /*
     * This value contains the data for the chart that is currently being
     * built.
     */
    let currentChartData = {}

    initUi()

    /*
     * Hook a listener up to the "add values" button that inserts an additional
     * set of X and Y value input fields into the document when the button is
     * clicked.
     */
    addValuesBtn && addValuesBtn.addEventListener("click", function () {
        insertXYInputPair()
    })

    /*
     * Hook a listener up to the "generate chart" button that generates the
     * chart image from the current data when the button is clicked.
     */
    generateChartBtn && generateChartBtn.addEventListener("click", function () {
        generateChart()
    })

    /*
     * Hook a listener up to the "save chart" button that stores the data for
     * the current chart when the button is clicked.
     */
    saveChartBtn && saveChartBtn.addEventListener("click", function () {
        /*
         * Determine if a chart ID is specified in the URL as the query string
         * `id` (i.e. a URL that ends like `?id={chartId}`).  If an ID is
         * specified, overwrite the saved data for the existing chart.
         */
        const searchParams = new URLSearchParams(window.location.search)
        const chartId = searchParams.get("id")
        chartStorage.saveChart({
            type: type,
            data: currentChartData.data,
            xLabel: currentChartData.xLabel,
            yLabel: currentChartData.yLabel,
            title: currentChartData.title,
            color: currentChartData.color
        }, chartId)
        updateSaveChartBtn("Chart saved ✔", true)
    })

    /*
     * Hook a listener up to the "clear chart data" button that clears all
     * entered chart data and resets the UI when the button is clicked.
     */
    clearChartBtn && clearChartBtn.addEventListener("click", function () {
        currentChartData = {}
        chartStorage.updateCurrentChartData(currentChartData)

        const img = document.getElementById("chart-img")
        img && img.remove()

        const xValues = document.getElementsByClassName("x-value")
        const yValues = document.getElementsByClassName("y-value")
        for (let i = xValues.length - 1; i >= 0; i--) {
            xValues[i].remove()
            yValues[i].remove()
        }
        initUi()
    })

    /*
     * Hook a listener up the the X/Y data entry grid that listens for any
     * changes to the data there.  When the data is changed, update the data
     * for the current chart.
     */
    xyDataGrid && xyDataGrid.addEventListener("change", function () {
        currentChartData.xLabel = xLabelInput.value.trim()
        currentChartData.yLabel = yLabelInput.value.trim()
        currentChartData.data = gatherData(false)
        chartStorage.updateCurrentChartData(currentChartData)
    })

    /*
     * Hook a listener up the the chart title input that listens for any
     * changes to the data there.  When the data is changed, update the data
     * for the current chart.
     */
    chartTitleInput && chartTitleInput.addEventListener("change", function () {
        currentChartData.title = chartTitleInput.value.trim()
        chartStorage.updateCurrentChartData(currentChartData)
    })

    /*
     * Hook a listener up the the chart color input that listens for any
     * changes to the data there.  When the data is changed, update the data
     * for the current chart.
     */
    chartColorInput && chartColorInput.addEventListener("change", function () {
        currentChartData.color = chartColorInput.value
        chartStorage.updateCurrentChartData(currentChartData)
    })

    /*
     * This function initializes the UI by loading any current chart data from
     * stored from a previous page and putting that data back into the
     * corresponding UI elements, adding new elements for X and Y values if
     * necessary.
     */
    function initUi() {
        /*
         * Determine if a chart ID is specified in the URL as the query string
         * `id` (i.e. a URL that ends like `?id={chartId}`).  If an ID is
         * specified, load the data for the specified chart.  Otherwise,
         * check to see if a chart was currently being built on a different
         * page.
         */
        const searchParams = new URLSearchParams(window.location.search)
        const chartId = searchParams.get("id")
        if (chartId !== null) {
            currentChartData = chartStorage.loadSavedChart(chartId)
            chartStorage.updateCurrentChartData(currentChartData)
        } else {
            currentChartData = chartStorage.loadCurrentChartData()
            currentChartData.color = currentChartData.color || "#ff4500"
        }

        if (chartTitleInput) {
            chartTitleInput.value = currentChartData.title || ""
        }
        if (xLabelInput) {
            xLabelInput.value = currentChartData.xLabel || ""
        }
        if (yLabelInput) {
            yLabelInput.value = currentChartData.yLabel || ""
        }
        if (chartColorInput) {
            chartColorInput.value = currentChartData.color
        }

        if (currentChartData.data) {
            for (let i = 0; i < currentChartData.data.length; i++) {
                insertXYInputPair()
                if (xValueInputs && xValueInputs[i]) {
                    xValueInputs[i].value = currentChartData.data[i].x
                }
                if (yValueInputs && yValueInputs[i]) {
                    yValueInputs[i].value = currentChartData.data[i].y
                }
            }
        }

        insertXYInputPair()
        updateSaveChartBtn("Save chart", true)

        /*
         * If a chart ID was specified in the URL and the data for that chart
         * was loaded, automatically generate an image for the chart.
         */
        if (chartId !== null) {
            generateChart()
        }
    }

    /*
     * This function generates a single input field for either an X or a Y
     * value.
     *
     * @param xOrY This should either be the string "x" or the string "y".  It
     *   indicates whether the input field being generated will be used for an
     *   X value or for a Y value.
     */
    function generateXYInput(xOrY) {
        const lowerXOrY = xOrY.toLowerCase()
        const upperXOrY = xOrY.toUpperCase()
        const labelElem = document.createElement("label")
        labelElem.classList.add(`${lowerXOrY}-value`)
        const inputType = (type === "bar" && lowerXOrY === "x") ? "" : "type='number'"
        labelElem.innerHTML = `${upperXOrY} <input ${inputType} class="${lowerXOrY}-value-input" />`
        return labelElem
    }

    /*
     * This function generates and inserts into the DOM a new set of X and Y
     * value input fields.
     */
    function insertXYInputPair() {
        const xInput = generateXYInput("x")
        const yInput = generateXYInput("y")
        xyDataGrid && xyDataGrid.append(xInput, yInput)
    }

    /*
     * This function generates a chart image from the currently input chart
     * data and displays that image in the UI.
     */
    async function generateChart() {
        const data = gatherData(type !== "bar")
        if (!data.length) {
            alert("Error: No data specified!")
            return
        }

        const title = chartTitleInput && chartTitleInput.value.trim()
        const color = chartColorInput && chartColorInput.value

        const xLabel = xLabelInput && xLabelInput.value.trim()
        const yLabel = yLabelInput && yLabelInput.value.trim()
        if (!xLabel || !yLabel) {
            alert("Error: Must specify a label for both X and Y!")
            return
        }

        try {
            const imgUrl = await generateChartImg(type, data, xLabel, yLabel, title, color)
            displayChartImg(imgUrl)
            updateSaveChartBtn("Save chart", false)
        } catch (e) {
            alert(`Error generating chart:\n\n${e}`)
        }
    }

    /*
     * This function gathers and prepares all the X/Y data pairs.  Only data
     * pairs where at least one of the X or Y values are specified are used.
     * The data are sorted by X coordinate if the `sort` parameter is truthy.
     */
    function gatherData(sort) {
        const data = []
        for (let i = 0; i < xValueInputs?.length || 0; i++) {
            const x = xValueInputs[i].value.trim()
            const y = yValueInputs[i].value.trim()
            if (x || y) {
                data.push({
                    x: x,
                    y: y
                })
            }
        }
        return sort ? sortPoints(data) : data
    }

    /*
     * This function displays a chart image in the correct location in the UI.
     * A new <img> element is inserted into the DOM if necessary.
     *
     * @param imgUrl The URL of the chart image to be displayed.
     */
    function displayChartImg(imgUrl) {
        let img = document.getElementById("chart-img")
        if (!img) {
            img = document.createElement("img")
            img.setAttribute("id", "chart-img")
            chartDisplay && chartDisplay.append(img)
        }
        img.src = imgUrl
    }

    /*
     * This function is used to control the text and disabled state of the
     * "save chart" button.
     */
    function updateSaveChartBtn(text, disabled) {
        if (saveChartBtn) {
            saveChartBtn.textContent = text
            saveChartBtn.disabled = disabled
        }
    }
}
