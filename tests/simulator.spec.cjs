const { reveal, feedback, replies } = require('./review-helpers.cjs');
const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
  page.browserErrors = [];
  page.on('pageerror', error => page.browserErrors.push(error.message));
  await page.addInitScript(() => {
    window.captureErrors = [];
    const capture = navigator.mediaDevices?.getUserMedia?.bind(navigator.mediaDevices);
    if (capture) navigator.mediaDevices.getUserMedia = async constraints => {
      try { return await capture(constraints); }
      catch (error) { captureErrors.push({ name: error.name, message: error.message }); throw error; }
    };
  });
});
test.afterEach(async ({ page }, testInfo) => {
  expect(page.browserErrors).toEqual([]);
  if (testInfo.status !== testInfo.expectedStatus) {
    const failures = await page.evaluate(() => window.captureErrors);
    if (failures?.length) throw new Error('Browser media capture failures: ' + JSON.stringify(failures));
  }
});

async function openPractice(page) {
  await page.goto('/simulator/01/');
  await page.getByRole('button', { name: 'Help me draft a response' }).click();
  await expect(page.locator('#expressWords')).toBeFocused();
}

async function probeMicrophone(page) {
  await page.addInitScript(() => {
    window.micCalls = 0;
    window.micTracks = [];
    window.revokedAudio = [];
    const getUserMedia = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
    navigator.mediaDevices.getUserMedia = async constraints => {
      window.micCalls++;
      const stream = await getUserMedia(constraints);
      window.micTracks.push(...stream.getTracks());
      return stream;
    };
    const revoke = URL.revokeObjectURL.bind(URL);
    URL.revokeObjectURL = url => { window.revokedAudio.push(url); revoke(url); };
  });
}

async function recordTake(page, context) {
  await context.grantPermissions(['microphone']);
  await probeMicrophone(page);
  await openPractice(page);
  await reveal(page, 'recordingPanel');
  await page.locator('#recordConsent').check();
  await page.locator('#recordStart').click();
  await expect(page.locator('#recordStatus')).toContainText('Recording…');
  // Wait for actual encoded audio from Chromium's synthetic microphone.
  await expect.poll(() => page.evaluate(() => micTracks[0]?.readyState)).toBe('live');
  await page.waitForTimeout(350);
  await page.locator('#recordStop').click();
  await expect(page.locator('#recordStatus')).toContainText('Ready to listen back');
  await expect.poll(() => page.evaluate(() => micTracks.every(t => t.readyState === 'ended'))).toBe(true);
}

test('private expression requires opt-in and never sends, scores, stores, or uploads it', async ({ page }) => {
  await probeMicrophone(page);
  const requests = [];
  page.on('request', request => requests.push({ url: request.url(), method: request.method() }));
  await page.goto('/simulator/01/');
  await expect(page.locator('#expressStudio')).not.toHaveAttribute('open', '');
  await expect(page.getByRole('checkbox', { name: /score|grade/i })).toHaveCount(0);
  await page.locator('#openPractice').click();
  await expect(page.locator('#recordConsent')).not.toBeChecked();
  await expect(page.locator('#recordStart')).toBeDisabled();
  await page.locator('#expressWords').fill('I am furious and need space.');
  await reveal(page, 'rehearsalPanel');
  await page.locator('#rehearsedWords').fill('I need a realistic deadline.');
  await reveal(page, 'recordingPanel');
  await page.locator('#recordConsent').check();
  expect(await page.evaluate(() => micCalls)).toBe(0);
  await expect(page.locator('#yourReply')).toHaveValue('');
  await expect(page.locator('#history')).not.toContainText('I am furious');
  await expect(page.locator('#sceneProgress')).toHaveText('SCENE 1 OF 2');
  expect(await page.evaluate(() => ({ local: localStorage.length, session: sessionStorage.length, cookies: document.cookie })))
    .toEqual({ local: 0, session: 0, cookies: '' });
  expect(requests.every(r => new URL(r.url).origin === 'http://127.0.0.1:8765' && r.method === 'GET')).toBe(true);
});

