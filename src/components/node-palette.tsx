import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion'
import {
  Bell,
  Calendar,
  Mail,
  MessageSquare,
  Search,
  Send,
  Sparkles,
  Webhook,
} from 'lucide-react'

import { ClassValue } from 'clsx'
import { cn } from '../lib/utils'
import { useCallback } from 'react'

// Define node types
const triggerNodes = [
  { type: 'webhook', label: 'Webhook', icon: 'Webhook' },
  { type: 'schedule', label: 'Schedule', icon: 'Calendar' },
  { type: 'email', label: 'New Email', icon: 'Mail' },
]

const actionNodes = [
  { type: 'send-email', label: 'Send Email', icon: 'Send' },
  { type: 'notification', label: 'Notification', icon: 'Bell' },
  { type: 'search', label: 'Search', icon: 'Search' },
  { type: 'ai-process', label: 'AI Process', icon: 'Sparkles' },
  { type: 'message', label: 'Send Message', icon: 'MessageSquare' },
]

export function NodePalette() {
  const onDragStart = useCallback((event: React.DragEvent, nodeData: any) => {
    event.dataTransfer.setData(
      'application/reactflow',
      JSON.stringify(nodeData)
    )
    event.dataTransfer.effectAllowed = 'move'
  }, [])

  return (
    <div className="w-64 border-r border-border bg-card p-4">
      <h2 className="mb-4 text-lg font-semibold">Node Palette</h2>

      <Accordion
        type="single"
        collapsible
        defaultValue="triggers"
        className="w-full"
      >
        <AccordionItem value="triggers">
          <AccordionTrigger className="font-medium">Triggers</AccordionTrigger>
          <AccordionContent>
            <div className="grid gap-2 pt-2">
              {triggerNodes.map((node) => (
                <NodeItem
                  key={node.type}
                  node={node}
                  onDragStart={onDragStart}
                  className="bg-blue-50 hover:bg-blue-100"
                />
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="actions">
          <AccordionTrigger className="font-medium">Actions</AccordionTrigger>
          <AccordionContent>
            <div className="grid gap-2 pt-2">
              {actionNodes.map((node) => (
                <NodeItem
                  key={node.type}
                  node={node}
                  onDragStart={onDragStart}
                  className="bg-green-50 hover:bg-green-100"
                />
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

function NodeItem({
  node,
  onDragStart,
  className,
}: {
  node: any
  onDragStart: (event: React.DragEvent, node: any) => void
  className?: ClassValue
}) {
  const IconComponent = getIconComponent(node.icon)

  return (
    <div
      className={cn(
        'flex cursor-grab items-center gap-2 rounded-md border border-border p-2 transition-colors',
        className
      )}
      draggable
      onDragStart={(e) => onDragStart(e, node)}
    >
      <IconComponent className="h-4 w-4" />
      <span className="text-sm">{node.label}</span>
    </div>
  )
}

// Helper function to get the icon component
function getIconComponent(iconName: string) {
  const icons: Record<string, any> = {
    Webhook,
    Calendar,
    Mail,
    Send,
    Bell,
    Search,
    Sparkles,
    MessageSquare,
  }

  return icons[iconName] || Webhook
}
