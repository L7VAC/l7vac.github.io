document.addEventListener('DOMContentLoaded', function() {
    var videoList = [
        { title: '未知', link1: '../assets/vid/bbll.mp4', link2: '#' },
        { title: '未知', link1: '../assets/vid/c88.mp4', link2: '#' },
        { title: '未知', link1: '../assets/vid/cgtt.mp4', link2: '#' },
        { title: '未知', link1: '../assets/vid/cnm999.mp4', link2: '#' },
        { title: '未知', link1: '../assets/vid/cnmd.mp4', link2: '#' },
        { title: '未知', link1: '../assets/vid/dxmsrtfl.mp4', link2: '#' },
        { title: '未知', link1: '../assets/vid/jbym.mp4', link2: '#' },
        { title: '未知', link1: '../assets/vid/ksh.mp4', link2: '#' },
        { title: '未知', link1: '../assets/vid/LSMM.mp4', link2: '#' },
        { title: '未知', link1: '../assets/vid/LSMM2.mp4', link2: '#' },
        { title: '未知', link1: '../assets/vid/mmmppp.mp4', link2: '#' },
        { title: '未知', link1: '../assets/vid/qhy.mp4', link2: '#' },
        { title: '未知', link1: '../assets/vid/w7a.mp4', link2: '#' },
        { title: '未知', link1: '../assets/vid/WTX.mp4', link2: '#' },
        { title: '未知', link1: '../assets/vid/wzmc88.mp4', link2: '#' }
    ];

    var container = document.getElementById('video-list');
    if (!container) return;

    var html = '';
    videoList.forEach(function(item) {
        html += '<li>';
        html += '<span class="vid-title"><a href="' + item.link1 + '">' + item.title + '</a></span>';
        html += '<span class="vid-links"><a href="' + item.link1 + '">[通道1]</a>&nbsp;&nbsp;&nbsp;&nbsp;<a href="' + item.link2 + '">[通道2]</a></span>';
        html += '</li>';
    });
    
    container.innerHTML = html;
});