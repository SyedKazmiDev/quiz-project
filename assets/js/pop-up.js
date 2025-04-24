const modal = document.getElementById('quizModal');
    const guideBtn = document.getElementById('guideBtn');
    const closeModal = document.getElementById('closeModal');

    guideBtn.addEventListener('click', () => {
      modal.classList.remove('hidden');
    });

    closeModal.addEventListener('click', () => {
      modal.classList.add('hidden');
    });

    window.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.add('hidden');
      }
    });