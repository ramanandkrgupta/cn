// app/privacy/page.jsx
import Head from 'next/head';  // Importing the Head component for SEO

const today = new Date();

export default function PrivacyPolicy() {
  return (
    <>
      {/* SEO Meta Tags */}
      <Head>
        <title>Privacy Policy | Notes Mates</title>
        <meta name="description" content="Read the privacy policy of Notes Mates, detailing how we collect, use, and protect your personal data." />
        <meta name="keywords" content="privacy policy, data protection, Notes Mates, GDPR, CCPA, cookies" />
        <meta property="og:title" content="Privacy Policy | Notes Mates" />
        <meta property="og:description" content="Read the privacy policy of Notes Mates, detailing how we collect, use, and protect your personal data." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://notesmates.in/privacy" />
        <meta property="og:image" content="/img/privacy-policy-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Privacy Policy | Notes Mates" />
        <meta name="twitter:description" content="Read the privacy policy of Notes Mates, detailing how we collect, use, and protect your personal data." />
        <meta name="twitter:image" content="/img/privacy-policy-image.png" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
        <p className="mb-6">Effective Date: {today.toDateString()}</p>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">1. Information We Collect</h2>
          <p className="mb-4">
            At <strong>Notes Mates.in</strong>, your privacy is a top priority. This section outlines the types of
            information we collect:
          </p>
          <h3 className="text-xl font-semibold">a) Personal Information</h3>
          <ul className="list-disc pl-6 mb-4">
            <li>Name, email address, and contact details (e.g., during registration or purchases).</li>
            <li>Account details such as username and password.</li>
          </ul>
          <h3 className="text-xl font-semibold">b) Usage Data</h3>
          <ul className="list-disc pl-6 mb-4">
            <li>Browser type and version.</li>
            <li>IP address and geographic location.</li>
            <li>Pages visited, time spent, and actions taken on the website.</li>
          </ul>
          <h3 className="text-xl font-semibold">c) Cookies and Similar Technologies</h3>
          <p>
            We use cookies and similar technologies to enhance user experience and for analytics.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">2. How We Use Your Information</h2>
          <p>
            We use your information to:
          </p>
          <ul className="list-disc pl-6">
            <li>Provide and improve our services.</li>
            <li>Process transactions and manage your account.</li>
            <li>Send updates, notifications, or promotional content (with your consent).</li>
            <li>Ensure website security and prevent fraud.</li>
            <li>Comply with legal obligations and resolve disputes.</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">3. Your Rights</h2>
          <p className="mb-4">
            Depending on your location, you have the following rights:
          </p>
          <h3 className="text-xl font-semibold">Under GDPR:</h3>
          <ul className="list-disc pl-6 mb-4">
            <li>Access, correct, or delete your personal data.</li>
            <li>Withdraw consent for data processing.</li>
            <li>Request data portability.</li>
            <li>File a complaint with your local data protection authority.</li>
          </ul>
          <h3 className="text-xl font-semibold">Under CCPA/CPRA:</h3>
          <ul className="list-disc pl-6">
            <li>Know what personal information is collected and how it is used.</li>
            <li>Request deletion of personal information.</li>
            <li>Opt-out of the sale of personal data.</li>
            <li>Non-discrimination for exercising privacy rights.</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">4. Sharing of Information</h2>
          <p>
            We do not sell your personal data. However, we may share your data with:
          </p>
          <ul className="list-disc pl-6">
            <li>Service providers (e.g., payment processors, analytics platforms).</li>
            <li>
              Advertising partners, including Google Adsense, to serve personalized ads (you can opt-out via Google Ads
              Settings).
            </li>
            <li>Legal authorities, if required by law.</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">5. Cookies and Tracking Technologies</h2>
          <p>
            We use cookies to:
          </p>
          <ul className="list-disc pl-6">
            <li>Provide essential website functions.</li>
            <li>Analyze website traffic and performance.</li>
            <li>Show personalized ads through Google Adsense.</li>
          </ul>
          <p>
            Manage cookie preferences via browser settings or opt-out of personalized ads through{' '}
            <a href="https://www.youradchoices.com/" className="text-blue-500 underline">
              Your Ad Choices
            </a>
            .
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">6. Data Retention</h2>
          <p>
            We retain your data for as long as necessary to fulfill the purposes outlined in this policy or as required by
            law.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">7. Security of Your Data</h2>
          <p>
            We implement robust security measures, including encryption and secure servers, to protect your data from
            unauthorized access.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">8. Third-Party Links</h2>
          <p>
            Our website may contain links to third-party websites. We are not responsible for their privacy practices. We
            recommend reviewing their privacy policies.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">9. Children's Privacy</h2>
          <p>
            Notes Mates.in does not knowingly collect data from individuals under the age of 13. If we become aware of
            such data, we will delete it promptly.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">10. Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy to reflect changes in our practices or for legal reasons. Updates will be
            posted with a revised "Effective Date."
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">11. Contact Us</h2>
          <p>
            If you have any questions or concerns about this Privacy Policy, please contact us at:
          </p>
          <ul className="list-disc pl-6">
            <li>Email: <a href="mailto:contact@notesmates.in" className="text-blue-500 underline">contact@notesmates.in</a></li>
            <li>Website: <a href="https://notesmates.in" className="text-blue-500 underline">https://notesmates.in</a></li>
          </ul>
        </section>

        <p className="text-sm">
          By using Notes Mates.in, you agree to this Privacy Policy. Thank you for trusting us with your data.
        </p>
      </main>
    </>
  );
}
