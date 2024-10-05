$("path, circle").hover(function(e) {
    $('#info-box').css('display','block');
    $('#info-box').html($(this).data('info'));
  });
  
  $("path, circle").mouseleave(function(e) {
    $('#info-box').css('display','none');
  });
  
  $(document).mousemove(function(e) {
    $('#info-box').css('top',e.pageY-$('#info-box').height()-30);
    $('#info-box').css('left',e.pageX-($('#info-box').width())/2);
  }).mouseover();
  
  var ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  if(ios) {
    $('a').on('click touchend', function() {
      var link = $(this).attr('href');
      window.open(link,'_blank');
      return false;
    });
  }

  $(document).ready(function() {
    let isDown = false;
    let startY, startX;
    let scrollTop, scrollLeft;

    const mapContainer = $('.map-box');

    mapContainer.on('pointerdown', function(e) {
        isDown = true;
        startY = e.originalEvent.pageY - mapContainer.position().top;
        startX = e.originalEvent.pageX - mapContainer.position().left;
        scrollTop = mapContainer.scrollTop();
        scrollLeft = mapContainer.scrollLeft();
    });

    mapContainer.on('pointerup pointerleave', function() {
        isDown = false;
    });

    mapContainer.on('pointermove', function(e) {
        if (!isDown) return;

        e.preventDefault(); // Запретить стандартное поведение

        const y = e.originalEvent.pageY;
        const x = e.originalEvent.pageX;
        const walkY = (y - startY) * 2; // Ускорение вертикального перемещения
        const walkX = (x - startX) * 2; // Ускорение горизонтального перемещения

        // Используйте requestAnimationFrame для улучшения производительности
        requestAnimationFrame(() => {
            mapContainer.scrollTop(scrollTop - walkY);
            mapContainer.scrollLeft(scrollLeft - walkX);
        });
    });
    
});

let initialDistance = 0;
let scale = 1;

const getDistance = (touches) => {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
};

$('#us-map').on('touchstart', function(e) {
    if (e.touches.length === 2) {
        e.preventDefault(); // Запретить прокрутку страницы
        initialDistance = getDistance(e.touches);
    }
});

$('#us-map').on('touchmove', function(e) {
    if (e.touches.length === 2) {
        e.preventDefault(); // Запретить прокрутку страницы

        const currentDistance = getDistance(e.touches);
        scale *= currentDistance / initialDistance; // Обновляем масштаб

        initialDistance = currentDistance; // Обновляем начальное расстояние
        $(this).css('transform', `scale(${scale})`); // Применяем масштаб
    }
});

$('#zoomIn').on('click', function() {
    scale *= 1.1; // Увеличиваем масштаб на 10%
    $('#us-map').css('transform', `scale(${scale})`); // Применяем масштаб
});

$('#zoomOut').on('click', function() {
    scale *= 0.9; // Уменьшаем масштаб на 10%
    $('#us-map').css('transform', `scale(${scale})`); // Применяем масштаб
});