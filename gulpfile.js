(function (require) {
  'use strict';
  const path = {
    build: {
      html: 'assets/build/',
      scripts: 'assets/build/scripts/',
      styles: 'assets/build/styles/',
      img: 'assets/build/media/img/',
    },
    src: {
      html: 'src/*.html',
      scripts: 'src/scripts/main.js',
      styles: 'src/styles/*.scss',
      img: 'src/media/img/**/*.*',
    },
    watch: {
      html: 'src/**/*.html',
      scripts: 'src/scripts/**/*.js',
      styles: 'src/style/**/*.scss',
      img: 'src/media/img/**/*.*',
    },
    clean: './assets/build/*',
  };

  /* настройки сервера */
  const config = {
    server: {
      baseDir: './assets/build',
    },
    notify: false,
  };

  /* подключаем gulp и плагины */
  const gulp = require('gulp'), // подключаем Gulp
    webserver = require('browser-sync'), // сервер для работы и автоматического обновления страниц
    plumber = require('gulp-plumber'), // модуль для отслеживания ошибок
    rigger = require('gulp-rigger'), // модуль для импорта содержимого одного файла в другой
    sourcemaps = require('gulp-sourcemaps'), // модуль для генерации карты исходных файлов
    sass = require('gulp-sass')(require('sass')), // модуль для компиляции SASS (SCSS) в CSS
    autoprefixer = require('gulp-autoprefixer'), // модуль для автоматической установки автопрефиксов
    cleanCSS = require('gulp-clean-css'), // плагин для минимизации CSS
    uglify = require('gulp-uglify'), // модуль для минимизации JavaScript
    cache = require('gulp-cache'), // модуль для кэширования
    rimraf = require('gulp-rimraf'), // плагин для удаления файлов и каталогов
    rename = require('gulp-rename');

  /* задачи */

  // запуск сервера
  gulp.task('webserver', function () {
    webserver(config);
  });

  // сбор html
  gulp.task('html:build', function () {
    return gulp
      .src(path.src.html) // выбор всех html файлов по указанному пути
      .pipe(plumber()) // отслеживание ошибок
      .pipe(rigger()) // импорт вложений
      .pipe(gulp.dest(path.build.html)) // выкладывание готовых файлов
      .pipe(webserver.reload({ stream: true })); // перезагрузка сервера
  });

  // сбор стилей
  gulp.task('styles:build', function () {
    return gulp
      .src(path.src.styles) // получим main.scss
      .pipe(plumber()) // для отслеживания ошибок
      .pipe(sourcemaps.init()) // инициализируем sourcemap
      .pipe(sass()) // scss -> css
      .pipe(autoprefixer()) // добавим префиксы
      .pipe(gulp.dest(path.build.styles))
      .pipe(rename({ suffix: '.min' }))
      .pipe(cleanCSS()) // минимизируем CSS
      .pipe(sourcemaps.write('./')) // записываем sourcemap
      .pipe(gulp.dest(path.build.styles)) // выгружаем в build
      .pipe(webserver.reload({ stream: true })); // перезагрузим сервер
  });

  // сбор js
  gulp.task('scripts:build', function () {
    return gulp
      .src(path.src.scripts) // получим файл main.js
      .pipe(plumber()) // для отслеживания ошибок
      .pipe(rigger()) // импортируем все указанные файлы в main.js
      .pipe(gulp.dest(path.build.scripts))
      .pipe(rename({ suffix: '.min' }))
      .pipe(sourcemaps.init()) //инициализируем sourcemap
      .pipe(uglify()) // минимизируем js
      .pipe(sourcemaps.write('./')) //  записываем sourcemap
      .pipe(gulp.dest(path.build.scripts)) // положим готовый файл
      .pipe(webserver.reload({ stream: true })); // перезагрузим сервер
  });

  // обработка картинок
gulp.task('img:build', function () {
    return gulp
      .src(path.src.img) // путь с исходниками картинок
      .pipe(gulp.dest(path.build.img)); // выгрузка готовых файлов
  });

  // удаление каталога build
  gulp.task('clean:build', function () {
    return gulp.src(path.clean, { read: false }).pipe(rimraf());
  });

  // очистка кэша
  gulp.task('cache:clear', function () {
    cache.clearAll();
  });

  // сборка
  gulp.task(
    'build',
    gulp.series(
      'clean:build',
      gulp.parallel('html:build', 'styles:build', 'scripts:build', 'img:build')
    )
  );

  // запуск задач при изменении файлов
  gulp.task('watch', function () {
    gulp.watch(path.watch.html, gulp.series('html:build'));
    gulp.watch(path.watch.styles, gulp.series('styles:build'));
    gulp.watch(path.watch.scripts, gulp.series('scripts:build'));
    gulp.watch(path.watch.img, gulp.series('img:build'));
  });

  // задача по умолчанию
  gulp.task(
    'default',
    gulp.series('build', gulp.parallel('webserver', 'watch'))
  );
})(require);


