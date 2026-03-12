if (window.gsap) {
  gsap.from('.hero h1', { y: 40, opacity: 0, duration: 1, delay: .2 });
  gsap.from('.hero p, .hero-actions', { y: 20, opacity: 0, duration: .9, stagger: .1, delay: .45 });
  gsap.utils.toArray('.stat-card,.package-card,.destination-card,.service-card').forEach(el => {
    gsap.from(el, {
      scrollTrigger: undefined,
      y: 35,
      opacity: 0,
      duration: .7,
      ease: 'power2.out',
      delay: 0.05
    });
  });
}
