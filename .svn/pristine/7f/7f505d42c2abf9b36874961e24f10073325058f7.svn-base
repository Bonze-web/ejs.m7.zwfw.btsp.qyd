const Config = require('./config.mjs');
const path = require('path');
const webpack = require('webpack');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const entries = {};
const plugins = [];

Config.Dirs.forEach((page) => {

    const group = page.group;
    const directory = page.directory;

    group.forEach((e) => {
        const htmlPlugin = new HTMLWebpackPlugin({
            filename: `${directory}/${e}.html`,
            template: path.resolve(__dirname, `./pages/${directory}/${e}.html`),
            chunks: ['common', `${directory}/assets/${e}`],
            inject: 'body'
        });

        const textPlugins = new ExtractTextPlugin({
            filename: `[name]-[contenthash].css`,
            allChunks: true
        });

        plugins.push.apply(plugins, [htmlPlugin, textPlugins]);
        entries[`${directory}/assets/${e}`] = path.resolve(__dirname, `./pages/${directory}/js/${e}.js`);
    });
});

plugins.push.apply(plugins, [
    new CleanWebpackPlugin(__dirname + '/dist/'),
    new webpack.optimize.CommonsChunkPlugin({
        name: 'common',
        filename: 'common/common.[chunkhash].js'
    })
]);

module.exports = {
    entry: entries,
    plugins: plugins,
    module: {
        rules: [{
            test: /\.css$/,
            exclude: /(node_modules)/,
            include: /(pages)/,
            use: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: 'css-loader'
            })
        }, {
            test: /\.html$/,
            use: {
                loader: 'html-loader'
            }
        }, {
            test: /\.(png|jpg|gif|svg|jpeg)$/i,
            exclude: /(node_modules)/,
            include: /(pages)/,
            use: {
                loader: 'url-loader',
                options: {
                    limit: 20000,
                    name: 'images/[name]-[hash:5].[ext]',
                    publicPath: Config.serverPath + '/dist/'
                }
            }
        }]
    },
    output: {
        path: path.resolve(__dirname + '/dist/'),
        filename: '[name]-[chunkhash].js'
    }
};