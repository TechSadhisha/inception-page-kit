
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Search, Calendar as CalendarIcon, ListTodo, FolderOpen } from 'lucide-react'
import { useTasks } from '@/hooks/useTasks'
import { useProjects } from '@/hooks/useProjects'
import { TaskCard } from '@/components/tasks/TaskCard'
import { TaskDialog } from '@/components/tasks/TaskDialog'
import { TaskCalendar } from '@/components/calendar/TaskCalendar'
import { Task } from '@/types/task'

const Tasks = () => {
  const { projects } = useProjects()
  const [selectedProjectId, setSelectedProjectId] = useState<string>('all')
  const { tasks, isLoading, createTask, updateTask, deleteTask, isCreating, isUpdating } = useTasks(selectedProjectId === 'all' ? undefined : selectedProjectId)
  
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [activeView, setActiveView] = useState('list')

  // Get all tasks for project tabs (not filtered by selectedProjectId)
  const { tasks: allTasks } = useTasks()

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter
    
    return matchesSearch && matchesStatus && matchesPriority
  })

  // Group tasks by project for project tabs
  const tasksByProject = projects.reduce((acc, project) => {
    acc[project.id] = allTasks.filter(task => task.project_id === project.id)
    return acc
  }, {} as Record<string, Task[]>)

  const handleCreateTask = (data: any) => {
    createTask(data)
    setDialogOpen(false)
  }

  const handleUpdateTask = (data: any) => {
    if (editingTask) {
      updateTask(editingTask.id, data)
      setEditingTask(null)
      setDialogOpen(false)
    }
  }

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    setDialogOpen(true)
  }

  const handleDeleteTask = (id: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask(id)
    }
  }

  const handleDialogClose = () => {
    setDialogOpen(false)
    setEditingTask(null)
  }

  const handleTaskClick = (task: Task) => {
    handleEditTask(task)
  }

  const renderTaskGrid = (tasksToRender: Task[]) => {
    if (tasksToRender.length === 0) {
      return (
        <Card>
          <CardHeader>
            <CardTitle>No Tasks Found</CardTitle>
            <CardDescription>
              {tasks.length === 0 
                ? "Get started by creating your first task."
                : "No tasks match your search criteria."
              }
            </CardDescription>
          </CardHeader>
          {tasks.length === 0 && (
            <CardContent>
              <Button onClick={() => setDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Task
              </Button>
            </CardContent>
          )}
        </Card>
      )
    }

    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tasksToRender.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
          />
        ))}
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Task Management</h1>
          <p className="text-muted-foreground">
            Manage tasks and schedule for effective project and prospect management
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Task
        </Button>
      </div>

      <Tabs value={activeView} onValueChange={setActiveView} className="space-y-6">
        <TabsList>
          <TabsTrigger value="list" className="flex items-center space-x-2">
            <ListTodo className="h-4 w-4" />
            <span>Task List</span>
          </TabsTrigger>
          <TabsTrigger value="projects" className="flex items-center space-x-2">
            <FolderOpen className="h-4 w-4" />
            <span>By Projects</span>
          </TabsTrigger>
          <TabsTrigger value="calendar" className="flex items-center space-x-2">
            <CalendarIcon className="h-4 w-4" />
            <span>Calendar View</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Projects</SelectItem>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {renderTaskGrid(filteredTasks)}
        </TabsContent>

        <TabsContent value="projects" className="space-y-6">
          <div className="relative max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>

          <Tabs defaultValue={projects[0]?.id || 'no-projects'} className="space-y-4">
            <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1">
              {projects.map((project) => (
                <TabsTrigger 
                  key={project.id} 
                  value={project.id}
                  className="text-sm"
                >
                  {project.name} ({tasksByProject[project.id]?.length || 0})
                </TabsTrigger>
              ))}
              {projects.length === 0 && (
                <TabsTrigger value="no-projects" disabled>
                  No Projects Available
                </TabsTrigger>
              )}
            </TabsList>

            {projects.map((project) => (
              <TabsContent key={project.id} value={project.id} className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{project.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {tasksByProject[project.id]?.length || 0} task(s) in this project
                    </p>
                  </div>
                  <Button 
                    onClick={() => {
                      setSelectedProjectId(project.id)
                      setDialogOpen(true)
                    }}
                    size="sm"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Task
                  </Button>
                </div>

                {renderTaskGrid(
                  (tasksByProject[project.id] || []).filter(task => {
                    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()))
                    return matchesSearch
                  })
                )}
              </TabsContent>
            ))}

            {projects.length === 0 && (
              <TabsContent value="no-projects">
                <Card>
                  <CardHeader>
                    <CardTitle>No Projects Available</CardTitle>
                    <CardDescription>
                      You need to create projects first before you can organize tasks by projects.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </TabsContent>

        <TabsContent value="calendar">
          <TaskCalendar tasks={allTasks} onTaskClick={handleTaskClick} />
        </TabsContent>
      </Tabs>

      <TaskDialog
        open={dialogOpen}
        onOpenChange={handleDialogClose}
        task={editingTask}
        projectId={selectedProjectId === 'all' ? undefined : selectedProjectId}
        onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
        isLoading={isCreating || isUpdating}
      />
    </div>
  )
}

export default Tasks
