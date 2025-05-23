sessionStorage.clear();
window.addEventListener('scroll', () => {
    const form = document.querySelector('.contact-form');
    const formPosition = form.getBoundingClientRect().top;
    const screenPosition = window.innerHeight / 1.3;
  
    if(formPosition < screenPosition) {
      form.classList.add('visible');
    }
    if (formPosition > screenPosition) {
      form.classList.remove('visible');
    }
  });


const contactPopup = document.getElementById('contactPopup');
const openPopupBtns = document.querySelectorAll('[data-popup="contact"]');
const closePopupBtn = contactPopup.querySelector('.close-popup');
let isPopupOpen = false;

const togglePopup = () => {
  contactPopup.classList.toggle('active');
  document.body.style.overflow = contactPopup.classList.contains('active') ? 'hidden' : 'auto';
  isPopupOpen = !isPopupOpen;
};

openPopupBtns.forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    togglePopup();
  });
});

closePopupBtn.addEventListener('click', togglePopup);

contactPopup.addEventListener('click', (e) => {
  if(e.target === contactPopup) togglePopup();
});

document.addEventListener('keydown', (e) => {
  if(e.key === 'Escape' && isPopupOpen) togglePopup();
});

const handleFormSubmit = (form, isPopup = false) => {
  const submitBtn = form.querySelector('button[type="submit"]');
  const statusMessage = form.querySelector('.status-message');
  const inputs = form.querySelectorAll('input, textarea');
  const originalText = submitBtn.textContent;
  const validationRules = {
    name: {
      required: true,
      minLength: 5,
      regex: /^[A-Za-zА-Яа-яЁё\s]+$/,
      messages: {
        required: 'Пожалуйста, введите ваше имя',
        minLength: 'Имя должно содержать минимум 5 символов',
        invalid: 'Разрешены только буквы и пробелы'
      }
    },
    email: {
      required: true,
      regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      messages: {
        required: 'Пожалуйста, введите ваш email',
        invalid: 'Введите корректный email адрес'
      }
    },
    message: {
      required: true,
      minLength: 10,
      messages: {
        required: 'Пожалуйста, введите сообщение',
        minLength: 'Сообщение должно содержать минимум 10 символов'
      }
    }
  };

  const validateField = (input) => {
    const fieldName = input.id.replace('popup-', '');
    const value = input.value.trim();
    const rules = validationRules[fieldName];
    let isValid = true;

    clearFieldError(input);

    if (rules.required && !value) {
      showFieldError(input, rules.messages.required);
      return false;
    }

    if (rules.minLength && value.length < rules.minLength) {
      showFieldError(input, rules.messages.minLength);
      isValid = false;
    }

    if (rules.regex && !rules.regex.test(value)) {
      showFieldError(input, rules.messages.invalid);
      isValid = false;
    }

    return isValid;
  };
  
  inputs.forEach(input => {
    const errorContainer = document.createElement('div');
    errorContainer.className = 'error-message';
    errorContainer.style.color = 'red';
    errorContainer.style.fontSize = '0.8rem';
    errorContainer.style.marginTop = '0.3rem';
    input.parentNode.appendChild(errorContainer);
  });

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const errorMessages = {
    name: {
      valueMissing: 'Пожалуйста, введите ваше имя',
      tooShort: 'Имя должно содержать минимум 2 символа'
    },
    email: {
      valueMissing: 'Пожалуйста, введите ваш email',
      typeMismatch: 'Введите корректный email адрес',
      customError: 'Email не соответствует формату'
    },
    message: {
      valueMissing: 'Пожалуйста, введите сообщение',
      tooShort: 'Сообщение должно содержать минимум 10 символов'
    }
  };

  const showFieldError = (input, message) => {
    const errorContainer = input.parentNode.querySelector('.error-message');
    errorContainer.textContent = message;
    input.style.borderColor = 'red';
  };

  const clearFieldError = (input) => {
    const errorContainer = input.parentNode.querySelector('.error-message');
    errorContainer.textContent = '';
    input.style.borderColor = '#e2e8f0';
  };

  const validateForm = () => {
    let isFormValid = true;

    inputs.forEach(input => {
      const fieldValid = validateField(input);
      if (!fieldValid) isFormValid = false;
    });

    return isFormValid;
  };
  const showSuccess = () => {
    statusMessage.textContent = 'Сообщение отправлено!';
    statusMessage.style.color = 'green';
    
    submitBtn.textContent = '✓ Успешно!';
    submitBtn.style.backgroundColor = '#38a169';
    submitBtn.style.cursor = 'not-allowed';

    setTimeout(() => {
      submitBtn.textContent = originalText;
      submitBtn.style.backgroundColor = 'var(--blue)';
      submitBtn.style.cursor = 'pointer';
    }, 1500);

    if(isPopup) {
      setTimeout(() => {
        statusMessage.textContent = '';
        togglePopup();
      }, 2000);
    }
  };

  const showError = (message) => {
    statusMessage.textContent = message;
    statusMessage.style.color = 'red';
  };

  const resetForm = () => {
    form.reset();
    inputs.forEach(input => {
      input.style.borderColor = 'blue';
    });
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    e.preventDefault();
    
    if (!validateForm()) {
      showError('Исправьте выделенные ошибки');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Отправка...';
    submitBtn.style.opacity = '0.7';
    submitBtn.style.backgroundColor = 'gray';
    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: {
          'Accept': 'application/json'
        }
      });

      if(response.ok) {
        showSuccess();
        resetForm();
      } else {
        throw new Error('Ошибка сети');
      }
    } catch(error) {
      showError('Ошибка отправки: ' + error.message);
    } finally {
      submitBtn.disabled = false;
      submitBtn.style.opacity = '1';
      setTimeout(() => {
        statusMessage.textContent = '';
      }, 5000);
    }
  });

  inputs.forEach(input => {
    input.addEventListener('input', () => {
      validateField(input);
      if (input.value.trim() === '') clearFieldError(input);
    });
  });
};

