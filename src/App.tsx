import { WorkflowBuilder } from './components/workflow-builder'

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b border-border bg-card px-6 py-3">
        <h1 className="text-xl font-semibold">Workflow Builder</h1>
      </header>
      <WorkflowBuilder />
    </div>
  )
}

export default App
