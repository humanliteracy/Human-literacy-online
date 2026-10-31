const {test,expect}=require('@playwright/test');

// OP-104 founder acceptance: at normal desktop browser zoom, a focused route
// should occupy one viewport rather than a long vertically scrolling document.
// Accessibility wins over the no-scroll aesthetic at enlarged zoom/phone widths.
const desktopRoutes=[
  ['One Place home','/one-place/'],
  ['Money & Bills area','/one-place/index.html?area=Money%20%26%20Bills'],
  ['Family & Caregiving area','/one-place/index.html?area=Family%20%26%20Caregiving'],
  ['Money & Bills tool overview','/one-place/money-bills.html'],
  ['Family Handoff tool first view','/one-place/family-handoff.html'],
  ['Human Literacy Explore','/'],
  ['Human Literacy Lessons','/#lessons'],
];

for(const size of [{width:1920,height:1080},{width:1366,height:768}]){
  test.describe(`desktop ${size.width}x${size.height}`,()=>{
    test.use({viewport:size});
    for(const [name,route] of desktopRoutes){
      test(`${name} fits first task without page scrolling`,async({page})=>{
        await page.goto(route);
        await expect(page.locator('body')).toBeVisible();
        const metrics=await page.evaluate(()=>({
          scroll:Math.max(document.documentElement.scrollHeight,document.body.scrollHeight),
          height:window.innerHeight,
          contentWidth:Math.max(document.documentElement.scrollWidth,document.body.scrollWidth),
          width:window.innerWidth
        }));
        expect(metrics.scroll,`${name} document scrollHeight=${metrics.scroll}, viewport=${metrics.height}`).toBeLessThanOrEqual(metrics.height+3);
        expect(metrics.contentWidth,`${name} width=${metrics.contentWidth}, viewport=${metrics.width}`).toBeLessThanOrEqual(metrics.width+3);
      });
    }
  });
}

for(const width of [320,390]){
  test(`mobile ${width}: content remains available with no horizontal clipping`,async({page})=>{
    await page.setViewportSize({width,height:844});
    for(const route of ['/one-place/','/one-place/index.html?area=Money%20%26%20Bills','/one-place/money-bills.html','/','/teal/']){
      await page.goto(route);
      const m=await page.evaluate(()=>({scroll:Math.max(document.documentElement.scrollWidth,document.body.scrollWidth),width:window.innerWidth}));
      expect(m.scroll,`${route} mobile horizontal overflow`).toBeLessThanOrEqual(m.width+3);
    }
  });
}

test('all ten lessons expose distinct global destinations',async({page})=>{
  for(let i=1;i<=10;i++){
    await page.goto(`/lessons/${String(i).padStart(2,'0')}/`);
    const nav=page.getByRole('navigation',{name:'One Place and lessons'});
    await expect(nav.getByRole('link',{name:'One Place Home'})).toBeVisible();
    await expect(nav.getByRole('link',{name:'All Lessons'})).toBeVisible();
    await expect(nav.getByRole('link',{name:'One Place Home'})).toHaveAttribute('href','../../one-place/index.html');
    await expect(nav.getByRole('link',{name:'All Lessons'})).toHaveAttribute('href','../../index.html#lessons');
  }
});
test('TEAL entrance, message and simple reading offer One Place exit',async({page})=>{
  await page.goto('/teal/');
  await expect(page.getByRole('link',{name:'One Place Home'}).first()).toBeVisible();
  await page.locator('#message-title').scrollIntoViewIfNeeded();
  await expect(page.locator('.site-nav').getByRole('link',{name:'One Place Home'})).toBeVisible();
  await page.goto('/teal/letter.html');
  await expect(page.locator('.reading-header').getByRole('link',{name:'One Place Home'})).toBeVisible();
});
