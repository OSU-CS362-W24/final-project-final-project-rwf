/**
 * This function saves a chart in the collection of saved charts.  Saved
 * charts are stored in browser localStorage.  If a chart index is specified,
 * overwrite the existing data for that chart.  Otherwise, add a new chart to
 * the end of the array of charts.
 */
function saveChart(chart, idx) {
    const charts = loadAllSavedCharts()
    if (idx != null && idx < charts.length) {
        charts.splice(idx, 1, chart)
    } else {
        charts.push(chart)
    }
    window.localStorage.setItem("savedCharts", JSON.stringify(charts))
}

/**
 * This function loads and returns the array of all saved charts.
 */
function loadAllSavedCharts() {
    const charts = window.localStorage.getItem("savedCharts") || "[]"
    return JSON.parse(charts)
}

/**
 * This function loads and returns a specific chart from the array of saved
 * charts.
 */
function loadSavedChart(idx) {
    const chartsJson = window.localStorage.getItem("savedCharts") || "[]"
    const charts = JSON.parse(chartsJson)
    return charts[idx] || {}
}

/**
 * This function stores the data for the chart currently being built in
 * localStorage.
 */
function updateCurrentChartData(currentChartData) {
    window.localStorage.setItem("currentChartData", JSON.stringify(currentChartData))
}

/**
 * This function loads and returns the data for the chart currently being built.
 */
function loadCurrentChartData() {
    const currentChartData = window.localStorage.getItem("currentChartData") || "{}"
    return JSON.parse(currentChartData)
}

module.exports = {
    saveChart: saveChart,
    loadAllSavedCharts: loadAllSavedCharts,
    loadSavedChart: loadSavedChart,
    updateCurrentChartData: updateCurrentChartData,
    loadCurrentChartData: loadCurrentChartData
}
