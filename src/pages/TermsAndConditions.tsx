import { Card } from '@/components/ui/card';

const TermsAndConditions = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card className="p-8">
        <h1 className="text-3xl font-bold mb-8 text-foreground">Terms and Conditions</h1>
        
        <div className="space-y-6 text-muted-foreground">
          <section>
            <h2 className="text-xl font-semibold mb-3 text-foreground">1. Acceptance of Terms</h2>
            <p>
              By accessing and using this service, you accept and agree to be bound by the terms and provision of this agreement.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-foreground">2. Service Description</h2>
            <p>
              Our platform provides business management tools including project management, prospect tracking, task management, and communication features.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-foreground">3. User Responsibilities</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Maintain the confidentiality of your account credentials</li>
              <li>Use the service in compliance with applicable laws and regulations</li>
              <li>Not engage in any activity that interferes with or disrupts the service</li>
              <li>Ensure accuracy of information provided</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-foreground">4. Data Usage</h2>
            <p>
              You retain ownership of your data. We process and store your data to provide our services. 
              We implement appropriate security measures to protect your information.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-foreground">5. Service Availability</h2>
            <p>
              While we strive for continuous availability, we do not guarantee uninterrupted access to our services. 
              Maintenance, updates, and unforeseen circumstances may temporarily affect service availability.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-foreground">6. Limitation of Liability</h2>
            <p>
              Our liability is limited to the maximum extent permitted by law. We are not liable for any indirect, 
              incidental, or consequential damages arising from the use of our service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-foreground">7. Termination</h2>
            <p>
              Either party may terminate this agreement at any time. Upon termination, your access to the service will cease, 
              and we may delete your data in accordance with our data retention policies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-foreground">8. Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. 
              Continued use of the service constitutes acceptance of modified terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-foreground">9. Contact Information</h2>
            <p>
              If you have any questions about these Terms and Conditions, please contact us through our support channels.
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

export default TermsAndConditions;