//Creates CodeMirror instance
const htmlEditor = CodeMirror(document.getElementById("html"), {
  mode: 'text/html',
  value: '<h1>Hello World!</h1>',
  lineNumbers: true,
  autoCloseTags: true,
  autoCloseBrackes: true,
  theme: 'lucario',
});

const cssEditor = CodeMirror(document.getElementById("css"), {
  mode: 'text/css',
  value: 
    `h1 { 
      color: red; 
  }`,
  lineNumbers: true,
  autoCloseTags: true,
  autoCloseBrackes: true,
  theme: 'lucario',
});

const jsEditor = CodeMirror(document.getElementById("js"), {
  mode: 'text/javascript',
  value: 'function testFunc () {alert("Hello!");} testFunc();',
  lineNumbers: true,
  autoCloseTags: true,
  autoCloseBrackes: true,
  theme: 'lucario',
});

//Append HTML
const liveRoom = document.getElementById('live');
if(liveRoom) {
  liveRoom.contentWindow.document.body.innerHTML = '<h1>Hello World!</h1>';
}



$(document).ready(function () {
  $('#live').contents().find('head').html("<style></style><script></script>");
  const style = cssEditor.getValue();
  const script = jsEditor.getValue();
  $('#live').contents().find('style').html(style);
  $('#live').contents().find('script').html(script);
});




//Append CSS
// const style = document.createElement('style');
// style.setAttribute('id', 'style');
// style.innerHTML = 'body {color: red;}';
// liveRoom.contentWindow.document.head.appendChild(style);

//Append JS
// const script = document.createElement('script');
// liveRoom.contentWindow.document.head.appendChild(script)


// Event Listener
CodeMirror.on(htmlEditor, 'change', function () {
  // liveRoom.contentWindow.document.body.innerHTML = htmlEditor.getValue();
  var html = htmlEditor.getValue();
  $('#live').contents().find('body').html(html);
});

CodeMirror.on(cssEditor, 'change', function () {
  // style.innerText = cssEditor.getValue();
  // liveRoom.contentWindow.document.head.appendChild(style);
  var css = cssEditor.getValue();
  $('#live').contents().find('style').html(css);
  console.log($('#live').contents().find('script').html());
  console.log($('#live').contents().find('style').html());
});

CodeMirror.on(jsEditor, 'change', function () {
  // script.innerText = jsEditor.getValue();
  // const preview = liveRoom.contentWindow.document;
  // console.log(preview.head);
  // preview.open();
  // preview.close();
  // preview.head.appendChild(script);
  var js = jsEditor.getValue();
  $('#live').contents().find('script').html(js);
  console.log($('#live').contents().find('script').html());
  console.log($('#live').contents().find('style').html());
});