test('rehearsal transfers only the chosen draft; sending remains a separate action', async ({ page }) => {
  await openPractice(page);
  await reveal(page, 'rehearsalPanel');
  await page.locator('#practiceTransfer').click();
  await expect(page.locator('#practiceWords')).toBeFocused();
  await expect(page.locator('#practiceStatus')).toContainText('Write a rehearsal draft first');
  await page.locator('#expressWords').fill('My private first reaction');
  await reveal(page, 'rehearsalPanel');
  await page.locator('#rehearsedWords').fill('My private reflection');
  await reveal(page, 'rehearsalPanel');
  await page.locator('#practiceWords').fill('I need us to agree on a realistic deadline.');
  await reveal(page, 'rehearsalPanel');
  await page.locator('#practiceTransfer').click();
  await expect(page.locator('#yourReply')).toHaveValue('I need us to agree on a realistic deadline.');
  await expect(page.locator('#yourReply')).toBeFocused();
  await expect(page.locator('#history')).not.toContainText('realistic deadline');
  await expect(page.locator('#sceneProgress')).toHaveText('SCENE 1 OF 2');
  await page.locator('#send').click();
  await expect(page.locator('#history')).toContainText('I need us to agree on a realistic deadline.');
  await expect(page.locator('#history')).not.toContainText('My private');
  await expect(page.locator('#sceneProgress')).toHaveText('SCENE 2 OF 2');
});

test('roleplay has no numerical grades; qualitative detail is optional and resets on replay', async ({ page }) => {
  await page.goto('/simulator/01/');
  if (await page.locator('#expressStudio').evaluate(n => n.open)) await page.locator('#returnToReply').click();
  await page.locator('#choices button').nth(0).click();
  await page.locator('#send').click();
  await replies(page);
  await page.locator('#choices button').nth(1).click();
  await page.locator('#send').click();
  await expect(page.locator('#sceneProgress')).toHaveText('SIMULATION COMPLETE');
  await expect(page.locator('#scoreArea')).toBeHidden();
  await expect(page.locator('#score')).toHaveCount(0);
  await expect(page.locator('#scoreArea')).toBeHidden();
  await expect(page.locator('#exploreNote')).toBeVisible();
  await feedback(page);
  await expect(page.locator('#scoreArea')).toBeVisible();
  await expect(page.locator('#score')).toHaveCount(0);
  await expect(page.locator('#feedbackConstructive')).not.toBeEmpty();
  await page.locator('#reflectionReview > summary').click();
  await expect(page.locator('#score')).toHaveCount(0);
  await expect(page.locator('#scoreArea')).toBeHidden();
  await page.locator('#replay').click();
  await expect(page.getByRole('checkbox', { name: /score|grade/i })).toHaveCount(0);
  await expect(page.locator('#sceneProgress')).toHaveText('SCENE 1 OF 2');
  await expect(page.locator('#yourReply')).toHaveValue('');
});

test('moving a draft after completion starts a fresh, unsubmitted roleplay', async ({ page }) => {
  await openPractice(page);
  if (await page.locator('#expressStudio').evaluate(n => n.open)) await page.locator('#returnToReply').click();
  await page.locator('#choices button').nth(0).click();
  await page.locator('#send').click();
  await replies(page);
  await page.locator('#choices button').nth(1).click();
  await page.locator('#send').click();
  await reveal(page, 'rehearsalPanel');
  await page.locator('#practiceWords').fill('I want to reset this conversation.');
  await reveal(page, 'rehearsalPanel');
  await page.locator('#practiceTransfer').click();
  await expect(page.locator('#sceneProgress')).toHaveText('SCENE 1 OF 2');
  await expect(page.locator('#yourReply')).toHaveValue('I want to reset this conversation.');
  await expect(page.locator('#history .bubble')).toHaveCount(1);
  await expect(page.getByRole('checkbox', { name: /score|grade/i })).toHaveCount(0);
});

test('actual recording can be played and deleted; it releases tracks and revokes its URL', async ({ page, context }) => {
  const unexpectedRequests = [];
  page.on('request', r => {
    if (r.method() !== 'GET' || new URL(r.url()).origin !== 'http://127.0.0.1:8765') unexpectedRequests.push(r.url());
  });
  await recordTake(page, context);
  const player = page.locator('#recordPlayer');
  await expect(player).toBeVisible();
  expect(await player.evaluate(audio => audio.paused)).toBe(true);
  await player.evaluate(audio => audio.play());
  await expect.poll(() => player.evaluate(audio => audio.currentTime)).toBeGreaterThan(0);
  const url = await player.getAttribute('src');
  await page.locator('#recordDelete').click();
  await expect(player).toBeHidden();
  await expect(player).not.toHaveAttribute('src');
  expect(await page.evaluate(url => revokedAudio.includes(url), url)).toBe(true);
  expect(unexpectedRequests).toEqual([]);
});

