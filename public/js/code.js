//Creates CodeMirror instance
const editor = CodeMirror(document.getElementById("html"), {
  mode: 'html',
  value: '<h1>Hello World!</h1>',
  lineNumbers: true,
  autoCloseTags: true,
  autoCloseBrackes: true,
  theme: 'panda-syntax',
})

//Append HTML
const liveRoom = document.getElementById('live');
if(liveRoom) {
  liveRoom.contentWindow.document.body.innerHTML = '<h1>Hello World!</h1>';
}

//Append CSS
/*
const style = document.createElement('style');
style.setAttribute('id', 'style');
style.innerHTML = 'body {color: red;}'

liveRoom.contentWindow.document.head.appendChild(style);
*/

//Append JS
/*
const script = document.createElement('script');
script.innerHTML = 'console.log("hi")';

liveRoom.contentWindow.document.head.appendChild(script)
*/

// Event Listener
CodeMirror.on(editor, 'change', function () {
liveRoom.contentWindow.document.body.innerHTML = editor.getValue();
})