/**
 * U-NYA Website Script
 * - 1초 후 고양이 캐릭터들이 아래에서 위로 시간차(stagger)를 두고 등장
 * - 등장 후 둥둥 떠있는 애니메이션(floating)으로 지속 연출
 * - 고양이 클릭 시 귀여운 사운드 및 모션 반응
 */

document.addEventListener('DOMContentLoaded', () => {
  const catItems = document.querySelectorAll('.cat-item');

  // Web Audio API를 이용한 귀여운 야옹(Meow) 효과음 생성기
  function playCuteMeowSound(pitch = 1.0) {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';

      const now = ctx.currentTime;
      // 야옹 피치 변동
      osc.frequency.setValueAtTime(550 * pitch, now);
      osc.frequency.exponentialRampToValueAtTime(850 * pitch, now + 0.1);
      osc.frequency.exponentialRampToValueAtTime(450 * pitch, now + 0.35);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.2, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.45);
    } catch (e) {
      console.log('Audio playback not supported or user gesture needed');
    }
  }

  /**
   * 핵심 애니메이션 로직
   * 1. 화면이 켜지면 1초(1000ms) 대기
   * 2. 12마리의 고양이가 시간차(stagger delay)를 두고 아래에서 위로 등장 (.appeared)
   * 3. 등장이 완료되면 둥둥 떠있는 애니메이션 (.floating) 적용
   */
  function initCatEntranceAnimation() {
    const INITIAL_DELAY = 1000; // 1초 후 등장 시작
    const STAGGER_INTERVAL = 140; // 고양이간 등장 시간차 (140ms)
    const TRANSITION_DURATION = 850; // 등장 슬라이드업 소요시간 (850ms)

    // 순차적으로 등장 적용
    catItems.forEach((cat, index) => {
      const entranceDelay = INITIAL_DELAY + (index * STAGGER_INTERVAL);

      // 시간차 등장
      setTimeout(() => {
        cat.classList.add('appeared');

        // 등장 슬라이드업이 끝나는 시점에 둥둥 떠있는 애니메이션 시작
        setTimeout(() => {
          cat.classList.add('floating');
        }, TRANSITION_DURATION);

      }, entranceDelay);
    });
  }

  /**
   * 고양이 클릭 및 인터랙션 이벤트
   */
  function initCatInteractions() {
    catItems.forEach(cat => {
      cat.addEventListener('click', () => {
        const catId = parseInt(cat.getAttribute('data-id'), 10);

        // 1. 팝 반응 애니메이션
        cat.classList.remove('pop-react');
        void cat.offsetWidth; // Reflow 트리거
        cat.classList.add('pop-react');

        // 2. 효과음 재생 (고양이마다 약간씩 다른 피치)
        const pitchMap = [1.0, 1.2, 0.8, 1.4, 0.9, 1.3, 0.7, 1.1, 0.85, 1.5, 0.95, 1.05];
        playCuteMeowSound(pitchMap[catId - 1] || 1.0);
      });
    });
  }

  /**
   * 네비게이션 및 버튼 스크롤 이벤트
   */
  function initNavEvents() {
    const scrollLinks = document.querySelectorAll('.nav-link, .char-btn');
    scrollLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#') && href.length > 1) {
          const targetEl = document.querySelector(href);
          if (targetEl) {
            e.preventDefault();
            targetEl.scrollIntoView({ behavior: 'smooth' });
          }
          if (link.classList.contains('nav-link')) {
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
          }
        }
      });
    });
  }

  /**
   * 갤러리 슬라이더 로직 (4개 이미지, 하얀선 화살표, 인디케이터 도트)
   */
  function initGallerySlider() {
    const slides = document.querySelectorAll('.gallery-slide');
    const dots = document.querySelectorAll('.gallery-dots .dot');
    const prevBtn = document.getElementById('prevSlideBtn');
    const nextBtn = document.getElementById('nextSlideBtn');
    if (!slides.length) return;

    let currentIndex = 0;

    function goToSlide(index) {
      if (index < 0) index = slides.length - 1;
      if (index >= slides.length) index = 0;

      slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
      });

      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
      });

      currentIndex = index;
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        goToSlide(currentIndex - 1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        goToSlide(currentIndex + 1);
      });
    }

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        goToSlide(i);
      });
    });
  }

  /**
   * 배경화면 가로 클릭 드래그 스크롤 로직
   */
  function initBgDragScroll() {
    const slider = document.querySelector('.bg-scroll-container');
    if (!slider) return;

    let isDown = false;
    let startX;
    let scrollLeft;

    slider.addEventListener('mousedown', (e) => {
      isDown = true;
      slider.classList.add('active');
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    });

    slider.addEventListener('mouseleave', () => {
      isDown = false;
      slider.classList.remove('active');
    });

    slider.addEventListener('mouseup', () => {
      isDown = false;
      slider.classList.remove('active');
    });

    slider.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 2; // 스크롤 감도
      slider.scrollLeft = scrollLeft - walk;
    });
  }

  // 초기화 실행
  initCatEntranceAnimation();
  initCatInteractions();
  initNavEvents();
  initGallerySlider();
  initBgDragScroll();
});
