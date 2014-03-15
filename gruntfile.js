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
					'images/*'
				],
				dest: 'build/'
			}
		},
		sass: {
			build: {
				files: {
					'build/css/master.css': 'assets/sass/master.scss'
				}
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
			txt: {
				files: ['assets/index.html','assets/svg/*','assets/images/*'],
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
	grunt.registerTask('default', ['copy','compile-css','connect','watch']);
};