document.querySelectorAll('.contact-form').forEach((form, index) => {
  handleFormSubmit(form, index === 1); 
});



const targetDate = new Date('2025-06-03').getTime();

function updateCountdown() {
  const now = new Date().getTime();
  const diff = targetDate - now;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  document.getElementById('days').textContent = days;
  document.getElementById('hours').textContent = hours;
  document.getElementById('minutes').textContent = minutes;
  document.getElementById('seconds').textContent = seconds;
}

setInterval(updateCountdown, 1000);

window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    const heroHeight = document.querySelector('.hero').offsetHeight;
    
    if(window.pageYOffset > heroHeight) {
      header.classList.add('fixed');
    } else {
      header.classList.remove('fixed');
    }
  });

 

document.addEventListener('DOMContentLoaded', () => {
    const popup = document.getElementById('telegramPopup');
    const closeBtn = document.querySelector('.close-popup-btn');

    if (!popup || !closeBtn) {
        console.error('Элементы попапа не найдены!');
        return;
    }

    const showPopup = () => {
        if (!sessionStorage.getItem('popupClosed')) {
            popup.style.display = 'flex';
        }
    };

    setTimeout(showPopup, 30000);

    closeBtn.addEventListener('click', () => {
        popup.style.display = 'none';
        sessionStorage.setItem('popupClosed', 'true');
    });

    popup.addEventListener('click', (e) => {
        if (e.target === popup) {
            popup.style.display = 'none';
            sessionStorage.setItem('popupClosed', 'true');
        }
    });
});

const initSvgAnimations = () => {
  const svg = document.querySelector('.animated-svg');
  const svgPath = document.querySelector('.svg-path');
  
  if (!svg || !svgPath) {
      console.error('SVG elements not found!');
      return;
  }

  const maxTilt = 15; 
  const maxMove = 30; 

  const updateSvgPosition = (e) => {
      const rect = svg.getBoundingClientRect();
      const centerX = rect.left + rect.width/2;
      const centerY = rect.top + rect.height/2;
      
      const deltaX = (e.clientX - centerX) / window.innerWidth * 2;
      const deltaY = (e.clientY - centerY) / window.innerHeight * 2;

      svgPath.style.transform = `
          translate(${deltaX * maxMove}px, ${deltaY * maxMove}px)
          rotateX(${deltaY * maxTilt}deg)
          rotateY(${deltaX * maxTilt}deg)
      `;
      
      svg.style.filter = `drop-shadow(${-deltaX * 10}px ${-deltaY * 10}px 15px rgba(0,57,166,0.3))`;
  };

  const resetSvgPosition = () => {
      svgPath.style.transform = 'none';
      svg.style.filter = 'none';
  };

  document.addEventListener('mousemove', updateSvgPosition);
  document.addEventListener('mouseleave', resetSvgPosition);
};

document.addEventListener('DOMContentLoaded', () => {
  initSvgAnimations();
  
  const popup = document.getElementById('telegramPopup');
  const closeBtn = document.querySelector('.close-popup-btn');
});
