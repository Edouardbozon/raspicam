import ExtractTextPlugin from 'extract-text-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin'
import autoprefixer from 'autoprefixer';
import webpack from 'webpack';
import precss from 'precss';
import path from 'path';
import ngAnnotate from 'ng-annotate-loader';

const HOST = process.env.HOST || "127.0.0.1";
const PORT = process.env.PORT || "8080";

const webpackConfig = {
    target: 'web',
    cache: true,
    stats: {
        color: true
    },
    resolve: {
		extensions: ['', '.js']
	},
    watchOptions: {
        aggregateTimeout: 300,
        poll: 1000
    },
};

/**
 * Application entries
 */
webpackConfig.entry = [
    path.resolve(__dirname, 'src', 'client', 'app.js') // Front app entry point
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
        exclude: /(node_modules|dist)/
    }
];

/**
 * Loaders
 */
webpackConfig.module.loaders = [
    // JavaScripts
	{
		test: /\.js?$/,
		exclude: /(node_modules|dist)/,
		loader: 'babel',
		query: {
		  presets: ['es2015'],
		  plugins: ['transform-runtime', 'transform-decorators-legacy', 'transform-class-properties'],
		}
	},
    // ng-Annotate
    {
        test: /.js$/,
        loader: 'ng-annotate',
        exclude: /(node_modules|dist)/
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
    // new webpack.HotModuleReplacementPlugin(),
    // new HtmlWebpackPlugin({
    //     template: path.join(__dirname, 'src', 'client', 'index.html')
    // })
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