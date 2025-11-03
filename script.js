document.addEventListener('DOMContentLoaded', function() {
    
    // QRコードを初期化
    const qrcode = new QRCode(document.getElementById("qrcode"), {
        width : 128,
        height : 128
    });

    // ページ読み込み時にURLからリストを復元
    loadListFromURL();

    // 抽選ボタンの処理
    document.getElementById('drawButton').addEventListener('click', function() {
        const listItems = document.getElementById('listDisplay').getElementsByTagName('li');
        const participants = Array.from(listItems).map(li => li.textContent);
        
        const winnerDisplay = document.getElementById('winner');
        
        if (participants.length === 0) {
            winnerDisplay.textContent = '参加者がいません';
            return;
        }
        
        // 抽選アニメーション
        winnerDisplay.textContent = '抽選中...';
        let shuffleCount = 0;
        const maxShuffles = 10 + Math.floor(Math.random() * 5); // アニメーション回数

        const shuffleAnimation = setInterval(() => {
            const randomIndex = Math.floor(Math.random() * participants.length);
            winnerDisplay.textContent = participants[randomIndex];
            shuffleCount++;
            
            if (shuffleCount >= maxShuffles) {
                clearInterval(shuffleAnimation);
                // 最終的な当選者を決定
                const finalRandomIndex = Math.floor(Math.random() * participants.length);
                winnerDisplay.textContent = participants[finalRandomIndex];
            }
        }, 100);
    });

    // 修正箇所：「編集」ボタンの処理 (startEdit) を丸ごと削除

    // リスト保存ボタンの処理
    document.getElementById('saveList').addEventListener('click', function() {
        const inputText = document.getElementById('listInput').value;
        const items = inputText.split('\n').filter(item => item.trim() !== '');
        
        const listDisplay = document.getElementById('listDisplay');
        listDisplay.innerHTML = ''; // リストをクリア
        
        items.forEach(itemText => {
            const li = document.createElement('li');
            li.textContent = itemText;
            listDisplay.appendChild(li);
        });
        
        // 修正箇所：フォームを非表示にする処理を削除
        
        // URLを更新
        updateURL();
    });

    // 共有URLとQRコードを更新する関数
    function updateURL() {
        const listItems = Array.from(document.getElementById('listDisplay').getElementsByTagName('li'));
        const listData = listItems.map(li => li.textContent).join(',');
        
        if (listData) {
            // Base64エンコード
            const encodedList = btoa(encodeURIComponent(listData));
            const shareURL = window.location.origin + window.location.pathname + '?list=' + encodedList;
            
            document.getElementById('shareURL').value = shareURL;
            qrcode.makeCode(shareURL);
        } else {
            // リストが空の場合
            const shareURL = window.location.origin + window.location.pathname;
            document.getElementById('shareURL').value = shareURL;
            qrcode.makeCode(shareURL);
        }
    }

    // URLからリストを読み込む関数
    function loadListFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        const listParam = urlParams.get('list');
        const listInput = document.getElementById('listInput');
        
        if (listParam) {
            try {
                // デコード
                const decodedList = decodeURIComponent(atob(listParam));
                const items = decodedList.split(',');
                const listDisplay = document.getElementById('listDisplay');
                listDisplay.innerHTML = ''; // クリア
                
                items.forEach(itemText => {
                    if(itemText.trim() !== '') {
                        const li = document.createElement('li');
                        li.textContent = itemText;
                        listDisplay.appendChild(li);
                    }
                });
                
                // 修正箇所：フォームにも読み込んだリストを反映
                listInput.value = items.join('\n');

            } catch (e) {
                console.error('URLデコード失敗:', e);
            }
            
            // URLを（再）生成してQRコードを表示
            updateURL();
        } else {
            // URLにリストがない場合
            
            // 修正箇所：初期状態でもQRコードを生成するために updateURL() を呼ぶ
            updateURL();
        }
    }
});
