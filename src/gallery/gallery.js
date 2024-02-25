/*
 * This module contains the "gallery", which connects to and controls the UI
 * for displaying the saved charts.
 */
require("../app.css")
require("./gallery.css")

const chartStorage = require("../lib/chartStorage")
const generateChartImg = require("../lib/generateChartImg")

runGallery()

/*
 * This function runs the gallery.  It must be called within a document that
 * contains the needed UI elements.  Currently these are within the
 * <main id="gallery"> element in index.html.
 */
function runGallery() {
    /*
     * Grab the important UI elements.
     */
    const gallery = document.getElementById("gallery")

    displaySavedCharts()

    /*
     * This function loads the saved charts, generates a card element to
     * display each one, and inserts those cards into the DOM.
     */
    async function displaySavedCharts() {
        const savedCharts = chartStorage.loadAllSavedCharts()
        for (let i = 0; i < savedCharts.length; i++) {
            const chartCard = await generateChartCard(savedCharts[i], i)
            gallery.append(chartCard)
        }
    }

    /*
     * This function generates a card element in which to display a chart.
     */
    async function generateChartCard(chart, id) {
        const chartCard = document.createElement("a")
        chartCard.classList.add("chart-card")
        chartCard.innerHTML = `<div class="chart-img-container"><img class="chart-img" alt="${chart.title}" /></div>`
        chartCard.innerHTML += `<h3 class="chart-title">${chart.title}</h3>`

        const chartImg = chartCard.getElementsByClassName("chart-img")[0]
        const chartImgUrl = await generateChartImg(
            chart.type,
            chart.data,
            chart.xLabel,
            chart.yLabel,
            chart.title,
            chart.color
        )
        chartImg.src = chartImgUrl

        chartCard.href = `${chart.type}.html?id=${id}`
        return chartCard
    }
}
