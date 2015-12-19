/*!
 * Bootstrap's Gruntfile
 * http://getbootstrap.com
 * Copyright 2013-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 */

module.exports = function (grunt) {
    grunt.file.preserveBOM = true;
    grunt.file.defaultEncoding = 'UTF-8';
    // Project configuration.
    grunt.initConfig({

        // Metadata.
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*\n' +
            ' * miniui v<%= pkg.version %> (<%= pkg.homepage %>)\n' +
            ' * Copyright 2013-<%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
            ' */\n',
        dist:'dist',
        // Task configuration.
        clean: {
			dist: ['dist']
        },


        concat: {
            options: {
                banner: '<%= banner %>\n',
                separator: '\r\n',
                stripBanners: false
            },
            miniui: {
                src: [
                    'js/IdCardBox.js'
                ],
                dest: '<%=dist%>/<%= pkg.name %>-source.js'
            }
        },
        comments: {
            miniui: {
                options: {
                    singleline: true,
                    multiline: true
                },
                src: '<%= concat.miniui.dest %>'
            }
        },
        uglify: {
            options: {
                report: 'min'
            },
            miniui: {
                options: {
                    banner: '<%= banner %>',
                    beautify: {
                        ascii_only: true
                    }
                },
                src: '<%= concat.miniui.dest %>',
                dest: '<%=dist%>/<%= pkg.name %>-min.js'
            }
        },

        jshint: {
            all: {
                src: 'js/**/*.js',
                options: {
                    bitwise: true,
                    camelcase: true,
                    curly: true,
                    eqeqeq: true,
                    forin: true,
                    immed: true,
                    indent: 4,
                    latedef: true,
                    newcap: true,
                    noarg: true,
                    noempty: true,
                    nonew: true,
                    regexp: true,
                    undef: true,
                    unused: true,
                    trailing: true,
                    maxlen: 120
                }
            }
        },

        cssmin: {
            target: {
                files: [{
                    expand: true,
                    cwd: 'css',
                    src: ['*.css', '!*.min.css','*/*.css'],
                    dest: '<%=dist%>/themes/',
                    ext: '.min.css'
                }]
            }
        },

        copy: {
            css: {
                cwd: 'css',
                expand: true,
                src: [ '**' ],
                dest: '<%=dist%>/themes/'
            }
        }


    });


    // These plugins provide necessary tasks.
    require('load-grunt-tasks')(grunt, {scope: 'devDependencies'});

    grunt.registerTask('jshint-js', ['jshint']);

    grunt.registerTask('clean-dist', ['clean']);
    grunt.registerTask('concat-js', ['concat']);

    grunt.registerTask('releaseJs', ['releaseJs']);

    grunt.registerTask('css-min', ['cssmin']);
    // JS distribution task.



    //default
    grunt.registerTask('default', ['clean', 'concat','uglify','cssmin','copy']);


};
