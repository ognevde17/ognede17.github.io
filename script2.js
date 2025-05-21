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
const form = document.getElementById('contactForm');
const submitBtn = form.querySelector('button[type="submit"]');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const name = form.name.value;
  const email = form.email.value;
  const message = form.message.value;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const nameRegex = /^[а-яА-ЯёЁa-zA-Z\s]+$/;
  
  if(!nameRegex.test(name)) {
    alert('Имя должно содержать только буквы');
    return;
  }

  if(!emailRegex.test(email)) {
    alert('Введите корректный email');
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = 'Отправка...';
  submitBtn.style.backgroundColor = '#ccc';

  try {
    const response = await fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: {
        'Accept': 'application/json'
      }
    });

    if(response.ok) {
      submitBtn.textContent = '✓ Отправлено!';
      submitBtn.style.backgroundColor = '#38a169';
      form.reset();
    }
  } catch(error) {
    alert('Ошибка отправки');
  } finally {
    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Отправить';
      submitBtn.style.backgroundColor = "#0039A6";
    }, 3000);
  }
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
        if (!localStorage.getItem('popupClosed')) {
            popup.style.display = 'flex';
        }
    };

    setTimeout(showPopup, 30000);

    closeBtn.addEventListener('click', () => {
        popup.style.display = 'none';
        localStorage.setItem('popupClosed', 'true');
    });

    popup.addEventListener('click', (e) => {
        if (e.target === popup) {
            popup.style.display = 'none';
            localStorage.setItem('popupClosed', 'true');
        }
    });
});
