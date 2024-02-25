/**
 * This function sorts an array of X/Y points by ascending X value.  The
 * function only operates on data where the X value us numeric.  In other
 * words, it won't work on bar chart data, where the X values are strings.
 *
 * @param points An array of x,y data points.  Should have the following format:
 *   [
 *     { x: ..., y: ... },
 *     { x: ..., y: ... },
 *     { x: ..., y: ... },
 *     ...
 *   ]
 *
 * @return Returns a reference to the original `points` array, which is sorted
 *   in place.
 */
module.exports = function sortPoints(points) {
    return points.sort(function (a, b) {
        return a.x - b.x
    })
}
