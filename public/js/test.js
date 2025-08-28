const getCSRFToken = () => document.querySelector('meta[name="csrf-token"]').getAttribute('content');

function showNotification(msg, type = 'success') {
    const n = document.getElementById('notification');
    n.innerText = msg;
    n.style.display = 'block';
    n.style.background = type === 'error' ? '#f8d7da' : '#d1e7dd';
    setTimeout(() => n.style.display = 'none', 3000);
}

function getInputJSON() {
    return document.getElementById('editor-input').value;
}

function setInputJSON(value) {
    document.getElementById('editor-output').value = value;
}

function beautifyJSON() {
    const json = getInputJSON();
    const indent = document.getElementById('sel1').value;
    fetch('/json-editor/beautify', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': getCSRFToken()
        },
        body: JSON.stringify({ json: json, indent: indent })
    })
    .then(res => res.json())
    .then(data => {
        if (data.json) setInputJSON(data.json);
        else showNotification(data.error, 'error');
    });
}

function minifyJSON() {
    const json = getInputJSON();
    fetch('/json-editor/minify', {
        method: 'POST',
        headers: {'Content-Type':'application/json','X-CSRF-TOKEN': getCSRFToken()},
        body: JSON.stringify({json: json})
    })
    .then(res => res.json())
    .then(data => {
        if (data.json) setInputJSON(data.json);
        else showNotification(data.error, 'error');
    });
}

function validateJSON() {
    const json = getInputJSON();
    fetch('/json-editor/validate', {
        method:'POST',
        headers: {'Content-Type':'application/json','X-CSRF-TOKEN': getCSRFToken()},
        body: JSON.stringify({json: json})
    })
    .then(res=>res.json())
    .then(data=>{
        if(data.valid) showNotification('JSON hợp lệ!');
        else showNotification('Lỗi JSON: ' + data.error, 'error');
    });
}

function convertToXML() { convertJSON('/json-editor/xml'); }
function convertToCSV() { convertJSON('/json-editor/csv'); }
function convertToYAML() { convertJSON('/json-editor/yaml'); }

function convertJSON(url) {
    const json = getInputJSON();
    fetch(url, {
        method:'POST',
        headers:{'Content-Type':'application/json','X-CSRF-TOKEN': getCSRFToken()},
        body: JSON.stringify({json: json})
    })
    .then(res=>{
        if(url.includes('xml')) return res.text();
        if(url.includes('csv')) return res.text();
        if(url.includes('yaml')) return res.text();
    })
    .then(data=>{
        document.getElementById('editor-output').value = data;
    });
}

function downloadJSON() {
    const json = getInputJSON();
    fetch('/json-editor/download', {
        method:'POST',
        headers:{'Content-Type':'application/json','X-CSRF-TOKEN': getCSRFToken()},
        body: JSON.stringify({json: json})
    })
    .then(res=>res.blob())
    .then(blob=>{
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'data.json';
        a.click();
        window.URL.revokeObjectURL(url);
    });
}

function uploadData() {
    const url = prompt('Nhập URL của JSON file (hoặc bấm Cancel để chọn file từ máy):');
    
    if (url) {
        fetch(url)
            .then(res => {
                if (!res.ok) throw new Error('Không thể tải file từ URL');
                return res.text();
            })
            .then(data => {
                document.getElementById('editor-input').value = data;
            })
            .catch(err => alert('Error: ' + err.message));
    } else {
        document.getElementById('fileInput').click();
    }
}

document.getElementById('fileInput').addEventListener('change', function(evt) {
    const file = evt.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        document.getElementById('editor-input').value = e.target.result;
    };
    reader.readAsText(file);
});
