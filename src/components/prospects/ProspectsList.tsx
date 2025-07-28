
import { ProspectCard } from './ProspectCard'
import { Prospect } from '@/types/prospect'

interface ProspectsListProps {
  prospects: Prospect[]
  onEdit: (prospect: Prospect) => void
  onDelete: (id: string) => void
  onWhatsApp: (prospect: Prospect) => void
}

export const ProspectsList = ({
  prospects,
  onEdit,
  onDelete,
  onWhatsApp,
}: ProspectsListProps) => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {prospects.map((prospect) => (
        <ProspectCard
          key={prospect.id}
          prospect={prospect}
          onEdit={onEdit}
          onDelete={onDelete}
          onWhatsApp={prospect.phone ? () => onWhatsApp(prospect) : undefined}
        />
      ))}
    </div>
  )
}
