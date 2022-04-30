const path = require('path');

const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');

const commonPreprocessContext = {};
const developmentPreprocessContext = {};
const productionPreprocessContext = {};

module.exports = (env, { mode }) => {
	const isProduction = mode === 'production';

	const preprocessContext = {
		ENV: isProduction ? 'production' : 'development',
		...commonPreprocessContext,
		...isProduction
			? productionPreprocessContext
			: developmentPreprocessContext
	};

	return {
		mode: isProduction ? 'production' : 'development',
		entry: path.resolve(__dirname, 'src/index.js'),
		output: {
			clean: isProduction,
			path: path.resolve(__dirname, 'dist'),
			filename: '[name].[contenthash].js'
		},
		module: {
			rules: [
				{
					test: /\.jsx?$/,
					exclude: /node_modules/,
					use: [
						{
							loader: 'preprocess-loader',
							options: {
								...preprocessContext,
								ppOptions: {
									type: 'js'
								}
							}
						},
						{
							loader: 'babel-loader',
							options: {
								cacheDirectory: true,
								cacheCompression: false,
								envName: isProduction ? 'production' : 'development'
							}
						}
					]
				},
				{
					test: /\.css$/,
					use: [
						isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
						'css-loader'
					]
				},
				{
					test: /\.s[ac]ss$/,
					use: [
						isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
						{
							loader: 'css-loader',
							options: {
								importLoaders: 2
							}
						},
						'resolve-url-loader',
						{
							loader: 'sass-loader',
							options: {
								sourceMap: true
							}
						}
					]
				},
				{
					test: /\.(png|jpg|gif)$/i,
					use: {
						loader: 'url-loader',
						options: {
							limit: 8192,
							name: 'file/[name].[hash].[ext]'
						}
					}
				},
				{
					test: /\.svg$/,
					use: ['@svgr/webpack']
				},
				{
					test: /\.(eot|otf|ttf|woff|woff2)$/,
					loader: require.resolve('file-loader'),
					options: {
						name: 'file/[name].[hash].[ext]'
					}
				}
			]
		},
		plugins: [
			new HtmlWebpackPlugin({
				inject: false,
				template: path.resolve(__dirname, 'src/index.ejs')
			}),
			isProduction && new MiniCssExtractPlugin({
				filename: '[name].[contenthash].css'
			})
		].filter(Boolean),
		resolve: {
			extensions: ['.js', '.jsx']
		},
		optimization: {
			minimize: isProduction,
			minimizer: [
				new TerserWebpackPlugin({
					terserOptions: {
						compress: {
							comparisons: false
						},
						mangle: {
							safari10: true
						},
						output: {
							comments: false,
							ascii_only: true
						},
						warnings: false
					}
				}),
				new CssMinimizerPlugin()
			]
		}
	};
};
