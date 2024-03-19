/**
 * Verifies that the sort points method is working as intended
 */

const sortPoints = require("../../sortPoints");

test("sort a given list of points", () => {
    // Unordered list of points
    points = [
        { x: 3, y: 6 },
        { x: 1, y: 4 },
        { x: 2, y: 5 },
    ];

    // Ordered list by ascending x values
    sortedPoints = [
        { x: 1, y: 4 },
        { x: 2, y: 5 },
        { x: 3, y: 6 },
    ];

    expect(sortPoints(points)).toStrictEqual(sortedPoints);
});

test("sort another list of points", () => {
    // Unordered list of points
    points = [
        { x: 76, y: 78 },
        { x: 786, y: 574 },
        { x: 4563, y: 423 },
        { x: 54, y: 34 },
        { x: 8453, y: 45 },
        { x: 786, y: 345 },
        { x: 789, y: 453 },
        { x: 756, y: 1423 },
        { x: 786, y: 7896 },
        { x: 4250, y: 2475 },
        { x: 40, y: 453 },
        { x: 24, y: 78 },
    ];

    // Ordered list by ascending x values
    sortedPoints = [
        { x: 24, y: 78 },
        { x: 40, y: 453 },
        { x: 54, y: 34 },
        { x: 76, y: 78 },
        { x: 756, y: 1423 },
        { x: 786, y: 574 },
        { x: 786, y: 345 },
        { x: 786, y: 7896 },
        { x: 789, y: 453 },
        { x: 4250, y: 2475 },
        { x: 4563, y: 423 },
        { x: 8453, y: 45 },
    ];

    expect(sortPoints(points)).toStrictEqual(sortedPoints);
});
