import path from "path";
import webpack, { Configuration } from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import { TsconfigPathsPlugin } from "tsconfig-paths-webpack-plugin";

const webpacConfig = (env): Configuration => ({
    entry: "./src/index.tsx",
    ...(env.production || !env.developement ? {} : {devtool: "eval-source-map"}),
    resolve: { 
        extensions : [".ts", ".tsx", ".js"],
        plugins: [new TsconfigPathsPlugin()]
    },
    output: { 
        path: path.join(__dirname, "/dist"),
        filename: "build.js"
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader",
                options: {
                    transpileOnly: true,
                },
                exclude: /dist/
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./public/index.html"
        }),
        new webpack.DefinePlugin({
            "process.env.PRODUCTION": env.production || !env.developement,
            "process.env.NAME": JSON.stringify(require("./package.json").name),
            "process.env.VERSION": JSON.stringify(require("./package.json").version),
        }),
        new ForkTsCheckerWebpackPlugin({
            eslint: { 
                files: "./src/**/*.{ts,tsx,js,jsx}" 
            }
        })
    ] 
})

export default webpacConfig