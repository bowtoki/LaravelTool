@extends('layouts.app')

@section('title', 'JSON Editor - Laravel')

@section('content')
<div class="row">
    <div id="inputdiv" class="col-lg-5">
        <div id="inputeditor" tabindex="-1" class="jsoneditor-manual">
            <div class="jsoneditor jsoneditor-mode-code">
                <div class="jsoneditor-menu">
                    <button type="button" class="jsoneditor-format" title="Format JSON data, with proper indentation and line feeds (Ctrl+I)" onclick="formatJSON()">
                        <i class="fa fa-align-center"></i>
                    </button>
                    <button type="button" class="jsoneditor-compact" title="Compact JSON data, remove all whitespaces (Ctrl+Shift+I)" onclick="compactJSON()">
                        <i class="fa fa-align-left"></i>
                    </button>
                    <button type="button" class="jsoneditor-sort" title="Sort contents" onclick="sortJSON()">
                        <i class="fa fa-sort-alpha-asc"></i>
                    </button>
                    <button type="button" title="Filter, sort, or transform contents" class="jsoneditor-transform">
                        <i class="fa fa-filter"></i>
                    </button>
                    <button type="button" class="jsoneditor-repair" title="Repair JSON: fix quotes and escape characters, remove comments and JSONP notation, turn JavaScript objects into JSON." onclick="repairJSON()">
                        <i class="fa fa-wrench"></i>
                    </button>
                    <button type="button" class="jsoneditor-undo jsoneditor-separator" title="Undo last action (Ctrl+Z)" disabled onclick="undoAction()">
                        <i class="fa fa-undo"></i>
                    </button>
                    <button type="button" class="jsoneditor-redo" title="Redo (Ctrl+Shift+Z)" disabled onclick="redoAction()">
                        <i class="fa fa-repeat"></i>
                    </button>
                    <div class="btn-group btn-group-sm right hidden-xs">
                        <a href="#" id="sampleDataBtn" title="Sample JSON Data" class="poweredBy" onclick="loadJSONSampleData();">Sample</a>
                        <div id="jsonGraph" class="cursor-pointer btn-sm fa fa-usb" title="JSON Graph"></div>
                        <div id="fileopen" class="cursor-pointer btn-sm fa fa-folder-open" title="Open File" onclick="openFile()"></div>
                        <div class="cursor-pointer btn-sm fa fa-floppy-o" title="Save online" onclick="saveJSON()"></div>
                        <div class="cursor-pointer btn-sm fa fa-check" title="JSON Validator" onclick="validateJSON()"></div>
                        <div class="cursor-pointer btn-sm fa fa-print" title="Print JSON" onclick="printJSON()"></div>
                        <div class="cursor-pointer btn-sm fa fa-times" title="Clear" onclick="clearInput()"></div>
                        <div id="inputcopy" title="Copy to Clipboard" class="cursor-pointer btn-sm btn-shrink fa fa-files-o" onclick="copyInput()"></div>
                        <div id="inputFullScreen" title="fullscreen" onclick="toggleFullscreen('input');" class="cursor-pointer btn-sm btn-fullscreen fa fa-arrows-alt"></div>
                        <div id="inputCloseScreen" title="Close" onclick="toggleFullscreen('input');" style="display:none" class="cursor-pointer btn-sm btn-fullscreen fa fa-window-close"></div>
                    </div>
                </div>
                <div class="jsoneditor-outer has-main-menu-bar has-status-bar">
                    <div class="ace_editor ace_hidpi ace-jsoneditor">
                        <textarea id="editor-input" placeholder="Nhập JSON của bạn vào đây..."></textarea>
                    </div>
                </div>
                <div class="jsoneditor-statusbar">
                    <span class="jsoneditor-curserinfo-label">Ln:</span>
                    <span class="jsoneditor-curserinfo-val" id="input-line">1</span>
                    <span class="jsoneditor-curserinfo-label">Col:</span>
                    <span class="jsoneditor-curserinfo-val" id="input-col">1</span>
                </div>
            </div>
        </div>
    </div>

    <div class="col-lg-2">
        <button type="button" class="btn btn-xs btn-outline btn-block" onclick="uploadData()" title="JSON URL or Browse File">Upload Data</button>
        <button type="button" class="btn btn-xs btn-outline btn-block" onclick="validateJSON();" title="JSON Validator">Validate</button>
        <div class="form-group">
            <select class="form-control" id="sel1" onchange="changeIndentation()">
                <option value="2" selected>2 Tab Space</option>
                <option value="3">3 Tab Space</option>
                <option value="4">4 Tab Space</option>
            </select>
        </div>
        <button type="button" id="defaultaction" class="btn btn-xs btn-outline btn-block" onclick="beautifyJSON();" title="JSON Formatter">Format / Beautify</button>
        <button type="button" class="btn btn-xs btn-outline btn-block" onclick="minifyJSON();" title="JSON Minify or JSON Compact">Minify / Compact</button>
        <div class="dropdown w-100">
            <button class="btn dropdown-toggle" 
                    type="button" 
                    id="convertDropdownBtn" 
                    data-bs-toggle="dropdown" 
                    aria-expanded="false">
                Convert JSON to
            </button>
            <ul class="dropdown-menu w-100" aria-labelledby="convertDropdownBtn">
                <li><a class="dropdown-item" href="#" onclick="convertToXML();">JSON to XML</a></li>
                <li><a class="dropdown-item" href="#" onclick="convertToCSV();">JSON to CSV</a></li>
                <li><a class="dropdown-item" href="#" onclick="convertToYAML();">JSON to YAML</a></li>
            </ul>
        </div>

        <button type="button" class="btn btn-xs btn-outline btn-block hidden-xs" onclick="downloadJSON();" title="JSON Download">Download</button>

        <p class="text-center">
            <a style="color:black;font-size: 16px;" href="#" target="_blank">JSON Full Form</a>
        </p>
    </div>

    <div id="outputdiv" class="col-lg-5">
        <div id="outputeditor" tabindex="-1" class="jsoneditor-manual">
            <div class="jsoneditor jsoneditor-mode-code">
                <div class="jsoneditor-menu">
                    <button type="button" class="jsoneditor-format" title="Format JSON data, with proper indentation and line feeds (Ctrl+I)" onclick="formatOutput()">
                        <i class="fa fa-indent"></i>
                    </button>
                    <button type="button" class="jsoneditor-compact" title="Compact JSON data, remove all whitespaces (Ctrl+Shift+I)" onclick="compactOutput()">
                        <i class="fa fa-compress"></i>
                    </button>
                    <button type="button" class="jsoneditor-sort" title="Sort contents" onclick="sortOutput()">
                        <i class="fa fa-sort-alpha-asc"></i>
                    </button>
                    <button type="button" title="Filter, sort, or transform contents" class="jsoneditor-transform">
                        <i class="fa fa-filter"></i>
                    </button>
                    <button type="button" class="jsoneditor-repair" title="Repair JSON: fix quotes and escape characters, remove comments and JSONP notation, turn JavaScript objects into JSON." onclick="repairOutput()">
                        <i class="fa fa-wrench"></i>
                    </button>
                    <button type="button" class="jsoneditor-undo jsoneditor-separator" title="Undo last action (Ctrl+Z)" disabled>
                        <i class="fa fa-undo"></i>
                    </button>
                    <button type="button" class="jsoneditor-redo" title="Redo (Ctrl+Shift+Z)" disabled>
                        <i class="fa fa-repeat"></i>
                    </button>
                    
                    <div class="jsoneditor-modes">
                        <button type="button" id="modeToggle" class="jsoneditor-btn">
                            Code ▾
                        </button>
                        <ul id="modeDropdown" class="jsoneditor-dropdown">
                            <li><a href="#" data-mode="code">Code</a></li>
                            <li><a href="#" data-mode="form">Form</a></li>
                            <li><a href="#" data-mode="text">Text</a></li>
                            <li><a href="#" data-mode="tree">Tree</a></li>
                            <li><a href="#" data-mode="view">View</a></li>
                        </ul>
                    </div>
                    

                    <div id="outputToolBar" class="btn-group btn-group-sm right hidden-xs">
                        <div class="cursor-pointer tree-rotate-180 btn-sm fa fa-tree" title="Tree view" onclick="changeOutputTreeMode()"></div>
                        <div class="cursor-pointer btn-sm fa fa-times" title="Clear" onclick="clearOutput()"></div>
                        <div class="cursor-pointer btn-sm fa fa-download" title="Download" onclick="downloadOutput()"></div>
                        <div id="outputcopy" title="Copy to Clipboard" class="cursor-pointer btn-sm btn-shrink fa fa-files-o" onclick="copyOutput()"></div>
                        <div id="outputFullScreen" title="fullscreen" onclick="toggleFullscreen('output');" class="cursor-pointer btn-sm btn-fullscreen fa fa-arrows-alt"></div>
                        <div id="outputCloseScreen" title="Close" onclick="toggleFullscreen('output');" style="display:none" class="cursor-pointer btn-sm btn-fullscreen fa fa-window-close"></div>
                    </div>
                </div>
                <div class="jsoneditor-outer has-main-menu-bar has-status-bar">
                    <div class="ace_editor ace_hidpi ace-jsoneditor">
                        <textarea id="editor-output" placeholder="Kết quả sẽ hiển thị ở đây..." readonly></textarea>
                    </div>
                </div>
                <div class="jsoneditor-statusbar">
                    <span class="jsoneditor-curserinfo-label">Ln:</span>
                    <span class="jsoneditor-curserinfo-val" id="output-line">1</span>
                    <span class="jsoneditor-curserinfo-label">Col:</span>
                    <span class="jsoneditor-curserinfo-val" id="output-col">1</span>
                </div>
            </div>
        </div>
    </div>
</div>

<input type="file" id="fileInput" accept=".json,.txt" style="display: none;" onchange="handleFileSelect(event)">
<div id="notification" class="notification" style="display: none;"></div>
@endsection

@push('scripts')
    <script src="{{ asset('js/json-editor.js') }}"></script>
    <script src="{{ asset('js/input.js') }}"></script>
    <script src="{{ asset('js/output.js') }}"></script>
    <script src="{{ asset('js/htpassword.js') }}"></script>
    <script src="{{ asset('js/test.js') }}"></script>

@endpush    