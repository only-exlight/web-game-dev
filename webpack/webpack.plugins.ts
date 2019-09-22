import { DefinePlugin } from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import { BaseHrefWebpackPlugin } from 'base-href-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

export const getPlugins = (mode, domain) => {
    const plugins = [
        new DefinePlugin({
            'API_URL': JSON.stringify(domain),
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            }
        }),
        new HtmlWebpackPlugin({
            title: 'Exlight Games',
            template: './src/index.html',
            hash: true,
        }),
        new BaseHrefWebpackPlugin({
            baseHref: '/'
        }),
        new CopyWebpackPlugin([{
            from: './src/assets',
            to: './assets/[name].[ext]',
        },
        {
            from: './src/assets/skybox',
            to: './assets/[name].[ext]'
        },
        {
            from: './src/favicon.ico',
            to: './favicon.ico'
        }
        ]),
        new MiniCssExtractPlugin({
            filename: '[name].[hash].css',
            chunkFilename: '[id].css',
        }),
    ];
    return plugins;
};