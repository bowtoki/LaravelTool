@extends('layouts.app')

@section('title', 'Trang chủ - Công cụ trực tuyến')

@section('content')
<div class="text-center mb-5">
    <h1 class="fw-bold text-uppercase">Bộ công cụ trực tuyến</h1>
    <p class="text-muted">Nhanh chóng, tiện lợi và miễn phí</p>
</div>

<div class="row justify-content-center g-4">
    <!-- Password Tool -->
    <div class="col-md-5">
        <div class="card h-100 shadow-lg border-0 rounded-4 hover-card text-center">
            <div class="card-body p-5">
                <div class="icon-box bg-primary text-white mb-4 mx-auto">
                    <i class="fa fa-lock fa-2x"></i>
                </div>
                <h3 class="card-title fw-bold">Password Tool</h3>
                <p class="card-text text-muted">
                    Tạo và quản lý mật khẩu bảo mật, hỗ trợ Htpasswd cho website.
                </p>
                <a href="{{ url('/htpasswd') }}" class="btn btn-primary btn-lg rounded-pill px-4 mt-3">
                    Truy cập <i class="fa fa-arrow-right ms-2"></i>
                </a>
            </div>
        </div>
    </div>

    <!-- JSON Form Tool -->
    <div class="col-md-5">
        <div class="card h-100 shadow-lg border-0 rounded-4 hover-card text-center">
            <div class="card-body p-5">
                <div class="icon-box bg-success text-white mb-4 mx-auto">
                    <i class="fa fa-code fa-2x"></i>
                </div>
                <h3 class="card-title fw-bold">JSON Form Tool</h3>
                <p class="card-text text-muted">
                    Chỉnh sửa, validate và định dạng JSON một cách dễ dàng.
                </p>
                <a href="{{ url('/json-editor') }}" class="btn btn-success btn-lg rounded-pill px-4 mt-3">
                    Truy cập <i class="fa fa-arrow-right ms-2"></i>
                </a>
            </div>
        </div>
    </div>
</div>
@endsection
