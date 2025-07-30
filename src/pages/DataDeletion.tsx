import { Card } from '@/components/ui/card';

const DataDeletion = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card className="p-8">
        <h1 className="text-3xl font-bold mb-8 text-foreground">Data Deletion Request – Sadhisha CRM</h1>
        
        <div className="space-y-6 text-muted-foreground">
          <p className="text-lg">
            As per Facebook (Meta) policy, you can request deletion of your personal data stored in Sadhisha CRM at any time.
          </p>

          <section>
            <h2 className="text-xl font-semibold mb-4 text-foreground">How to request deletion:</h2>
            <ul className="list-disc pl-6 space-y-3">
              <li>
                Please email us at <strong className="text-foreground">support@sadhishahomes.com</strong> with the subject "Facebook Data Deletion Request."
              </li>
              <li>
                Include your Facebook-linked email address or username for identification.
              </li>
              <li>
                Upon receiving your request, we will permanently remove your data associated with your Facebook account within 7 business days and send you a confirmation.
              </li>
            </ul>
          </section>

          <section className="pt-4">
            <p>
              If you have questions, contact us at <strong className="text-foreground">support@sadhishahomes.com</strong> or see our <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>.
            </p>
          </section>

          <div className="pt-6 border-t border-border">
            <p className="text-lg font-medium text-foreground">
              Thank you for trusting Sadhisha CRM.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DataDeletion;