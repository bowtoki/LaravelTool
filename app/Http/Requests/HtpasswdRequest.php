<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class HtpasswdRequest extends FormRequest
{
     public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'username' => 'required|string',
            'password' => 'required|string',
            'mode'     => 'required|string|in:sha,apr1,y2,a2i',
        ];
    }

    public function messages()
    {
        return [
            'username.required' => 'Vui lòng nhập username.',
            'password.required' => 'Vui lòng nhập password.',
            'mode.required'     => 'Vui lòng chọn mode.',
            'mode.in'           => 'Mode không hợp lệ.',
        ];
    }
}
