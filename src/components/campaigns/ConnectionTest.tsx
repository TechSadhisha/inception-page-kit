
import { Button } from '@/components/ui/button'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'

interface ConnectionTestProps {
  isTestingConnection: boolean
  connectionStatus: 'success' | 'error' | null
  onTestConnection: () => void
}

export const ConnectionTest = ({ 
  isTestingConnection, 
  connectionStatus, 
  onTestConnection 
}: ConnectionTestProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Button 
        variant="outline" 
        onClick={onTestConnection} 
        disabled={isTestingConnection}
      >
        {isTestingConnection ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Testing...
          </>
        ) : (
          "Test Connection"
        )}
      </Button>
      
      {connectionStatus && (
        <div className="flex items-center">
          {connectionStatus === 'success' ? (
            <CheckCircle className="h-5 w-5 text-green-600" />
          ) : (
            <XCircle className="h-5 w-5 text-red-600" />
          )}
        </div>
      )}
    </div>
  )
}
