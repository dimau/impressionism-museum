const webpack = require("webpack");
const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const fs = require("fs");

// Get all file names from directory with pages
const PAGES_DIR = path.join(__dirname, "src", "pages");
const pages = fs.readdirSync(PAGES_DIR).filter(fileName => fileName.endsWith(".pug"));

const config = {
  entry: "./src/scripts/index.js",

  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.[contenthash].js",
    clean: true,
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        use: "babel-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.(scss|css)$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
          "sass-loader",
        ],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
      {
        test: /\.pug$/i,
        use: "pug-loader",
      },
    ],
  },

  plugins: [
    // Automatic creation all web pages
    ...pages.map(page => new HtmlWebpackPlugin({
      template: path.join(PAGES_DIR, page),
      filename: page.replace(/\.pug$/, ".html"),
    })),

    // Copy images from src to dist
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "src", "img"),
          to: path.resolve(__dirname, "dist", "img"),
        },
      ],
    }),

    // Copy robots.txt file from src to dist
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "src", "robots.txt"),
          to: path.resolve(__dirname, "dist", "robots.txt"),
        },
      ],
    }),

    // Gathering and minification of CSS file
    new MiniCssExtractPlugin({
      filename: "[name].[contenthash].css",
    }),
  ],
};

module.exports = config;