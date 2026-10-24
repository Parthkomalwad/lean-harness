export type Phase = {
  name: string
  skill: string
  in: string
  out: string
  gate?: boolean
  done: boolean
}

export type Flow = { playbook: string; phase: number; phases: Phase[] }

declare module 'claude-code' {
  interface PluginState {
    'lean-flow': { flow: Shaped<Flow | null>; isHidden: boolean }
  }
}
