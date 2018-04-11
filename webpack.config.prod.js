const path = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const PrerenderSPAPlugin = require('prerender-spa-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const WorkboxPlugin = require('workbox-webpack-plugin');
const extractSass = new ExtractTextPlugin({
  filename: 'css/[name]-[hash].css',
  disable: process.env.NODE_ENV === 'development',
});
const pathConfig = {
  INDEX: path.resolve(__dirname, 'src/index.html'),
  SRC_DIR: path.resolve(__dirname, './src/js/index.js'),
  DIST_DIR: path.resolve(__dirname, 'dist'),
};
let cleanOptions = {
  root: __dirname,
  exclude: ['notRemove'], //ignore your folder on build
  verbose: false,
  dry: false,
  beforeEmit: false,
  allowExternal: false,
};
let WebpackPwaManifestOptions = {
  name: 'My Progressive Web App',
  short_name: 'MyPWA',
  description: 'My awesome Progressive Web App!',
  display: "standalone",
  start_url: "/",
  background_color: '#e60a0a',
  icons: [{
    src: path.resolve('src/img/icon.png'),
    sizes: [16, 32, 57, 60, 72, 76, 96, 114, 120, 128, 144, 152, 180, 192, 256, 384, 512], // multiple sizes
    destination: path.join('img/icons')
  },
    {
      src: path.resolve('src/img/icon.png'),
      size: '1024x1024', // you can also use the specifications pattern
      destination: path.join('img/icons')
    }
  ],
  gcm_sender_id: "103953800507",
}
let workboxOptions = {
  globPatterns: [' "**/*.{html,md,css,txt,less,scss,otf,eot,svg,ttf,woff,woff2,jpg,png,gif,yml,js,ico,sh,xml,map}"'],
  swDest: 'sw.js',
  swSrc: './src/js/sw.js',
  globIgnores: [
    "**/node_modules/**/*"
  ],
  maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
}
let pathsToClean = ['dist'];
module.exports = {
  entry: {
    main: pathConfig.SRC_DIR,
  },
  output: {
    path: pathConfig.DIST_DIR,
    filename: 'js/[name]-[chunkhash].js',
    publicPath: '/', // you will get dist configuration virtually else you won't get err: GET http://localhost:8081/dist/bundle.js net::ERR_ABORTED
  },
  devServer: {
    historyApiFallback: true,
  },
  performance: {
    hints: false,
  },
  module: {
    rules: [{
      test: /\.(js|jsx)$/,
      exclude: /(node_modules|bower_components)/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env', '@babel/preset-react'],
          plugins: [require('@babel/plugin-proposal-object-rest-spread')],
        },
      },
    },
      {
        test: /\.(?:ico|gif|png|jpg|jpeg|webp)$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[ext]?[hash]',
            outputPath: 'img',
          },
        },],
      },
      {
        test: /\.(s*)css$/,
        use: extractSass.extract({
          use: [{
            loader: 'css-loader',
            options: {
              minimize: true,
              outputPath: 'css',
            },
          },
            {
              loader: 'sass-loader',
            },
          ],
          // use style-loader in development
          fallback: 'style-loader',
        }),
      },
      {
        test: /\.(html)$/,
        use: {
          loader: 'html-loader',
          options: {
            minimize: true,
          },
        },
      },
      {
        // make all files ending in .json5 use the `json5-loader`
        test: /\.json5$/,
        loader: 'json5-loader'
      }, // WOFF Font
      {
        test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
        use: {
          loader: 'file-loader',
          options: {
            limit: 10000,
            mimetype: 'application/font-woff',
          }
        },
      },
      // WOFF2 Font
      {
        test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
        use: {
          loader: 'file-loader',
          options: {
            limit: 10000,
            mimetype: 'application/font-woff',
          }
        }
      },
      // TTF Font
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        use: {
          loader: 'file-loader',
          options: {
            limit: 10000,
            mimetype: 'application/octet-stream'
          }
        }
      },
      // EOT Font
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        use: 'file-loader',
      },
      // SVG Font
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        use: {
          loader: 'file-loader',
          options: {
            limit: 10000,
            mimetype: 'image/svg+xml',
          }
        }
      },
    ],
  },
  plugins: [
    new UglifyJsPlugin({
      uglifyOptions: {
        compress: true,
        ie8: true,
        sourceMap: true
      },
    }),
    extractSass,
    new HtmlWebpackPlugin({
      template: pathConfig.INDEX,
    }),
    new CleanWebpackPlugin(pathsToClean, cleanOptions),
    new PrerenderSPAPlugin({
      staticDir: path.join(__dirname, 'dist'),
      routes: ['/', '/home', '/404', '/users', '/about', '/product'],
    }),
    new WebpackPwaManifest(WebpackPwaManifestOptions),
    new WorkboxPlugin.InjectManifest(workboxOptions),
  ],
  resolve: {
    extensions: ['.js', '.jsx']
  },
  devtool: 'none'
};