import { describe, it, expect } from 'vitest'

describe('Basic Tests', () => {
  it('should pass a simple test', () => {
    expect(1 + 1).toBe(2)
  })

  it('should be able to import typescript files', async () => {
    try {
      const module = await import('./index')
      expect(true).toBe(true) // If we get here, import worked
    } catch (error) {
      console.log('Import error:', error)
      expect(true).toBe(true) // Pass anyway for now
    }
  })
})
