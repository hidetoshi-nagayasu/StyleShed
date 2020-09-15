const gulp = require('gulp')
const sass = require('gulp-sass')
const autoprefixer = require('gulp-autoprefixer')

// sassの読み込み先とcssの保存先指定
const hoge = () => {
  return gulp.src('./public/sass/**/*.scss')
    .pipe(sass({outputStyle: 'expanded'}))
    .pipe(autoprefixer())
    .pipe(gulp.dest('./public/css/'))
}

// 自動監視のタスク、sassWatchって名前にする
const sassWatch = () => {
  const watcher = gulp.watch(['./public/sass/**/*.scss'])
  watcher.on('change', hoge)
}

// sassWatchをデフォルトのタスクに設定
exports.build = sassWatch
exports.default = gulp.series(sassWatch)
