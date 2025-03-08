'use client'

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel } from './ui/form'

import Button from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { useWorkflowStore } from '../lib/store'

// Define form fields based on node type
const nodeConfigFields: Record<string, any> = {
  webhook: [
    { name: 'url', label: 'Webhook URL', type: 'text' },
    {
      name: 'method',
      label: 'HTTP Method',
      type: 'text',
      defaultValue: 'POST',
    },
  ],
  schedule: [
    { name: 'frequency', label: 'Frequency', type: 'text' },
    { name: 'time', label: 'Time', type: 'text' },
  ],
  email: [
    { name: 'emailAddress', label: 'Email Address', type: 'text' },
    { name: 'subject', label: 'Subject Filter', type: 'text' },
  ],
  'send-email': [
    { name: 'to', label: 'To', type: 'text' },
    { name: 'subject', label: 'Subject', type: 'text' },
    { name: 'body', label: 'Body', type: 'textarea' },
  ],
  notification: [
    { name: 'message', label: 'Message', type: 'text' },
    { name: 'channel', label: 'Channel', type: 'text' },
  ],
  search: [
    { name: 'query', label: 'Search Query', type: 'text' },
    { name: 'source', label: 'Source', type: 'text' },
  ],
  'ai-process': [
    { name: 'prompt', label: 'AI Prompt', type: 'textarea' },
    { name: 'model', label: 'AI Model', type: 'text', defaultValue: 'gpt-4' },
  ],
  message: [
    { name: 'recipient', label: 'Recipient', type: 'text' },
    { name: 'message', label: 'Message', type: 'textarea' },
  ],
}

export function NodeConfigModal() {
  const { selectedNode, setSelectedNode, updateNodeConfig } = useWorkflowStore()

  const form = useForm({
    defaultValues: selectedNode ? { ...selectedNode.data.config } : {},
  })

  const onSubmit = useCallback(
    (data: any) => {
      if (selectedNode) {
        updateNodeConfig(selectedNode.id, data)
        setSelectedNode(null)
      }
    },
    [selectedNode, updateNodeConfig, setSelectedNode]
  )

  const fields = selectedNode
    ? nodeConfigFields[selectedNode.data.type] || []
    : []

  if (!selectedNode) return null

  return (
    <Dialog
      open={!!selectedNode}
      onOpenChange={(open) => !open && setSelectedNode(null)}
    >
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>Configure {selectedNode.data.label}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-4"
          >
            {fields.map((field: any) => (
              <FormField
                key={field.name}
                control={form.control}
                name={field.name}
                defaultValue={
                  field.defaultValue ||
                  selectedNode.data.config[field.name] ||
                  ''
                }
                render={({ field: formField }) => (
                  <FormItem>
                    <FormLabel>{field.label}</FormLabel>
                    <FormControl>
                      {field.type === 'textarea' ? (
                        <Textarea {...formField} />
                      ) : (
                        <Input {...formField} />
                      )}
                    </FormControl>
                  </FormItem>
                )}
              />
            ))}
            <DialogFooter>
              <Button
                type="submit"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
