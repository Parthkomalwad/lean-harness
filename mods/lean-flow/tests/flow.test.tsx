import { expect, test } from 'claude-code/testing'

const PANE = {
  plugin: 'lean-flow',
  component: 'Pane',
  requestId: 'lean-flow',
  surface: 'desktop',
  props: {
    title: 'Flow',
    isFocused: false,
    bodyColumns: 60,
    placement: 'dock',
    scroll: { offset: 0, bodyRows: 20 },
    view: {},
  },
} as const

const FLOW = {
  playbook: 'hackathon',
  phase: 1,
  phases: [
    { name: 'Plan', skill: 'plan-spec', in: 'idea', out: 'docs/spec.md', gate: true, done: true },
    { name: 'UI', skill: 'ui-taste', in: 'spec', out: 'main screen', done: false },
  ],
}

test('the pane shows the phases from .flow.json', async ($, on) => {
  on('command.register', () => ({ value: { command: 'flow' } }))
  on('ui.open', () => ({ value: { isPlaced: true } }))
  on('ui.status', () => ({ value: undefined }))
  on('fs.exists', () => ({ value: true }))
  on('fs.read', () => ({ value: JSON.stringify(FLOW) }))
  on('session.start', (_, e) => ({ cwd: e.cwd }))

  await $.session.start({ cwd: '/', surface: 'desktop', isInteractive: true })
  const ui = await $.ui.mount(PANE)

  expect((await ui.find({ type: 'Text', text: /Plan/ }))?.text).toContain('[x] Plan')
  expect((await ui.find({ type: 'Text', text: /UI/ }))?.text).toContain('[>] UI')
  await ui.unmount()
})

test('no .flow.json leaves a hint in the pane', async ($, on) => {
  on('command.register', () => ({ value: { command: 'flow' } }))
  on('ui.status', () => ({ value: undefined }))
  on('fs.exists', () => ({ value: false }))
  on('session.start', (_, e) => ({ cwd: e.cwd }))

  await $.session.start({ cwd: '/', surface: 'desktop', isInteractive: true })
  const ui = await $.ui.mount(PANE)

  expect((await ui.find({ type: 'Text' }))?.text).toContain('Run /flow')
  await ui.unmount()
})
