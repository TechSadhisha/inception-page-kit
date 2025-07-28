
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { SearchParams } from '@/types/apify'

interface SearchParamsFormProps {
  params: SearchParams
  onParamsChange: (params: SearchParams) => void
}

export const SearchParamsForm = ({ params, onParamsChange }: SearchParamsFormProps) => {
  const handleChange = (field: keyof SearchParams, value: string | number) => {
    onParamsChange({
      ...params,
      [field]: value
    })
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="space-y-2">
        <Label htmlFor="search-query">Search Query</Label>
        <Input
          id="search-query"
          value={params.query}
          onChange={(e) => handleChange('query', e.target.value)}
          placeholder="e.g., restaurants, plumbers, dentists"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          value={params.location}
          onChange={(e) => handleChange('location', e.target.value)}
          placeholder="e.g., New York, NY"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="max-results">Max Results</Label>
        <Input
          id="max-results"
          type="number"
          value={params.maxResults}
          onChange={(e) => handleChange('maxResults', parseInt(e.target.value) || 20)}
          placeholder="20"
          min="1"
          max="100"
        />
      </div>
    </div>
  )
}
