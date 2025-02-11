export default function FAQ() {
  const faqs = [
    {
      question: "How does NotesMates help for RGPV Students?",
      answer: "RGPV students can access high-quality study materials, BTech notes, PYQs, and semester resources for all branches like CSE, ECE, ME, and more on NotesMates."
    },
    {
      question: "Is NotesMates free for RGPV BTech students?",
      answer: "NotesMates offers free BTech notes, PYQs, and study materials for RGPV students. Some premium content may require a subscription."
    },
    
    // {
    //   question: "Does NotesMates offer study materials for all BTech branches?",
    //   answer: "NotesMates provides study materials, BTech notes, and PYQs for all RGPV branches, including CSE, ECE, ME, Civil, Electrical, and more."
    // },
    // {
    //   question: "RGPV BTech semester syllabus – How to access on NotesMates?",
    //   answer: "RGPV BTech students can access detailed semester syllabus, notes, and PYQs for all branches directly on NotesMates."
    // },
    {
      question: "BTech notes and study materials for Bhopal students – What does NotesMates provide?",
      answer: "NotesMates offers BTech notes, PYQs, and study resources for RGPV students in Bhopal, covering all engineering branches and semesters."
    },
    {
      question: "How to install the NotesMates app for RGPV study materials?",
      answer: "Install the NotesMates Progressive Web App (PWA) to access RGPV study materials, BTech notes, and PYQs on your mobile. Click One Three dot of browser then Add to Home Screen"
    },
    // {
    //   question: "RGPV PYQs and BTech notes – How to find on NotesMates?",
    //   answer: "RGPV BTech students can find previous year questions (PYQs) and notes for all semesters and branches on NotesMates."
    // },
    {
      question: "Are RGPV study materials and notes updated regularly on NotesMates?",
      answer: "Yes, NotesMates regularly updates RGPV BTech notes, PYQs, and study materials for all branches and semesters."
    },
    {
      question: "Why choose NotesMates for RGPV BTech notes and study resources?",
      answer: "NotesMates provides the most comprehensive BTech notes, PYQs, and study materials for RGPV students across all branches like CSE, ECE, and ME."
    },
    // {
    //   question: "How to download RGPV BTech notes and PYQs from NotesMates?",
    //   answer: "Download RGPV BTech notes, PYQs, and study materials directly from NotesMates by selecting your branch and semester."
    // }
  ];

  return (
    <section className="max-w-4xl mx-auto p-6">
      <h2 className="text-4xl font-extrabold text-center mb-8">
        Frequently Asked Questions
      </h2>
      <div className="space-y-6">
        {faqs.map((faq, index) => (
          <details key={index} className="p-5 border border-secondary rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
            <summary className="font-semibold text-lg cursor-pointer flex justify-between items-center">
              {faq.question}
              <span className="text-secondary">▼</span>
            </summary>
            <p className="mt-3 text-base-300/85 leading-relaxed">{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
  