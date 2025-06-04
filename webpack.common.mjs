import path from 'path';
import packageJson from './package.json' with {type: "json"};
import HtmlWebpackPlugin from 'html-webpack-plugin';

const DEFAULT_PATH = 'src';

export default {
    entry: `./${DEFAULT_PATH}/index.js`,
    plugins: [
        new HtmlWebpackPlugin({
            title: packageJson.name,
        }),
    ],
    output: {
        filename: 'app.[contenthash].js',
        path: path.resolve(import.meta.dirname, 'build'),
        clean: true,
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                include: path.resolve(import.meta.dirname, DEFAULT_PATH),

            },
            {
                test: /\.json$/i,
                include: path.resolve(import.meta.dirname, DEFAULT_PATH),
                type: 'asset/source',
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                include: path.resolve(import.meta.dirname, DEFAULT_PATH),
                type: 'asset/resource',
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                include: path.resolve(import.meta.dirname, DEFAULT_PATH),
                type: 'asset/resource',
            },
        ]
    }
};