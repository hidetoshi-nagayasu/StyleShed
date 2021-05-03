const app_const = {
  APP_TITLE: "StyleShed",
  APP_URL: "http://local.code.com:3000/",
  EMAIL_FROM: "hidetoshi.nagayasu@gmail.com",

  // Time Zone
  TIME_ZONE: "Asia/Tokyo",

  SIDEBAR_CATEGORY: {
    accordion:    { name: "Accordion", desc: "コンテンツを折りたたんでおけるアコーディオン。<br>Q&Aなどによく使われる。" },
    alert:        { name: "Alert", desc: "成功や注意などをユーザーに知らせるアラート。<br>目に入りやすいデザインがおすすめ。" },
    badge:        { name: "Badge", desc: "ユーザーの目を引くために利用するバッジ。<br>Newコンテンツなどによく使われる。" },
    breadcrumb:   { name: "Breadcrumb", desc: "階層構造を表示するパンくずリスト。<br>ユーザーが自分の居場所を知るのに効果的。" },
    button:       { name: "Button", desc: "ユーザーのアクションの際に使用するボタン。<br>Webサイトのデザインに大きな影響を与える重要なパーツ。" },
    card:         { name: "Card", desc: "コンテンツのまとまりを示すカード。<br>価格表示や同列コンテンツの表示などでよく使われる。" },
    comment:      { name: "Comment", desc: "ユーザーのコミュニケーションで使用されるコメント。<br>より見やすいデザインが求められる。" },
    countdown:    { name: "Countdown", desc: "期限を示すカウントダウン。<br>コンテンツの消費、購買に期限を設ける際に効果的。" },
    dropdown:     { name: "Dropdown", desc: "コンテンツのまとまりを表示するドロップダウン。<br>Webサイトの様々な場所で使われる。" },
    form:         { name: "Form", desc: "ユーザー情報のインプットに利用されるフォーム。<br>より使いやすいフォームデザインが求められる。" },
    heading:      { name: "Heading", desc: "コンテンツの主題、副題を示す見出し。<br>デザインによってそのWebサイトのイメージが左右される重要なパーツ。" },
    lightbox:     { name: "Lightbox", desc: "主に画像の拡大表示で使用されるライトボックス。<br>見やすく、使いやすいデザインが求められる。" },
    list:         { name: "List", desc: "並列コンテンツを表示する際に使用されるリスト。<br>見せ方は幾通りもあり、Webサイトのデザインにも影響する。" },
    modal:        { name: "Modal", desc: "特にユーザーに見てもらいたいコンテンツの表示で使用するモーダル。<br>アイテムの削除時の確認モーダルなどでよく使われる。" },
    navbar:       { name: "Navbar", desc: "並列したメニューなどで使われるナビゲーションバー。<br>ユーザーが求めるコンテンツにすぐたどり着くために使いやすいデザインであることが重要。" },
    toast:        { name: "Toast", desc: "ユーザーアクションに対する結果表示などで使用されるトースト。<br>画面表示の邪魔にならない程度にかつ目が止まりやすいデザインが好まれる。" },
    drawer:       { name: "Drawer", desc: "隠しコンテンツを表示するのに効果的なドロワー。<br>ドロワーが存在していることも画面上にわかりやすく表示することが重要。" },
    pagination:   { name: "Pagination", desc: "テーブル表示で使われるページネーション。<br>見やすさ、使いやすさが重要なパーツ。" },
    parallax:     { name: "Parallax", desc: "視差効果によってWebサイトに立体感をもたらすパララックス。<br>効果的に使うことでWebサイトのイメージアップにも期待できる。" },
    progress_bar: { name: "Progress bar", desc: "状態を表すのに使用されるプログレスバー。<br>ファイルアップロードなどでよく使われる。" },
    scrollspy:    { name: "Scrollspy", desc: "スクロールによって表示を変えるスクロールスパイ。<br>ユーザビリティ向上にも効果的なパーツ。" },
    search:       { name: "Search", desc: "探したいものをすぐに見つけるために重要な検索パーツ。<br>使いやすさが大きくWebサイトに影響する。" },
    slider:       { name: "Slider", desc: "状態を変更する際に使われるスライダー。<br>ユーザー体験に大きく影響するパーツ。" },
    slideshow:    { name: "Slideshow", desc: "主に複数枚の画像を見せるのに使われるスライドショー。<br>アニメーションなどで見やすさを追求できるパーツ。" },
    spinner:      { name: "Spinner", desc: "ローディング状態を表すスピナー。<br>おもしろいデザインにすることでユーザーを飽きさせない工夫も可能。" },
  }
}

module.exports = app_const;