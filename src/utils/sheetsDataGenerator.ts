
export const generateMockSheetData = (sheetName: string) => {
  const isProspectSheet = sheetName.toLowerCase().includes('prospect') || 
                         sheetName.toLowerCase().includes('client') ||
                         sheetName.toLowerCase().includes('green')

  if (isProspectSheet) {
    return {
      headers: ['Name', 'Email', 'Phone', 'Status', 'Interest Level', 'Notes', 'Source'],
      data: [
        ['John Smith', 'john@example.com', '555-0101', 'Qualified', 'High', 'Very interested in our services', 'Website'],
        ['Sarah Johnson', 'sarah@example.com', '555-0102', 'New', 'Medium', 'Requested information', 'Referral'],
        ['Mike Davis', 'mike@example.com', '555-0103', 'Contacted', 'High', 'Follow up next week', 'Social Media'],
        ['Lisa Wilson', 'lisa@example.com', '555-0104', 'Qualified', 'Low', 'Budget concerns', 'Email Campaign'],
        ['Tom Brown', 'tom@example.com', '555-0105', 'Converted', 'High', 'Signed contract', 'Direct Contact']
      ],
      lastUpdated: new Date(),
      isProspectSheet: true
    }
  }

  return {
    headers: ['Project Name', 'Status', 'Budget', 'Timeline', 'Progress'],
    data: [
      ['Website Redesign', 'Active', '$50,000', '3 months', '75%'],
      ['Mobile App', 'Planning', '$80,000', '6 months', '25%'],
      ['Marketing Campaign', 'Completed', '$25,000', '2 months', '100%']
    ],
    lastUpdated: new Date(),
    isProspectSheet: false
  }
}
