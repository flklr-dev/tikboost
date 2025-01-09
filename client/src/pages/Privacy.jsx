const Privacy = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Privacy Policy</h1>
      
      <div className="space-y-6 text-gray-600">
        <section>
          <h2 className="text-xl font-semibold mb-3 text-gray-700">1. Information We Collect</h2>
          <p>When using our TikTok Views Booster service, we collect:</p>
          <ul className="list-disc pl-6 mt-2">
            <li>TikTok video URLs that you submit</li>
            <li>IP addresses for security purposes</li>
            <li>Usage data and analytics</li>
            <li>Cookie and session information</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-gray-700">2. How We Use Your Information</h2>
          <p>We use the collected information to:</p>
          <ul className="list-disc pl-6 mt-2">
            <li>Provide our view boosting service</li>
            <li>Prevent abuse and maintain security</li>
            <li>Improve our service quality</li>
            <li>Display relevant advertisements</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-gray-700">3. Cookies and Tracking</h2>
          <p>We use cookies and similar tracking technologies to:</p>
          <ul className="list-disc pl-6 mt-2">
            <li>Remember your preferences</li>
            <li>Analyze site traffic and usage</li>
            <li>Deliver targeted advertisements</li>
            <li>Maintain security features</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-gray-700">4. Third-Party Services</h2>
          <p>We work with trusted third-party services:</p>
          <ul className="list-disc pl-6 mt-2">
            <li>Google AdSense for advertisements</li>
            <li>Google reCAPTCHA for security</li>
            <li>Analytics providers</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-gray-700">5. Contact Us</h2>
          <p>For any privacy-related questions or concerns, please contact us at:</p>
          <p className="mt-2">Email: [Your Contact Email]</p>
        </section>

        <p className="text-sm mt-8">Last updated: {new Date().toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default Privacy; 