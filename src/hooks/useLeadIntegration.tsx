import { useState, useCallback } from 'react'
import { useToast } from '@/hooks/use-toast'
import { useProspects } from '@/hooks/useProspects'

interface Lead {
  name: string
  phone: string
  email?: string
  source: string
  property?: string
  budget?: string
  location?: string
  notes?: string
}

interface LeadSource {
  id: string
  name: string
  enabled: boolean
  lastSync: string | null
  totalLeads: number
  newLeads: number
  status: 'connected' | 'disconnected' | 'syncing' | 'error'
  credentials?: Record<string, string>
}

interface FacebookLeadForm {
  id: string
  name: string
  pageId: string
  pageName: string
  enabled: boolean
  lastSync: string | null
  totalLeads: number
  newLeads: number
  status: 'connected' | 'disconnected' | 'syncing' | 'error'
}

export const useLeadIntegration = () => {
  const { toast } = useToast()
  const { createProspect } = useProspects()
  const [syncing, setSyncing] = useState<string | null>(null)

  const [leadSources, setLeadSources] = useState<LeadSource[]>([
    {
      id: 'magicbricks',
      name: 'MagicBricks',
      enabled: true,
      lastSync: null,
      totalLeads: 0,
      newLeads: 0,
      status: 'disconnected'
    },
    {
      id: '99acres',
      name: '99acres',
      enabled: false,
      lastSync: null,
      totalLeads: 0,
      newLeads: 0,
      status: 'disconnected'
    },
    {
      id: 'housing',
      name: 'Housing.com',
      enabled: true,
      lastSync: null,
      totalLeads: 0,
      newLeads: 0,
      status: 'disconnected'
    },
    {
      id: 'callyzer',
      name: 'Callyzer',
      enabled: true,
      lastSync: null,
      totalLeads: 0,
      newLeads: 0,
      status: 'disconnected'
    }
  ])

  const [facebookLeadForms, setFacebookLeadForms] = useState<FacebookLeadForm[]>([
    {
      id: 'fb_form_1',
      name: 'Premium Apartments Lead Form',
      pageId: 'page_123456',
      pageName: 'Real Estate Pro',
      enabled: true,
      lastSync: null,
      totalLeads: 0,
      newLeads: 0,
      status: 'disconnected'
    },
    {
      id: 'fb_form_2',
      name: 'Villa Inquiry Form',
      pageId: 'page_789012',
      pageName: 'Luxury Homes',
      enabled: false,
      lastSync: null,
      totalLeads: 0,
      newLeads: 0,
      status: 'disconnected'
    }
  ])

  const fetchLeadsFromSource = useCallback(async (sourceId: string): Promise<Lead[]> => {
    const mockLeads: Record<string, Lead[]> = {
      magicbricks: [
        {
          name: 'Rajesh Kumar',
          phone: '+91 9876543210',
          email: 'rajesh@example.com',
          source: 'MagicBricks',
          property: '3BHK Apartment in Noida',
          budget: '₹75L - ₹1Cr',
          location: 'Noida, UP',
          notes: 'Interested in ready-to-move properties'
        },
        {
          name: 'Sunita Sharma',
          phone: '+91 9876543211',
          email: 'sunita@example.com',
          source: 'MagicBricks',
          property: '2BHK Flat in Gurgaon',
          budget: '₹50L - ₹75L',
          location: 'Gurgaon, HR',
          notes: 'First-time buyer, looking for loan assistance'
        }
      ],
      '99acres': [
        {
          name: 'Amit Patel',
          phone: '+91 9876543212',
          source: '99acres',
          property: 'Villa in Pune',
          budget: '₹1.5Cr - ₹2Cr',
          location: 'Pune, MH',
          notes: 'Looking for premium properties with good amenities'
        }
      ],
      housing: [
        {
          name: 'Kavita Singh',
          phone: '+91 9876543213',
          email: 'kavita@example.com',
          source: 'Housing.com',
          property: '4BHK House in Bangalore',
          budget: '₹1Cr - ₹1.5Cr',
          location: 'Bangalore, KA',
          notes: 'Urgent requirement, ready to close deal'
        }
      ],
      callyzer: [
        {
          name: 'Rohit Gupta',
          phone: '+91 9876543214',
          email: 'rohit@example.com',
          source: 'Callyzer',
          property: '2BHK Apartment in Delhi',
          budget: '₹60L - ₹80L',
          location: 'Delhi, DL',
          notes: 'Call received at 2:30 PM, interested in new projects'
        },
        {
          name: 'Meera Jain',
          phone: '+91 9876543215',
          source: 'Callyzer',
          property: '3BHK Villa in Goa',
          budget: '₹1.2Cr - ₹1.8Cr',
          location: 'Goa, GA',
          notes: 'Inbound call inquiry, looking for vacation home'
        }
      ]
    }

    await new Promise(resolve => setTimeout(resolve, 2000))
    
    return mockLeads[sourceId] || []
  }, [])

  const fetchFacebookLeads = useCallback(async (formId: string): Promise<Lead[]> => {
    const mockFacebookLeads: Record<string, Lead[]> = {
      fb_form_1: [
        {
          name: 'Priya Sharma',
          phone: '+91 9876543220',
          email: 'priya.sharma@example.com',
          source: 'Facebook Lead Form',
          property: 'Premium Apartments',
          budget: '₹80L - ₹1.2Cr',
          location: 'Mumbai, MH',
          notes: 'Interested in premium apartments, submitted form from Facebook ad'
        },
        {
          name: 'Arjun Reddy',
          phone: '+91 9876543221',
          email: 'arjun.reddy@example.com',
          source: 'Facebook Lead Form',
          property: 'Premium Apartments',
          budget: '₹60L - ₹90L',
          location: 'Hyderabad, TS',
          notes: 'First-time buyer, responded to Facebook campaign'
        }
      ],
      fb_form_2: [
        {
          name: 'Deepak Agarwal',
          phone: '+91 9876543222',
          email: 'deepak.agarwal@example.com',
          source: 'Facebook Lead Form',
          property: 'Luxury Villas',
          budget: '₹2Cr - ₹3Cr',
          location: 'Bangalore, KA',
          notes: 'High-value lead from Facebook villa campaign'
        }
      ]
    }

    await new Promise(resolve => setTimeout(resolve, 2000))
    
    return mockFacebookLeads[formId] || []
  }, [])

  const syncLeads = useCallback(async (sourceId: string, projectId: string) => {
    setSyncing(sourceId)
    
    try {
      console.log(`Syncing leads from ${sourceId} to project ${projectId}`)
      
      setLeadSources(prev => prev.map(source => 
        source.id === sourceId 
          ? { ...source, status: 'syncing' as const }
          : source
      ))

      const leads = await fetchLeadsFromSource(sourceId)
      
      for (const lead of leads) {
        const prospectData = {
          project_id: projectId,
          name: lead.name,
          phone: lead.phone,
          email: lead.email || null,
          status: 'new' as const,
          interest_rating: 3,
          notes: [
            `Source: ${lead.source}`,
            lead.property && `Property Interest: ${lead.property}`,
            lead.budget && `Budget: ${lead.budget}`,
            lead.location && `Location: ${lead.location}`,
            lead.notes && `Notes: ${lead.notes}`
          ].filter(Boolean).join('\n')
        }
        
        createProspect(prospectData)
      }

      setLeadSources(prev => prev.map(source => {
        if (source.id === sourceId) {
          return {
            ...source,
            status: 'connected' as const,
            lastSync: new Date().toISOString(),
            totalLeads: source.totalLeads + leads.length,
            newLeads: leads.length
          }
        }
        return source
      }))

      toast({
        title: "Sync Completed",
        description: `Successfully imported ${leads.length} leads from ${leadSources.find(s => s.id === sourceId)?.name}`,
      })

    } catch (error) {
      console.error('Lead sync error:', error)
      
      setLeadSources(prev => prev.map(source => 
        source.id === sourceId 
          ? { ...source, status: 'error' as const }
          : source
      ))
      
      toast({
        title: "Sync Failed",
        description: "Failed to sync leads. Please check your configuration.",
        variant: "destructive",
      })
    } finally {
      setSyncing(null)
    }
  }, [createProspect, toast, leadSources])

  const syncFacebookLeads = useCallback(async (formId: string, projectId: string) => {
    setSyncing(formId)
    
    try {
      console.log(`Syncing Facebook leads from form ${formId} to project ${projectId}`)
      
      setFacebookLeadForms(prev => prev.map(form => 
        form.id === formId 
          ? { ...form, status: 'syncing' as const }
          : form
      ))

      const leads = await fetchFacebookLeads(formId)
      
      for (const lead of leads) {
        const prospectData = {
          project_id: projectId,
          name: lead.name,
          phone: lead.phone,
          email: lead.email || null,
          status: 'new' as const,
          interest_rating: 4,
          notes: [
            `Source: ${lead.source}`,
            lead.property && `Property Interest: ${lead.property}`,
            lead.budget && `Budget: ${lead.budget}`,
            lead.location && `Location: ${lead.location}`,
            lead.notes && `Notes: ${lead.notes}`
          ].filter(Boolean).join('\n')
        }
        
        createProspect(prospectData)
      }

      setFacebookLeadForms(prev => prev.map(form => {
        if (form.id === formId) {
          return {
            ...form,
            status: 'connected' as const,
            lastSync: new Date().toISOString(),
            totalLeads: form.totalLeads + leads.length,
            newLeads: leads.length
          }
        }
        return form
      }))

      const formName = facebookLeadForms.find(f => f.id === formId)?.name
      toast({
        title: "Facebook Sync Completed",
        description: `Successfully imported ${leads.length} leads from ${formName}`,
      })

    } catch (error) {
      console.error('Facebook lead sync error:', error)
      
      setFacebookLeadForms(prev => prev.map(form => 
        form.id === formId 
          ? { ...form, status: 'error' as const }
          : form
      ))
      
      toast({
        title: "Facebook Sync Failed",
        description: "Failed to sync Facebook leads. Please check your configuration.",
        variant: "destructive",
      })
    } finally {
      setSyncing(null)
    }
  }, [createProspect, toast, facebookLeadForms])

  const toggleSource = useCallback((sourceId: string, enabled: boolean) => {
    setLeadSources(prev => prev.map(source => 
      source.id === sourceId 
        ? { ...source, enabled }
        : source
    ))
  }, [])

  const toggleFacebookForm = useCallback((formId: string, enabled: boolean) => {
    setFacebookLeadForms(prev => prev.map(form => 
      form.id === formId 
        ? { ...form, enabled }
        : form
    ))
  }, [])

  const updateCredentials = useCallback((sourceId: string, credentials: Record<string, string>) => {
    setLeadSources(prev => prev.map(source => 
      source.id === sourceId 
        ? { ...source, credentials, status: 'connected' as const }
        : source
    ))
    
    toast({
      title: "Credentials Updated",
      description: `Successfully updated credentials for ${leadSources.find(s => s.id === sourceId)?.name}`,
    })
  }, [toast, leadSources])

  const addFacebookForm = useCallback((formData: { name: string; pageId: string; pageName: string }) => {
    const newForm: FacebookLeadForm = {
      id: `fb_form_${Date.now()}`,
      name: formData.name,
      pageId: formData.pageId,
      pageName: formData.pageName,
      enabled: true,
      lastSync: null,
      totalLeads: 0,
      newLeads: 0,
      status: 'connected'
    }
    
    setFacebookLeadForms(prev => [...prev, newForm])
    
    toast({
      title: "Facebook Form Added",
      description: `Successfully added ${formData.name} to lead forms`,
    })
  }, [toast])

  const removeFacebookForm = useCallback((formId: string) => {
    setFacebookLeadForms(prev => prev.filter(form => form.id !== formId))
    
    toast({
      title: "Facebook Form Removed",
      description: "Successfully removed Facebook lead form",
    })
  }, [toast])

  return {
    leadSources,
    facebookLeadForms,
    syncing,
    syncLeads,
    syncFacebookLeads,
    toggleSource,
    toggleFacebookForm,
    updateCredentials,
    addFacebookForm,
    removeFacebookForm
  }
}
