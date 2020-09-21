(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
//Creates CodeMirror instance
const editor = CodeMirror(document.getElementById("html"), {
  mode: 'text/html',
  value: '<h1>Hello World!</h1>',
  lineNumbers: true,
  autoCloseTags: true,
  autoCloseBrackes: true,
  theme: 'panda-syntax',
})

//Append HTML
const liveRoom = document.getElementById('live');
liveRoom.contentWindow.document.body.innerHTML = '<h1>Hello World!</h1>';

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
},{}]},{},[1]);
