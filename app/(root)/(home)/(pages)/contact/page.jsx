import React from 'react';
import Head from 'next/head'; // Import Head for SEO

const ContactPage = () => {
    const metaTitle = "Contact Us | Notes Mates";
    const metaDescription = "Get in touch with Notes Mates for any queries or support. Reach us through email, phone, or visit our office.";
    const metaImage = "/img/contact-page-image.png";  // Replace with your contact page image
    const metaUrl = typeof window !== "undefined" ? window.location.href : ""; // Current page URL

    return (
        <>
            {/* SEO Meta Tags */}
            <Head>
                <title>{metaTitle}</title>
                <meta name="description" content={metaDescription} />
                <meta name="keywords" content="contact, support, Notes Mates, reach us, customer service" />
                <meta property="og:title" content={metaTitle} />
                <meta property="og:description" content={metaDescription} />
                <meta property="og:image" content={metaImage} />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={metaUrl} />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={metaTitle} />
                <meta name="twitter:description" content={metaDescription} />
                <meta name="twitter:image" content={metaImage} />
            </Head>

            <div>
                <h1>Contact Us</h1>
                <p>If you have any questions, feel free to reach out to us:</p>
                <ul>
                    <li>Email: contact@notesmates.in</li>
                    <li>Phone: +917667747539</li>
                    <li>Address: Aadhartal, Jabalpur, Madhya Pradesh, India 482001</li>
                </ul>
            </div>
        </>
    );
};

export default ContactPage;
