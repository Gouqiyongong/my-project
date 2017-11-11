const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
const clean = require('clean-webpack-plugin');
const webpack = require('webpack');
module.exports = {
  entry: {
    login:'./all/js/login.js',
    load:'./all/js/load.js',
    signup:'./all/js/signup.js',
    forgetPassword:'./all/js/forgetPassword.js',
    index:'./all/js/index.js',
    provi:'./all/js/provi.js',
    newPassword:'./all/js/newPassword.js'
  },

  output: {
    filename: 'js/[name].bundle.js',
    path: path.resolve(__dirname, './dist')
  },

  devtool: 'inline-source-map',

  devServer:{
    contentBase:'./dist',
    hot:true,
    open:true,
    openPage:'newPassword.html'
  },

  module:{
    rules:[
      {
        test:/\.html/,
        use:['html-loader'],
        exclude:path.resolve(__dirname,'./node_modules')
      },
      {
        test:/\.js$/,
        use:['babel-loader'],
        exclude:path.resolve(__dirname,'./node_modules')
      },
      {
        test:/\.css$/,
        use:[
            'style-loader',
            'css-loader'
        ],
        exclude:path.resolve(__dirname,'./node_modules')
      },
      {
        test:/\.(png|svg|jpg|gif)$/,
        use:[
            'file-loader'
        ],
        exclude:path.resolve(__dirname,'./node_modules')
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
            'file-loader'
       ]
     }
    ]
  },

  plugins:[
    new webpack.HotModuleReplacementPlugin(),
    new clean(['dist/js']),
    new htmlWebpackPlugin({
      filename:'login.html',
      template:'./all/login.html',
      inject:'body',
      chunks:['login']
    }),
    new htmlWebpackPlugin({
      filename:'load.html',
      template:'./all/load.html',
      inject:'body',
      chunks:['load']
    }),
    new htmlWebpackPlugin({
      filename:'signup.html',
      template:'./all/signup.html',
      inject:'body',
      chunks:['signup']
    }),
    new htmlWebpackPlugin({
      filename:'forgetPassword.html',
      template:'./all/forgetPassword.html',
      inject:'body',
      chunks:['forgetPassword']
    }),
    new htmlWebpackPlugin({
      filename:'index.html',
      template:'./all/index.html',
      inject:'body',
      chunks:['index']
    }),
    new htmlWebpackPlugin({
      filename:'provi.html',
      template:'./all/provi.html',
      inject:'body',
      chunks:['provi']
    }),
    new htmlWebpackPlugin({
      filename:'newPassword.html',
      template:'./all/newPassword.html',
      inject:'body',
      chunks:['newPassword']
    })
  ]
};