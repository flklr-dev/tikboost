const Boost = require('../models/Boost');
const puppeteer = require('puppeteer');

const extractVideoId = (url) => {
  const regex = /video\/(\d+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

const boostViews = async (req, res) => {
  let browser = null;
  
  try {
    const { videoUrl } = req.body;
    console.log('Received request for URL:', videoUrl);

    if (!videoUrl || !videoUrl.includes('tiktok.com')) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid TikTok URL' 
      });
    }

    const videoId = extractVideoId(videoUrl);
    if (!videoId) {
      return res.status(400).json({
        success: false,
        message: 'Could not extract video ID from URL'
      });
    }

    // Launch browser
    browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
        '--window-size=1920x1080'
      ]
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });

    // Set random user agent
    const userAgents = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/97.0.4692.71',
      'Mozilla/5.0 (iPhone; CPU iPhone OS 14_4 like Mac OS X) AppleWebKit/605.1.15',
      'Mozilla/5.0 (iPad; CPU OS 14_4 like Mac OS X) AppleWebKit/605.1.15',
      'Mozilla/5.0 (Android 10; Mobile; rv:68.0) Gecko/68.0 Firefox/68.0'
    ];
    
    await page.setUserAgent(userAgents[Math.floor(Math.random() * userAgents.length)]);
    
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

    try {
      console.log('Attempting to use zefoy.com...');
      await page.goto('https://zefoy.com/', { 
        waitUntil: 'networkidle0',
        timeout: 30000 
      });

      // Wait for page to load completely
      await delay(5000);

      // Find and click the views service button using page.evaluate
      await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button, div[role="button"], .btn, .button'));
        const viewsButton = buttons.find(button => 
          button.textContent.toLowerCase().includes('view') || 
          button.textContent.toLowerCase().includes('views')
        );
        if (viewsButton) viewsButton.click();
      });
      await delay(3000);

      // Type the video URL
      const inputSelector = 'input[type="text"], input[placeholder*="URL"], textarea';
      await page.waitForSelector(inputSelector, { visible: true, timeout: 5000 });
      await page.type(inputSelector, videoUrl);
      await delay(2000);

      // Click search/submit button
      await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button, input[type="submit"], .btn, .button'));
        const searchButton = buttons.find(button => 
          button.textContent.toLowerCase().includes('search') || 
          button.textContent.toLowerCase().includes('submit') ||
          button.textContent.toLowerCase().includes('send')
        );
        if (searchButton) searchButton.click();
      });
      await delay(5000);

      // Check for confirmation
      const confirmationText = await page.evaluate(() => {
        const elements = document.querySelectorAll('div, p, span');
        for (const element of elements) {
          const text = element.textContent.toLowerCase();
          if (text.includes('success') || 
              text.includes('sent') || 
              text.includes('views added') ||
              text.includes('processing')) {
            return element.textContent;
          }
        }
        return null;
      });

      if (!confirmationText) {
        console.log('Zefoy confirmation not found, trying vipto.de...');
        throw new Error('Could not confirm views on zefoy');
      }

      // Success with zefoy
      const boost = new Boost({
        videoUrl,
        videoId,
        viewsAdded: 1000,
        success: true,
        clientIP: req.ip || '0.0.0.0'
      });

      await boost.save();
      console.log('Boost record saved:', boost);

      if (browser) await browser.close();

      return res.status(200).json({
        success: true,
        message: 'Views boost initiated successfully',
        data: {
          videoUrl,
          videoId,
          viewsAdded: 1000,
          confirmation: confirmationText
        }
      });

    } catch (zefoyError) {
      console.log('Zefoy failed, trying vipto.de...', zefoyError.message);
      
      // Try vipto.de as fallback
      try {
        await page.goto('https://vipto.de/', { 
          waitUntil: 'networkidle0',
          timeout: 30000 
        });
        await delay(5000);

        // Click Views button using evaluate
        await page.evaluate(() => {
          const buttons = Array.from(document.querySelectorAll('button, div[role="button"], .btn, .button'));
          const viewsButton = buttons.find(button => 
            button.textContent.toLowerCase().includes('view') || 
            button.textContent.toLowerCase().includes('views')
          );
          if (viewsButton) viewsButton.click();
        });
        await delay(3000);

        // Input video URL
        const inputSelector = 'input[type="text"], input[placeholder*="URL"], textarea';
        await page.waitForSelector(inputSelector, { visible: true, timeout: 5000 });
        await page.type(inputSelector, videoUrl);
        await delay(2000);

        // Click submit button
        await page.evaluate(() => {
          const buttons = Array.from(document.querySelectorAll('button, input[type="submit"], .btn, .button'));
          const submitButton = buttons.find(button => 
            button.textContent.toLowerCase().includes('search') || 
            button.textContent.toLowerCase().includes('submit') ||
            button.textContent.toLowerCase().includes('send')
          );
          if (submitButton) submitButton.click();
        });
        await delay(5000);

        // Save boost record
        const boost = new Boost({
          videoUrl,
          videoId,
          viewsAdded: 1000,
          success: true,
          clientIP: req.ip || '0.0.0.0'
        });

        await boost.save();
        console.log('Boost record saved:', boost);

        if (browser) await browser.close();

        return res.status(200).json({
          success: true,
          message: 'Views boost initiated successfully (via fallback)',
          data: {
            videoUrl,
            videoId,
            viewsAdded: 1000
          }
        });

      } catch (viptoError) {
        console.error('Vipto error:', viptoError);
        throw new Error('Both services failed to boost views');
      }
    }

  } catch (error) {
    console.error('Boost error:', error);
    
    if (browser) {
      await browser.close();
    }

    res.status(500).json({ 
      success: false, 
      message: 'Server error while processing boost request',
      error: error.message
    });
  }
};

module.exports = {
  boostViews
}; 