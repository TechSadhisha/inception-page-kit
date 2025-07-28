
import { ScrapedContact, ApifyCredentials, SearchParams } from '@/types/apify'

export class ApifyService {
  static async scrapeGoogleMaps(
    credentials: ApifyCredentials, 
    params: SearchParams
  ): Promise<ScrapedContact[]> {
    if (!credentials.token.trim()) {
      throw new Error('Apify API token is required')
    }

    if (!credentials.userId.trim()) {
      throw new Error('Apify User ID is required')
    }

    const searchTerms = [`${params.query} in ${params.location}`]
    
    const requestBody = {
      searchTerms,
      maxCrawledPlaces: params.maxResults,
      language: 'en',
      countryCode: 'US',
      scrapeReviews: false,
      scrapeImages: false,
      exportPlaceUrls: false,
      additionalInfo: false
    }

    console.log('Starting Apify scrape with params:', requestBody)
    console.log('Using actor:', `${credentials.userId}~${credentials.actorName}`)

    // Start the Apify actor run
    const runResponse = await fetch(`https://api.apify.com/v2/acts/${credentials.userId}~${credentials.actorName}/runs`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${credentials.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })

    if (!runResponse.ok) {
      const errorText = await runResponse.text()
      console.error('Failed to start Apify run:', errorText)
      
      // Provide more specific error messages
      if (runResponse.status === 404) {
        throw new Error(`Actor "${credentials.userId}~${credentials.actorName}" not found. Please check your User ID and Actor name.`)
      } else if (runResponse.status === 401) {
        throw new Error('Invalid Apify API token. Please check your credentials.')
      } else {
        throw new Error(`Failed to start scraping: ${runResponse.statusText}`)
      }
    }

    const runData = await runResponse.json()
    const runId = runData.data.id
    console.log('Apify run started with ID:', runId)

    // Poll for completion
    let attempts = 0
    const maxAttempts = 60 // 5 minutes max wait time
    
    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 5000)) // Wait 5 seconds
      
      const statusResponse = await fetch(`https://api.apify.com/v2/acts/${credentials.userId}~${credentials.actorName}/runs/${runId}`, {
        headers: {
          'Authorization': `Bearer ${credentials.token}`,
        },
      })

      if (!statusResponse.ok) {
        throw new Error('Failed to check run status')
      }

      const statusData = await statusResponse.json()
      const status = statusData.data.status
      console.log('Run status:', status)

      if (status === 'SUCCEEDED') {
        // Get the results
        const resultsResponse = await fetch(`https://api.apify.com/v2/acts/${credentials.userId}~${credentials.actorName}/runs/${runId}/dataset/items`, {
          headers: {
            'Authorization': `Bearer ${credentials.token}`,
          },
        })

        if (!resultsResponse.ok) {
          throw new Error('Failed to fetch results')
        }

        const results = await resultsResponse.json()
        console.log('Scraping results:', results)
        
        // Transform the results to our format
        const transformedContacts = results.map((item: any) => ({
          name: item.title || 'Unknown Business',
          address: item.address,
          phone: item.phoneNumber,
          website: item.website,
          email: item.email,
          rating: item.totalScore ? parseFloat(item.totalScore) : undefined,
          reviews: item.reviewsCount ? parseInt(item.reviewsCount) : undefined,
          category: item.categoryName || item.categories?.[0]
        }))

        return transformedContacts
      } else if (status === 'FAILED') {
        throw new Error('Scraping job failed')
      }

      attempts++
    }

    throw new Error('Scraping job timed out')
  }
}
