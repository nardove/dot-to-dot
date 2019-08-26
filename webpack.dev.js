const path = require('path');
const config = require('./webpack.config')
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = merge(config, {
	mode: 'development',
	// entry: './src/index.js',
	output: {
		filename: 'index.js',
		path: path.join(__dirname, '/dist'),
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: './src/index.html'
		})
	],
	module: {
		rules: [
			{
				test: /\.scss$/,
				use: [
					'style-loader',
					'css-loader',
					'sass-loader'
					]
			},
		]
	}
});