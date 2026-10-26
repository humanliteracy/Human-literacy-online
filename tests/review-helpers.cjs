// Open optional UI explicitly; keep the default-flow assertions in the tests.
async function reveal(page, id) {
  const target = page.locator('#' + id);
  const ancestors = await target.evaluate(n => {
    const ids = [];
    for (let parent = n.parentElement; parent; parent = parent.parentElement) {
      if (parent.tagName === 'DETAILS' && parent.id) ids.unshift(parent.id);
    }
    return ids;
  });
  for (const ancestor of ancestors) {
    const container = page.locator('#' + ancestor);
    if (!await container.evaluate(n => n.open)) await container.locator(':scope > summary').click();
  }
  if (!await target.evaluate(n => n.open)) await target.locator(':scope > summary').click();
}
async function feedback(page) {
  if (!await page.locator('.mode-control').evaluate(n => n.open)) {
    await page.locator('.mode-control > summary').click();
  }
}
async function replies(page) { await reveal(page, 'replyMore'); }
module.exports = { reveal, feedback, replies };
