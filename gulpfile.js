/*
* @Author: zhengchangjun
* @Date:   2018-02-06 15:49:13
* @Last Modified by:   zhengchangjun
* @Last Modified time: 2018-02-06 15:51:32
*/
var gulp = require('gulp');
var del = require('del');

var defaultConfig = require(configPath);

gulp.task('clean', function () {
    return del([defaultConfig.DIR_BUILD], {force: true});
});

gulp.task('build:inject', function () {
    var publicPaths = libs
        .filter(lib => (lib.src || lib.cdn))
        .map((lib) => {

            if (lib.cdn) {
                return lib.cdn;
            } else {
                return defaultConfig.publicPath + 'libs/' + lib.name;
            }
        });
    var cssLinks = publicPaths.filter(path => /.css$/.test(path))
                              .map(path => '<link rel="stylesheet" href="' + path + '">')
                              .join('\n\t');

    var jsLinks = publicPaths.filter(path => /.js$/.test(path))
                             .map(path => '<script src="' + path + '"></script>')
                             .join('\n');

    return gulp.src(defaultConfig.indexPath)
               .pipe(replace(/<!-- inject:lib:css -->[\s\S]*?<!-- endinject -->/, cssLinks))
               .pipe(replace(/<!-- inject:lib:js -->[\s\S]*?<!-- endinject -->/, jsLinks))
               .pipe(rename('index.ejs'))
               .pipe(gulp.dest('src/'));
});

gulp.task('build', gulp.series('build:lib', 'build:inject'));

gulp.task('default', gulp.series('clean', 'build'));