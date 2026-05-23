/**
 * INCORRECT: Barrel File Imports (Anti-Patterns)
 *
 * These patterns prevent tree-shaking and bloat the client bundle.
 * Each example demonstrates a common mistake that impacts performance.
 */

// ============================================================================
// ANTI-PATTERN 1: Internal Barrel File
// ============================================================================

// components/index.ts — THE BARREL FILE (creates the problem)
// export * from './button'
// export * from './modal'
// export * from './sidebar'
// export * from './chart'
// export * from './dataTable'
// export * from './form'
// export * from './input'
// export * from './select'

// WRONG: Imports from barrel, bundles ALL components
import { Button, Modal, Sidebar } from '@/components'
// Problem: Even though you only use Button, Modal, and Sidebar,
// the bundler may include chart, dataTable, form, input, and select
// because it cannot safely tree-shake barrel file re-exports.
// Bundle impact: Potentially 20-50KB+ of unused components.

function BrokenComponent() {
  return (
    <div>
      <Button>Click me</Button>
      <Modal>Content</Modal>
    </div>
  )
}

// ============================================================================
// ANTI-PATTERN 2: Full Library Import (Lodash)
// ============================================================================

// WRONG: Imports entire lodash library
import { debounce, throttle, cloneDeep } from 'lodash'
// Problem: Bundles ALL of lodash (~70KB minified+gzipped)
// Even with tree-shaking, lodash's module structure often prevents
// proper elimination of unused functions.
// Bundle impact: ~70KB vs ~2KB per function when imported directly.

function BrokenDebounce() {
  const handler = debounce((value: string) => {
    console.log(value)
  }, 300)

  return <input onChange={(e) => handler(e.target.value)} />
}

// ============================================================================
// ANTI-PATTERN 3: Icon Library Barrel Import
// ============================================================================

// WRONG: Imports from barrel, potentially hundreds of icons
import { UserIcon, HomeIcon, CogIcon } from '@heroicons/react/24/solid'
// Problem: While Heroicons has improved tree-shaking, barrel imports
// from icon libraries are risky. Some bundlers include all icons
// referenced in the barrel file index.
// Bundle impact: Potentially 100KB+ of unused SVG icons.

function BrokenIconBar() {
  return (
    <nav>
      <HomeIcon className="h-6 w-6" />
      <UserIcon className="h-6 w-6" />
      <CogIcon className="h-6 w-6" />
    </nav>
  )
}

// ============================================================================
// ANTI-PATTERN 4: Material UI Icon Barrel
// ============================================================================

// WRONG: Imports from MUI icon barrel
import { Home, Person, Settings, Search } from '@mui/icons-material'
// Problem: @mui/icons-material exports 2000+ icons.
// Even with tree-shaking, the barrel file structure can cause
// the bundler to include significantly more than needed.
// Bundle impact: Potentially hundreds of KB of unused icons.

function BrokenMuiIcons() {
  return (
    <div>
      <Home />
      <Person />
      <Settings />
      <Search />
    </div>
  )
}

// ============================================================================
// ANTI-PATTERN 5: Utility Barrel File
// ============================================================================

// lib/utils/index.ts — THE BARREL FILE
// export * from './format'
// export * from './validate'
// export * from './api'
// export * from './transform'
// export * from './constants'

// WRONG: Imports from utility barrel
import { formatDate, validateEmail } from '@/lib/utils'
// Problem: Pulls in all utility modules including potentially
// large constants files, API helpers, and transform functions
// that are never used.
// Bundle impact: 10-30KB+ of unused utility code.

function BrokenUtils() {
  const email = 'test@example.com'
  const isValid = validateEmail(email)
  const formatted = formatDate(new Date())

  return (
    <div>
      <p>Email valid: {isValid}</p>
      <p>Date: {formatted}</p>
    </div>
  )
}

// ============================================================================
// ANTI-PATTERN 6: UI Component Library Barrel
// ============================================================================

// WRONG: Imports from component library barrel
import { Card, Input, Select, Button } from '@/ui'
// Problem: If @/ui exports 50+ components from its barrel file,
// importing just 4 components could still bundle many unused ones.
// Bundle impact: 30-100KB+ depending on library size.

function BrokenUILibrary() {
  return (
    <Card>
      <Input placeholder="Enter name" />
      <Select options={[{ value: 'a', label: 'A' }]} />
      <Button>Submit</Button>
    </Card>
  )
}

// ============================================================================
// SUMMARY: Bundle Impact Comparison
// ============================================================================
//
// Pattern                  | Bundle Size | Tree-Shakeable | Risk Level
// -------------------------|-------------|----------------|------------
// Direct file import       | Minimal     | Yes            | Low
// Small barrel (3-5 files) | Low        | Partial        | Medium
// Large barrel (10+ files) | High       | No/Unreliable  | High
// Full library (lodash)    | Very High  | No             | Critical
// Icon barrel              | High       | Unreliable     | High
//
// Always prefer direct imports for client-side code.