document.addEventListener('DOMContentLoaded', function () {
  const slides = document.getElementById('testimonial-slides');
  const nextBtn = document.getElementById('next-btn');
  const prevBtn = document.getElementById('prev-btn');
  let currentIndex = 0;
  const totalSlides = slides.children.length;

  function getVisibleSlides() {
    return window.innerWidth < 768 ? 1 : 3;
  }

  function getMaxIndex() {
    return totalSlides - getVisibleSlides();
  }

  function updateSlider() {
    const visibleSlides = getVisibleSlides();
    const translateValue = currentIndex * (100 / visibleSlides);
    slides.style.transform = `translateX(-${translateValue}%)`;

    // Mostrar ou esconder botões conforme necessário
    prevBtn.style.display = currentIndex > 0 ? 'block' : 'none';
    nextBtn.style.display = currentIndex >= getMaxIndex() ? 'none' : 'block';
  }

  nextBtn.addEventListener('click', () => {
    if (currentIndex < getMaxIndex()) {
      currentIndex++;
      updateSlider();
    }
  });

  prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateSlider();
    }
  });

  // Atualiza o slider ao redimensionar a tela
  window.addEventListener('resize', () => {
    currentIndex = 0;
    updateSlider();
  });

  // Iniciar com estado correto
  updateSlider();
});
