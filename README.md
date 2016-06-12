[![TeamCity (simple build status)](https://img.shields.io/teamcity/http/teamcity.jetbrains.com/s/bt345.svg?maxAge=2592000&style=flat-square&label=v1.3.0)](https://build.nativecode.com/viewType.html?buildTypeId=nativecode_opensource_buildconfig_continuous&branch_nativecode_opensource_buildconfig=v1.3.0)

# gulp-build-tasks
Simple set of build tasks for quickly getting a project up and running with Gulp.
Provides a simple workflow for building, packaging, and publishing your project.

## Getting Started
Here is a simple example of just doing some JS processing.

```
'use strict'
var gulp = (require('./src/index.js')(require('gulp')))
gulp.build({
  'src/**/*.js': src => src
    .pipe(gulp.use.cached('js'))
    .pipe(gulp.use.jslint())
    .pipe(gulp.use.babel({ presets: ['es2015'] }))
    .pipe(gulp.use.uglify())
    .pipe(gulp.dest('dist'))
})
gulp.publish({ tasks: ['build'] }).npm()
gulp.reload({
  'package.json': ['build'],
  'src/**/*.js': ['build:src/**/*.js']
}, ['build'])
gulp.task('default', ['build'])
gulp.task('watch', ['build', 'watch:reload'])
```

This is the `gulpfile.js` for the project itself. One of the goals is to provide a concise
syntax to describe build actions. The `build` method accepts two forms for defining your
pipeline.

The first form is a complete object instance. You would only want this if you want to have
clean names.
```
name: {
    build: function(gulp),
    src: array | glob
}
```

The second form is more concise, but creates mangled build names. You can see this version
used to process the JS files in the example above.
```
glob: function(gulp)
```

`build` will emit a task named 'build' as well as one for each name/glob specified in the
parameter options.

```
gulp.build({
  'src/**/*.js': src => src
    .pipe(gulp.use.cached())
    .pipe(gulp.use.debug({ title: 'js:' }))
    .pipe(gulp.use.jslint())
    .pipe(gulp.use.babel({ presets: ['es2015'] }))
    .pipe(gulp.use.uglify())
    .pipe(gulp.dest('dist'))
})
```
Produces:
- "build"
- "build:src/\*\*/\*.js"

```
gulp.build({
  js: {
    build: src => src
      .pipe(gulp.use.cached())
      .pipe(gulp.use.debug({ title: 'js:' }))
      .pipe(gulp.use.jslint())
      .pipe(gulp.use.babel({ presets: ['es2015'] }))
      .pipe(gulp.use.uglify())
      .pipe(gulp.dest('dist')),
    src: ['src/**/*.js']
  }
})
```
Produces:
- "build"
- "build:js"
