import { sync } from 'rimraf';
import { BUILD_FOOLDER, DEVELOPMENT } from './webpack.const';
import { getPlugins } from './webpack.plugins';
import { chooseMode as getMode } from './webpack.modes';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

export default (_, argv: any) => {
    const isProd = getMode(argv.mode);
    sync(__dirname.split('/').slice(0, -1).join('/') + BUILD_FOOLDER);
    return {
        entry: {
            main: './src/main.ts',
            // style: './src/styles.scss'
        },
        stats: {
            all: false,
            modules: true,
            maxModules: 6,
            errors: true,
            warnings: true,
            moduleTrace: true,
            errorDetails: true,
            modulesSort: 'name'
        },
        output: {
            path: __dirname.split('/').slice(0, -1).join('/') + BUILD_FOOLDER,
            filename: '[name].[hash].js',
        },
        resolve: {
            extensions: ['.ts', '.js', '.json', 'scss', 'css']
        },
        module: {
            rules: [{
                enforce: 'pre',
                test: /\.(ts|tsx)$/,
                exclude: /node_modules/,
                loader: 'tslint-loader',
            }, {
                test: /\.(ts|tsx|js|jsx)$/,
                exclude: /node_modules/,
                loader: 'ts-loader'
            }, {
                test: /\.(scss|css)$/,
                use: [{
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                        hmr: process.env.NODE_ENV === DEVELOPMENT,
                    }
                }, 'css-loader', 'sass-loader']
            }]
        },
        plugins: getPlugins(isProd, null),
        optimization: {
            minimize: isProd,
            noEmitOnErrors: true,
            removeAvailableModules: true,
            splitChunks: {
                chunks: 'all',
                cacheGroups: {
                    commons: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'vendors',
                        chunks: 'all'
                    }
                }
            }
        },
        devtool: isProd ? false : 'source-map',
        devServer: {
            open: false,
            overlay: {
                errors: true
            },
            https: true,
            host: '0.0.0.0',
            inline: true,
            historyApiFallback: true,
            contentBase: __dirname + BUILD_FOOLDER
        }
    };
};