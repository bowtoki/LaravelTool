function formatJSON() {
    try {
        const jsonString = inputEditor.value.trim();
        if (!jsonString) {
            showNotification('Vui lòng nhập JSON để format', 'warning');
            return;
        }
        
        saveState();
        const jsonObject = JSON.parse(jsonString);
        const formattedJSON = JSON.stringify(jsonObject, null, currentIndentation);
        
        inputEditor.value = formattedJSON;
        showNotification('JSON đã được format thành công!', 'success');
    } catch (error) {
        showNotification('JSON không hợp lệ: ' + error.message, 'error');
    }
}

function compactJSON() {
    try {
        const jsonString = inputEditor.value.trim();
        if (!jsonString) {
            showNotification('Vui lòng nhập JSON để compact', 'warning');
            return;
        }
        
        saveState();
        const jsonObject = JSON.parse(jsonString);
        const compactJSON = JSON.stringify(jsonObject);
        
        inputEditor.value = compactJSON;
        showNotification('JSON đã được compact thành công!', 'success');
    } catch (error) {
        showNotification('JSON không hợp lệ: ' + error.message, 'error');
    }
}

function sortJSON() {
    try {
        const jsonString = inputEditor.value.trim();
        if (!jsonString) {
            showNotification('Vui lòng nhập JSON để sort', 'warning');
            return;
        }
        saveState();
        const jsonObject = JSON.parse(jsonString);
        const sortedJSON = sortObjectKeys(jsonObject);
        const formattedSortedJSON = JSON.stringify(sortedJSON, null, currentIndentation);
        
        inputEditor.value = formattedSortedJSON;
        showNotification('JSON đã được sort thành công!', 'success');
    } catch (error) {
        showNotification('JSON không hợp lệ: ' + error.message, 'error');
    }
}

function repairJSON() {
    const inputEditor = document.getElementById('editor-input');
    
    try {
        let jsonString = inputEditor.value.trim();
        if (!jsonString) {
            showNotification('Vui lòng nhập JSON để repair', 'warning');
            return;
        }
        
        saveState();
        jsonString = repairJSONString(jsonString);
        const jsonObject = JSON.parse(jsonString);
        const repairedJSON = JSON.stringify(jsonObject, null, currentIndentation);
        
        inputEditor.value = repairedJSON;
        showNotification('JSON đã được repair thành công!', 'success');
    } catch (error) {
        showNotification('Không thể repair JSON: ' + error.message, 'error');
    }
}

function undoAction() {
    const inputEditor = document.getElementById('editor-input');
    
    if (undoStack.length > 0) {
        const currentValue = inputEditor.value;
        const previousValue = undoStack.pop();
        
        redoStack.push(currentValue);
        inputEditor.value = previousValue;
        
        updateUndoRedoButtons();
        showNotification('Đã undo thành công!', 'info');
    } else {
        showNotification('Không có action nào để undo', 'warning');
    }
}

function redoAction() {
    const inputEditor = document.getElementById('editor-input');
    
    if (redoStack.length > 0) {
        const currentValue = inputEditor.value;
        const redoValue = redoStack.pop();
        
        undoStack.push(currentValue);
        inputEditor.value = redoValue;
        
        updateUndoRedoButtons();
        showNotification('Đã redo thành công!', 'info');
    } else {
        showNotification('Không có action nào để redo', 'warning');
    }
}

function loadJSONSampleData() {
    const inputEditor = document.getElementById('editor-input');
    const sampleData = {
        "name": "John Doe",
        "age": 30,
        "email": "john.doe@example.com",
        "address": {
            "street": "123 Main St",
            "city": "New York",
            "zipCode": "10001"
        },
        "hobbies": ["reading", "swimming", "coding"],
        "isActive": true,
        "salary": 50000.50
    };
    
    saveState();
    inputEditor.value = JSON.stringify(sampleData, null, 2);
    showNotification('Sample JSON data đã được load!', 'success');
}

function openFile() {
    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
        fileInput.click();
    }
}

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const inputEditor = document.getElementById('editor-input');
            saveState();
            inputEditor.value = e.target.result;
            showNotification(`File "${file.name}" đã được load!`, 'success');
        };
        reader.readAsText(file);
    }
}

function saveJSON() {
    const inputEditor = document.getElementById('editor-input');
    const jsonString = inputEditor.value.trim();
    
    if (!jsonString) {
        showNotification('Không có dữ liệu để save', 'warning');
        return;
    }
    
    try {
        JSON.parse(jsonString);
        
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'data.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showNotification('JSON đã được save!', 'success');
    } catch (error) {
        showNotification('JSON không hợp lệ, không thể save: ' + error.message, 'error');
    }
}

function printJSON() {
    const inputEditor = document.getElementById('editor-input');
    const jsonString = inputEditor.value.trim();
    
    if (!jsonString) {
        showNotification('Không có dữ liệu để print', 'warning');
        return;
    }
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
            <head>
                <title>Print JSON</title>
                <style>
                    body { font-family: monospace; white-space: pre-wrap; margin: 20px; }
                </style>
            </head>
            <body>${jsonString}</body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}

function copyInput() {
    const inputEditor = document.getElementById('editor-input');
    inputEditor.select();
    document.execCommand('copy');
    showNotification('Đã copy input vào clipboard!', 'success');
}

function clearInput() {
    const inputEditor = document.getElementById('editor-input');
    saveState();
    inputEditor.value = '';
    showNotification('Input đã được xóa', 'info');
}

