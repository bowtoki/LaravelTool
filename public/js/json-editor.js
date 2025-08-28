
let undoStack = [];
let redoStack = [];
let currentIndentation = 2;
let isFullscreen = false;
const inputEditor = document.getElementById('editor-input');
const outputEditor = document.getElementById('editor-output');

document.addEventListener('DOMContentLoaded', function() {
    initializeEditor();
    addKeyboardShortcuts();
    updateCursorPosition();
});


function initializeEditor() {
    if (inputEditor) {
        inputEditor.addEventListener('keyup', updateCursorPosition);
        inputEditor.addEventListener('click', updateCursorPosition);
        inputEditor.addEventListener('input', function() {
            saveState();
        });
    }
    
    if (outputEditor) {
        outputEditor.addEventListener('keyup', updateOutputCursorPosition);
        outputEditor.addEventListener('click', updateOutputCursorPosition);
    }
}

function addKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'i' && !e.shiftKey) {
            e.preventDefault();
            formatJSON();
        } else if (e.ctrlKey && e.shiftKey && e.key === 'I') {
            e.preventDefault();
            compactJSON();
        } else if (e.ctrlKey && e.key === 'z' && !e.shiftKey) {
            e.preventDefault();
            undoAction();
        } else if (e.ctrlKey && e.shiftKey && e.key === 'Z') {
            e.preventDefault();
            redoAction();
        } else if (e.ctrlKey && e.key === 'p') {
            e.preventDefault();
            printJSON();
        }
    });
}

function saveState() {
    const currentValue = inputEditor.value;
    if (undoStack.length === 0 || undoStack[undoStack.length - 1] !== currentValue) {
        undoStack.push(currentValue);
        if (undoStack.length > 50) {
            undoStack.shift();
        }
        redoStack = [];
        updateUndoRedoButtons();
    }
}


