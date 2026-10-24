import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register } from 'claude-code'

import type { Flow } from '../types'

const PANE = 'lean-flow'
const FILE = '.flow.json'
const PLAYBOOKS = ['hackathon', 'office', 'personal-site', 'personal-package', 'personal-service']

// Change the tag when Flow changes: it declines what an earlier version stored.
const flow = atom({ plugin: 'lean-flow', key: 'flow' } as const, null, { shape: 'flow-1' })
const isHidden = atom({ plugin: 'lean-flow', key: 'isHidden' } as const, false)

// .flow.json is the source of truth. The flow skill writes it; this mod only reads it.
async function load($: EngineInterface): Promise<Flow | null> {
  let next: Flow | null = null
  try {
    if (await $.fs.exists(FILE)) {
      const parsed = JSON.parse(String(await $.fs.read(FILE)))
      if (typeof parsed?.playbook === 'string' && Array.isArray(parsed.phases)) next = parsed
    }
  } catch {
    // A half-written or broken file shows as no flow until the next turn.
  }
  await update($, flow, () => next)
  const current = next?.phases[next.phase]
  $.ui.status(
    next
      ? `flow: ${next.playbook} · ${Math.min(next.phase + 1, next.phases.length)}/${next.phases.length} ${current?.name ?? 'done'}`
      : 'flow: none (/flow)',
  )
  return next
}

function start($: EngineInterface, playbook?: string) {
  const text = playbook
    ? `Use the flow skill. Start the ${playbook} playbook for this project.`
    : 'Use the flow skill. Suggest the best playbook for this project.'
  return $.prompt.submit({ text, asUser: true })
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    await $.command.register({
      name: 'flow',
      description: 'Show the workflow pane, or start a playbook: /flow <playbook>',
    })
    if (await load($)) void $.ui.open({ id: PANE, title: 'Flow' })

    return next(e)
  })

  on('command.run', { command: 'flow' }, async ($, e) => {
    const wanted = e.args.trim()
    if (wanted) {
      void start($, PLAYBOOKS.includes(wanted) ? wanted : undefined)
      return { text: `Starting flow: ${wanted}` }
    }
    await load($)
    await $.ui.open({ id: PANE, title: 'Flow' })

    return { text: 'Flow pane opened.' }
  })

  on('turn.complete', async ($, e, next) => {
    const before = await read($, flow)
    const after = await load($)
    if (after && after.phase !== before?.phase && before?.playbook === after.playbook) {
      $.ui.toast(`Phase done. Now: ${after.phases[after.phase]?.name ?? 'all phases done'}`)
    }
    if (after && !before) void $.ui.open({ id: PANE, title: 'Flow' })

    return next(e)
  })

  on('prompt.compose', async ($, e, next) => {
    const result = await next(e)
    const current = await read($, flow)
    const phase = current?.phases[current.phase]
    const text = !current
      ? 'lean-flow: this project has no .flow.json. At the first task, use the flow skill to suggest a playbook. Ask once.'
      : phase
        ? `lean-flow: active playbook ${current.playbook}, phase ${current.phase + 1} of ${current.phases.length}: ${phase.name}. Use the ${phase.skill} skill. In: ${phase.in}. Out: ${phase.out}.${phase.gate ? ' Stop at the gate.' : ''} Update .flow.json when the phase ends.`
        : `lean-flow: playbook ${current.playbook} is complete.`

    return { sections: [...result.sections, { id: 'lean-flow:state', text, scope: 'session' }] }
  })

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    if (e.props.hasSurvey || (await read($, flow)) || (await read($, isHidden))) return next(e)
    const { Box, Button, Text } = $.ui.resolve(e)

    return (
      <Box flexWrap="wrap">
        <Text dimColor>No flow. Pick one: </Text>
        <Button key="suggest" label="Suggest" onPress={() => void start($)} />
        {PLAYBOOKS.map(name => (
          <Button key={name} label={name} onPress={() => void start($, name)} />
        ))}
        <Button key="hide" label="Hide" onPress={() => update($, isHidden, () => true)} />
      </Box>
    )
  })

  on('ui.render', { component: 'Pane', requestId: PANE }, async ($, e) => {
    const { Box, Text } = $.ui.resolve(e)
    const current = await read($, flow)
    if (!current) return <Text dimColor>No .flow.json. Run /flow to pick a playbook.</Text>

    return (
      <Box flexDirection="column">
        <Text bold>{current.playbook}</Text>
        {current.phases.map((phase, i) => (
          <Box key={phase.name} flexDirection="column">
            <Text dimColor={phase.done} bold={i === current.phase}>
              {phase.done ? '[x]' : i === current.phase ? '[>]' : '[ ]'} {phase.name}
              {phase.gate ? ' (gate)' : ''} · {phase.skill}
            </Text>
            {i === current.phase && (
              <Text dimColor>
                {'    '}in: {phase.in} | out: {phase.out}
              </Text>
            )}
          </Box>
        ))}
      </Box>
    )
  })
}
