/*
 * This is the build configuration for the app.  The build uses a tool called
 * Webpack.  You don't need to worry about the details of how the build works,
 * but if you're curious, you can read more about Webpack here:
 *
 * https://webpack.js.org/guides/
 */

const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")

module.exports = {
    mode: "development",
    entry: {
        bar: "./src/bar/bar.js",
        line: "./src/line/line.js",
        scatter: "./src/scatter/scatter.js",
        gallery: "./src/gallery/gallery.js",
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.html",
            filename: "index.html",
            chunks: [ "gallery" ]
        }),
        new HtmlWebpackPlugin({
            template: "./src/bar/bar.html",
            filename: "bar.html",
            chunks: [ "bar" ]
        }),
        new HtmlWebpackPlugin({
            template: "./src/line/line.html",
            filename: "line.html",
            chunks: [ "line" ]
        }),
        new HtmlWebpackPlugin({
            template: "./src/scatter/scatter.html",
            filename: "scatter.html",
            chunks: [ "scatter" ]
        })
    ],
    output: {
        filename: "[name].bundle.js",
        path: path.resolve(__dirname, "dist"),
        clean: true
    },
    devtool: "eval-source-map",
    devServer: {
        static: "./dist"
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [ "style-loader", "css-loader" ]
            }
        ]
    }
}
