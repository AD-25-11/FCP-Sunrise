const continents = {
  Asia: { countries: ['Japan', 'China', 'Singapore', 'Thailand', 'Philippines', 'Hong Kong', 'South Korea'] },
  Europe: { countries: ['France', 'Italy', 'Spain', 'UK'] },
  'North America': { countries: ['USA', 'Canada', 'Mexico'] },
  'South America': { countries: ['Brazil', 'Peru', 'Chile'] },
  Africa: { countries: ['Morocco', 'Egypt', 'South Africa'] },
  Australia: { countries: ['Australia', 'New Zealand'] }
};

const countryToContinent = Object.fromEntries(
  Object.entries(continents)
    .flatMap(([continent, data]) => data.countries.map(country => [country, continent]))
);

const destinationData = [
  ['Japan', 'Mount Fuji', 'Scenic climbs and iconic sunrise views.', 'https://images.unsplash.com/photo-1570459027562-4a916cc6113f?auto=format&fit=crop&w=1200&q=80'],
  ['Japan', 'Mount Fuji', 'Scenic climbs and iconic sunrise views.', 'https://images.pexels.com/photos/161401/fuji-mountain-sky-mountain-range-161401.jpeg'],
  ['Japan', 'Tokyo', 'Future-city nightlife and world-class cuisine.', 'https://images.pexels.com/photos/2187605/pexels-photo-2187605.jpeg'],
  ['Japan', 'Kyoto', 'Ancient temples and timeless cultural districts.', 'https://images.pexels.com/photos/402028/pexels-photo-402028.jpeg'],
  ['Japan', 'Osaka', 'Street food and modern entertainment hubs.', 'https://images.pexels.com/photos/3155666/pexels-photo-3155666.jpeg'],
  ['Singapore', 'Marina Bay', 'Skyline luxury with waterfront attractions.', 'https://images.pexels.com/photos/754268/pexels-photo-754268.jpeg'],
  ['South Korea', 'Seoul', 'K-culture, shopping and palaces.', 'https://images.pexels.com/photos/2376719/pexels-photo-2376719.jpeg'],
  ['Hong Kong', 'Victoria Peak', 'Breathtaking skyline from above.', 'https://images.pexels.com/photos/3703465/pexels-photo-3703465.jpeg'],
  ['Philippines', 'Palawan', 'Turquoise lagoons and island-hopping.', 'https://images.pexels.com/photos/753626/pexels-photo-753626.jpeg']
];

const services = [
  'Visa Assistance', 'PSA (formerly NSO)', 'CHED / TESDA Certification', 'DFA Authentication / Apostille / Red Ribbon',
  'Passport Processing (new / renewal / lost)', 'Embassy Stamping / Attestation', 'Travel Insurance', 'Document Translation',
  'Domestic Airline Tickets', 'International Airline Tickets', '2GO / Ferry Tickets', 'Cruise Booking',
  'Team Building / Seminars / Conventions', 'Domestic Package Tours', 'International Package Tours',
  'PhilHealth', 'NBI', 'PEOS', 'OEC', 'Pag-IBIG', 'PRC'
];

