
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RatingStarsProps {
  rating: number | null
  onRatingChange?: (rating: number) => void
  readonly?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export const RatingStars = ({ 
  rating, 
  onRatingChange, 
  readonly = false,
  size = 'md' 
}: RatingStarsProps) => {
  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  }

  const handleStarClick = (starRating: number) => {
    if (!readonly && onRatingChange) {
      onRatingChange(starRating)
    }
  }

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            sizeClasses[size],
            'transition-colors',
            rating && star <= rating
              ? 'fill-yellow-400 text-yellow-400'
              : 'text-gray-300',
            !readonly && 'cursor-pointer hover:text-yellow-300'
          )}
          onClick={() => handleStarClick(star)}
        />
      ))}
      {rating && (
        <span className="ml-2 text-sm text-muted-foreground">
          ({rating}/5)
        </span>
      )}
    </div>
  )
}
