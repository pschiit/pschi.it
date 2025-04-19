const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const DEFAULT_PATH = 'src';

module.exports = {
    entry: `./${DEFAULT_PATH}/index.js`,
    plugins: [
        new HtmlWebpackPlugin({
            title: 'App',
        }),
    ],
    output: {
        filename: 'app.[contenthash].js',
        path: path.resolve(__dirname, 'build'),
        clean: true,
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                include: path.resolve(__dirname, DEFAULT_PATH),
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.css$/i,
                include: path.resolve(__dirname, DEFAULT_PATH),
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.json$/i,
                include: path.resolve(__dirname, DEFAULT_PATH),
                type: 'asset/source',
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                include: path.resolve(__dirname, DEFAULT_PATH),
                type: 'asset/resource',
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                include: path.resolve(__dirname, DEFAULT_PATH),
                type: 'asset/resource',
            },
        ]
    }
};