export default function FAQ() {
    const faqs = [
      {
        question: "What is NotesMates and how does it help students?",
        answer: "NotesMates is a comprehensive platform that provides students with high-quality study materials, previous year questions (PYQs), notes, and educational resources to enhance their learning experience."
      },
      {
        question: "Is NotesMates free to use?",
        answer: "Yes, NotesMates offers a vast collection of free study materials. However, some premium content may require a subscription or purchase."
      },
      {
        question: "How can I earn money by contributing notes?",
        answer: "Students and educators can upload high-quality notes and earn revenue when other users access their content. Our contributor program rewards valuable content."
      },
      {
        question: "Does NotesMates support all universities and courses?",
        answer: "We primarily focus on RGPV and other major universities, covering engineering, management, and other courses. We are continuously expanding our repository."
      },
      {
        question: "How can I install the NotesMates app?",
        answer: "NotesMates is available as a PWA (Progressive Web App). You can install it directly from our website by clicking the 'Install App' button."
      },
    
    ];
  
    return (
      <section className="max-w-4xl mx-auto p-6">
        <h2 className="text-4xl font-extrabold text-center mb-8">Frequently Asked Questions</h2>
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <details key={index} className="p-5 border border-gray-300 rounded-lg bg-gray-50 shadow-md transition-all duration-300 hover:shadow-lg">
              <summary className="font-semibold text-lg cursor-pointer flex justify-between items-center">
                {faq.question}
                <span className="text-gray-600">▼</span>
              </summary>
              <p className="mt-3 text-gray-700 leading-relaxed">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>
    );
  }
  