// Mobile nav toggle
const navToggle = document.getElementById('nav-toggle');
const mainNav = document.getElementById('main-nav');

if (navToggle && mainNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Close menu after tapping a link (mobile)
  mainNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// Footer year
const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// Stencil quote estimate and email-draft request
const quoteForm = document.getElementById('quote-form');

if (quoteForm) {
  const widthField = document.getElementById('stencil-width');
  const heightField = document.getElementById('stencil-height');
  const quantityField = document.getElementById('stencil-quantity');
  const areaOutput = document.getElementById('stencil-area');
  const totalOutput = document.getElementById('estimate-total');
  const response = document.getElementById('quote-response');
  const quoteEmail = 'hello@meridianelectronics.example';

  const getEstimate = () => {
    const width = Number(widthField.value) || 0;
    const height = Number(heightField.value) || 0;
    const quantity = Number(quantityField.value) || 2;
    const area = width * height * quantity;
    const total = 5 + area * 0.05;

    areaOutput.textContent = `${area.toFixed(1)} cm2`;
    totalOutput.textContent = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(total);

    return { area, total, width, height, quantity };
  };

  quoteForm.addEventListener('input', getEstimate);
  quoteForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const estimate = getEstimate();
    const formData = new FormData(quoteForm);
    const subject = 'Custom solder stencil quote request';
    const body = [
      'Hello, I would like a quote for custom solder stencils.',
      '',
      `Name: ${formData.get('name')}`,
      `Email: ${formData.get('email')}`,
      `Quantity: ${estimate.quantity}`,
      `Stencil dimensions: ${estimate.width} cm x ${estimate.height} cm each`,
      `Total stencil area: ${estimate.area.toFixed(1)} cm2`,
      `Web estimate: $${estimate.total.toFixed(2)}`,
      `Project notes: ${formData.get('notes') || 'None'}`,
      '',
      'I will attach my Gerber or paste-layer file to this email.'
    ].join('\n');
    const mailto = `mailto:${quoteEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    response.hidden = false;
    response.innerHTML = `<p>Your request is ready. Attach your Gerber or paste-layer file before sending.</p><a href="${mailto}">Open email draft</a>`;
  });
}
