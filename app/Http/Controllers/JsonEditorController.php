<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\Yaml\Yaml;

class JsonEditorController extends Controller
{
    // Hiển thị trang JSON Editor
    public function index()
    {
        return view('json-editor.index');
    }

    // Validate JSON
    public function validateJSON(Request $request)
    {
        $json = $request->input('json');
        json_decode($json);
        if (json_last_error() === JSON_ERROR_NONE) {
            return response()->json(['valid' => true]);
        }
        return response()->json([
            'valid' => false,
            'error' => json_last_error_msg()
        ]);
    }

    // Beautify / Format JSON
    public function beautifyJSON(Request $request)
    {
        $json = $request->input('json');
        $indent = intval($request->input('indent', 2));
        json_decode($json);
        if (json_last_error() === JSON_ERROR_NONE) {
            $pretty = json_encode(json_decode($json), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
            $pretty = preg_replace_callback('/^ +/m', function ($m) use ($indent) {
                return str_repeat(' ', strlen($m[0]) / 2 * $indent);
            }, $pretty);
            return response()->json(['json' => $pretty]);
        }
        return response()->json([
            'error' => json_last_error_msg()
        ], 400);
    }

    // Minify JSON
    public function minifyJSON(Request $request)
    {
        $json = $request->input('json');
        json_decode($json);
        if (json_last_error() === JSON_ERROR_NONE) {
            return response()->json(['json' => json_encode(json_decode($json), JSON_UNESCAPED_UNICODE)]);
        }
        return response()->json([
            'error' => json_last_error_msg()
        ], 400);
    }

    // Convert JSON to XML
    public function convertToXML(Request $request)
    {
        $json = $request->input('json');
        $data = json_decode($json, true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            return response()->json(['error' => json_last_error_msg()], 400);
        }
        $xml = new \SimpleXMLElement('<root/>');
        $this->arrayToXML($data, $xml);
        return response($xml->asXML(), 200)->header('Content-Type', 'application/xml');
    }

    public function convertToCSV(Request $request)
    {
        $json = $request->input('json');
        $data = json_decode($json, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            return response()->json(['error' => json_last_error_msg()], 400);
        }

        // Đảm bảo $data là mảng
        if (!is_array($data)) {
            return response()->json(['error' => 'Invalid JSON format. Expected array or object.'], 400);
        }

        $output = fopen('php://temp', 'r+');

        // Nếu là mảng nhiều dòng (array of arrays)
        if (isset($data[0]) && is_array($data[0])) {
            // Header CSV
            fputcsv($output, array_keys($data[0]));

            foreach ($data as $row) {
                // Flatten nested arrays thành string nếu cần
                $row = array_map(function($item) {
                    return is_array($item) ? json_encode($item, JSON_UNESCAPED_UNICODE) : $item;
                }, $row);
                fputcsv($output, $row);
            }
        } else {
            // Single object
            $row = array_map(function($item) {
                return is_array($item) ? json_encode($item, JSON_UNESCAPED_UNICODE) : $item;
            }, $data);
            fputcsv($output, array_keys($data));
            fputcsv($output, $row);
        }

        rewind($output);
        $csv = stream_get_contents($output);
        fclose($output);

        // Thêm BOM để Excel hiển thị UTF-8 đúng
        $csv = "\xEF\xBB\xBF" . $csv;

        return response($csv, 200)
            ->header('Content-Type', 'text/csv')
            ->header('Content-Disposition', 'attachment; filename="data.csv"');
    }


    // Convert JSON to YAML
    public function convertToYAML(Request $request)
    {
        $json = $request->input('json');
        $data = json_decode($json, true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            return response()->json(['error' => json_last_error_msg()], 400);
        }
        return response(Yaml::dump($data, 4, 2), 200)
            ->header('Content-Type', 'text/yaml');
    }

    // Download JSON file
    public function downloadJSON(Request $request)
    {
        $json = $request->input('json');
        return response($json, 200)
            ->header('Content-Type', 'application/json')
            ->header('Content-Disposition', 'attachment; filename="data.json"');
    }

    // Helper: array to XML
    private function arrayToXML(array $data, \SimpleXMLElement &$xml)
    {
        foreach ($data as $key => $value) {
            if (is_numeric($key)) $key = "item$key";
            if (is_array($value)) {
                $subnode = $xml->addChild($key);
                $this->arrayToXML($value, $subnode);
            } else {
                $xml->addChild($key, htmlspecialchars($value));
            }
        }
    }
}
