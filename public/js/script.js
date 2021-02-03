
const PATH = location.pathname;
const SIDEBAR_ACTIVE = 'active';

$(function() {
  let $sidebar_nav = $('#sidebar_nav');
  $sidebar_nav.find('li, a').removeClass(SIDEBAR_ACTIVE);
  $sidebar_nav.find(`a[href="${PATH}"]`).addClass(SIDEBAR_ACTIVE);
  $sidebar_nav.find(`li:has(a[class="${SIDEBAR_ACTIVE}"])`).addClass(SIDEBAR_ACTIVE);
});