import { Card } from '@/components/ui/card';

const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card className="p-8">
        <h1 className="text-3xl font-bold mb-8 text-foreground">Privacy Policy</h1>
        
        <div className="space-y-6 text-muted-foreground">
          <section>
            <h2 className="text-xl font-semibold mb-3 text-foreground">1. Information We Collect</h2>
            <div className="space-y-3">
              <h3 className="font-medium text-foreground">Personal Information</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Name and email address</li>
                <li>Account credentials</li>
                <li>Profile information</li>
              </ul>
              
              <h3 className="font-medium text-foreground">Business Data</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Project information</li>
                <li>Prospect and contact details</li>
                <li>Task and communication data</li>
                <li>Files and documents you upload</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-foreground">2. How We Use Your Information</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide and maintain our services</li>
              <li>Process your requests and transactions</li>
              <li>Send service-related communications</li>
              <li>Improve our platform and user experience</li>
              <li>Ensure security and prevent fraud</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-foreground">3. Information Sharing</h2>
            <p className="mb-3">
              We do not sell, trade, or rent your personal information to third parties. We may share information in the following circumstances:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>With your consent</li>
              <li>To comply with legal obligations</li>
              <li>To protect our rights and safety</li>
              <li>With service providers who assist in our operations (under strict confidentiality agreements)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-foreground">4. Data Security</h2>
            <p>
              We implement industry-standard security measures to protect your information, including encryption, 
              secure data storage, and access controls. However, no method of transmission over the internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-foreground">5. Data Retention</h2>
            <p>
              We retain your information for as long as necessary to provide our services and comply with legal obligations. 
              You may request deletion of your data at any time, subject to legal and operational requirements.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-foreground">6. Third-Party Integrations</h2>
            <p>
              Our platform may integrate with third-party services (such as Gmail, Google Sheets). 
              Your use of these integrations is governed by their respective privacy policies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-foreground">7. Your Rights</h2>
            <p className="mb-3">You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access your personal information</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Export your data</li>
              <li>Opt-out of certain communications</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-foreground">8. Cookies and Tracking</h2>
            <p>
              We use cookies and similar technologies to enhance your experience, analyze usage, and provide personalized content. 
              You can control cookie settings through your browser preferences.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-foreground">9. Changes to Privacy Policy</h2>
            <p>
              We may update this privacy policy periodically. We will notify you of significant changes through our platform 
              or via email. Your continued use of the service constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-foreground">10. Contact Us</h2>
            <p>
              If you have questions about this privacy policy or how we handle your data, please contact us through our support channels.
            </p>
          </section>
        </div>

        <div className="mt-8 pt-6 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </Card>
    </div>
  );
};

export default PrivacyPolicy;