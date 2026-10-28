const { test, expect } = require('@playwright/test');
const { reveal } = require('./review-helpers.cjs');

// These checks cover browser semantics, keyboard, declared contrast and reflow.
// They are not a claim that screen-reader software or physical devices were tested.
test.beforeEach(async ({ page }) => {
  page.accessibilityErrors = [];
  page.on('pageerror', error => page.accessibilityErrors.push(error.message));
  await page.goto('/simulator/01/');
});
test.afterEach(async ({ page }) => { expect(page.accessibilityErrors).toEqual([]); });

async function noOverflow(page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
    'The page reflows without horizontal scrolling').toBe(true);
}

test('landmarks, labels, disclosure semantics and empty-reply recovery remain accessible', async ({ page }) => {
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page).toHaveTitle(/Life Simulator/);
  await expect(page.getByRole('main')).toHaveCount(1);
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
  const duplicates = await page.locator('[id]').evaluateAll(nodes => {
    const ids = nodes.map(node => node.id);
    return ids.filter((id, index) => ids.indexOf(id) !== index);
  });
  expect(duplicates).toEqual([]);
  await expect(page.locator('#yourReply')).toHaveAccessibleName(/own words|response|reply/i);
  await expect(page.locator('#send')).toHaveAccessibleName(/say|send/i);
  await page.locator('#send').click();
  await expect(page.locator('#yourReply')).toBeFocused();
  await expect(page.locator('#yourReply')).toHaveAttribute('aria-invalid', 'true');
  await expect(page.locator('#yourReply')).toHaveAttribute('aria-describedby', /replyStatus/);
  await expect(page.locator('#replyStatus')).toHaveAttribute('role', 'status');
  await expect(page.locator('#replyStatus')).toContainText(/write|choose|response|reply/i);
  await page.locator('#yourReply').fill('Could you explain the priority?');
  await expect(page.locator('#yourReply')).not.toHaveAttribute('aria-invalid', 'true');
  await page.locator('#openPractice').click();
  await expect(page.locator('#expressWords')).toHaveAccessibleName(/reaction|expression|words/i);
  await reveal(page, 'recordingPanel');
  await expect(page.locator('#recordConsent')).toHaveAccessibleName(/microphone/i);
  await expect(page.locator('#recordConsent')).toHaveAttribute('aria-describedby', /recordPrivacy/);
  await expect(page.locator('#recordStart')).toBeDisabled();
  await reveal(page, 'speechPanel');
  await expect(page.locator('#speechConsent')).toHaveAccessibleName(/external|browser/i);
  await expect(page.locator('#speechConsent')).toHaveAttribute('aria-describedby', /speechPrivacy/);
  await expect(page.locator('#speechStart')).toBeDisabled();
  const nameless = await page.locator('button').evaluateAll(buttons => buttons
    .filter(button => !(button.getAttribute('aria-label') || button.textContent).trim())
    .map(button => button.id));
  expect(nameless).toEqual([]);
});

test('focus and essential control boundaries meet sampled contrast targets', async ({ page }) => {
  await page.locator('#yourReply').focus();
  await page.locator('#openPractice').hover();
  const contrast = await page.evaluate(() => {
    function rgb(value) { return value.match(/[\d.]+/g).slice(0, 3).map(Number); }
    function luminance(value) {
      const colors = rgb(value).map(channel => channel / 255)
        .map(channel => channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4);
      return colors[0] * 0.2126 + colors[1] * 0.7152 + colors[2] * 0.0722;
    }
    function ratio(first, second) {
      const a = luminance(first), b = luminance(second);
      return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
    }
    const reply = getComputedStyle(document.querySelector('#yourReply'));
    const primary = getComputedStyle(document.querySelector('#send'));
    const secondary = getComputedStyle(document.querySelector('#openPractice'));
    const card = getComputedStyle(document.querySelector('#inputPanel'));
    const scene = getComputedStyle(document.querySelector('.scene'));
    const speaker = getComputedStyle(document.querySelector('.speaker'));
    const stops = scene.backgroundImage.match(/rgba?\([^)]+\)/g) || [scene.backgroundColor];
    return {
      text: ratio(reply.color, reply.backgroundColor),
      primaryText: ratio(primary.color, primary.backgroundColor),
      secondaryHoverText: ratio(secondary.color, secondary.backgroundColor),
      sceneLabel: Math.min(...stops.map(stop => ratio(speaker.color, stop))),
      border: ratio(reply.borderTopColor, reply.backgroundColor),
      outline: ratio(reply.outlineColor, card.backgroundColor),
      outlineWidth: parseFloat(reply.outlineWidth),
      outlineStyle: reply.outlineStyle,
    };
  });
  expect(contrast.text).toBeGreaterThanOrEqual(4.5);
  expect(contrast.primaryText).toBeGreaterThanOrEqual(4.5);
  expect(contrast.secondaryHoverText).toBeGreaterThanOrEqual(4.5);
  expect(contrast.sceneLabel).toBeGreaterThanOrEqual(4.5);
  expect(contrast.border).toBeGreaterThanOrEqual(3);
  expect(contrast.outline).toBeGreaterThanOrEqual(3);
  expect(contrast.outlineWidth).toBeGreaterThanOrEqual(2);
  expect(contrast.outlineStyle).not.toBe('none');
});