for (const action of ['withdraw consent', 'close practice', 'hide page']) {
  test(`${action} releases an actively recording microphone`, async ({ page, context }) => {
    await context.grantPermissions(['microphone']);
    await probeMicrophone(page);
    await openPractice(page);
    await reveal(page, 'recordingPanel');
    await page.locator('#recordConsent').check();
    await page.locator('#recordStart').click();
    await expect(page.locator('#recordStatus')).toContainText('Recording…');
    if (action === 'withdraw consent') await page.locator('#recordConsent').uncheck();
    if (action === 'close practice') await page.locator('#expressStudio > summary').click();
    if (action === 'hide page') await page.evaluate(() => {
      Object.defineProperty(document, 'hidden', { configurable: true, value: true });
      document.dispatchEvent(new Event('visibilitychange'));
    });
    await expect.poll(() => page.evaluate(() => micTracks.length > 0 && micTracks.every(t => t.readyState === 'ended'))).toBe(true);
    await expect(page.locator('#recordStop')).toBeDisabled();
    if (action !== 'hide page') {
      await expect(page.locator('#recordPlayer')).not.toHaveAttribute('src');
      await expect(page.locator('#recordConsent')).not.toBeChecked();
    }
  });
}

test('real page navigation clears private writing and audio before leaving', async ({ page, context }) => {
  await recordTake(page, context);
  await page.locator('#expressWords').fill('Private expression');
  await reveal(page, 'rehearsalPanel');
  await page.locator('#rehearsedWords').fill('Private reflection');
  await reveal(page, 'rehearsalPanel');
  await page.locator('#practiceWords').fill('Private draft');
  await page.evaluate(() => {
    addEventListener('pagehide', () => {
      // Test-only observation survives destruction of the outgoing execution context.
      // The application itself never writes to browser storage.
      sessionStorage.setItem('test-navigation-cleanup', JSON.stringify({
        stopped: micTracks.every(t => t.readyState === 'ended'),
        audio: document.querySelector('#recordPlayer').getAttribute('src'),
        consent: document.querySelector('#recordConsent').checked,
        writing: ['expressWords', 'rehearsedWords', 'practiceWords'].map(id => document.getElementById(id).value),
      }));
    });
  });
  await page.goto('/');
  expect(await page.evaluate(() => {
    const result = JSON.parse(sessionStorage.getItem('test-navigation-cleanup'));
    sessionStorage.removeItem('test-navigation-cleanup');
    return result;
  })).toEqual({
    stopped: true, audio: null, consent: false, writing: ['', '', ''],
  });
  await page.goBack();
  await expect(page.locator('#recordPlayer')).not.toHaveAttribute('src');
  await expect(page.locator('#recordConsent')).not.toBeChecked();
  await expect(page.locator('#expressWords')).toHaveValue('');
});

for (const action of ['withdraw consent', 'close practice', 'clear everything', 'leave page']) {
  test(`${action} discards recorded audio`, async ({ page, context }) => {
    await recordTake(page, context);
    await page.locator('#expressWords').fill('Private writing');
    const url = await page.locator('#recordPlayer').getAttribute('src');
    if (action === 'withdraw consent') await page.locator('#recordConsent').uncheck();
    if (action === 'close practice') {
      await page.locator('#expressStudio > summary').click();
      await page.locator('#expressStudio > summary').click();
    }
    if (action === 'clear everything') await page.locator('#practiceClear').click();
    if (action === 'leave page') {
      // pagehide is the cleanup event for navigation and the back/forward cache.
      await page.evaluate(() => dispatchEvent(new PageTransitionEvent('pagehide', { persisted: true })));
    }
    await expect(page.locator('#recordPlayer')).toBeHidden();
    await expect(page.locator('#recordPlayer')).not.toHaveAttribute('src');
    await expect(page.locator('#recordConsent')).not.toBeChecked();
    await expect(page.locator('#recordStart')).toBeDisabled();
    expect(await page.evaluate(url => revokedAudio.includes(url), url)).toBe(true);
    if (action === 'clear everything' || action === 'leave page') await expect(page.locator('#expressWords')).toHaveValue('');
  });
}

test('permission denial leaves writing and rehearsal usable', async ({ page }) => {
  await page.addInitScript(() => {
    navigator.mediaDevices.getUserMedia = () => Promise.reject(new DOMException('Denied', 'NotAllowedError'));
  });
  await openPractice(page);
  await reveal(page, 'recordingPanel');
  await page.locator('#recordConsent').check();
  await page.locator('#recordStart').click();
  await expect(page.locator('#recordStatus')).toContainText('permission was declined');
  await expect(page.locator('#recordStart')).toBeEnabled();
  await reveal(page, 'rehearsalPanel');
  await page.locator('#practiceWords').fill('A written alternative');
  await reveal(page, 'rehearsalPanel');
  await page.locator('#practiceTransfer').click();
  await expect(page.locator('#yourReply')).toHaveValue('A written alternative');
});

