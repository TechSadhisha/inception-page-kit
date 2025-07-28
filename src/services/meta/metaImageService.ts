
import { MetaApiClient } from './metaApiClient'

export class MetaImageService {
  constructor(private apiClient: MetaApiClient) {}

  async uploadImage(imageFile: File): Promise<string | null> {
    try {
      const formData = new FormData()
      formData.append('source', imageFile)
      formData.append('access_token', this.apiClient.token)

      const response = await fetch(`${this.apiClient.apiBaseUrl}/act_${this.apiClient.accountId}/adimages`, {
        method: 'POST',
        body: formData
      })

      const data = await response.json()
      if (data.images && Object.keys(data.images).length > 0) {
        return Object.keys(data.images)[0] // Return the image hash
      }
      return null
    } catch (error) {
      console.error('Image upload failed:', error)
      return null
    }
  }
}
