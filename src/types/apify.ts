
export interface ScrapedContact {
  name: string
  address?: string
  phone?: string
  website?: string
  email?: string
  rating?: number
  reviews?: number
  category?: string
}

export interface ApifyCredentials {
  userId: string
  token: string
  actorName: string
}

export interface SearchParams {
  query: string
  location: string
  maxResults: number
}
