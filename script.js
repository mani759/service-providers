// =========================================
// WorkerConnect Website JavaScript
// Handles navigation, animations, workers,
// and contact form validation.
// =========================================

const workers = [
  { name: 'Arun Kumar', phone: '9876543210', location: 'T. Nagar, Chennai', service: 'electrician' },
  { name: 'Sathish Raj', phone: '9123456780', location: 'Anna Nagar, Chennai', service: 'electrician' },
  { name: 'Vikram S', phone: '9012345678', location: 'Tambaram, Chennai', service: 'electrician' },
  { name: 'Pradeep Reddy', phone: '9345678912', location: 'Velachery, Chennai', service: 'plumber' },
  { name: 'Ravi Teja', phone: '9789012345', location: 'Porur, Chennai', service: 'plumber' },
  { name: 'Manoj Das', phone: '9445566778', location: 'Medavakkam, Chennai', service: 'plumber' },
  { name: 'Kiran Fit', phone: '9000011223', location: 'Nungambakkam, Chennai', service: 'trainer' },
  { name: 'Deepak Paul', phone: '9556677889', location: 'Adyar, Chennai', service: 'trainer' },
  { name: 'Naveen Sai', phone: '9887766554', location: 'OMR, Chennai', service: 'trainer' }
];

const menuButton = document.querySelector('[data-menu-toggle]');
const navMenu = document.querySelector('[data-nav]');
const header = document.querySelector('.site-header');

if (menuButton && navMenu) {
  menuButton.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('is-open');
    menuButton.classList.toggle('is-open', isOpen);
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
  });

  navMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('is-open');
      menuButton.classList.remove('is-open');
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Open navigation');
    });
  });
}

window.addEventListener('scroll', () => {
  if (!header) return;
  header.classList.toggle('is-scrolled', window.scrollY > 10);
});

const revealItems = document.querySelectorAll('.reveal-on-load, .reveal-on-scroll');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealItems.forEach((item, index) => {
  if (item.classList.contains('reveal-on-load')) {
    requestAnimationFrame(() => {
      setTimeout(() => item.classList.add('is-visible'), 120 + index * 90);
    });
  } else {
    revealObserver.observe(item);
  }
});

const workerGrid = document.getElementById('workerGrid');
const filterButtons = document.querySelectorAll('[data-filter]');

function formatService(service) {
  return service.charAt(0).toUpperCase() + service.slice(1);
}

function createWorkerCard(worker, index) {
  const article = document.createElement('article');
  article.className = 'worker-card card';
  article.style.animationDelay = `${index * 90}ms`;
  article.innerHTML = `
    <div class="worker-top">
      <div>
        <span class="worker-role">${formatService(worker.service)}</span>
        <h3>${worker.name}</h3>
      </div>
    </div>
    <div class="worker-meta">
      <span><strong>Phone:</strong> ${worker.phone}</span>
      <span><strong>Location:</strong> ${worker.location}</span>
    </div>
    <div class="worker-actions">
      <a class="action-link call" href="tel:${worker.phone}">Call now</a>
      <a class="action-link whatsapp" href="https://wa.me/91${worker.phone}?text=Hello%20${encodeURIComponent(worker.name)},%20I%20found%20your%20profile%20on%20WorkerConnect." target="_blank" rel="noopener noreferrer">WhatsApp</a>
    </div>
  `;
  return article;
}

function renderWorkers(filter = 'all') {
  if (!workerGrid) return;

  const hashFilter = window.location.hash.replace('#', '').toLowerCase();
  const activeFilter = filter === 'all' && hashFilter ? hashFilter : filter;
  const filteredWorkers = activeFilter === 'all'
    ? workers
    : workers.filter((worker) => worker.service === activeFilter);

  workerGrid.innerHTML = '';

  filteredWorkers.forEach((worker, index) => {
    workerGrid.appendChild(createWorkerCard(worker, index));
  });

  if (!filteredWorkers.length) {
    workerGrid.innerHTML = `
      <article class="card">
        <h3>No workers found</h3>
        <p>Try a different category to explore available professionals.</p>
      </article>
    `;
  }

  filterButtons.forEach((button) => {
    button.classList.toggle('is-active', button.dataset.filter === activeFilter || (activeFilter === '' && button.dataset.filter === 'all'));
  });
}

if (workerGrid) {
  renderWorkers('all');

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      renderWorkers(button.dataset.filter);
    });
  });
}

const form = document.querySelector('.contact-form');

if (form) {
  const statusMessage = form.querySelector('.form-status');
  const requiredFields = Array.from(form.querySelectorAll('input[required], select[required]'));

  function validateField(field) {
    const wrapper = field.closest('.form-field');
    let isValid = field.checkValidity();

    if (field.name === 'phone') {
      isValid = /^\d{10}$/.test(field.value.trim());
    }

    wrapper.classList.toggle('invalid', !isValid);
    return isValid;
  }

  requiredFields.forEach((field) => {
    field.addEventListener('input', () => validateField(field));
    field.addEventListener('blur', () => validateField(field));
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const allValid = requiredFields.every((field) => validateField(field));

    if (!allValid) {
      statusMessage.textContent = 'Please correct the highlighted fields before submitting.';
      statusMessage.style.color = '#b54747';
      return;
    }

    statusMessage.textContent = 'Your request has been submitted successfully.';
    statusMessage.style.color = '#2b8a57';
    form.reset();
    requiredFields.forEach((field) => field.closest('.form-field').classList.remove('invalid'));
  });
}
