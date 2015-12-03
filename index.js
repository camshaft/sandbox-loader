var SingleEntryPlugin = require('webpack/lib/SingleEntryPlugin');
var template = require('fs').readFileSync(__dirname + '/template.js', 'utf8');

module.exports = function(source) {
  if(this.cacheable) this.cacheable();
  return source;
};

var count = 0;
module.exports.pitch = function(request) {
  createCompiler(this, request, {
    filename: 'sandbox/' + (count++) + '.js'
  }, this.async());
};

function createCompiler(loader, request, options, cb) {
  var compiler = loader._compilation.createChildCompiler('iframe', options);

  compiler.apply(new SingleEntryPlugin(loader.context, '!!' + request, 'sandbox'));

  var subCache = 'subcache ' + __dirname + ' ' + request;
  compiler.plugin('compilation', function(compilation) {
    if (!compilation.cache) return;
    if (!compilation.cache[subCache]) {
      compilation.cache[subCache] = {};
    }
    compilation.cache = compilation.cache[subCache];
  });

  compiler.runAsChild(function(err, entries, compilation) {
    if (err) return cb(err);
    if (!entries[0]) return cb(null, null);

    var sandbox = compilation.assets[options.filename];
    if (!sandbox) return cb(new Error('Could not compile sandbox source'));

    var src = template.replace('__SOURCE__', sandbox.source());

    cb(null, src);
  });
}
