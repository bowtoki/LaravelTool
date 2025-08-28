
function formatOutput() {
    const outputEditor = document.getElementById('editor-output');
    
    try {
        const jsonString = outputEditor.value.trim();
        if (!jsonString) {
            showNotification('Output trống, không thể format', 'warning');
            return;
        }
        
        const jsonObject = JSON.parse(jsonString);
        const formattedJSON = JSON.stringify(jsonObject, null, currentIndentation);
        
        outputEditor.value = formattedJSON;
        showNotification('Output đã được format!', 'success');
    } catch (error) {
        showNotification('Output không phải JSON hợp lệ', 'warning');
    }
}

function compactOutput() {
    const outputEditor = document.getElementById('editor-output');
    
    try {
        const jsonString = outputEditor.value.trim();
        if (!jsonString) {
            showNotification('Output trống, không thể compact', 'warning');
            return;
        }
        
        const jsonObject = JSON.parse(jsonString);
        const compactJSON = JSON.stringify(jsonObject);
        
        outputEditor.value = compactJSON;
        showNotification('Output đã được compact!', 'success');
    } catch (error) {
        showNotification('Output không phải JSON hợp lệ', 'warning');
    }
}


function sortOutput() {
    const outputEditor = document.getElementById('editor-output');
    
    try {
        const jsonString = outputEditor.value.trim();
        if (!jsonString) {
            showNotification('Output trống, không thể sort', 'warning');
            return;
        }
        
        const jsonObject = JSON.parse(jsonString);
        const sortedJSON = sortObjectKeys(jsonObject);
        const formattedSortedJSON = JSON.stringify(sortedJSON, null, currentIndentation);
        
        outputEditor.value = formattedSortedJSON;
        showNotification('Output đã được sort!', 'success');
    } catch (error) {
        showNotification('Output không phải JSON hợp lệ', 'warning');
    }
}

function repairOutput() {
    const outputEditor = document.getElementById('editor-output');
    
    try {
        let jsonString = outputEditor.value.trim();
        if (!jsonString) {
            showNotification('Output trống, không thể repair', 'warning');
            return;
        }
        
        jsonString = repairJSONString(jsonString);
        const jsonObject = JSON.parse(jsonString);
        const repairedJSON = JSON.stringify(jsonObject, null, currentIndentation);
        
        outputEditor.value = repairedJSON;
        showNotification('Output đã được repair!', 'success');
    } catch (error) {
        showNotification('Không thể repair output: ' + error.message, 'error');
    }
}

function copyOutput() {
    const outputEditor = document.getElementById('editor-output');
    if (outputEditor) {
        outputEditor.select();
        document.execCommand('copy');
        showNotification('Đã copy output vào clipboard!', 'success');
    }
}

function clearOutput() {
    const outputEditor = document.getElementById('editor-output');
    if (outputEditor) {
        outputEditor.value = '';
        showNotification('Output đã được xóa', 'info');
    }
}

function downloadOutput() {
    const outputEditor = document.getElementById('editor-output');
    if (outputEditor && outputEditor.value) {
        const blob = new Blob([outputEditor.value], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'output.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showNotification('Output đã được download!', 'success');
    } else {
        showNotification('Không có output để download', 'warning');
    }
}

function changeOutputTreeMode() {
    showNotification('Tree mode chưa được implement', 'info');
}

function sortObjectKeys(obj) {
    if (Array.isArray(obj)) {
        return obj.map(item => typeof item === 'object' && item !== null ? sortObjectKeys(item) : item);
    } else if (typeof obj === 'object' && obj !== null) {
        const sortedObj = {};
        const keys = Object.keys(obj).sort();
        for (const key of keys) {
            sortedObj[key] = typeof obj[key] === 'object' && obj[key] !== null ? sortObjectKeys(obj[key]) : obj[key];
        }
        return sortedObj;
    }
    return obj;
}


function repairJSONString(str) {
    str = str.replace(/\/\*[\s\S]*?\*\//g, '');
    str = str.replace(/\/\/.*$/gm, '');
    str = str.replace(/^[^{[]*/, '');
    str = str.replace(/[^}\]]*$/, '');
    str = str.replace(/'/g, '"');
    str = str.replace(/([{,]\s*)([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/g, '$1"$2":');
    return str;
}