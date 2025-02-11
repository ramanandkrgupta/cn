import Head from 'next/head';

const today = new Date();

export default function TermsAndConditions() {
  return (
    <>
      {/* Static SEO Meta Tags */}
      <Head>
        <title>Terms and Conditions | Notes Mates</title>
        <meta
          name="description"
          content="Read the Terms and Conditions of Notes Mates. Learn about our policies, including eligibility, user responsibilities, intellectual property, and more. Protecting students and users."
        />
        <meta
          name="keywords"
          content="rgpv, bhopal, b.tech, study, engineering, exam, pyqs, important questions, pyq solution, notesmates, student, terms, conditions"
        />
        <meta property="og:title" content="Terms and Conditions | Notes Mates" />
        <meta
          property="og:description"
          content="Understand the Terms and Conditions of Notes Mates. Read about eligibility, user responsibilities, intellectual property, and more."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://notesmates.in/terms" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Terms and Conditions | Notes Mates" />
        <meta
          name="twitter:description"
          content="Explore the Terms and Conditions at Notes Mates to understand how we serve students in engineering and study needs, including pyq solutions."
        />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Terms and Conditions</h1>
        <p className="mb-6">Effective Date: {today.toDateString()}</p>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">1. Agreement to Terms</h2>
          <p>
            By accessing or using <strong>Notes Mates.in</strong> (the “Website”),
            you agree to comply with and be bound by these Terms and Conditions.
            If you do not agree to these terms, please do not use our Website.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">2. Changes to Terms</h2>
          <p>
            We reserve the right to modify these Terms at any time. Any changes
            will be effective immediately upon posting on the Website. Continued
            use of the Website constitutes your acceptance of the updated Terms.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">3. Eligibility</h2>
          <p>
            To use our Website, you must be at least 13 years old or the legal age
            of majority in your jurisdiction. By using the Website, you represent
            and warrant that you meet these eligibility requirements.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">4. User Responsibilities</h2>
          <p>When using the Website, you agree to:</p>
          <ul className="list-disc pl-6">
            <li>
              Provide accurate and complete information when creating an account.
            </li>
            <li>Keep your account login credentials confidential.</li>
            <li>Not use the Website for illegal or unauthorized purposes.</li>
            <li>
              Refrain from engaging in activities that could harm or disrupt the
              Website’s functionality.
            </li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">5. Intellectual Property</h2>
          <p>
            All content on the Website, including text, graphics, logos, and
            software, is the property of Notes Mates.in or its licensors and is
            protected by copyright, trademark, and other intellectual property
            laws. You may not reproduce, distribute, or create derivative works
            from our content without our written consent.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">6. Content Ownership and License</h2>
          <p>
            By submitting content to the Website (e.g., comments, reviews, or
            uploaded material), you grant us a non-exclusive, worldwide,
            royalty-free license to use, reproduce, modify, and distribute your
            content in connection with the operation of the Website.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">7. Third-Party Links</h2>
          <p>
            Our Website may include links to third-party websites. These links are
            provided for your convenience, and we do not endorse or assume
            responsibility for the content or practices of these third-party
            websites. Use them at your own risk.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">8. Disclaimer of Warranties</h2>
          <p>
            The Website is provided on an "as-is" and "as-available" basis. We
            disclaim all warranties, express or implied, including but not limited
            to merchantability, fitness for a particular purpose, and
            non-infringement. We do not guarantee that the Website will be
            error-free, secure, or uninterrupted.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">9. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, Notes Mates.in shall not be
            liable for any indirect, incidental, special, consequential, or
            punitive damages arising out of your use or inability to use the
            Website, even if advised of the possibility of such damages.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">10. Termination</h2>
          <p>
            We may suspend or terminate your access to the Website at any time,
            without notice, for violating these Terms or for any other reason at
            our sole discretion.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">11. Governing Law</h2>
          <p>
            These Terms and any disputes arising from your use of the Website will
            be governed by and construed in accordance with the laws of [Your
            Country/State], without regard to its conflict of law principles.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">12. Contact Us</h2>
          <p>
            If you have any questions or concerns about these Terms, please
            contact us at:
          </p>
          <ul className="list-disc pl-6">
            <li>
              Email:{" "}
              <a
                href="mailto:support@notesmates.in"
                className="text-blue-500 underline"
              >
                support@notesmates.in
              </a>
            </li>
            <li>
              Website:{" "}
              <a
                href="https://www.notesmates.in"
                className="text-blue-500 underline"
              >
                https://notesmates.in
              </a>
            </li>
          </ul>
        </section>

        <p className="text-sm">
          By using Notes Mates.in, you agree to these Terms and Conditions. Thank
          you for being a part of our community.
        </p>
      </main>
    </>
  );
}
