// Main JavaScript for DoctorNet Platform

document.addEventListener('DOMContentLoaded', function() {
    // Initialize tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Initialize popovers
    var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });

    // Auto-hide alerts after 5 seconds
    setTimeout(function() {
        var alerts = document.querySelectorAll('.alert');
        alerts.forEach(function(alert) {
            var bsAlert = new bootstrap.Alert(alert);
            bsAlert.close();
        });
    }, 5000);

    // Add loading states to forms
    var forms = document.querySelectorAll('form');
    forms.forEach(function(form) {
        form.addEventListener('submit', function() {
            var submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.classList.add('loading');
                submitBtn.disabled = true;
            }
        });
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            var target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add fade-in animation to cards
    var cards = document.querySelectorAll('.card');
    cards.forEach(function(card, index) {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(function() {
            card.style.transition = 'all 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });

    // Phone number formatting
    var phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(function(input) {
        input.addEventListener('input', function() {
            var value = this.value.replace(/\D/g, '');
            if (value.length >= 10) {
                this.value = value.substring(0, 10);
            }
        });
    });

    // Aadhaar number formatting
    var aadhaarInputs = document.querySelectorAll('input[name="aadhaarNumber"]');
    aadhaarInputs.forEach(function(input) {
        input.addEventListener('input', function() {
            var value = this.value.replace(/\D/g, '');
            if (value.length >= 12) {
                this.value = value.substring(0, 12);
            }
        });
    });

    // Form validation
    var forms = document.querySelectorAll('.needs-validation');
    forms.forEach(function(form) {
        form.addEventListener('submit', function(event) {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add('was-validated');
        });
    });

    // Search functionality
    var searchInputs = document.querySelectorAll('input[type="search"], input[id*="search"]');
    searchInputs.forEach(function(input) {
        input.addEventListener('input', function() {
            var searchTerm = this.value.toLowerCase();
            var targetElements = document.querySelectorAll(this.dataset.target || '.searchable');
            
            targetElements.forEach(function(element) {
                var text = element.textContent.toLowerCase();
                if (text.includes(searchTerm)) {
                    element.style.display = '';
                } else {
                    element.style.display = 'none';
                }
            });
        });
    });

    // Emergency button animation
    var emergencyBtns = document.querySelectorAll('.btn-danger');
    emergencyBtns.forEach(function(btn) {
        if (btn.textContent.includes('Emergency') || btn.textContent.includes('108')) {
            btn.classList.add('emergency-btn');
        }
    });

    // Add click effects to buttons
    var buttons = document.querySelectorAll('.btn');
    buttons.forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            var ripple = document.createElement('span');
            var rect = this.getBoundingClientRect();
            var size = Math.max(rect.width, rect.height);
            var x = e.clientX - rect.left - size / 2;
            var y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(function() {
                ripple.remove();
            }, 600);
        });
    });

    // Add ripple effect CSS
    var style = document.createElement('style');
    style.textContent = `
        .btn {
            position: relative;
            overflow: hidden;
        }
        
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple-animation 0.6s linear;
            pointer-events: none;
        }
        
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // Notification system
    window.showNotification = function(message, type = 'info') {
        var notification = document.createElement('div');
        notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
        notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'} me-2"></i>
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(function() {
            var bsAlert = new bootstrap.Alert(notification);
            bsAlert.close();
        }, 5000);
    };

    // File upload preview
    var fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach(function(input) {
        input.addEventListener('change', function() {
            var file = this.files[0];
            if (file) {
                var reader = new FileReader();
                reader.onload = function(e) {
                    var preview = document.getElementById(this.dataset.preview);
                    if (preview) {
                        preview.innerHTML = `
                            <div class="file-preview">
                                <i class="fas fa-file-${file.type.includes('image') ? 'image' : 'pdf'} me-2"></i>
                                ${file.name}
                                <small class="text-muted d-block">${(file.size / 1024 / 1024).toFixed(2)} MB</small>
                            </div>
                        `;
                    }
                };
                reader.readAsDataURL(file);
            }
        });
    });

    // Add loading spinner to async operations
    window.showLoading = function(element) {
        element.classList.add('loading');
        element.style.position = 'relative';
    };

    window.hideLoading = function(element) {
        element.classList.remove('loading');
    };

    // Initialize date pickers
    var dateInputs = document.querySelectorAll('input[type="date"], input[type="datetime-local"]');
    dateInputs.forEach(function(input) {
        if (input.type === 'datetime-local') {
            // Set minimum date to current date
            var now = new Date();
            now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
            input.min = now.toISOString().slice(0, 16);
        } else {
            // Set minimum date to today
            input.min = new Date().toISOString().split('T')[0];
        }
    });

    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + K for search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            var searchInput = document.querySelector('input[type="search"], input[id*="search"]');
            if (searchInput) {
                searchInput.focus();
            }
        }
        
        // Escape to close modals
        if (e.key === 'Escape') {
            var modals = document.querySelectorAll('.modal.show');
            modals.forEach(function(modal) {
                var bsModal = bootstrap.Modal.getInstance(modal);
                if (bsModal) {
                    bsModal.hide();
                }
            });
        }
    });

    // Add accessibility improvements
    var focusableElements = document.querySelectorAll('button, input, select, textarea, a[href]');
    focusableElements.forEach(function(element) {
        element.addEventListener('focus', function() {
            this.style.outline = '2px solid var(--primary-color)';
            this.style.outlineOffset = '2px';
        });
        
        element.addEventListener('blur', function() {
            this.style.outline = '';
            this.style.outlineOffset = '';
        });
    });

    // Performance optimization: Lazy load images
    var images = document.querySelectorAll('img[data-src]');
    var imageObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                var img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(function(img) {
        imageObserver.observe(img);
    });

    console.log('TeleMed Platform initialized successfully!');
});

// Utility functions
function formatPhoneNumber(phoneNumber) {
    return phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
}

function formatAadhaarNumber(aadhaarNumber) {
    return aadhaarNumber.replace(/(\d{4})(\d{4})(\d{4})/, '$1 $2 $3');
}

function validateEmail(email) {
    var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhoneNumber(phoneNumber) {
    var re = /^\d{10}$/;
    return re.test(phoneNumber);
}

function validateAadhaarNumber(aadhaarNumber) {
    var re = /^\d{12}$/;
    return re.test(aadhaarNumber);
}

// Export functions for global use
window.TeleMed = {
    showNotification: window.showNotification,
    showLoading: window.showLoading,
    hideLoading: window.hideLoading,
    formatPhoneNumber: formatPhoneNumber,
    formatAadhaarNumber: formatAadhaarNumber,
    validateEmail: validateEmail,
    validatePhoneNumber: validatePhoneNumber,
    validateAadhaarNumber: validateAadhaarNumber
};