function convertJSONToXML(obj, rootName = 'root') {
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<${rootName}>`;
    
    function objectToXML(obj, indent = 1) {
        let result = '';
        const indentStr = '  '.repeat(indent);
        
        for (const [key, value] of Object.entries(obj)) {
            if (Array.isArray(value)) {
                value.forEach(item => {
                    result += `\n${indentStr}<${key}>`;
                    if (typeof item === 'object' && item !== null) {
                        result += objectToXML(item, indent + 1);
                        result += `\n${indentStr}`;
                    } else {
                        result += item;
                    }
                    result += `</${key}>`;
                });
            } else if (typeof value === 'object' && value !== null) {
                result += `\n${indentStr}<${key}>`;
                result += objectToXML(value, indent + 1);
                result += `\n${indentStr}</${key}>`;
            } else {
                result += `\n${indentStr}<${key}>${value}</${key}>`;
            }
        }
        return result;
    }
    
    xml += objectToXML(obj);
    xml += `\n</${rootName}>`;
    return xml;
}

function convertJSONToCSV(jsonArray) {
    if (!Array.isArray(jsonArray)) jsonArray = [jsonArray];
    if (jsonArray.length === 0) return '';
    
    const allKeys = new Set();
    jsonArray.forEach(obj => {
        if (typeof obj === 'object' && obj !== null) {
            Object.keys(obj).forEach(key => allKeys.add(key));
        }
    });
    
    const keys = Array.from(allKeys);
    let csv = keys.join(',') + '\n';
    
    jsonArray.forEach(obj => {
        const row = keys.map(key => {
            const value = obj && typeof obj === 'object' ? obj[key] : '';
            return typeof value === 'string' && value.includes(',') ? `"${value}"` : value || '';
        });
        csv += row.join(',') + '\n';
    });
    
    return csv;
}

function convertJSONToYAML(obj, indent = 0) {
    const indentStr = '  '.repeat(indent);
    let yaml = '';
    
    if (Array.isArray(obj)) {
        obj.forEach(item => {
            yaml += `${indentStr}- `;
            if (typeof item === 'object' && item !== null) {
                yaml += '\n' + convertJSONToYAML(item, indent + 1);
            } else {
                yaml += `${item}\n`;
            }
        });
    } else if (typeof obj === 'object' && obj !== null) {
        Object.entries(obj).forEach(([key, value]) => {
            yaml += `${indentStr}${key}: `;
            if (typeof value === 'object' && value !== null) {
                yaml += '\n' + convertJSONToYAML(value, indent + 1);
            } else {
                yaml += `${value}\n`;
            }
        });
    } else {
        yaml += `${indentStr}${obj}\n`;
    }
    
    return yaml;
}

function updateUndoRedoButtons() {
    const undoBtn = document.querySelector('.jsoneditor-undo');
    const redoBtn = document.querySelector('.jsoneditor-redo');
    
    if (undoBtn) undoBtn.disabled = undoStack.length === 0;
    if (redoBtn) redoBtn.disabled = redoStack.length === 0;
}

function toggleFullscreen(type) {
    const element = type === 'input' ? document.getElementById('inputdiv') : document.getElementById('outputdiv');
    const fullscreenBtn = document.getElementById(`${type}FullScreen`);
    const closeBtn = document.getElementById(`${type}CloseScreen`);
    
    if (!isFullscreen) {
        element.style.position = 'fixed';
        element.style.top = '0';
        element.style.left = '0';
        element.style.width = '100vw';
        element.style.height = '100vh';
        element.style.zIndex = '9999';
        element.style.backgroundColor = '#fff';
        
        fullscreenBtn.style.display = 'none';
        closeBtn.style.display = 'block';
        isFullscreen = true;
    } else {
        element.style.position = '';
        element.style.top = '';
        element.style.left = '';
        element.style.width = '';
        element.style.height = '';
        element.style.zIndex = '';
        element.style.backgroundColor = '';
        
        fullscreenBtn.style.display = 'block';
        closeBtn.style.display = 'none';
        isFullscreen = false;
    }
}

function updateCursorPosition() {
    const inputEditor = document.getElementById('editor-input');
    const lineSpan = document.getElementById('input-line');
    const colSpan = document.getElementById('input-col');
    
    if (inputEditor && lineSpan && colSpan) {
        const cursorPosition = inputEditor.selectionStart;
        const textBeforeCursor = inputEditor.value.substring(0, cursorPosition);
        const lines = textBeforeCursor.split('\n');
        
        lineSpan.textContent = lines.length;
        colSpan.textContent = lines[lines.length - 1].length + 1;
    }
}

function updateOutputCursorPosition() {
    const outputEditor = document.getElementById('editor-output');
    const lineSpan = document.getElementById('output-line');
    const colSpan = document.getElementById('output-col');
    
    if (outputEditor && lineSpan && colSpan) {
        const cursorPosition = outputEditor.selectionStart;
        const textBeforeCursor = outputEditor.value.substring(0, cursorPosition);
        const lines = textBeforeCursor.split('\n');
        
        lineSpan.textContent = lines.length;
        colSpan.textContent = lines[lines.length - 1].length + 1;
    }
}

function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    if (notification) {
        notification.textContent = message;
        notification.className = `notification ${type}`;
        notification.style.display = 'block';
        
        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000);
    } else {
        console.log(`${type.toUpperCase()}: ${message}`);
    }
}

document.addEventListener('click', function(event) {
    const dropdown = document.getElementById('convertDropdown');
    const dropdownBtn = event.target.closest('.dropdown-toggle');
    
    if (!dropdownBtn && dropdown && dropdown.style.display === 'block') {
        dropdown.style.display = 'none';
    }
});


const toggleBtn = document.getElementById("modeToggle");
const dropdown = document.getElementById("modeDropdown");
const modeLinks = dropdown.querySelectorAll("a");
const outputArea = document.getElementById("editor-output");

let currentJSON = {};

try {
    currentJSON = JSON.parse(outputArea.value);
} catch(e) {
    currentJSON = {}; 
}

function renderJSON(mode) {
    const jsonData = currentJSON;
    let result = '';

    switch(mode) {
        case 'code':
            result = JSON.stringify(jsonData, null, 2);
            break;
        case 'text':
            result = JSON.stringify(jsonData);
            break;
        case 'tree':
            result = renderTree(jsonData);
            break;
        case 'view':
            for(let key in jsonData){
                result += `${key}: ${JSON.stringify(jsonData[key])}\n`;
            }
            break;
        case 'form':
            function formView(obj, prefix=''){
                let str = '';
                for(let key in obj){
                    const fullKey = prefix ? prefix + '.' + key : key;
                    if(typeof obj[key] === 'object' && obj[key] !== null){
                        str += formView(obj[key], fullKey);
                    } else {
                        str += `${fullKey} = ${obj[key]}\n`;
                    }
                }
                return str;
            }
            result = formView(jsonData);
            break;
        default:
            result = JSON.stringify(jsonData, null, 2);
    }

    outputArea.value = result;
}


function updateJSON() {
    try {
        const parsed = JSON.parse(outputArea.value);
        currentJSON = parsed;
    } catch(e) {
        // alert("JSON không hợp lệ!");
    }
}

modeLinks.forEach(link => {
    link.addEventListener("click", function(e) {
        e.preventDefault();
        e.stopPropagation();

        const mode = link.getAttribute("data-mode");
        updateJSON();
        renderJSON(mode);
        toggleBtn.textContent = link.textContent + " ▾";
        dropdown.style.display = "none";
    });
});

toggleBtn.addEventListener("click", function(e) {
    e.stopPropagation();
    dropdown.style.display = (dropdown.style.display === "block") ? "none" : "block";
});

document.addEventListener("click", function() {
    dropdown.style.display = "none";
});


function renderTree(obj, indent = 0) {
    let str = '';
    for (let key in obj) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
            str += ' '.repeat(indent) + key + ":\n";
            str += renderTree(obj[key], indent + 2);
        } else {
            str += ' '.repeat(indent) + key + ": " + obj[key] + "\n";
        }
    }
    return str;
}

let isTreeView = false;
let tempJSONText = '';  

function changeOutputTree() {
    if (!isTreeView) {
        try {
            tempJSONText = outputArea.value;        
            const tempJSON = JSON.parse(outputArea.value);
            outputArea.value = renderTree(tempJSON); 
            isTreeView = true;
        } catch(e) {
            alert("JSON không hợp lệ!");
        }
    } else {
        outputArea.value = tempJSONText;
        isTreeView = false;
    }
}