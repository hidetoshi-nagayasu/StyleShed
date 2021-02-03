
const THEME = 'darcula';
const PATH_INDEX_UNIQUE_ID = 3;

//Creates CodeMirror instance
const htmlEditor = CodeMirror(document.getElementById("htmlEditor"), {
  mode: 'text/html',
  value: '<h1>Hello World!</h1>',
  lineNumbers: true,
  autoCloseTags: true,
  autoCloseBrackes: true,
  theme: THEME,
});

const cssEditor = CodeMirror(document.getElementById("cssEditor"), {
  mode: 'text/css',
  value: 
    `h1 { 
      color: red; 
  }`,
  lineNumbers: true,
  autoCloseTags: true,
  autoCloseBrackes: true,
  theme: THEME,
});

const jsEditor = CodeMirror(document.getElementById("jsEditor"), {
  mode: 'text/javascript',
  value: 'function testFunc () {alert("Hello!");} testFunc();',
  lineNumbers: true,
  autoCloseTags: true,
  autoCloseBrackes: true,
  theme: THEME,
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


$(function() {
  // Resize Editor
  resizeEditor();

  // Edit title
  editTitle();

  // Save code
  saveCode();
});


/**
 * エディターのリサイズ対応
 */
const resizeEditor = () => {
  let $resize_panel = $('.js-col-resizer');

  $resize_panel.resizable({
    resize : function (event, ui) {
    },
  })
  .on('resize', function (e) {
    e.stopPropagation();
    resizeEvent($(this));
  });
}

/**
 * Event when editor resize
 * @param $panel 
 */
const resizeEvent = ($panel) => {
  let width = $panel.width();
}

/**
 * コードタイトルの保存処理
 */
const editTitle = () => {
  $('#editTitleIcon').on('click', () => {
    let title = $('#codeTitleText').text();
    let originHtml = $('#codeTitleWrapper').clone(true);
    let formHtml = `<input id="editTitleInput" class="edit-title-input" type="text">`;

    $('#codeTitle').html(formHtml);
    let $input = $('#editTitleInput');
    $input.focus().val(title);

    // タイトル入力のフォーカスアウト時に保存処理実行
    $input.on('blur', () => {
      let editedTitle = $input.val();

      if(!editedTitle || !editedTitle.match(/\S/g)) {
        $('#codeTitle').html(originHtml);
        return;
      }

      let uniqueId = '';
      const path = location.pathname;
      const pathArr = path.split('/');
      if(pathArr && pathArr.length === 4 && path.match(/^\/code\/edit\//) !== null) {
        uniqueId = pathArr[PATH_INDEX_UNIQUE_ID];
        console.log(uniqueId);
      }

      $.ajax({
        url: '/code/title/save',
        type: 'post',
        data: {
          title: editedTitle,
          uniqueId: uniqueId
        }
      })
      .done( (result) => {
        if(result.isError) {
          alert('タイトルを保存できませんでした。');
          $('#codeTitle').html(originHtml);
        } else {
          const message = 'タイトルの保存が完了しました。';

          $.when(
            originHtml.find('#codeTitleText').text(result.newTitle)
          ).done( () => {
            if(Object.keys(result).indexOf('uniqueId') !== -1) {
              location.href=`/code/edit/${result.uniqueId}`;
              return;
            }
            $('#codeTitle').html(originHtml);
            showNotificationDone(message);
            return;
          });
        }
      })
      .fail( (e) => {
        alert('タイトルを保存できませんでした。');
        $('#codeTitle').html(originHtml);
      });
    });
  });
}

/**
 * コードの保存処理
 */
const saveCode = () => {
  $('#saveButton').on('click', () => {
    $.ajax({
      url: "/code/save",
      type: 'post'
    })
    .done( (result) => {
      let message = 'コードの保存が完了しました。';
      showNotificationDone(message);
    })
    .fail( (e) => {
      alert('保存に失敗しました。');
    });
  });
}


/**
 *  処理成功のトースト表示
 * @param {*} message 
 */
const showNotificationDone = (message) => {
  let message_icon = $('#notifyIcon').clone(true).css('display', 'block').html();
  UIkit.notification({
    message: `${message_icon} ${message}`,
    status: 'default',
    pos: 'top-center',
    timeout: 3000
  });
}