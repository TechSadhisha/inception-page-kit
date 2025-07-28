import { Button } from '@/components/ui/button'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { FolderSync as Sync, ChevronDown } from 'lucide-react'

interface PropertySyncProps {
  onSync: (sourceId: string) => void
  isSyncing: boolean
}

export const PropertySync = ({ onSync, isSyncing }: PropertySyncProps) => {
  const syncSources = [
    { id: 'magicbricks', name: 'MagicBricks', enabled: true },
    { id: '99acres', name: '99acres', enabled: true },
    { id: 'housing', name: 'Housing.com', enabled: true },
    { id: 'local_mls', name: 'Local MLS', enabled: false },
  ]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={isSyncing}>
          <Sync className={`mr-2 h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
          {isSyncing ? 'Syncing...' : 'Sync Properties'}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {syncSources.map((source) => (
          <DropdownMenuItem
            key={source.id}
            onClick={() => source.enabled && onSync(source.id)}
            disabled={!source.enabled || isSyncing}
          >
            {source.name}
            {!source.enabled && <span className="ml-2 text-xs text-muted-foreground">(Coming Soon)</span>}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}