test('unsupported recording offers writing without requesting microphone access', async ({ page }) => {
  await page.addInitScript(() => { window.MediaRecorder = undefined; });
  await openPractice(page);
  await reveal(page, 'recordingPanel');
  await page.locator('#recordConsent').check();
  await expect(page.locator('#recordStart')).toBeDisabled();
  await expect(page.locator('#recordStatus')).toContainText('not supported');
  await reveal(page, 'rehearsalPanel');
  await page.locator('#practiceWords').fill('No microphone needed');
  await reveal(page, 'rehearsalPanel');
  await page.locator('#practiceTransfer').click();
  await expect(page.locator('#yourReply')).toHaveValue('No microphone needed');
});

for (const cancel of ['delete', 'withdraw consent', 'hide page']) {
  test(`late microphone permission after ${cancel} cannot start recording`, async ({ page, context }) => {
    await context.grantPermissions(['microphone']);
    await probeMicrophone(page);
    await page.addInitScript(() => {
      const getUserMedia = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
      navigator.mediaDevices.getUserMedia = constraints => new Promise((resolve, reject) => {
        window.resolveMicrophone = () => getUserMedia(constraints).then(resolve, reject);
      });
    });
    await openPractice(page);
    await reveal(page, 'recordingPanel');
    await page.locator('#recordConsent').check();
    await page.locator('#recordStart').click();
    await expect(page.locator('#recordStatus')).toContainText('Waiting');
    if (cancel === 'delete') await page.locator('#recordDelete').click();
    if (cancel === 'withdraw consent') await page.locator('#recordConsent').uncheck();
    if (cancel === 'hide page') await page.evaluate(() => {
      Object.defineProperty(document, 'hidden', { configurable: true, value: true });
      document.dispatchEvent(new Event('visibilitychange'));
    });
    await page.evaluate(() => window.resolveMicrophone());
    await expect.poll(() => page.evaluate(() => micTracks.length)).toBe(1);
    await expect.poll(() => page.evaluate(() => micTracks[0].readyState)).toBe('ended');
    await expect(page.locator('#recordStop')).toBeDisabled();
    await expect(page.locator('#recordPlayer')).toBeHidden();
  });
}

test('deletion during finalization prevents stale audio; overlapping starts are blocked', async ({ page }) => {
  await page.addInitScript(() => {
    window.recorderStarts = 0;
    navigator.mediaDevices.getUserMedia = async () => ({ getTracks: () => [{ stop() {} }] });
    window.MediaRecorder = class {
      state = 'inactive';
      mimeType = 'audio/webm';
      start() { this.state = 'recording'; window.recorderStarts++; }
      stop() {
        this.state = 'inactive';
        const data = this.ondataavailable, stop = this.onstop;
        window.finishRecording = () => {
          data?.({ data: new Blob(['test audio'], { type: 'audio/webm' }) });
          stop?.();
        };
      }
    };
  });
  await openPractice(page);
  await reveal(page, 'recordingPanel');
  await page.locator('#recordConsent').check();
  await page.locator('#recordStart').click();
  await expect(page.locator('#recordStart')).toBeDisabled();
  await page.locator('#recordStop').click();
  await expect(page.locator('#recordStatus')).toContainText('Finalizing');
  await expect(page.locator('#recordStart')).toBeDisabled();
  await page.locator('#recordDelete').click();
  await page.evaluate(() => window.finishRecording());
  await expect(page.locator('#recordPlayer')).toBeHidden();
  await expect(page.locator('#recordStart')).toBeEnabled();
  expect(await page.evaluate(() => recorderStarts)).toBe(1);
});

test('90-second limit stops recording and releases the microphone', async ({ page, context }) => {
  await context.grantPermissions(['microphone']);
  await probeMicrophone(page);
  await openPractice(page);
  await page.clock.install();
  await reveal(page, 'recordingPanel');
  await page.locator('#recordConsent').check();
  await page.locator('#recordStart').click();
  await expect(page.locator('#recordStatus')).toContainText('Recording…');
  await page.clock.fastForward(90000);
  await expect(page.locator('#recordStop')).toBeDisabled();
  await expect.poll(() => page.evaluate(() => micTracks.every(t => t.readyState === 'ended'))).toBe(true);
});

test('optional practice is keyboard accessible and fits a narrow mobile viewport', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto('/simulator/01/');
  const summary = page.locator('#expressStudio > summary');
  await summary.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#expressWords')).toBeVisible();
  await reveal(page, 'recordingPanel');
  await page.locator('#recordConsent').focus();
  await page.keyboard.press('Space');
  await expect(page.locator('#recordStart')).toBeEnabled();
  await expect(page.getByRole('checkbox', { name: /score|grade/i })).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
