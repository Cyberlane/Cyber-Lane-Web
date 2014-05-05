/*global module:false*/
var path = require('path');
var lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;

var folderMount = function folderMount(connect, point) {
	return connect.static(path.resolve(point));
};

module.exports = function(grunt){
	
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		cssc: {
			build: {
				options: {
					consolidateViaDeclarations:	true,
					consolidateViaSelectors:	true,
					consolidateMediaQueries:	true
				},
				files: {
					'build/css/master.css': 'build/css/master.css'
				}
			}
		},
		cssmin: {
			build: {
				src: 'build/css/master.css',
				dest: 'build/css/master.css'
			}
		},
		copy: {
			content: {
				cwd: 'assets/',
				expand: true,
				src: [
					'index.html',
					'svg/*.svg',
					'images/**',
					'fonts/*'
				],
				dest: 'build/'
			}
		},
		sass: {
			options: {
				compass: true
			},
			build: {
				files: {
					'build/css/master.css': 'assets/sass/master.scss'
				}
			}
		},
		build_html: {
			dev: {
				options: {
					data: 'assets/data.json',
					templates: 'assets/fragments/**/*.html'
				},
				expand: true,
				cwd: 'assets/',
				src: ['*.html'],
				dest: 'build/',
				ext: '.html'
			}
		},
		watch: {
			build_trigger: {
				files: ['build/**/*'],
				options: {
					livereload: true
				}
			},
			styles: {
				files: ['assets/sass/**/*.scss'],
				tasks: ['compile-css']
			},
			html: {
				files: ['assets/*.html','assets/fragments/**/*.html', 'assets/data.json'],
				tasks: ['build_html']
			},
			txt: {
				files: ['assets/svg/*.*','assets/images/*.*'],
				tasks: ['copy:content']
			}
		},
		connect: {
			livereload: {
				options: {
					middleware: function(connect, options) {
						return [lrSnippet, folderMount(connect, '.')]
					}
				}
			}
		}
	});

	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
	
	grunt.registerTask('compile-css', ['sass','cssc','cssmin']);
	grunt.registerTask('default', ['copy','build_html','compile-css','connect','watch']);
};
