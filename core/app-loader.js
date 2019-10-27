const babel = require('@babel/core');
const path = require('path');
const glob = require('glob');
const fs = require('fs');
const config = require('./config');
const cli = require('../helpers/cli');

function ES6Compiler(src, dst) {
  this.i = 0;
  this.compiled = 0;
  this.src = src,
  this.dst = dst;
};
ES6Compiler.prototype.next = function() {
  this.i++;
  if (this.i < this.files.length) {
    this.handle();
  } else {
    cli.logNewline('Compiled successfully!');

    this.onFinished();
  }
};
ES6Compiler.prototype.handle = function() {
  const src = this.files[this.i];

  const dstRelPath = src.substr(this.src.length);

  fs.mkdirSync(
    path.join(this.dst, path.dirname(dstRelPath)),
    { recursive: true }
  );
  
  babel.transformFileAsync(src, {
    cwd: path.join(__dirname, '..'),
    root: path.join(__dirname, '..'),
    configFile: false,
    presets: [
      "@babel/preset-env",
      "babel-preset-minify"
    ],
    plugins: [
      "@babel/plugin-transform-runtime",
      ["@babel/plugin-proposal-decorators", { "legacy": true }]
    ]
  })
    .then(result => {
      fs.writeFileSync(path.join(this.dst, dstRelPath), result.code);

      this.compiled++;
      cli.stdout.write(`Compiling files (${Math.floor((this.compiled / this.files.length) * 100)}%)`, { before: "\r" });

      this.next();
    });
};
ES6Compiler.prototype.compile = function(onFinished) {
  this.onFinished = onFinished;

  glob(path.join(this.src, '**/*.js'), {}, (err, files) => {
    if (err) {
      throw new Error(err);
    }

    this.files = files;
    this.handle();
  });
};

// Load user's app.
exports.loadApp = function() {
  // Load app.config.json file.
  config.load();
  cli.log('Configuration file loaded.');

  // Create build folder.
  const buildFolder = path.join(process.cwd(), '.build');
  fs.mkdirSync(buildFolder, { recursive: true });

  const rootDir = path.join(
    process.cwd(),
    config.get('rootDir') || ''
  );
  
  return new Promise(resolve => {
    new ES6Compiler(rootDir, buildFolder)
      .compile(() => {
        require(path.join(buildFolder, 'app'));

        resolve();
      });
  });
}
