<?php

namespace App\Http\Controllers;

use App\Http\Requests\HtpasswdRequest;


class HtpasswdController extends Controller
{
    public function index()
    {
        return view('htpassword.index');
    }

    public function generate(HtpasswdRequest $request)
    {
        $username = trim($request->username);
        $password = $request->password;
        $mode     = strtolower($request->mode);

        $hash = match ($mode) {
            'sha'   => $this->hashSha1($password),
            'apr1'  => $this->hashApr1($password),
            'y2'    => $this->hashBcrypt($password, 10),
            'a2i'   => password_hash($password, PASSWORD_ARGON2ID),
            default => $this->hashBcrypt($password, 10),
        };

        $htpasswdLine = "{$username}:{$hash}";

        return back()->withInput()->with('htpasswdLine', $htpasswdLine);
    }

    private function hashSha1(string $password): string
    {
        return '{SHA}' . base64_encode(sha1($password, true));
    }


    private function hashApr1(string $password): string
    {
        $salt = substr(str_shuffle("abcdefghijklmnopqrstuvwxyz0123456789"), 0, 8);
        $magic = '$apr1$';
        $ctx = $password . $magic . $salt;
        $final = md5($password . $salt . $password, true);

        for ($i = strlen($password); $i > 0; $i -= 16) {
            $ctx .= substr($final, 0, min(16, $i));
        }

        $i = strlen($password);
        while ($i) {
            $ctx .= ($i & 1) ? chr(0) : $password[0];
            $i >>= 1;
        }

        $final = md5($ctx, true);

        for ($i = 0; $i < 1000; $i++) {
            $ctx1 = ($i & 1) ? $password : $final;
            if ($i % 3) $ctx1 .= $salt;
            if ($i % 7) $ctx1 .= $password;
            $ctx1 .= ($i & 1) ? $final : $password;
            $final = md5($ctx1, true);
        }

        $passwd = '';
        $value = [
            (ord($final[0]) << 16) | (ord($final[6]) << 8) | ord($final[12]),
            (ord($final[1]) << 16) | (ord($final[7]) << 8) | ord($final[13]),
            (ord($final[2]) << 16) | (ord($final[8]) << 8) | ord($final[14]),
            (ord($final[3]) << 16) | (ord($final[9]) << 8) | ord($final[15]),
            (ord($final[4]) << 16) | (ord($final[10]) << 8) | ord($final[5]),
            ord($final[11])
        ];

        $passwd .= $this->to64($value[0], 4);
        $passwd .= $this->to64($value[1], 4);
        $passwd .= $this->to64($value[2], 4);
        $passwd .= $this->to64($value[3], 4);
        $passwd .= $this->to64($value[4], 4);
        $passwd .= $this->to64($value[5], 2);

        return $magic . $salt . '$' . $passwd;
    }
    
    private function to64($v, $n): string
    {
        $itoa64 = './0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        $ret = '';
        while (--$n >= 0) {
            $ret .= $itoa64[$v & 0x3f];
            $v >>= 6;
        }
        return $ret;
    }
    private function hashBcrypt(string $password, int $cost): string
    {
        return password_hash($password, PASSWORD_BCRYPT, ['cost' => $cost]);
    }

}
