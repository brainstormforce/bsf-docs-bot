module.exports = function ( grunt ) {
	// Project configuration.
	grunt.initConfig( {
		pkg: grunt.file.readJSON( 'package.json' ),

		copy: {
			main: {
				options: {
					mode: true,
				},
				src: [
					'**',
					'!.git/**',
					'!.gitignore',
					'!.gitattributes',
					'!*.sh',
					'!*.zip',
					'!eslintrc.json',
					'!README.md',
					'!Gruntfile.js',
					'!package.json',
					'!package-lock.json',
					'!composer.json',
					'!composer.lock',
					'!phpcs.xml',
					'!phpcs.xml.dist',
					'!phpunit.xml.dist',
					'!node_modules/**',
					'!app/node_modules/**',
					'!app/package.json',
					'!app/package-lock.json',
					'!app/postcss.config.js',
					'!app/tailwind.config.js',
					'!app/webpack.config.js',
					'!app/assets/src/**',
					'!vendor/**',
					'!tests/**',
					'!scripts/**',
					'!config/**',
					'!tests/**',
					'!bin/**',
				],
				dest: 'bsf-docs-bot/',
			},
		},
		compress: {
			main: {
				options: {
					archive: 'bsf-docs-bot-<%= pkg.version %>.zip',
					mode: 'zip',
				},
				files: [
					{
						src: [ './bsf-docs-bot/**' ],
					},
				],
			},
		},
		clean: {
			main: [ 'bsf-docs-bot' ],
			zip: [ '*.zip' ],
		},
		addtextdomain: {
            options: {
                textdomain: 'bsf-docs-bot',
            },
            target: {
                files: {
                    src: [
                        '*.php',
                        '**/*.php',
                        '!node_modules/**',
                        '!php-tests/**',
                        '!bin/**',
                    ]
                }
            }
        },
		makepot: {
            target: {
                options: {
                    domainPath: '/',
                    potFilename: 'languages/bsf-docs-bot.pot',
                    potHeaders: {
                        poedit: true,
                        'x-poedit-keywordslist': true
                    },
                    type: 'wp-plugin',
                    updateTimestamp: true
                }
            }
        },
	} );

	/* Load Tasks */
	grunt.loadNpmTasks( 'grunt-contrib-copy' );
	grunt.loadNpmTasks( 'grunt-contrib-compress' );
	grunt.loadNpmTasks( 'grunt-contrib-clean' );
    grunt.loadNpmTasks( 'grunt-wp-i18n' );

	/* Register task started */
	grunt.registerTask( 'release', [
		'clean:zip',
		'copy',
		'compress',
		'clean:main',
	] );

    grunt.registerTask( 'i18n', [
		'addtextdomain',
		'makepot'
	] );
};
