document.addEventListener('DOMContentLoaded', function() {
    var modal = document.createElement('div');
    modal.id = 'video-modal';
    
    var header = document.createElement('div');
    header.className = 'modal-header';
    
    var titleSpan = document.createElement('span');
    titleSpan.id = 'modal-title';
    
    var closeBtn = document.createElement('button');
    closeBtn.className = 'close-btn';
    closeBtn.innerHTML = '✕';
    
    header.appendChild(titleSpan);
    header.appendChild(closeBtn);
    
    var player = document.createElement('video');
    player.id = 'modal-player';
    player.controls = true;
    player.preload = 'none';
    
    var loadingLayer = document.createElement('div');
    loadingLayer.id = 'video-loading';
    
    var loadingText = document.createElement('div');
    loadingText.className = 'loading-text';
    loadingText.innerText = '正在加载 0%';
    
    var progressTrack = document.createElement('div');
    progressTrack.className = 'progress-track';
    
    var progressFill = document.createElement('div');
    progressFill.className = 'progress-fill';
    
    var cancelBtn = document.createElement('button');
    cancelBtn.className = 'cancel-btn';
    cancelBtn.innerText = '取消加载';
    
    progressTrack.appendChild(progressFill);
    loadingLayer.appendChild(loadingText);
    loadingLayer.appendChild(progressTrack);
    loadingLayer.appendChild(cancelBtn);
    
    modal.appendChild(header);
    modal.appendChild(loadingLayer);
    modal.appendChild(player);
    document.body.appendChild(modal);

    var currentBlobUrl = '';
    var abortController = null;

    function startLoading(title, url) {
        titleSpan.innerText = title;
        
        if (abortController) {
            abortController.abort();
        }
        abortController = new AbortController();
        
        if (currentBlobUrl) {
            URL.revokeObjectURL(currentBlobUrl);
            currentBlobUrl = '';
        }
        
        player.pause();
        player.src = '';
        player.style.display = 'none';
        loadingLayer.style.display = 'flex';
        loadingText.innerText = '正在加载 0%';
        progressFill.style.width = '0%';
        
        fetch(url, { signal: abortController.signal })
            .then(function(response) {
                if (!response.ok) throw new Error('Network response was not ok');
                var contentLength = response.headers.get('content-length');
                var total = contentLength ? parseInt(contentLength, 10) : 0;
                var reader = response.body.getReader();
                var chunks = [];
                var receivedLength = 0;
                
                function read() {
                    return reader.read().then(function(result) {
                        if (result.done) {
                            return new Blob(chunks, { type: 'video/mp4' });
                        }
                        chunks.push(result.value);
                        receivedLength += result.value.length;
                        
                        if (total) {
                            var percent = Math.round((receivedLength / total) * 100);
                            loadingText.innerText = '正在加载 ' + percent + '%';
                            progressFill.style.width = percent + '%';
                        } else {
                            var mb = (receivedLength / 1024 / 1024).toFixed(1);
                            loadingText.innerText = '已加载 ' + mb + ' MB';
                        }
                        return read();
                    });
                }
                return read();
            })
            .then(function(blob) {
                currentBlobUrl = URL.createObjectURL(blob);
                player.src = currentBlobUrl;
                player.style.display = 'block';
                loadingLayer.style.display = 'none';
                player.play().catch(function(e) {
                    console.log('自动播放被阻止，请手动点击播放');
                });
            })
            .catch(function(err) {
                if (err.name === 'AbortError') {
                    return;
                }
                loadingLayer.style.display = 'none';
                player.src = url;
                player.style.display = 'block';
                player.play().catch(function(e) {
                    console.log('自动播放被阻止，请手动点击播放');
                });
            });
    }

    function closeModal() {
        if (abortController) {
            abortController.abort();
            abortController = null;
        }
        player.pause();
        player.src = '';
        if (currentBlobUrl) {
            URL.revokeObjectURL(currentBlobUrl);
            currentBlobUrl = '';
        }
        modal.style.display = 'none';
        player.style.display = 'none';
        loadingLayer.style.display = 'none';
    }

    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    var links = document.querySelectorAll('.menu-container a');
    
    links.forEach(function(link) {
        if (link.href.endsWith('.mp4')) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                var li = this.closest('li');
                if (!li) return;
                
                var titleLink = li.querySelector('.vid-title a');
                var title = titleLink ? titleLink.innerText : '视频';
                
                var startUrl = this.href;
                
                if (startUrl) {
                    modal.style.display = 'flex';
                    startLoading(title, startUrl);
                }
            });
        }
    });
});