document.addEventListener('DOMContentLoaded', () => {
  const preloader = document.getElementById('preloader');
  if (preloader) setTimeout(() => preloader.classList.add('hidden'), 2600);

  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (menuToggle && navLinks) menuToggle.onclick = () => navLinks.classList.toggle('show');

  if (window.AOS) AOS.init({ once: true, duration: 850 });

  document.querySelectorAll('[data-count]').forEach(el => {
    let n = 0, end = +el.dataset.count, step = Math.ceil(end / 90);
    const intv = setInterval(() => {
      n += step;
      if (n >= end) { n = end; clearInterval(intv); }
      el.textContent = n.toLocaleString();
    }, 24);
  });

  if (window.Swiper && document.querySelector('.package-swiper')) {
    new Swiper('.package-swiper', {
      slidesPerView: 1.2,
      spaceBetween: 16,
      loop: true,
      autoplay: { delay: 2500 },
      pagination: { el: '.swiper-pagination', clickable: true },
      breakpoints: { 768: { slidesPerView: 2.2 }, 1024: { slidesPerView: 3 } }
    });
  }

  const destinationGrid = document.getElementById('destinationGrid');
  if (destinationGrid) {
    const selectedContinent = new URLSearchParams(window.location.search).get('continent');
    const visibleDestinations = selectedContinent
      ? destinationData.filter(([country]) => countryToContinent[country] === selectedContinent)
      : destinationData;

    destinationGrid.innerHTML = visibleDestinations.map((d, i) => `
      <article class="destination-card" data-aos="fade-up" data-aos-delay="${(i % 3) * 80}">
        <img src="${d[3]}" alt="${d[1]}" />
        <div class="content"><h3>${d[0]} - ${d[1]}</h3><p>${d[2]}</p><a class="btn btn-primary" href="contact.html">Book / Inquire</a></div>
      </article>`).join('');

    if (!visibleDestinations.length) {
      destinationGrid.innerHTML = `<article class="destination-card"><div class="content"><h3>${selectedContinent}</h3><p>More curated packages are coming soon for this region.</p><a class="btn btn-primary" href="contact.html">Ask About ${selectedContinent}</a></div></article>`;
    }
  }

  const servicesGrid = document.getElementById('servicesGrid');
  if (servicesGrid) {
    const icons = ['🛂', '📄', '🎓', '🏛️', '🛃', '📌', '🛡️', '🌐', '🛫', '🌍', '⛴️', '🚢', '🤝', '🏝️', '🗺️', '🏥', '🕵️', '🧑‍💻', '📑', '🏠', '📘'];
    servicesGrid.innerHTML = services.map((s, i) => `<article class="service-card" data-aos="fade-up" data-aos-delay="${(i % 4) * 60}"><h3>${icons[i] || '✦'} ${s}</h3></article>`).join('');
  }

  const form = document.getElementById('flightSearchForm');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const results = document.getElementById('flightResults');
      const rows = [
        ['Philippine Airlines', '06:30', '11:20', '₱13,900'],
        ['Cebu Pacific', '09:10', '14:05', '₱10,450'],
        ['Singapore Airlines', '13:40', '18:10', '₱17,880']
      ];
      results.innerHTML = rows.map(r => `<div class="result-item"><strong>${r[0]}</strong><span>Dep: ${r[1]}</span><span>Arr: ${r[2]}</span><b>${r[3]}</b></div>`).join('');
    });
  }

  const inquiryForm = document.getElementById('inquiryForm');
  if (inquiryForm) {
    inquiryForm.addEventListener('submit', async e => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(inquiryForm));
      const notice = document.getElementById('formResponse');
      try {
        const res = await fetch('/api/inquiry', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error();
        notice.textContent = 'Your inquiry has been sent. Our travel consultants will contact you shortly.';
      } catch {
        window.location.href = `mailto:fcpsunrise@gmail.com?subject=Travel Inquiry - ${encodeURIComponent(data.destination)}&body=${encodeURIComponent(`${data.name} | ${data.phone}\nTravel Date: ${data.travelDate}\n\n${data.message}`)}`;
        notice.textContent = 'Your inquiry has been sent. Our travel consultants will contact you shortly.';
      }
      inquiryForm.reset();
    });
  }

  const song = document.getElementById('themeSong');
  if (song) {
    song.volume = 0.5;
    const tryPlay = () => song.play().catch(() => {});
    tryPlay();
    const unlockAudio = () => {
      tryPlay();
      window.removeEventListener('click', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
    };
    window.addEventListener('click', unlockAudio, { once: true });
    window.addEventListener('touchstart', unlockAudio, { once: true });
    window.addEventListener('keydown', unlockAudio, { once: true });
  }
  if (song) song.play().catch(() => {});
});

window.updateContinentInfo = continent => {
  const panel = document.getElementById('continentInfo');
  if (!panel || !continents[continent]) return;
  panel.innerHTML = `<h3>${continent}</h3><p>${continents[continent].countries.join(' • ')}</p><a href="destinations.html?continent=${encodeURIComponent(continent)}" class="btn btn-primary">Explore ${continent}</a>`;
};

window.navigateToContinent = continent => {
  if (!continents[continent]) return;
  window.location.href = `destinations.html?continent=${encodeURIComponent(continent)}`;
};
