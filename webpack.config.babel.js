import ExtractTextPlugin from 'extract-text-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin'
import autoprefixer from 'autoprefixer';
import webpack from 'webpack';
import precss from 'precss';
import path from 'path';

const HOST = process.env.HOST || "127.0.0.1";
const PORT = process.env.PORT || "8080";

const webpackConfig = {
    target: 'web',
    cache: true,
    stats: {
        color: true
    },
    resolve: {
		extensions: ['', '.js', '.jsx']
	}
};

/**
 * Application entries
 */
webpackConfig.entry = [
    `webpack-dev-server/client?http://${HOST}:${PORT}`,
    `webpack/hot/only-dev-server`,
    `./src/client/index.jsx` // Your appʼs entry point
]

/**
 * Output configuration
 */
webpackConfig.output = {
  path: path.join(__dirname, 'dist'),
  filename: 'bundle.js'
};

webpackConfig.module = {
    devServer: {
		contentBase: './dist',
        // do not print bundle build stats
		noInfo: true,
		// enable HMR
		hot: true,
		// embed the webpack-dev-server runtime into the bundle
		inline: true,
		// serve index.html in place of 404 responses to allow HTML5 history
		historyApiFallback: true,
		port: PORT,
		host: HOST
	}
};

/**
 * Pré-loaders
 */
webpackConfig.module.preLoaders = [
    {
        test: /\.js$/, 
        loader: "eslint-loader", 
        exclude: /node_modules/
    }
];

/**
 * Loaders
 */
webpackConfig.module.loaders = [
    {
		test: /\.jsx?$/,
		exclude: /(node_modules|bower_components|dist)/,
		loaders: ['react-hot']
	},
	{
		test: /\.jsx?$/,
		exclude: /(node_modules|bower_components|dist)/,
		loader: 'babel',
		query: {
		  presets: ['es2015', 'react'],
		  plugins: ['transform-runtime', 'transform-decorators-legacy', 'transform-class-properties'],
		}
	},
    // SASS preprocess & postprocess
    {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('style', 'css-loader!postcss-loader!sass-loader')
    },
    // Images
    {
        test: /\.(jpg|jpeg|gif|png)$/,
        exclude: /node_modules/,
        loader:'url-loader?limit=1024&name=images/[name].[ext]'
    },
    // Fonts
    {
        test: /\.(woff|woff2|eot|ttf|svg)$/,
        exclude: /node_modules/,
        loader: 'url-loader'
    }
];

/**
 * Plugins
 */
webpackConfig.plugins = [
    new ExtractTextPlugin('css/[name].css'),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
        template: path.join(__dirname, 'src', 'client', 'template.html'),
        title: 'Webpack App'
    })
];

/**
 * PostCss configuration
 */
webpackConfig.postcss = function() {
	return [ autoprefixer({
		browsers: ['last 2 versions', '> 5%']
	}), precss ];
};

webpackConfig.esLint = {
    configPath: __dirname + '.eslintrc'
};

export default webpackConfig;