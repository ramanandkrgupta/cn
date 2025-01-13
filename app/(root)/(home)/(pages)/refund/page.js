export default function RefundPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Refund Policy</h1>
      
      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-3">Refund Eligibility</h2>
          <p className="text-base-content/80">
            We offer refunds under the following conditions:
          </p>
          <ul className="list-disc list-inside space-y-2 mt-2 text-base-content/80">
            <li>Request made within 7 days of purchase</li>
            <li>Course content not accessed more than 25%</li>
            <li>Technical issues preventing access to content</li>
            <li>Service not as described</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Refund Process</h2>
          <ul className="list-disc list-inside space-y-2 text-base-content/80">
            <li>Submit refund request through support</li>
            <li>Include order ID and reason for refund</li>
            <li>Processing time: 5-7 business days</li>
            <li>Refund to original payment method</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Non-Refundable Items</h2>
          <ul className="list-disc list-inside space-y-2 text-base-content/80">
            <li>Downloaded digital content</li>
            <li>Completed courses</li>
            <li>Subscription fees after 7 days</li>
            <li>Special promotional offers</li>
          </ul>
        </section>
      </div>
    </div>
  );
} 