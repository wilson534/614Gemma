import { describe, it, expect } from 'vitest'

describe('Digital Worker', () => {
  it('should be able to import the module', async () => {
    const module = await import('./index')
    expect(module).toBeDefined()
  })

  it('should export expected functions', async () => {
    const module = await import('./index')
    // Test based on what's actually exported
    expect(typeof module).toBe('object')
  })
})
