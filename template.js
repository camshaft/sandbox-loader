var iframe = document.createElement('iframe');
iframe.style.visibility = 'hidden';
iframe.style.display = 'none';
iframe.style.height = 0;
iframe.style.width = 0;
iframe.style.position = 'fixed';
document.body.appendChild(iframe);

var script = document.createElement('script');
function s() {
  window._lib = __SOURCE__
}
script.text = '(' + s + ')()';

var doc = iframe.contentWindow.document;
doc.open();
doc.write(script.outerHTML);
doc.close();

module.exports = iframe.contentWindow._lib;
