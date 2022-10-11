// 一文字ずつspanタグで囲む

$.fn.spanWrap = function() {
  $(this).each((i) => {
    let text = $.trim(this[i].innerText);
    let html = "";
    text.split("").forEach(function(val) {
      html += "<span>" + val + "</span>";
    });
    this[i].innerHTML = html;
  });
}

$('.js-span-container').spanWrap();
$('#js-span').spanWrap();
