
export const MetaHelpSection = () => {
  return (
    <div className="text-sm text-muted-foreground mt-4">
      <p className="font-medium mb-2">How to get these credentials:</p>
      <ol className="list-decimal list-inside space-y-1">
        <li>Go to <a href="https://developers.facebook.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Facebook Developers</a></li>
        <li>Create or select your app</li>
        <li>Add the Marketing API product</li>
        <li>Generate a long-lived User Access Token with ads_management permissions</li>
        <li>Find your Ad Account ID in <a href="https://business.facebook.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Meta Business Manager</a></li>
      </ol>
    </div>
  )
}
