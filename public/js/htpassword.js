// Lưu scroll position và loading state
document.getElementById('htpasswd_generator_form').addEventListener('submit', function() {
    sessionStorage.setItem('scrollPos', window.scrollY);
    this.style.cssText = 'opacity:0.7;pointer-events:none;transition:opacity 0.3s';
    this.querySelector('[type="submit"]').textContent = 'Processing...';
});

// Khôi phục position mượt mà
document.addEventListener('DOMContentLoaded', function() {
    const pos = sessionStorage.getItem('scrollPos');
    if (pos) {
        window.scrollTo(0, +pos);
        setTimeout(() => window.scrollTo({top: +pos, behavior: 'smooth'}), 50);
        sessionStorage.removeItem('scrollPos');
    }
});

// document.addEventListener('DOMContentLoaded', function () {
//     const clearBtn = document.getElementById('clearform');
//     const generatedInput = document.getElementById('generated_password');
//     const usernameInput = document.getElementById('username');
//     const passwordInput = document.getElementById('password');
//     const modeSelect = document.getElementById('mode');
//
//     clearBtn.addEventListener('click', function (e) {
//         e.preventDefault(); // ngăn form reset mặc định của browser
//
//         // Xóa giá trị input
//         usernameInput.value = '';
//         passwordInput.value = '';
//         modeSelect.selectedIndex = 0; // chọn option đầu tiên
//
//         // Xóa kết quả hiển thị
//         generatedInput.value = '';
//         generatedInput.style.display = 'none';
//
//         // Xóa class lỗi nếu có
//         usernameInput.classList.remove('error');
//         passwordInput.classList.remove('error');
//         modeSelect.classList.remove('error');
//
//         // Xóa label lỗi nếu có
//         const errorLabels = document.querySelectorAll('label.error');
//         errorLabels.forEach(label => label.remove());
//     });
// });


document.addEventListener('DOMContentLoaded', () => {
    const clearBtn = document.getElementById('clearform');
    const generatedInput = document.getElementById('generated_password');
    const inputs = [
        document.getElementById('username'),
        document.getElementById('password'),
        document.getElementById('mode')
    ];

    clearBtn.addEventListener('click', e => {
        e.preventDefault();

        inputs.forEach(input => {
            if (!input) return;
            if (input.tagName === 'SELECT') {
                input.value = input.options[0].value;
            } else {
                input.value = '';
                input.defaultValue = '';
            }
            input.classList.remove('error');
        });

        const form = clearBtn.closest("form");
        if (form) {
            form.querySelectorAll("input").forEach(input => {
                if (["text", "password", "email"].includes(input.type)) {
                    input.value = "";
                    input.defaultValue = "";
                }
            });
        }

        if (generatedInput) {
            generatedInput.value = '';
            generatedInput.style.display = 'none';
        }

        document.querySelectorAll('label.error').forEach(label => label.remove());
    });
});


