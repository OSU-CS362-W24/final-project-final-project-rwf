/**
 * Verifies that the sort points method is working as intended
 */

const sortPoints = require("../sortPoints");

test("sort a given list of points", () =>{

    // Unordered list of points
    points = [
      { x: 3, y: 6 },
      { x: 1, y: 4 },
      { x: 2, y: 5 },
    ]

    // Ordered list by ascending x values
    sortedPoints = [ 
        { x: 1, y: 4 },
        { x: 2, y: 5 },
        { x: 3, y: 6 },
    ]
    
    expect(sortPoints(points)).toStrictEqual(sortedPoints);
});