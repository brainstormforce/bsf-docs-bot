// Load the default @wordpress/scripts config object
const path = require( 'path' );
const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );

// Use the defaultConfig but replace the entry and output properties
module.exports = {
	...defaultConfig,
	entry: {
		'bot-app': path.resolve(
			__dirname,
			'assets/src/BotApp.js'
		),
	},
	resolve: {
		alias: {
			...defaultConfig.resolve.alias,
			'@BotApp': path.resolve( __dirname, 'assets/src/' ),
		},
	},
	output: {
		filename: '[name].js',
		path: path.resolve( __dirname, 'assets/build' ),
	},
	plugins: [
		// ...defaultConfig.plugins,
		...defaultConfig.plugins.filter( function ( plugin ) {
			if ( plugin.constructor.name === 'LiveReloadPlugin' ) {
				return false;
			}
			return true;
		} ),
	],
};
