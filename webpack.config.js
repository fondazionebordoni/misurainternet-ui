module.exports = {
	entry: __dirname + '/public/js/speedtest.js',
	module: {
		rules: [ 
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader'
				}
			} 
		]
	},
	output: {
		filename: 'bundle.js',
		path: __dirname + '/public/build'
	}
};