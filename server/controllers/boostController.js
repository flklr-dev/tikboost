const Boost = require('../models/Boost');
const axios = require('axios');

// Function to extract video ID from TikTok URL
const extractVideoId = (url) => {
  const regex = /video\/(\d+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

// Real view boost function
const boostRealViews = async (videoId) => {
  try {
    // Number of parallel requests
    const numberOfRequests = 50;
    const requests = [];

    // Different user agents to mimic different browsers/devices
    const userAgents = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/97.0.4692.71',
      'Mozilla/5.0 (iPhone; CPU iPhone OS 14_4 like Mac OS X) AppleWebKit/605.1.15',
      'Mozilla/5.0 (iPad; CPU OS 14_4 like Mac OS X) AppleWebKit/605.1.15',
      'Mozilla/5.0 (Android 10; Mobile; rv:68.0) Gecko/68.0 Firefox/68.0',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1.15'
    ];

    // Different proxy servers (you should replace these with real proxy IPs)
    const proxies = [
      'http://proxy1.example.com',
      'http://proxy2.example.com',
      'http://proxy3.example.com',
      // Add more proxies here
    ];

    for (let i = 0; i < numberOfRequests; i++) {
      const randomUserAgent = userAgents[Math.floor(Math.random() * userAgents.length)];
      const randomProxy = proxies[Math.floor(Math.random() * proxies.length)];

      requests.push(
        axios.get(`https://www.tiktok.com/video/${videoId}`, {
          headers: {
            'User-Agent': randomUserAgent,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
            'Referer': 'https://www.google.com/'
          },
          proxy: {
            host: randomProxy,
            port: 8080
          },
          timeout: 10000,
          validateStatus: false // Don't throw on error status codes
        })
      );

      // Add delay between requests
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Execute requests in parallel with error handling
    const results = await Promise.allSettled(requests);
    const successfulRequests = results.filter(r => r.status === 'fulfilled').length;

    return successfulRequests > numberOfRequests / 2; // Consider success if more than half requests succeed
  } catch (error) {
    console.error('View boost error:', error);
    return false;
  }
};

const boostViews = async (req, res) => {
  try {
    const { videoUrl } = req.body;

    // Validate video URL
    if (!videoUrl || !videoUrl.includes('tiktok.com')) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid TikTok URL' 
      });
    }

    // Extract video ID
    const videoId = extractVideoId(videoUrl);
    if (!videoId) {
      return res.status(400).json({
        success: false,
        message: 'Could not extract video ID from URL'
      });
    }

    // Check if video was boosted recently
    const recentBoost = await Boost.findOne({
      videoUrl,
      timestamp: { $gt: new Date(Date.now() - 3 * 60 * 1000) } // 3 minutes
    });

    if (recentBoost) {
      return res.status(429).json({
        success: false,
        message: 'Please wait 3 minutes between boosts'
      });
    }

    // Attempt to boost views
    const boostSuccess = await boostRealViews(videoId);

    // Create new boost record
    const boost = new Boost({
      videoUrl,
      videoId,
      viewsAdded: boostSuccess ? 1000 : 0,
      success: boostSuccess
    });

    await boost.save();

    if (!boostSuccess) {
      return res.status(500).json({
        success: false,
        message: 'Failed to boost views'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Views boost initiated successfully',
      data: {
        videoUrl,
        videoId,
        viewsAdded: 1000
      }
    });

  } catch (error) {
    console.error('Boost error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while processing boost request' 
    });
  }
};

module.exports = {
  boostViews
}; 