test('reduced motion, native goal navigation and completion focus do not depend on delayed events', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe('auto');
  await page.locator('#openPractice').click();
  await page.locator('#expressWords').fill('The expectations are unreasonable. I quit');
  await page.locator('#coachUnderstand').click();
  await page.locator('#coachConfirm').click();
  await page.locator('#coachReview > summary').focus();
  await page.keyboard.press('Enter');
  await page.keyboard.press('Tab');
  await expect(page.locator('#coachPath')).toBeFocused();
  await expect(page.locator('#coachChoices')).toBeHidden();
  // Let queued toggle/layout work run. It must not steal already-moved focus.
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  await expect(page.locator('#coachPath')).toBeFocused();
  await page.locator('#coachReview > summary').click();
  await page.locator('.coach-option button').first().click();
  await page.locator('#send').click();
  await page.locator('#yourReply').fill('I am confirming my decision to resign.');
  await page.locator('#send').click();
  await expect(page.locator('#completionTitle')).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.locator('#reflectionReview > summary')).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#scoreArea')).toBeVisible();
  await expect(page.locator('#scoreArea')).not.toContainText(/\b\d{1,3}\s*\/\s*100\b/);
  await page.locator('#replay').click();
  await expect(page.locator('#replyHeading')).toBeFocused();
});

for (const width of [320, 390, 768, 1120]) {
  test(`${width}px reflow: long literal, custom goal, alternatives, transcript and feedback stay readable`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await noOverflow(page);
    await page.locator('#openPractice').click();
    const literal = '<img src=x onerror="window.unsafeMarkup=true">' + 'Z'.repeat(1500);
    const goal = '<script>window.unsafeMarkup=true</script>' + 'W'.repeat(500);
    await page.locator('#expressWords').fill(literal);
    await page.locator('#coachUnderstand').click();
    await page.locator('#coachPath').selectOption('custom');
    await page.locator('#coachGoal').fill(goal);
    await page.locator('#coachConfirm').click();
    await reveal(page, 'readingDetails');
    await expect(page.locator('#coachLiteral')).toHaveText(literal);
    await expect(page.locator('#coachLiteral img')).toHaveCount(0);
    await expect(page.locator('#coachChosenGoal script')).toHaveCount(0);
    await noOverflow(page);
    await page.locator('#coachReview > summary').click();
    await page.locator('#coachMore > summary').click();
    await expect(page.locator('.coach-option:visible')).toHaveCount(3);
    await noOverflow(page);
    await page.locator('#coachWording0').fill('<img src=x onerror="window.unsafeMarkup=true">' + 'R'.repeat(500));
    await page.locator('.coach-option button').first().click();
    await page.locator('#send').click();
    await page.locator('#yourReply').fill('Please ask what I mean before assuming a commitment.');
    await page.locator('#send').click();
    await reveal(page, 'reflectionReview');
    await reveal(page, 'conversationHistory');
    await expect(page.locator('#history img')).toHaveCount(0);
    expect(await page.evaluate(() => window.unsafeMarkup)).toBeUndefined();
    await noOverflow(page);
  });

  test(`${width}px and 200% text resize preserve content and touch targets`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.evaluate(() => {
      const original = parseFloat(getComputedStyle(document.documentElement).fontSize);
      document.documentElement.style.fontSize = original * 2 + 'px';
    });
    await noOverflow(page);
    await page.locator('#replyMore > summary').click();
    await noOverflow(page);
    await page.locator('#openPractice').click();
    await page.locator('#expressWords').fill('I need more time because the scope changed');
    await page.locator('#coachUnderstand').click();
    await page.locator('#coachConfirm').click();
    await page.locator('#coachMore > summary').click();
    await noOverflow(page);
    const targets = await page.locator('main button:visible, main summary:visible').evaluateAll(nodes => nodes.map(node => {
      const bounds = node.getBoundingClientRect();
      return { name: node.textContent.trim(), width: bounds.width, height: bounds.height };
    }));
    expect(targets.length).toBeGreaterThan(0);
    for (const target of targets) {
      expect(target.width, target.name).toBeGreaterThanOrEqual(24);
      expect(target.height, target.name).toBeGreaterThanOrEqual(24);
    }
  });
}
