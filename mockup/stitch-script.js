const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  // Set viewport size
  await page.setViewport({ width: 1920, height: 1080 });
  
  console.log('Navigating to Google Stitch...');
  await page.goto('https://stitch.withgoogle.com/', { waitUntil: 'networkidle2' });
  
  // Wait for the page to load
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  // Take initial screenshot
  await page.screenshot({ path: '/root/.openclaw/workspace/ingversions-blog/mockup/stitch-initial.png', fullPage: true });
  console.log('Initial screenshot saved');
  
  // Try to find and interact with the prompt input
  try {
    // Wait for textarea or input
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Try different selectors for the prompt input
    const selectors = [
      'textarea',
      'input[type="text"]',
      '[contenteditable="true"]',
      'div[role="textbox"]',
      '.prompt-input',
      '[data-testid="prompt-input"]',
      'textarea[placeholder*="Describe"]',
      'textarea[placeholder*="design"]'
    ];
    
    let inputElement = null;
    for (const selector of selectors) {
      try {
        inputElement = await page.$(selector);
        if (inputElement) {
          console.log(`Found input with selector: ${selector}`);
          break;
        }
      } catch (e) {
        // Continue to next selector
      }
    }
    
    if (inputElement) {
      const prompt = "Modern dark blog page for tech consulting company, header with logo and navigation, hero section with headline and search, 3-column article grid with image cards, newsletter CTA section, clean footer. Dark theme (#0a0a0a), blue accent (#0070f3), professional, non-tech founders audience.";
      
      await inputElement.click();
      await page.keyboard.type(prompt, { delay: 50 });
      console.log('Prompt entered');
      
      // Take screenshot after entering prompt
      await page.screenshot({ path: '/root/.openclaw/workspace/ingversions-blog/mockup/stitch-prompt-entered.png', fullPage: true });
      
      // Try to find and click generate button
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const buttonSelectors = [
        'button[type="submit"]',
        'button:has-text("Generate")',
        'button:has-text("Create")',
        'button:has-text("Design")',
        '[data-testid="generate-button"]',
        '.generate-button',
        'button[aria-label*="generate"]'
      ];
      
      let generateButton = null;
      for (const selector of buttonSelectors) {
        try {
          generateButton = await page.$(selector);
          if (generateButton) {
            console.log(`Found button with selector: ${selector}`);
            break;
          }
        } catch (e) {
          // Continue to next selector
        }
      }
      
      if (generateButton) {
        await generateButton.click();
        console.log('Generate button clicked');
        
        // Wait for generation to complete
        await page.waitForTimeout(15000);
        
        // Take screenshot of result
        await page.screenshot({ path: '/root/.openclaw/workspace/ingversions-blog/mockup/stitch-result.png', fullPage: true });
        console.log('Result screenshot saved');
      } else {
        console.log('Generate button not found');
        // Take screenshot anyway
        await page.screenshot({ path: '/root/.openclaw/workspace/ingversions-blog/mockup/stitch-no-button.png', fullPage: true });
      }
    } else {
      console.log('Input element not found');
      // Take screenshot of current state
      await page.screenshot({ path: '/root/.openclaw/workspace/ingversions-blog/mockup/stitch-no-input.png', fullPage: true });
    }
  } catch (error) {
    console.error('Error:', error.message);
    // Take screenshot of error state
    await page.screenshot({ path: '/root/.openclaw/workspace/ingversions-blog/mockup/stitch-error.png', fullPage: true });
  }
  
  await browser.close();
  console.log('Done');
})();