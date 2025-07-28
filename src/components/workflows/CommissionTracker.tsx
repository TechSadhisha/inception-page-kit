import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Plus, DollarSign, TrendingUp, Users, Calendar } from 'lucide-react'

export const CommissionTracker = () => {
  const commissionRecords = [
    {
      id: '1',
      agentName: 'Rajesh Kumar',
      propertyTitle: '3BHK Apartment in Bandra',
      dealValue: 12500000,
      commissionAmount: 312500,
      commissionPercentage: 2.5,
      status: 'approved',
      paymentDate: '2024-02-15',
      prospectName: 'Amit Sharma'
    },
    {
      id: '2',
      agentName: 'Priya Patel',
      propertyTitle: 'Villa in Whitefield',
      dealValue: 8500000,
      commissionAmount: 212500,
      commissionPercentage: 2.5,
      status: 'pending',
      paymentDate: null,
      prospectName: 'Sunita Jain'
    },
    {
      id: '3',
      agentName: 'Vikram Singh',
      propertyTitle: 'Commercial Space in Gurgaon',
      dealValue: 25000000,
      commissionAmount: 500000,
      commissionPercentage: 2.0,
      status: 'paid',
      paymentDate: '2024-01-30',
      prospectName: 'Tech Solutions Pvt Ltd'
    }
  ]

  const commissionStructures = [
    {
      id: '1',
      name: 'Standard Sales Commission',
      type: 'percentage',
      rate: '2.5%',
      minAmount: '₹50,000',
      maxAmount: '₹5,00,000',
      applicableTo: ['Residential Sales']
    },
    {
      id: '2',
      name: 'Rental Commission',
      type: 'percentage',
      rate: '1.0%',
      minAmount: '₹10,000',
      maxAmount: 'No limit',
      applicableTo: ['Rental Properties']
    },
    {
      id: '3',
      name: 'Luxury Property Commission',
      type: 'tiered',
      rate: '2.0-3.0%',
      minAmount: '₹1,00,000',
      maxAmount: 'No limit',
      applicableTo: ['Luxury Properties']
    }
  ]

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-blue-100 text-blue-800',
    paid: 'bg-green-100 text-green-800',
    disputed: 'bg-red-100 text-red-800',
  }

  const totalCommissionPaid = commissionRecords
    .filter(r => r.status === 'paid')
    .reduce((sum, r) => sum + r.commissionAmount, 0)

  const totalCommissionPending = commissionRecords
    .filter(r => r.status === 'pending' || r.status === 'approved')
    .reduce((sum, r) => sum + r.commissionAmount, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Commission Management</h2>
          <p className="text-muted-foreground">
            Track and manage agent commissions with automated calculations
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            Add Structure
          </Button>
          <Button>
            <DollarSign className="mr-2 h-4 w-4" />
            Process Payments
          </Button>
        </div>
      </div>

      {/* Commission Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ₹{(totalCommissionPaid / 100000).toFixed(1)}L
            </div>
            <p className="text-xs text-muted-foreground">This quarter</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Calendar className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              ₹{(totalCommissionPending / 100000).toFixed(1)}L
            </div>
            <p className="text-xs text-muted-foreground">Awaiting payment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(commissionRecords.map(r => r.agentName)).size}
            </div>
            <p className="text-xs text-muted-foreground">Earning commissions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Commission</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(commissionRecords.reduce((sum, r) => sum + r.commissionPercentage, 0) / commissionRecords.length).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">Average rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Commission Records */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Commission Records</CardTitle>
          <CardDescription>
            Track individual commission calculations and payments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {commissionRecords.map((record) => (
              <div key={record.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-medium">{record.agentName}</h3>
                    <Badge className={statusColors[record.status as keyof typeof statusColors]}>
                      {record.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{record.propertyTitle}</p>
                  <p className="text-xs text-muted-foreground">Client: {record.prospectName}</p>
                </div>
                
                <div className="text-right space-y-1">
                  <div className="text-lg font-bold text-green-600">
                    ₹{(record.commissionAmount / 100000).toFixed(1)}L
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {record.commissionPercentage}% of ₹{(record.dealValue / 100000).toFixed(1)}L
                  </div>
                  {record.paymentDate && (
                    <div className="text-xs text-muted-foreground">
                      Paid: {new Date(record.paymentDate).toLocaleDateString()}
                    </div>
                  )}
                </div>
                
                <div className="ml-4">
                  <Button variant="outline" size="sm">
                    {record.status === 'pending' ? 'Approve' : 
                     record.status === 'approved' ? 'Pay' : 'View'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Commission Structures */}
      <Card>
        <CardHeader>
          <CardTitle>Commission Structures</CardTitle>
          <CardDescription>
            Define commission rates and rules for different property types
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {commissionStructures.map((structure) => (
              <div key={structure.id} className="p-4 border rounded-lg">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{structure.name}</h3>
                    <Badge variant="outline">{structure.type}</Badge>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Rate:</span>
                      <span className="font-medium">{structure.rate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Min:</span>
                      <span>{structure.minAmount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Max:</span>
                      <span>{structure.maxAmount}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground">Applicable to:</span>
                    <div className="flex flex-wrap gap-1">
                      {structure.applicableTo.map((type) => (
                        <Badge key={type} variant="secondary" className="text-xs">
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <Button variant="outline" size="sm" className="w-full">
                    Edit Structure
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}