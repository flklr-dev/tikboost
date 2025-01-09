const Terms = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Terms of Service</h1>
      
      <div className="space-y-6 text-gray-600">
        <section>
          <h2 className="text-xl font-semibold mb-3 text-gray-700">1. Acceptance of Terms</h2>
          <p>By accessing and using our TikTok Views Booster service, you agree to be bound by these Terms of Service and all applicable laws and regulations.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-gray-700">2. Service Description</h2>
          <p>Our service provides view boosting for TikTok videos. Users understand that:</p>
          <ul className="list-disc pl-6 mt-2">
            <li>Results may vary and are not guaranteed</li>
            <li>There is a 3-minute cooldown between boost requests</li>
            <li>The service is provided "as is" without warranties</li>
            <li>We reserve the right to modify or discontinue the service at any time</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-gray-700">3. User Responsibilities</h2>
          <p>Users must:</p>
          <ul className="list-disc pl-6 mt-2">
            <li>Provide valid TikTok video URLs</li>
            <li>Not abuse or attempt to manipulate the service</li>
            <li>Complete reCAPTCHA verification when required</li>
            <li>Comply with TikTok's terms of service</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-gray-700">4. Limitations</h2>
          <p>We are not responsible for:</p>
          <ul className="list-disc pl-6 mt-2">
            <li>TikTok account suspensions or penalties</li>
            <li>Service interruptions or failures</li>
            <li>Loss of data or content</li>
            <li>Third-party advertisements</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-gray-700">5. Prohibited Activities</h2>
          <p>Users must not:</p>
          <ul className="list-disc pl-6 mt-2">
            <li>Use automated scripts or bots</li>
            <li>Attempt to bypass the cooldown timer</li>
            <li>Share or sell access to the service</li>
            <li>Submit inappropriate or illegal content</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-gray-700">6. Changes to Terms</h2>
          <p>We reserve the right to modify these terms at any time. Continued use of the service constitutes acceptance of new terms.</p>
        </section>

        <p className="text-sm mt-8">Last updated: {new Date().toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default Terms; 