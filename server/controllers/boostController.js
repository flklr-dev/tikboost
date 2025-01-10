const Boost = require('../models/Boost');
const axios = require('axios');

// Function to extract video ID from TikTok URL
const extractVideoId = (url) => {
  const regex = /video\/(\d+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

// Function to boost views
const boostViews = async (req, res) => {
  try {
    const { videoUrl } = req.body;
    console.log('Received request for URL:', videoUrl); // Debug log

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

    // Send multiple requests to simulate views
    const numberOfRequests = 50;
    const requests = [];

    const userAgents = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/97.0.4692.71',
      'Mozilla/5.0 (iPhone; CPU iPhone OS 14_4 like Mac OS X) AppleWebKit/605.1.15',
      'Mozilla/5.0 (iPad; CPU OS 14_4 like Mac OS X) AppleWebKit/605.1.15',
      'Mozilla/5.0 (Android 10; Mobile; rv:68.0) Gecko/68.0 Firefox/68.0',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1.15'
    ];

    for (let i = 0; i < numberOfRequests; i++) {
      const randomUserAgent = userAgents[Math.floor(Math.random() * userAgents.length)];
      
      requests.push(
        axios.get(`https://www.tiktok.com/video/${videoId}`, {
          headers: {
            'User-Agent': randomUserAgent,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Connection': 'keep-alive',
            'Cache-Control': 'no-cache'
          },
          timeout: 5000,
          validateStatus: false
        })
      );
    }

    // Execute requests in parallel
    const results = await Promise.allSettled(requests);
    const successfulRequests = results.filter(result => result.status === 'fulfilled');

    // Save boost record
    const boost = new Boost({
      videoUrl,
      videoId,
      viewsAdded: successfulRequests.length * 20,
      success: successfulRequests.length > 0
    });

    await boost.save();
    console.log('Boost record saved:', boost); // Debug log

    res.status(200).json({
      success: true,
      message: 'Views boost initiated successfully',
      data: {
        videoUrl,
        videoId,
        viewsAdded: successfulRequests.length * 20
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