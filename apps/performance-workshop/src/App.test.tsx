import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from './App'

describe('App', () => {
  it('renders layout with sidenav and main content', () => {
    render(<App />)
    expect(screen.getByRole('heading', { level: 1, name: /performance workshop/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /elements/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /rerenders/i })).toBeInTheDocument()
  })
})
