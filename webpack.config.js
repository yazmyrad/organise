const path = require("path")
const HtmlWebpackPlugins = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin"); 

module.exports = {
	mode: "production",
	entry: "./src/index.js",
	output: {
		filename: "main.js",
		path: path.resolve(__dirname, "dist"),
		publicPath: '/',
		clean: true,
	},
	devtool: "eval-source-map",
	devServer: {
		watchFiles: ["./src/template.html"],
	},
	plugins: [
		new HtmlWebpackPlugins({
			template: "./src/template.html",
			filename: "index.html"
		}),
		new CopyWebpackPlugin({
			patterns: [
				{ 
					from: "src/imgs",
					to: "assets",
					noErrorOnMissing: true 
				}
			]
			}),
	],
	module:{
		rules:[
		{
			test: /\.css$/i,
			use: ["style-loader", "css-loader"],
		},
		{
			test: /\.html$/i,
			loader: "html-loader",
		},
		{
			test: /\.(png|svg|jpg|jpeg|gif)$/i,
			type: "asset/resource",
			generator: {
				filename: 'assets/[name][ext]' 
			}
		}
		],
	},
};