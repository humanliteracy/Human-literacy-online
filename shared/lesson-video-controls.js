/* OP-104: shared controls for lessons that have an approved video asset.
   The video's native controls remain available. No tracking or network calls. */
(function () {
  'use strict';
  function time(value) {
    if (!Number.isFinite(value) || value < 0) return '0:00';
    const seconds = Math.floor(value);
    return Math.floor(seconds / 60) + ':' + String(seconds % 60).padStart(2, '0');
  }
  window.attachLessonVideoControls = function (section, video, sourceUrl) {
    if (!section || !video || !sourceUrl) return;
    const controls = document.createElement('div');
    controls.className = 'lesson-video-extra';
    controls.setAttribute('role', 'group');
    controls.setAttribute('aria-label', 'Video playback and download options');
    const back = document.createElement('button');
    back.type = 'button';
    back.textContent = '← Back 10 seconds';
    const forward = document.createElement('button');
    forward.type = 'button';
    forward.textContent = 'Forward 10 seconds →';
    const sliderLabel = document.createElement('label');
    sliderLabel.textContent = 'Video position';
    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = '0'; slider.max = '100'; slider.step = '1'; slider.value = '0';
    slider.disabled = true;
    slider.setAttribute('aria-label', 'Video position');
    const timeReadout = document.createElement('output');
    timeReadout.className = 'video-time';
    timeReadout.setAttribute('aria-live', 'off');
    timeReadout.textContent = '0:00';
    const download = document.createElement('a');
    download.className = 'video-download';
    download.href = sourceUrl;
    download.download = sourceUrl.split('/').pop().split('?')[0] || 'lesson-video.mp4';
    download.textContent = 'Download video (MP4)';
    const help = document.createElement('p');
    help.className = 'video-note';
    help.textContent = 'Use the seek bar or skip buttons. You can also continue the lesson without watching.';
    sliderLabel.append(slider);
    controls.append(back, forward, sliderLabel, timeReadout, download);
    section.append(controls, help);
    function update() {
      const duration = video.duration;
      const ready = Number.isFinite(duration) && duration > 0;
      slider.disabled = !ready;
      back.disabled = !ready;
      forward.disabled = !ready;
      if (ready) {
        slider.max = String(Math.floor(duration));
        slider.value = String(Math.min(Math.floor(video.currentTime), Math.floor(duration)));
      }
      timeReadout.textContent = time(video.currentTime) + (ready ? ' / ' + time(duration) : '');
    }
    function seek(to) {
      if (!Number.isFinite(video.duration) || video.duration <= 0) return;
      video.currentTime = Math.max(0, Math.min(video.duration, to));
      update();
    }
    back.addEventListener('click', () => seek(video.currentTime - 10));
    forward.addEventListener('click', () => seek(video.currentTime + 10));
    slider.addEventListener('input', () => seek(Number(slider.value)));
    ['loadedmetadata', 'durationchange', 'timeupdate', 'seeked'].forEach(event => video.addEventListener(event, update));
    video.addEventListener('error', () => {
      controls.hidden = true;
      help.textContent = 'This video is unavailable. You can still continue the lesson.';
    });
    const styles = document.createElement('style');
    styles.textContent = '.lesson-video-extra{display:flex;flex-wrap:wrap;justify-content:center;align-items:center;gap:9px;margin:14px auto 0;max-width:700px}.lesson-video-extra button,.lesson-video-extra a{min-height:44px;padding:9px 12px;border:1px solid #7bb8aa;border-radius:9px;background:#fff;color:#075d54;font:700 14px/1.4 system-ui,sans-serif;text-decoration:none;cursor:pointer}.lesson-video-extra button:disabled{opacity:.6;cursor:default}.lesson-video-extra label{display:flex;flex-direction:column;gap:4px;min-width:150px;flex:1;text-align:start;font:600 14px system-ui,sans-serif;color:#124c45}.lesson-video-extra input{width:100%;min-height:32px;accent-color:#087f75}.lesson-video-extra .video-time{font:600 14px system-ui,sans-serif;white-space:nowrap}.lesson-video-extra :is(button,a,input):focus-visible{outline:3px solid #b87520;outline-offset:2px}.video-note{font-size:14px;line-height:1.5;margin:8px 0;color:#355f59}@media(max-width:480px){.lesson-video-extra label{flex-basis:100%;order:-1}.lesson-video-extra .video-download{flex-basis:100%;text-align:center}}';
    section.append(styles);
    update();
  };
})();
