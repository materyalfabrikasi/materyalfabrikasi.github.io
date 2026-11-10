window.addEventListener('DOMContentLoaded', () => {
  const openingScreen = document.querySelector('#openingScreen');
  const openingStart = document.querySelector('#openingStart');
  const openingAudio = document.querySelector('#openingAudio');
  let openingFinished = false;

  const finishOpening = () => {
    if (openingFinished) return;
    openingFinished = true;
    openingAudio?.pause();
    openingScreen?.classList.add('is-leaving');
    window.setTimeout(() => {
      document.body.classList.remove('intro-active');
      if (openingScreen) openingScreen.hidden = true;
    }, 450);
  };

  if (!openingScreen || !openingStart || !openingAudio) {
    document.body.classList.remove('intro-active');
  } else {
    openingStart.addEventListener('click', async () => {
      if (openingStart.disabled) return;
      openingStart.disabled = true;
      openingAudio.currentTime = 0;
      try {
        await openingAudio.play();
      } catch (_) {
        openingStart.disabled = false;
      }
    });
    openingAudio.addEventListener('ended', finishOpening, {once:true});
    openingAudio.addEventListener('error', finishOpening, {once:true});
  }

  const title = document.createElement('div');
  title.className = 'game-title';
  title.textContent = 'Tıkla, Dinle.';
  document.body.appendChild(title);

  const bodyNav = document.createElement('nav');
  bodyNav.className = 'body-game-nav';
  bodyNav.setAttribute('aria-label','Oyun geçişleri');
  bodyNav.innerHTML = `<button class="body-back" type="button" aria-label="Önceki oyun">←</button><button class="body-next" type="button" aria-label="Sonraki oyun" disabled>İleri&nbsp; →</button>`;
  document.body.appendChild(bodyNav);
  const bodyBack = bodyNav.querySelector('.body-back');
  const bodyNext = bodyNav.querySelector('.body-next');

  const songScreen = document.createElement('section');
  songScreen.className = 'song-screen';
  songScreen.hidden = true;
  songScreen.innerHTML = `
    <img class="song-picture" src="body-song.png" alt="">
    <button class="song-back" type="button" aria-label="Oyuna dön">↶</button>
    <button class="song-next" type="button" aria-label="İleri">İleri&nbsp; →</button>
    <div class="song-controls">
      <button class="song-toggle" type="button" aria-label="Şarkıyı oynat">▶</button>
      <div class="song-track"><div class="song-fill"></div></div>
    </div>
    <audio class="song-audio" src="body-song.mp3" preload="auto"></audio>
  `;
  document.body.appendChild(songScreen);

  const activityComplete = document.createElement('section');
  activityComplete.className = 'activity-complete';
  activityComplete.hidden = true;
  activityComplete.innerHTML = `
    <div class="complete-confetti" aria-hidden="true">
      ${'<i></i>'.repeat(24)}
    </div>
    <div class="complete-card">
      <div class="complete-mark" aria-hidden="true">✓</div>
      <h2>Etkinlik Tamamlandı!</h2>
      <button class="complete-restart" type="button">↻ <span>Yeniden Oyna</span></button>
    </div>`;
  document.body.appendChild(activityComplete);

  const song = songScreen.querySelector('.song-audio');
  const songToggle = songScreen.querySelector('.song-toggle');
  const songFill = songScreen.querySelector('.song-fill');
  const songBack = songScreen.querySelector('.song-back');
  const songNext = songScreen.querySelector('.song-next');
  const completeRestart = activityComplete.querySelector('.complete-restart');
  const syncSongButton = () => {
    songToggle.textContent = song.paused ? '▶' : '❚❚';
    songToggle.classList.toggle('pulse', song.paused);
  };
  const openSongScreen = () => {
    songScreen.hidden = false;
    songScreen.classList.add('is-open');
    song.currentTime = 0;
    song.play().catch(syncSongButton);
    syncSongButton();
  };
  songToggle.addEventListener('click', () => song.paused ? song.play() : song.pause());
  song.addEventListener('play', syncSongButton);
  song.addEventListener('pause', syncSongButton);
  song.addEventListener('ended', syncSongButton);
  song.addEventListener('timeupdate', () => {
    songFill.style.width = `${song.duration ? song.currentTime / song.duration * 100 : 0}%`;
  });
  songBack.addEventListener('click', () => {
    song.pause();
    songScreen.classList.remove('is-open');
    window.setTimeout(() => { songScreen.hidden = true; }, 350);
  });
  songNext.addEventListener('click', () => {
    song.pause();
    songScreen.classList.remove('is-open');
    songScreen.hidden = true;
    activityComplete.hidden = false;
    requestAnimationFrame(() => activityComplete.classList.add('is-open'));
  });
  completeRestart.addEventListener('click', () => window.location.reload());

  const painScreen = document.createElement('section');
  painScreen.className = 'pain-screen';
  painScreen.hidden = true;
  painScreen.innerHTML = `
    <div class="pain-orb pain-orb-one" aria-hidden="true"></div>
    <div class="pain-orb pain-orb-two" aria-hidden="true"></div>
    <header class="pain-header">
      <h2>Dinle ve Görseli Seç.</h2>
      <button class="pain-listen" type="button" aria-label="Soruyu tekrar dinle"><span aria-hidden="true">🔊</span></button>
    </header>
    <div class="pain-options" role="group" aria-label="Çocuk görselleri">
      <button class="media-missing" type="button" data-pain="bas" aria-label="Birinci çocuk"><span class="pain-placeholder" aria-hidden="true">●</span><img src="assets/images/bas.png" alt=""></button>
      <button class="media-missing" type="button" data-pain="goz" aria-label="İkinci çocuk"><span class="pain-placeholder" aria-hidden="true">◉</span><img src="assets/images/goz.png" alt=""></button>
      <button class="media-missing" type="button" data-pain="kulak" aria-label="Üçüncü çocuk"><span class="pain-placeholder" aria-hidden="true">◖</span><img src="assets/images/kulak.png" alt=""></button>
      <button class="media-missing" type="button" data-pain="el" aria-label="Dördüncü çocuk"><span class="pain-placeholder" aria-hidden="true">✋</span><img src="assets/images/el.png" alt=""></button>
      <button class="media-missing" type="button" data-pain="ayak" aria-label="Beşinci çocuk"><span class="pain-placeholder" aria-hidden="true">◒</span><img src="assets/images/ayak.png" alt=""></button>
    </div>
    <footer class="pain-footer"><button class="pain-back" type="button" aria-label="Önceki oyun">←</button><div class="pain-progress-wrap"><div class="pain-dots"><i></i><i></i><i></i><i></i><i></i></div><b class="pain-count">1/5</b></div><button class="pain-next" type="button" aria-label="Sonraki oyun" disabled>İleri&nbsp; →</button></footer>
    <div class="pain-finish" hidden>
      <div class="pain-finish-stars" aria-hidden="true"><i>★</i><i>★</i><i>★</i></div>
      <div class="pain-finish-mark">✓</div>
      <h3>Harika!</h3>
      <div class="pain-finish-actions">
        <button class="pain-restart" type="button">↻ <span>Yeniden Oyna</span></button>
        <button class="pain-finish-next" type="button">İleri&nbsp; →</button>
      </div>
    </div>`;
  document.body.appendChild(painScreen);

  // Yeni sesler eklendiğinde yalnızca bu yolların değiştirilmesi yeterlidir.
  const painRounds = [
    {key:'bas', text:'Başı ağrıyan çocuğu bul.', question:['assets/audio/soru_bas.mp3','assets/audio/soru_bas.wav'], answer:['assets/audio/basim_agriyor.mp3','assets/audio/basim_agriyor.wav']},
    {key:'goz', text:'Gözü ağrıyan çocuğu bul.', question:['assets/audio/soru_goz.mp3','assets/audio/soru_goz.wav'], answer:['assets/audio/gozum_agriyor.wav?v=2']},
    {key:'kulak', text:'Kulağı ağrıyan çocuğu bul.', question:['assets/audio/soru_kulak.mp3','assets/audio/soru_kulak.wav'], answer:['assets/audio/kulagim_agriyor.mp3','assets/audio/kulagim_agriyor.wav']},
    {key:'el', text:'Eli ağrıyan çocuğu bul.', question:['assets/audio/elim_agriyor.wav?v=3'], answer:['assets/audio/elim_agriyor.wav?v=3']},
    {key:'ayak', text:'Ayağı ağrıyan çocuğu bul.', question:['assets/audio/soru_ayak.mp3','assets/audio/soru_ayak.wav'], answer:['assets/audio/ayagim_agriyor.mp3','assets/audio/ayagim_agriyor.wav']}
  ];
  const painAudio = new Audio();
  const painButtons = [...painScreen.querySelectorAll('.pain-options button')];
  const painDots = [...painScreen.querySelectorAll('.pain-dots i')];
  const painCount = painScreen.querySelector('.pain-count');
  const painListen = painScreen.querySelector('.pain-listen');
  const painBack = painScreen.querySelector('.pain-back');
  const painNext = painScreen.querySelector('.pain-next');
  const painFinish = painScreen.querySelector('.pain-finish');
  const painRestart = painScreen.querySelector('.pain-restart');
  const painFinishNext = painScreen.querySelector('.pain-finish-next');
  let painRound = 0;
  let painLocked = false;
  let painRun = 0;
  const waitPain = (milliseconds) => new Promise((resolve) => window.setTimeout(resolve, milliseconds));

  const stopPainAudio = () => {
    painRun += 1;
    painAudio.pause();
    painAudio.removeAttribute('src');
    painAudio.load();
  };
  const playPainAudio = (sources) => new Promise((resolve) => {
    const run = ++painRun;
    let index = 0;
    const finish = () => { if (run === painRun) resolve(true); };
    const tryNext = () => {
      if (run !== painRun) return resolve(false);
      if (index >= sources.length) return resolve(false);
      painAudio.src = sources[index++];
      painAudio.currentTime = 0;
      painAudio.onended = finish;
      painAudio.onerror = tryNext;
      const attempt = painAudio.play();
      if (attempt) attempt.catch(tryNext);
    };
    tryNext();
  });
  const updatePainProgress = () => {
    painDots.forEach((dot,index) => dot.classList.toggle('done', index < painRound));
    painCount.textContent = `${Math.min(painRound + 1, 5)}/5`;
  };
  const askPainQuestion = async () => {
    if (painLocked || painRound >= painRounds.length) return;
    painLocked = true;
    painListen.classList.add('speaking');
    const round = painRounds[painRound];
    // Önce seçim yönergesi dinlenir; öğrenci ses bittikten sonra görseli seçer.
    await playPainAudio(round.question);
    painListen.classList.remove('speaking');
    painLocked = false;
  };
  const startPainGame = () => {
    stopPainAudio();
    painRound = 0;
    painLocked = false;
    painNext.disabled = true;
    painFinish.hidden = true;
    painButtons.forEach((button) => {
      button.classList.remove('correct','wrong','completed');
      button.removeAttribute('data-completed');
      button.removeAttribute('aria-disabled');
    });
    updatePainProgress();
    window.setTimeout(askPainQuestion, 280);
  };
  const openPainGame = () => {
    painScreen.hidden = false;
    requestAnimationFrame(() => painScreen.classList.add('is-open'));
    startPainGame();
  };
  painScreen.querySelectorAll('.pain-options img').forEach((image) => {
    const button = image.closest('button');
    image.addEventListener('load', () => button.classList.remove('media-missing'));
    image.addEventListener('error', () => button.classList.add('media-missing'));
  });
  painListen.addEventListener('click', askPainQuestion);
  painButtons.forEach((button) => button.addEventListener('click', async () => {
    // Daha önce doğru seçilen görsel tekrar ses üretmez.
    if (painLocked || painRound >= painRounds.length || button.dataset.completed === 'true') return;
    if (button.dataset.pain !== painRounds[painRound].key) {
      painLocked = true;
      button.classList.remove('wrong');
      void button.offsetWidth;
      button.classList.add('wrong');
      await playPainAudio(['assets/audio/tekrar.mp3','assets/audio/tekrar.wav']);
      button.classList.remove('wrong');
      painLocked = false;
      return;
    }
    painLocked = true;
    button.dataset.completed = 'true';
    button.setAttribute('aria-disabled','true');
    button.classList.add('completed');
    button.classList.add('correct');
    // Doğru seçimde ses tekrar etmez ve Harika sesi kullanılmaz.
    await waitPain(650);
    button.classList.remove('correct');
    painRound += 1;
    updatePainProgress();
    if (painRound < painRounds.length) {
      painLocked = false;
      await askPainQuestion();
      return;
    }
    painDots.forEach((dot) => dot.classList.add('done'));
    painCount.textContent = '5/5';
    painFinish.hidden = false;
    painNext.disabled = false;
    painLocked = false;
  }));
  painRestart.addEventListener('click', startPainGame);
  painBack.addEventListener('click', () => {
    stopPainAudio();
    painScreen.classList.remove('is-open');
    window.setTimeout(() => { painScreen.hidden = true; }, 300);
  });
  const goPainToSong = () => {
    stopPainAudio();
    painScreen.classList.remove('is-open');
    painScreen.hidden = true;
    // Şarkıyı doğrudan kullanıcı tıklaması içinde başlat; mobil tarayıcılar
    // gecikmeli otomatik oynatmayı engelleyebilir.
    openSongScreen();
  };
  painNext.addEventListener('click', () => {
    if (!painNext.disabled) goPainToSong();
  });
  painFinishNext.addEventListener('click', goPainToSong);

  const emotionScreen = document.createElement('section');
  emotionScreen.className = 'emotion-screen';
  emotionScreen.hidden = true;
  emotionScreen.innerHTML = `
    <div class="emotion-top">
      <button class="emotion-back" type="button" aria-label="Geri">↶</button>
      <h2>Duyguyu Bul.</h2>
      <div class="emotion-progress"><span></span><span></span><span></span><span></span></div>
      <button class="emotion-next" type="button" aria-label="İleri" disabled>İleri&nbsp; →</button>
    </div>
    <div class="emotion-stage">
      <video class="emotion-video" playsinline></video>
      <button class="emotion-play" type="button" aria-label="Videoyu oynat">▶</button>
    </div>
    <div class="emotion-question" hidden>
      <div class="emotion-options">
        <button type="button" data-emotion="surprised" aria-label="Şaşkınım"><img class="emotion-face-image" src="assets/images/saskin.png" alt=""><span>Şaşkınım</span></button>
        <button type="button" data-emotion="happy" aria-label="Mutluyum"><img class="emotion-face-image" src="assets/images/mutlu.png" alt=""><span>Mutluyum</span></button>
        <button type="button" data-emotion="sad" aria-label="Üzgünüm"><img class="emotion-face-image" src="assets/images/uzgun.png" alt=""><span>Üzgünüm</span></button>
        <button type="button" data-emotion="angry" aria-label="Kızgınım"><img class="emotion-face-image" src="assets/images/kizgin.png" alt=""><span>Kızgınım</span></button>
      </div>
    </div>
    <div class="emotion-celebrate" hidden>★</div>
  `;
  document.body.appendChild(emotionScreen);

  const emotionRounds = [
    {key:'surprised', src:'şaşşkınımmm.mp4'},
    {key:'happy', src:'mutluyumm.mp4'},
    {key:'sad', src:'üzgünümm.mp4'},
    {key:'angry', src:'kızgınımm.mp4'}
  ];
  const emotionVideo = emotionScreen.querySelector('.emotion-video');
  const emotionPlay = emotionScreen.querySelector('.emotion-play');
  const emotionQuestion = emotionScreen.querySelector('.emotion-question');
  const emotionOptions = [...emotionScreen.querySelectorAll('.emotion-options button')];
  const emotionDots = [...emotionScreen.querySelectorAll('.emotion-progress span')];
  const emotionCelebrate = emotionScreen.querySelector('.emotion-celebrate');
  const emotionBack = emotionScreen.querySelector('.emotion-back');
  const emotionNext = emotionScreen.querySelector('.emotion-next');
  let emotionRound = 0;
  let emotionFreeChoice = false;

  const startEmotionRound = () => {
    const round = emotionRounds[emotionRound];
    emotionDots.forEach((dot,index) => dot.classList.toggle('done', index < emotionRound));
    // Dört duygu seçeneği her turda görünür kalır.
    emotionOptions.forEach((option) => {
      option.hidden = false;
      option.style.removeProperty('order');
      option.classList.remove('correct','wrong');
    });
    emotionQuestion.hidden = true;
    emotionPlay.hidden = true;
    emotionVideo.src = round.src;
    emotionVideo.currentTime = 0;
    emotionVideo.play().catch(() => { emotionPlay.hidden = false; });
  };
  const openEmotionGame = () => {
    song.pause();
    songScreen.classList.remove('is-open');
    window.setTimeout(() => { songScreen.hidden = true; }, 300);
    emotionRound = 0;
    emotionFreeChoice = false;
    emotionNext.disabled = true;
    emotionOptions.forEach((item) => item.classList.remove('free-choice'));
    emotionScreen.hidden = false;
    requestAnimationFrame(() => emotionScreen.classList.add('is-open'));
    startEmotionRound();
  };
  emotionPlay.addEventListener('click', () => emotionVideo.play());
  emotionVideo.addEventListener('play', () => { emotionPlay.hidden = true; });
  emotionVideo.addEventListener('ended', () => { emotionQuestion.hidden = false; });
  emotionOptions.forEach((option) => option.addEventListener('click', () => {
    if (emotionFreeChoice) {
      emotionQuestion.hidden = true;
      emotionCelebrate.hidden = false;
      window.setTimeout(() => {
        emotionCelebrate.hidden = true;
        emotionVideo.pause();
        emotionScreen.classList.remove('is-open');
        window.setTimeout(() => { emotionScreen.hidden = true; }, 350);
      }, 850);
      return;
    }
    const correct = option.dataset.emotion === emotionRounds[emotionRound].key;
    if (!correct) {
      option.classList.remove('wrong');
      void option.offsetWidth;
      option.classList.add('wrong');
      return;
    }
    option.classList.add('correct');
    emotionCelebrate.hidden = false;
    window.setTimeout(() => {
      option.classList.remove('correct');
      emotionCelebrate.hidden = true;
      emotionRound += 1;
      if (emotionRound < emotionRounds.length) {
        startEmotionRound();
      } else {
        emotionDots.forEach((dot) => dot.classList.add('done'));
        emotionVideo.pause();
        emotionQuestion.hidden = true;
        emotionNext.disabled = false;
      }
    }, 850);
  }));
  emotionBack.addEventListener('click', () => {
    emotionVideo.pause();
    emotionScreen.classList.remove('is-open');
    window.setTimeout(() => { emotionScreen.hidden = true; }, 350);
  });
  emotionNext.addEventListener('click', () => {
    if (emotionNext.disabled) return;
    emotionVideo.pause();
    bodyNext.disabled = true;
    emotionScreen.classList.remove('is-open');
    window.setTimeout(() => { emotionScreen.hidden = true; }, 350);
  });
  bodyBack.addEventListener('click', openEmotionGame);
  bodyNext.addEventListener('click', () => {
    if (!bodyNext.disabled) openPainGame();
  });
  const gardenScreen = document.createElement('section');
  gardenScreen.className = 'garden-screen';
  gardenScreen.hidden = false;
  gardenScreen.innerHTML = `
    <div class="garden-card">
      <video class="garden-video" src="assets/videos/okul-bahcesi.mp4" playsinline preload="metadata"></video>
      <div class="garden-heading"><b>İzle ve Cevapla.</b><span>1</span></div>
      <div class="garden-placeholder" hidden><span>🎬</span><b>Video hazırlanıyor</b></div>
      <button class="garden-start" type="button" aria-label="Videoyu başlat">▶</button>
      <div class="garden-question" hidden>
        <button class="garden-listen" type="button" aria-label="Soruyu tekrar dinle">🔊</button>
        <div class="garden-faces">
          <button type="button" data-emotion="angry" aria-label="Kızgın"><span class="garden-face-wrap"><img src="assets/images/kizgin.png" alt=""><span class="mini-face angry"><i class="brow left"></i><i class="brow right"></i><i class="eye left"></i><i class="eye right"></i><i class="mouth"></i></span></span><strong>Kızgın</strong></button>
          <button type="button" data-emotion="surprised" aria-label="Şaşkın"><span class="garden-face-wrap"><img src="assets/images/saskin.png" alt=""><span class="mini-face surprised"><i class="brow left"></i><i class="brow right"></i><i class="eye left"></i><i class="eye right"></i><i class="mouth"></i><i class="cheek left"></i><i class="cheek right"></i></span></span><strong>Şaşkın</strong></button>
        </div>
        <div class="garden-nav"><button class="garden-back" type="button" aria-label="Geri">←</button><button class="garden-next" type="button" aria-label="İleri" disabled>İleri&nbsp; →</button></div>
        <div class="garden-success" hidden>★</div>
      </div>
    </div>`;
  document.body.appendChild(gardenScreen);
  gardenScreen.querySelectorAll('.garden-faces img').forEach((image) => {
    image.addEventListener('error', () => { image.hidden = true; });
  });

  const gardenVideo = gardenScreen.querySelector('.garden-video');
  const gardenStart = gardenScreen.querySelector('.garden-start');
  const gardenQuestion = gardenScreen.querySelector('.garden-question');
  const gardenNext = gardenScreen.querySelector('.garden-next');
  const gardenSuccess = gardenScreen.querySelector('.garden-success');
  const gardenPlaceholder = gardenScreen.querySelector('.garden-placeholder');
  const gardenAudio = new Audio();
  const gardenSounds = {question:'assets/audio/soru_saskin.wav',answer:'assets/audio/saskin.wav',great:'assets/audio/harika.wav',retry:'assets/audio/tekrar.wav'};
  let gardenAfterAudio = null;
  const playGardenSound = (src, after = null) => {
    gardenAfterAudio = after;
    gardenAudio.pause();
    gardenAudio.currentTime = 0;
    gardenAudio.src = src;
    gardenAudio.play().catch(() => { gardenAfterAudio = null; });
  };
  gardenAudio.addEventListener('ended', () => {
    const after = gardenAfterAudio;
    gardenAfterAudio = null;
    if (after) after();
  });
  const showGardenQuestion = () => {
    gardenStart.hidden = true;
    gardenQuestion.hidden = false;
    playGardenSound(gardenSounds.question);
  };
  const resetGarden = () => {
    gardenAfterAudio = null;
    gardenAudio.pause();
    gardenVideo.pause();
    gardenQuestion.hidden = true;
    gardenNext.disabled = true;
    gardenSuccess.hidden = true;
    gardenScreen.querySelectorAll('.garden-faces button').forEach((button) => button.classList.remove('selected','wrong'));
    gardenVideo.currentTime = 0;
    gardenStart.hidden = false;
  };
  const openGardenGame = () => {
    gardenScreen.hidden = false;
    gardenScreen.classList.remove('leaving');
    resetGarden();
  };
  gardenStart.addEventListener('click', () => {
    if (gardenVideo.error) { showGardenQuestion(); return; }
    gardenStart.hidden = true;
    gardenVideo.currentTime = 0;
    gardenVideo.play().catch(() => { gardenStart.hidden = false; });
  });
  gardenVideo.addEventListener('ended', showGardenQuestion);
  gardenVideo.addEventListener('error', () => {
    gardenPlaceholder.hidden = false;
    gardenVideo.hidden = true;
  });
  gardenScreen.querySelector('.garden-listen').addEventListener('click', () => playGardenSound(gardenSounds.question));
  gardenScreen.querySelectorAll('.garden-faces button').forEach((button) => button.addEventListener('click', () => {
    if (!gardenNext.disabled) return;
    gardenScreen.querySelectorAll('.garden-faces button').forEach((item) => item.classList.remove('selected','wrong'));
    if (button.dataset.emotion !== 'surprised') {
      button.classList.add('wrong');
      playGardenSound(gardenSounds.retry);
      return;
    }
    button.classList.add('selected');
    playGardenSound(gardenSounds.answer, () => playGardenSound(gardenSounds.great, () => {
      gardenSuccess.hidden = false;
      gardenNext.disabled = false;
      window.setTimeout(() => { gardenSuccess.hidden = true; }, 850);
    }));
  }));
  gardenScreen.querySelector('.garden-back').addEventListener('click', resetGarden);

  const sadScreen = document.createElement('section');
  sadScreen.className = 'sad-screen';
  sadScreen.hidden = true;
  sadScreen.innerHTML = `
    <div class="sad-card">
      <video class="sad-video" src="assets/videos/uzgun.mp4" playsinline preload="metadata"></video>
      <div class="sad-heading"><b>İzle ve Cevapla.</b><span>2</span></div>
      <div class="sad-placeholder" hidden><span>🎬</span><b>Video hazırlanıyor</b></div>
      <button class="sad-start" type="button" aria-label="Videoyu başlat">▶</button>
      <div class="sad-question" hidden>
        <button class="sad-listen" type="button" aria-label="Soruyu tekrar dinle">🔊</button>
        <div class="sad-faces">
          <button type="button" data-emotion="happy" aria-label="Mutlu"><img src="assets/images/mutlu.png" alt=""><span class="sad-face happy"><i class="eye left"></i><i class="eye right"></i><i class="mouth"></i><i class="cheek left"></i><i class="cheek right"></i></span></button>
          <button type="button" data-emotion="sad" aria-label="Üzgün"><img src="assets/images/uzgun.png" alt=""><span class="sad-face sad"><i class="brow left"></i><i class="brow right"></i><i class="eye left"></i><i class="eye right"></i><i class="mouth"></i><i class="cheek left"></i><i class="cheek right"></i></span></button>
        </div>
        <div class="sad-nav"><button class="sad-back" type="button" aria-label="Geri">←</button><button class="sad-next" type="button" aria-label="İleri" disabled>İleri&nbsp; →</button></div>
        <div class="sad-success" hidden>★</div>
      </div>
    </div>`;
  document.body.appendChild(sadScreen);
  sadScreen.querySelectorAll('.sad-faces img').forEach((image) => image.addEventListener('error', () => { image.hidden = true; }));

  const sadVideo = sadScreen.querySelector('.sad-video');
  const sadStart = sadScreen.querySelector('.sad-start');
  const sadQuestion = sadScreen.querySelector('.sad-question');
  const sadNext = sadScreen.querySelector('.sad-next');
  const sadSuccess = sadScreen.querySelector('.sad-success');
  const sadPlaceholder = sadScreen.querySelector('.sad-placeholder');
  const sadAudio = new Audio();
  const sadSounds = {question:'assets/audio/soru_uzgun.wav',answer:'assets/audio/uzgun.wav',great:'assets/audio/harika.wav',retry:'assets/audio/tekrar.wav'};
  let sadAfterAudio = null;
  let sadLocked = false;
  const playSadSound = (src, after = null) => {
    sadAfterAudio = after;
    sadAudio.pause();
    sadAudio.currentTime = 0;
    sadAudio.src = src;
    sadAudio.play().catch(() => { sadAfterAudio = null; });
  };
  sadAudio.addEventListener('ended', () => {
    const after = sadAfterAudio;
    sadAfterAudio = null;
    if (after) after();
  });
  const showSadQuestion = () => {
    sadStart.hidden = true;
    sadQuestion.hidden = false;
    playSadSound(sadSounds.question);
  };
  const resetSad = () => {
    sadAfterAudio = null;
    sadLocked = false;
    sadAudio.pause();
    sadVideo.pause();
    sadQuestion.hidden = true;
    sadNext.disabled = true;
    sadSuccess.hidden = true;
    sadScreen.querySelectorAll('.sad-faces button').forEach((button) => button.classList.remove('selected','wrong'));
    sadVideo.currentTime = 0;
    sadStart.hidden = false;
  };
  const openSadGame = () => {
    gardenScreen.hidden = true;
    gardenScreen.classList.remove('leaving');
    sadScreen.hidden = false;
    sadScreen.classList.remove('leaving');
    resetSad();
    if (sadVideo.error) { sadStart.hidden = false; return; }
    sadStart.hidden = true;
    sadVideo.play().catch(() => { sadStart.hidden = false; });
  };
  sadStart.addEventListener('click', () => {
    if (sadVideo.error) { showSadQuestion(); return; }
    sadStart.hidden = true;
    sadVideo.currentTime = 0;
    sadVideo.play().catch(() => { sadStart.hidden = false; });
  });
  sadVideo.addEventListener('ended', () => {
    sadVideo.pause();
    showSadQuestion();
  });
  sadVideo.addEventListener('error', () => {
    sadPlaceholder.hidden = false;
    sadVideo.hidden = true;
  });
  sadScreen.querySelector('.sad-listen').addEventListener('click', () => playSadSound(sadSounds.question));
  sadScreen.querySelectorAll('.sad-faces button').forEach((button) => button.addEventListener('click', () => {
    if (sadLocked) return;
    sadScreen.querySelectorAll('.sad-faces button').forEach((item) => item.classList.remove('selected','wrong'));
    if (button.dataset.emotion !== 'sad') {
      button.classList.add('wrong');
      playSadSound(sadSounds.retry);
      return;
    }
    sadLocked = true;
    button.classList.add('selected');
    playSadSound(sadSounds.answer, () => playSadSound(sadSounds.great, () => {
      sadSuccess.hidden = false;
      sadNext.disabled = false;
      window.setTimeout(() => { sadSuccess.hidden = true; }, 850);
    }));
  }));
  sadScreen.querySelector('.sad-back').addEventListener('click', () => {
    resetSad();
    sadScreen.hidden = true;
    gardenScreen.hidden = false;
  });

  const angryScreen = document.createElement('section');
  angryScreen.className = 'sad-screen angry-screen';
  angryScreen.hidden = true;
  angryScreen.innerHTML = `
    <div class="sad-card angry-card">
      <video class="sad-video angry-video" src="assets/videos/kizgin.mp4" playsinline preload="metadata"></video>
      <div class="sad-heading angry-heading"><b>İzle ve Cevapla.</b><span>3</span></div>
      <div class="sad-placeholder angry-placeholder" hidden><span>🎬</span><b>Video hazırlanıyor</b></div>
      <button class="sad-start angry-start" type="button" aria-label="Videoyu başlat">▶</button>
      <div class="sad-question angry-question" hidden>
        <button class="sad-listen angry-listen" type="button" aria-label="Soruyu tekrar dinle">🔊</button>
        <div class="sad-faces angry-faces">
          <button type="button" data-emotion="happy" aria-label="Mutlu"><img src="assets/images/mutlu.png" alt=""><span class="sad-face happy"><i class="eye left"></i><i class="eye right"></i><i class="mouth"></i><i class="cheek left"></i><i class="cheek right"></i></span></button>
          <button type="button" data-emotion="angry" aria-label="Kızgın"><img src="assets/images/kizgin.png" alt=""><span class="sad-face angry"><i class="brow left"></i><i class="brow right"></i><i class="eye left"></i><i class="eye right"></i><i class="mouth"></i></span></button>
        </div>
        <div class="sad-nav angry-nav"><button class="sad-back angry-back" type="button" aria-label="Geri">←</button><button class="sad-next angry-next" type="button" aria-label="İleri" disabled>İleri&nbsp; →</button></div>
        <div class="sad-success angry-success" hidden>★</div>
      </div>
    </div>`;
  document.body.appendChild(angryScreen);
  angryScreen.querySelectorAll('.angry-faces img').forEach((image) => image.addEventListener('error', () => { image.hidden = true; }));

  const angryVideo = angryScreen.querySelector('.angry-video');
  const angryStart = angryScreen.querySelector('.angry-start');
  const angryQuestion = angryScreen.querySelector('.angry-question');
  const angryNext = angryScreen.querySelector('.angry-next');
  const angrySuccess = angryScreen.querySelector('.angry-success');
  const angryPlaceholder = angryScreen.querySelector('.angry-placeholder');
  const angryAudio = new Audio();
  const angrySounds = {question:'assets/audio/soru_kizgin.wav',answer:'assets/audio/kizgin.wav',great:'assets/audio/harika.wav',retry:'assets/audio/tekrar.wav'};
  let angryAfterAudio = null;
  let angryLocked = false;
  const playAngrySound = (src, after = null) => {
    angryAfterAudio = after;
    angryAudio.pause();
    angryAudio.currentTime = 0;
    angryAudio.src = src;
    angryAudio.play().catch(() => { angryAfterAudio = null; });
  };
  angryAudio.addEventListener('ended', () => {
    const after = angryAfterAudio;
    angryAfterAudio = null;
    if (after) after();
  });
  const showAngryQuestion = () => {
    angryStart.hidden = true;
    angryQuestion.hidden = false;
    playAngrySound(angrySounds.question);
  };
  const resetAngry = () => {
    angryAfterAudio = null;
    angryLocked = false;
    angryAudio.pause();
    angryVideo.pause();
    angryQuestion.hidden = true;
    angryNext.disabled = true;
    angrySuccess.hidden = true;
    angryScreen.querySelectorAll('.angry-faces button').forEach((button) => button.classList.remove('selected','wrong'));
    angryVideo.currentTime = 0;
    angryStart.hidden = false;
  };
  const openAngryGame = () => {
    sadScreen.hidden = true;
    sadScreen.classList.remove('leaving');
    angryScreen.hidden = false;
    angryScreen.classList.remove('leaving');
    resetAngry();
    if (angryVideo.error) { angryStart.hidden = false; return; }
    angryStart.hidden = true;
    angryVideo.play().catch(() => { angryStart.hidden = false; });
  };
  angryStart.addEventListener('click', () => {
    if (angryVideo.error) { showAngryQuestion(); return; }
    angryStart.hidden = true;
    angryVideo.currentTime = 0;
    angryVideo.play().catch(() => { angryStart.hidden = false; });
  });
  angryVideo.addEventListener('ended', () => { angryVideo.pause(); showAngryQuestion(); });
  angryVideo.addEventListener('error', () => {
    angryPlaceholder.hidden = false;
    angryVideo.hidden = true;
  });
  angryScreen.querySelector('.angry-listen').addEventListener('click', () => playAngrySound(angrySounds.question));
  angryScreen.querySelectorAll('.angry-faces button').forEach((button) => button.addEventListener('click', () => {
    if (angryLocked) return;
    angryScreen.querySelectorAll('.angry-faces button').forEach((item) => item.classList.remove('selected','wrong'));
    if (button.dataset.emotion !== 'angry') {
      button.classList.add('wrong');
      playAngrySound(angrySounds.retry);
      return;
    }
    angryLocked = true;
    button.classList.add('selected');
    playAngrySound(angrySounds.answer, () => playAngrySound(angrySounds.great, () => {
      angrySuccess.hidden = false;
      angryNext.disabled = false;
      window.setTimeout(() => { angrySuccess.hidden = true; }, 850);
    }));
  }));
  angryScreen.querySelector('.angry-back').addEventListener('click', () => {
    resetAngry();
    angryScreen.hidden = true;
    sadScreen.hidden = false;
  });

  const happyScreen = document.createElement('section');
  happyScreen.className = 'sad-screen happy-screen';
  happyScreen.hidden = true;
  happyScreen.innerHTML = `
    <div class="sad-card happy-card">
      <video class="sad-video happy-video" src="assets/videos/mutlu.mp4" playsinline preload="metadata"></video>
      <div class="sad-heading happy-heading"><b>İzle ve Cevapla.</b><span>4</span></div>
      <div class="sad-placeholder happy-placeholder" hidden><span>🎬</span><b>Video hazırlanıyor</b></div>
      <button class="sad-start happy-start" type="button" aria-label="Videoyu başlat">▶</button>
      <div class="sad-question happy-question" hidden>
        <button class="sad-listen happy-listen" type="button" aria-label="Soruyu tekrar dinle">🔊</button>
        <div class="sad-faces happy-faces">
          <button type="button" data-emotion="happy" aria-label="Mutlu"><img src="assets/images/mutlu.png" alt=""><span class="sad-face happy"><i class="eye left"></i><i class="eye right"></i><i class="mouth"></i><i class="cheek left"></i><i class="cheek right"></i></span></button>
          <button type="button" data-emotion="sad" aria-label="Üzgün"><img src="assets/images/uzgun.png" alt=""><span class="sad-face sad"><i class="brow left"></i><i class="brow right"></i><i class="eye left"></i><i class="eye right"></i><i class="mouth"></i><i class="cheek left"></i><i class="cheek right"></i></span></button>
        </div>
        <div class="sad-nav happy-nav"><button class="sad-back happy-back" type="button" aria-label="Geri">←</button><span></span></div>
        <div class="sad-success happy-success" hidden>★</div>
      </div>
    </div>`;
  document.body.appendChild(happyScreen);
  happyScreen.querySelectorAll('.happy-faces img').forEach((image) => image.addEventListener('error', () => { image.hidden = true; }));

  const finalScreen = document.createElement('section');
  finalScreen.className = 'final-screen';
  finalScreen.hidden = true;
  finalScreen.innerHTML = `<div class="final-card"><div class="final-stars" aria-hidden="true"><i>★</i><i>★</i><i>★</i></div><div class="final-badge">✓</div><h2>Harika!</h2><div class="final-actions"><button class="restart-game" type="button">↻ <span>Yeniden Oyna</span></button><button class="final-next" type="button" aria-label="İleri">İleri&nbsp; →</button></div></div>`;
  document.body.appendChild(finalScreen);
  const feelingLabels = {happy:'Mutlu',sad:'Üzgün',angry:'Kızgın',surprised:'Şaşkın'};
  document.querySelectorAll('.sad-faces button').forEach((button) => {
    const label = document.createElement('strong');
    label.className = 'feeling-label';
    label.textContent = feelingLabels[button.dataset.emotion];
    button.setAttribute('aria-label', label.textContent);
    button.appendChild(label);
  });

  const happyVideo = happyScreen.querySelector('.happy-video');
  const happyStart = happyScreen.querySelector('.happy-start');
  const happyQuestion = happyScreen.querySelector('.happy-question');
  const happySuccess = happyScreen.querySelector('.happy-success');
  const happyPlaceholder = happyScreen.querySelector('.happy-placeholder');
  const happyAudio = new Audio();
  const happySounds = {question:'assets/audio/soru_mutlu.wav',answer:'assets/audio/mutlu.wav',great:'assets/audio/harika.wav',retry:'assets/audio/tekrar.wav'};
  let happyAfterAudio = null;
  let happyLocked = false;
  let happyPromptPlaying = false;
  const playHappySound = (src, after = null) => {
    happyAfterAudio = after;
    happyAudio.pause();
    happyAudio.currentTime = 0;
    happyAudio.src = src;
    happyAudio.play().catch(() => { happyAfterAudio = null; });
  };
  happyAudio.addEventListener('ended', () => {
    happyPromptPlaying = false;
    const after = happyAfterAudio;
    happyAfterAudio = null;
    if (after) after();
  });
  const showHappyQuestion = () => {
    happyStart.hidden = true;
    happyQuestion.hidden = false;
    happyPromptPlaying = true;
    playHappySound(happySounds.question);
  };
  const resetHappy = () => {
    happyAfterAudio = null;
    happyLocked = false;
    happyPromptPlaying = false;
    happyAudio.pause();
    happyVideo.pause();
    happyQuestion.hidden = true;
    happySuccess.hidden = true;
    happyScreen.querySelectorAll('.happy-faces button').forEach((button) => button.classList.remove('selected','wrong'));
    happyVideo.currentTime = 0;
    happyStart.hidden = false;
  };
  const openHappyGame = () => {
    angryScreen.hidden = true;
    angryScreen.classList.remove('leaving');
    happyScreen.hidden = false;
    happyScreen.classList.remove('leaving');
    resetHappy();
    if (happyVideo.error) { happyStart.hidden = false; return; }
    happyStart.hidden = true;
    happyVideo.play().catch(() => { happyStart.hidden = false; });
  };
  const openFinal = () => {
    happyAudio.pause();
    happyVideo.pause();
    happyScreen.classList.add('leaving');
    window.setTimeout(() => {
      happyScreen.hidden = true;
      finalScreen.hidden = false;
      requestAnimationFrame(() => finalScreen.classList.add('is-open'));
    }, 350);
  };
  happyStart.addEventListener('click', () => {
    if (happyVideo.error) { showHappyQuestion(); return; }
    happyStart.hidden = true;
    happyVideo.currentTime = 0;
    happyVideo.play().catch(() => { happyStart.hidden = false; });
  });
  happyVideo.addEventListener('ended', () => { happyVideo.pause(); showHappyQuestion(); });
  happyVideo.addEventListener('error', () => {
    happyPlaceholder.hidden = false;
    happyVideo.hidden = true;
  });
  happyScreen.querySelector('.happy-listen').addEventListener('click', () => {
    happyPromptPlaying = true;
    playHappySound(happySounds.question);
  });
  happyScreen.querySelectorAll('.happy-faces button').forEach((button) => button.addEventListener('click', () => {
    if (happyLocked || happyPromptPlaying) return;
    happyScreen.querySelectorAll('.happy-faces button').forEach((item) => item.classList.remove('selected','wrong'));
    if (button.dataset.emotion !== 'happy') {
      button.classList.add('wrong');
      playHappySound(happySounds.retry);
      return;
    }
    happyLocked = true;
    button.classList.add('selected');
    playHappySound(happySounds.answer, () => playHappySound(happySounds.great, () => {
      happySuccess.hidden = false;
      window.setTimeout(openFinal, 900);
    }));
  }));
  happyScreen.querySelector('.happy-back').addEventListener('click', () => {
    resetHappy();
    happyScreen.hidden = true;
    angryScreen.hidden = false;
  });
  finalScreen.querySelector('.restart-game').addEventListener('click', () => {
    [gardenVideo,sadVideo,angryVideo,happyVideo,emotionVideo].forEach((media) => media.pause());
    [gardenAudio,sadAudio,angryAudio,happyAudio].forEach((media) => media.pause());
    resetGarden();resetSad();resetAngry();resetHappy();
    finalScreen.classList.remove('is-open');
    finalScreen.hidden = true;
    stopPainAudio();
    bodyNext.disabled = true;
    [gardenScreen,sadScreen,angryScreen,happyScreen,emotionScreen,painScreen,songScreen].forEach((screen) => { screen.hidden = true; screen.classList.remove('is-open','leaving'); });
    openGardenGame();
  });
  finalScreen.querySelector('.final-next').addEventListener('click', () => {
    finalScreen.classList.remove('is-open');
    finalScreen.hidden = true;
    openEmotionGame();
  });

  angryNext.addEventListener('click', () => {
    if (angryNext.disabled) return;
    angryAfterAudio = null;
    angryAudio.pause();
    angryVideo.pause();
    angryScreen.classList.add('leaving');
    window.setTimeout(() => { angryScreen.hidden = true; openHappyGame(); }, 350);
  });

  sadNext.addEventListener('click', () => {
    if (sadNext.disabled) return;
    sadAfterAudio = null;
    sadAudio.pause();
    sadVideo.pause();
    sadScreen.classList.add('leaving');
    window.setTimeout(() => { sadScreen.hidden = true; openAngryGame(); }, 350);
  });

  gardenNext.addEventListener('click', () => {
    if (gardenNext.disabled) return;
    gardenAfterAudio = null;
    gardenAudio.pause();
    gardenVideo.pause();
    gardenScreen.classList.add('leaving');
    window.setTimeout(() => { gardenScreen.hidden = true; openSadGame(); }, 350);
  });

  const player = document.querySelector('#player');
  if (!player) return;

  const hint = document.querySelector('#hint');
  const hidePlayButton = () => {
    if (!hint) return;
    hint.hidden = true;
    hint.classList.add('is-hidden');
    hint.style.setProperty('display', 'none', 'important');
  };

  document.querySelectorAll('.choice').forEach((button) => {
    button.addEventListener('click', hidePlayButton, {capture: true});
  });

  player.addEventListener('play', hidePlayButton);
  player.addEventListener('playing', hidePlayButton);

  player.addEventListener('ended', () => {
    const activeButton = document.querySelector('.choice.active');
    if (activeButton?.classList.contains('c6')) {
      bodyNext.disabled = false;
    }
  });
});
