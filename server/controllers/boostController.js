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
    
    try {
      // Try zefoy.com first
      await page.goto('https://zefoy.com/', { 
        waitUntil: 'networkidle0',
        timeout: 30000 
      });

      const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

      // Wait for the page to load and bypass any captcha
      await page.waitForSelector('input[type="text"]', { timeout: 5000 });
      await delay(2000);

      // Input video URL
      await page.type('input[type="text"]', videoUrl);
      await delay(1000);

      // Click the views button (usually the first or second option)
      const viewsButton = await page.$$('button');
      if (viewsButton.length > 1) {
        await viewsButton[1].click();
      }
      await delay(2000);

      // Click submit/search button
      const submitButton = await page.$$('button[type="submit"]');
      if (submitButton.length > 0) {
        await submitButton[0].click();
      }
      await delay(5000);

      // Verify if views are being added
      const confirmationText = await page.evaluate(() => {
        const elements = document.querySelectorAll('div');
        for (const element of elements) {
          if (element.textContent.includes('Views sent') || 
              element.textContent.includes('Success') ||
              element.textContent.includes('Processing')) {
            return element.textContent;
          }
        }
        return null;
      });

      if (!confirmationText) {
        throw new Error('Could not confirm views were added');
      }

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

      if (browser) {
        await browser.close();
      }

      res.status(200).json({
        success: true,
        message: 'Views boost initiated successfully',
        data: {
          videoUrl,
          videoId,
          viewsAdded: 1000,
          confirmation: confirmationText
        }
      });

    } catch (pageError) {
      console.error('Page interaction error:', pageError);
      
      // If zefoy fails, try vipto as fallback
      try {
        await page.goto('https://vipto.de/', { 
          waitUntil: 'networkidle0',
          timeout: 30000 
        });

        const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
        
        // Click Views button using evaluate
        await page.evaluate(() => {
          const buttons = Array.from(document.querySelectorAll('button'));
          const viewsButton = buttons.find(button => button.textContent.includes('Views'));
          if (viewsButton) viewsButton.click();
        });
        await delay(2000);

        // Input video URL
        await page.type('input[type="text"]', videoUrl);
        await delay(1000);

        // Click Search button
        await page.evaluate(() => {
          const buttons = Array.from(document.querySelectorAll('button'));
          const searchButton = buttons.find(button => button.textContent.includes('Search'));
          if (searchButton) searchButton.click();
        });
        await delay(2000);

        // Click Send Views button
        await page.evaluate(() => {
          const buttons = Array.from(document.querySelectorAll('button'));
          const sendButton = buttons.find(button => button.textContent.includes('Send Views'));
          if (sendButton) sendButton.click();
        });
        await delay(1000);

        // Verify if views are being added
        const confirmationText = await page.evaluate(() => {
          const elements = document.querySelectorAll('div');
          for (const element of elements) {
            if (element.textContent.includes('Views sent') || 
                element.textContent.includes('Success') ||
                element.textContent.includes('Processing')) {
              return element.textContent;
            }
          }
          return null;
        });

        if (!confirmationText) {
          throw new Error('Could not confirm views were added');
        }

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

        if (browser) {
          await browser.close();
        }

        res.status(200).json({
          success: true,
          message: 'Views boost initiated successfully',
          data: {
            videoUrl,
            videoId,
            viewsAdded: 1000,
            confirmation: confirmationText
          }
        });

      } catch (fallbackError) {
        console.error('Fallback error:', fallbackError);
        throw new Error('Failed to boost views using both services');
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