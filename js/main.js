// Main JavaScript for Power BI Training Site

document.addEventListener('DOMContentLoaded', function() {
    // Initialize components
    initNavigation();
    initCountdown();
    initFAQAccordion();
    initScrollReveal();
    initSmoothScroll();
});

// Mobile Navigation
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const header = document.querySelector('.header');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking on a nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    // Header scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// Countdown Timer
function initCountdown() {
    const countdownElement = document.querySelector('.countdown');
    if (!countdownElement) return;
    // elementos do DOM do contador
    const daysEl = document.getElementById('countdown-days');
    const hoursEl = document.getElementById('countdown-hours');
    const minutesEl = document.getElementById('countdown-minutes');
    const secondsEl = document.getElementById('countdown-seconds');

    // Set the date we're counting down to (current date + 2 days)
    const countDownDate = new Date();
    countDownDate.setDate(countDownDate.getDate() + 2);

    // guarda valores anteriores para detectar mudança e animar
    const prev = { days: null, hours: null, minutes: null, seconds: null };

    // Update the countdown every 1 second
    const countdownTimer = setInterval(function() {
        // Get current date and time
        const now = new Date().getTime();

        // Find the distance between now and the countdown date
        const distance = countDownDate - now;

        // Time calculations for days, hours, minutes and seconds
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // helper para atualizar e animar um elemento quando o valor muda
        function updateEl(el, value, key) {
            if (!el) return;
            const text = value.toString().padStart(2, '0');
            if (prev[key] !== value) {
                el.textContent = text;
                el.classList.remove('animate-pop');
                // forçar reflow para reiniciar animação
                void el.offsetWidth;
                el.classList.add('animate-pop');
                el.addEventListener('animationend', () => el.classList.remove('animate-pop'), { once: true });
                prev[key] = value;
            }
        }

        updateEl(daysEl, days, 'days');
        updateEl(hoursEl, hours, 'hours');
        updateEl(minutesEl, minutes, 'minutes');
        updateEl(secondsEl, seconds, 'seconds');

        // If the countdown is finished, display a message
        if (distance < 0) {
            clearInterval(countdownTimer);
            document.querySelector('.countdown').innerHTML = "<p class='text-light'>A oferta especial expirou!</p>";
        }
    }, 1000);
}

// FAQ Accordion
function initFAQAccordion() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            
            // Toggle active class on question
            question.classList.toggle('active');
            
            // Toggle active class on answer
            answer.classList.toggle('active');
        });
    });
}

// Scroll Reveal Animation
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');
    
    function checkReveal() {
        const windowHeight = window.innerHeight;
        const revealPoint = 150;
        
        revealElements.forEach((element, idx) => {
            const elementTop = element.getBoundingClientRect().top;
            
            if (elementTop < windowHeight - revealPoint) {
                if (!element.classList.contains('active')) {
                    // aplicação de delay cíclico para gerar efeito de stagger
                    element.style.transitionDelay = `${(idx % 6) * 80}ms`;
                    element.classList.add('active');
                }
            }
        });
    }
    
    // Initial check
    checkReveal();
    
    // Check on scroll
    window.addEventListener('scroll', checkReveal);
}

// Smooth Scroll for Anchor Links
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Form Validation
function validateForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return false;
    
    const inputs = form.querySelectorAll('input, textarea');
    let isValid = true;
    
    inputs.forEach(input => {
        if (input.hasAttribute('required') && !input.value.trim()) {
            input.classList.add('error');
            isValid = false;
        } else {
            input.classList.remove('error');
        }
        
        // Email validation
        if (input.type === 'email' && input.value.trim()) {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(input.value.trim())) {
                input.classList.add('error');
                isValid = false;
            }
        }
    });
    
    return isValid;
}

// Form Submission
function submitForm(formId, successMessage) {
    const form = document.getElementById(formId);
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm(formId)) {
            // In a real implementation, you would send the form data to a server here
            // For now, we'll just show a success message
            const formData = new FormData(form);
            const formValues = {};
            
            for (let [key, value] of formData.entries()) {
                formValues[key] = value;
            }
            
            console.log('Form submitted:', formValues);
            
            // Show success message
            const successElement = document.createElement('div');
            successElement.className = 'form-success';
            successElement.textContent = successMessage || 'Formulário enviado com sucesso!';
            
            form.innerHTML = '';
            form.appendChild(successElement);
        }
    });
}

// Testimonial Carousel (if needed)
function initTestimonialCarousel() {
    let currentSlide = 0;
    const slides = document.querySelectorAll('.testimonial-card');
    const totalSlides = slides.length;
    
    if (totalSlides <= 1) return;
    
    // Hide all slides except the first one
    for (let i = 1; i < totalSlides; i++) {
        slides[i].style.display = 'none';
    }
    
    // Previous slide function
    window.prevSlide = function() {
        slides[currentSlide].style.display = 'none';
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        slides[currentSlide].style.display = 'block';
    };
    
    // Next slide function
    window.nextSlide = function() {
        slides[currentSlide].style.display = 'none';
        currentSlide = (currentSlide + 1) % totalSlides;
        slides[currentSlide].style.display = 'block';
    };
    
    // Auto-advance slides every 5 seconds
    setInterval(window.nextSlide, 5000);
}

// Pricing Toggle (if needed)
function initPricingToggle() {
    const toggleBtn = document.querySelector('.pricing-toggle');
    const monthlyPrices = document.querySelectorAll('.price-monthly');
    const yearlyPrices = document.querySelectorAll('.price-yearly');
    
    if (!toggleBtn) return;
    
    toggleBtn.addEventListener('click', function() {
        this.classList.toggle('active');
        
        if (this.classList.contains('active')) {
            // Show yearly prices
            monthlyPrices.forEach(price => price.style.display = 'none');
            yearlyPrices.forEach(price => price.style.display = 'block');
        } else {
            // Show monthly prices
            monthlyPrices.forEach(price => price.style.display = 'block');
            yearlyPrices.forEach(price => price.style.display = 'none');
        }
    });
}

// Initialize custom functions when needed
function initCustomFunctions() {
    // Add any custom functions here
}
