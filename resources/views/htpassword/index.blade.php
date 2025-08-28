@extends('layouts.app')

@section('title', 'JSON Editor - Laravel')

@section('content')
<body class="bg-light">

<div class="container py-5 htpwd-generator">
    <div class="row justify-content-center">
        <div class="col-md-6">

            <div class="card shadow-lg border-0 rounded-3">
                <div class="card-body p-4">
                    <h2 class="card-title text-center mb-4 fw-bold text-primary">Password Generator</h2>

                    @if(session('htpasswdLine'))
                        <div class="mb-3">
                            <input type="text" 
                                   class="form-control generated-password text-center fw-semibold" 
                                   id="generated_password" readonly
                                   value="{{ session('htpasswdLine') }}">
                        </div>
                    @endif

                    <form id="htpasswd_generator_form" action="{{ route('htpasswd.generate') }}" method="POST" novalidate>
                        @csrf

                        <div class="mb-3">
                            <label for="username" class="form-label fw-semibold">Username</label>
                            <input type="text" name="username" id="username" 
                                   class="form-control @error('username') is-invalid @enderror" 
                                   placeholder="Enter username" value="{{ old('username') }}">
                            @error('username')
                                <div class="invalid-feedback">{{ $message }}</div>
                            @enderror
                        </div>

                        <div class="mb-3">
                            <label for="password" class="form-label fw-semibold">Password</label>
                            <input type="password" name="password" id="password" 
                                   class="form-control @error('password') is-invalid @enderror" 
                                   placeholder="Enter password" value="{{ old('password') }}">
                            @error('password')
                                <div class="invalid-feedback">{{ $message }}</div>
                            @enderror
                        </div>

                        <div class="mb-3">
                            <label for="mode" class="form-label fw-semibold">Mode</label>
                            <select name="mode" id="mode" class="form-select @error('mode') is-invalid @enderror">
                                <option value="sha" {{ old('mode')=='sha' ? 'selected':'' }}>SHA1 (insecure)</option>
                                <option value="apr1" {{ old('mode')=='apr1' ? 'selected':'' }}>Apache MD5 (common)</option>
                                <option value="y2" {{ old('mode')=='y2' ? 'selected':'' }}>Bcrypt (Apache v2.4+)</option>
                                <option value="a2i" {{ old('mode')=='a2i' ? 'selected':'' }}>Argon2 (experimental)</option>
                            </select>
                            @error('mode')
                                <div class="invalid-feedback">{{ $message }}</div>
                            @enderror
                        </div>

                        <div class="d-flex justify-content-between">
                            <button type="submit" class="btn btn-primary px-4">Generate</button>
                            <button type="reset" class="btn btn-outline-danger px-4" id="clearform">Clear</button>
                        </div>

                    </form>

                    <p class="mt-4 text-center small text-muted">
                        We do <strong>NOT</strong> log <strong>ANY</strong> data entered in this form.
                    </p>
                </div>
            </div>

        </div>
    </div>
</div>
@endsection
