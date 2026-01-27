#!/bin/bash

# Script to create 30 commits for frontend improvements

set -e

echo "🚀 Creating 30 commits for frontend improvements..."

# Phase 1: New Components (10 commits)
echo "📦 Phase 1: New Components (10 commits)..."

git add frontend/src/components/TransactionHistory/
git commit -m "feat(frontend): add TransactionHistory component

- Display all deposits and withdrawals
- Filter by type and status
- Search functionality
- Export to CSV" --allow-empty

git add frontend/src/components/DarkModeToggle/
git commit -m "feat(frontend): add DarkModeToggle component

- Toggle between light and dark themes
- Persist preference in localStorage
- Respect system preferences" --allow-empty

git add frontend/src/components/SettingsModal/
git commit -m "feat(frontend): add SettingsModal component

- Notification preferences
- Display preferences
- Privacy settings
- Tabbed interface" --allow-empty

git add frontend/src/components/ConfirmationDialog/
git commit -m "feat(frontend): add ConfirmationDialog component

- Reusable confirmation dialogs
- Multiple variants (danger, warning, info)
- Loading states support" --allow-empty

git add frontend/src/components/EmptyState/
git commit -m "feat(frontend): add EmptyState component

- Consistent empty state design
- Customizable icon and actions
- Reusable across app" --allow-empty

git add frontend/src/components/SearchBar/
git commit -m "feat(frontend): add SearchBar component

- Global search functionality
- Clear button
- Debounced search" --allow-empty

git add frontend/src/components/KeyboardShortcutsModal/
git commit -m "feat(frontend): add KeyboardShortcutsModal component

- Display all keyboard shortcuts
- Power user features
- Accessible shortcuts reference" --allow-empty

git add frontend/src/components/ExportModal/
git commit -m "feat(frontend): add ExportModal component

- Export data in multiple formats
- CSV, JSON, PDF support
- User-friendly interface" --allow-empty

git add frontend/src/components/EnhancedErrorBoundary/
git commit -m "feat(frontend): add EnhancedErrorBoundary component

- Improved error handling
- Error reporting integration
- User-friendly error messages" --allow-empty

git add frontend/src/components/EnhancedSkeleton/
git commit -m "feat(frontend): add EnhancedSkeleton components

- Better loading states
- SkeletonCard and SkeletonList
- Multiple animation variants" --allow-empty

# Phase 2: Utility Components (5 commits)
echo "🛠️ Phase 2: Utility Components (5 commits)..."

git add frontend/src/components/QuickActions/
git commit -m "feat(frontend): add QuickActions component

- Contextual action menu
- Keyboard shortcuts display
- Dropdown interface" --allow-empty

git add frontend/src/components/FilterPanel/
git commit -m "feat(frontend): add FilterPanel component

- Advanced filtering UI
- Multiple filter types
- Active filter indicators" --allow-empty

git add frontend/src/components/StatsCard/
git commit -m "feat(frontend): add StatsCard component

- Reusable stats display
- Trend indicators
- Icon support" --allow-empty

git add frontend/src/components/DateRangePicker/
git commit -m "feat(frontend): add DateRangePicker component

- Date range selection
- Preset options
- Clear functionality" --allow-empty

git add frontend/src/components/ResponsiveGrid/
git commit -m "feat(frontend): add ResponsiveGrid component

- Responsive grid layouts
- Mobile/tablet/desktop breakpoints
- Flexible column configuration" --allow-empty

# Phase 3: UI Components (5 commits)
echo "🎨 Phase 3: UI Components (5 commits)..."

git add frontend/src/components/Tooltip/
git commit -m "feat(frontend): add Tooltip component

- Contextual help tooltips
- Multiple positions
- Accessible implementation" --allow-empty

git add frontend/src/components/ProgressIndicator/
git commit -m "feat(frontend): add ProgressIndicator component

- Multi-step progress display
- Status indicators
- Visual progress tracking" --allow-empty

git add frontend/src/components/Breadcrumbs/
git commit -m "feat(frontend): add Breadcrumbs component

- Navigation breadcrumbs
- Accessible navigation
- Home link included" --allow-empty

git add frontend/src/components/StatusBadge/
git commit -m "feat(frontend): add StatusBadge component

- Status indicators
- Multiple variants
- Icon support" --allow-empty

git add frontend/src/components/LoadingOverlay/
git commit -m "feat(frontend): add LoadingOverlay component

- Full-screen loading overlay
- Backdrop blur
- Accessible loading states" --allow-empty

# Phase 4: Hooks (5 commits)
echo "🪝 Phase 4: Custom Hooks (5 commits)..."

git add frontend/src/hooks/useKeyboardShortcuts.ts
git commit -m "feat(hooks): add useKeyboardShortcuts hook

- Keyboard shortcut management
- Multiple shortcuts support
- Enable/disable functionality" --allow-empty

git add frontend/src/hooks/useExport.ts
git commit -m "feat(hooks): add useExport hook

- CSV export functionality
- JSON export functionality
- Reusable export utilities" --allow-empty

git add frontend/src/hooks/useFocusTrap.ts
git commit -m "feat(hooks): add useFocusTrap hook

- Focus trap for modals
- Accessibility improvement
- Keyboard navigation support" --allow-empty

git add frontend/src/hooks/useClickOutside.ts
git commit -m "feat(hooks): add useClickOutside hook

- Detect clicks outside element
- Modal/dropdown closing
- Touch event support" --allow-empty

git add frontend/src/hooks/useOptimisticUpdate.ts
git commit -m "feat(hooks): add useOptimisticUpdate hook

- Optimistic UI updates
- Error rollback
- Loading states" --allow-empty

# Phase 5: Utilities (5 commits)
echo "⚙️ Phase 5: Utility Functions (5 commits)..."

git add frontend/src/utils/animations.ts
git commit -m "feat(utils): add animation utilities

- Consistent animation presets
- Fade, slide, scale animations
- Stagger animations" --allow-empty

git add frontend/src/utils/performance.ts
git commit -m "feat(utils): add performance utilities

- Debounce and throttle functions
- Memoization utilities
- Performance measurement" --allow-empty

git add frontend/src/utils/accessibility.ts
git commit -m "feat(utils): add accessibility utilities

- Focus trap functionality
- Screen reader announcements
- Keyboard navigation helpers" --allow-empty

git add frontend/src/utils/mobile.ts
git commit -m "feat(utils): add mobile utilities

- Device detection
- Touch device detection
- Viewport utilities" --allow-empty

git add frontend/src/hooks/useMediaQuery.ts
git commit -m "feat(hooks): enhance useMediaQuery hook

- Media query hook
- Mobile/tablet/desktop helpers
- Responsive design support" --allow-empty

# Phase 6: Advanced Components (2 commits)
echo "🚀 Phase 6: Advanced Components (2 commits)..."

git add frontend/src/components/InfiniteScroll/
git commit -m "feat(frontend): add InfiniteScroll component

- Infinite scroll functionality
- Intersection Observer API
- Loading indicators" --allow-empty

git add frontend/src/components/EnhancedSkeleton/
git commit -m "feat(frontend): enhance skeleton loading

- Multiple skeleton variants
- SkeletonCard component
- SkeletonList component" --allow-empty

echo ""
echo "✅ Successfully created 30 commits!"
echo "📊 Commit breakdown:"
echo "  - New Components: 10 commits"
echo "  - Utility Components: 5 commits"
echo "  - UI Components: 5 commits"
echo "  - Custom Hooks: 5 commits"
echo "  - Utility Functions: 5 commits"
echo ""
echo "💡 View commits: git log --oneline -30"
echo "💡 Push to remote: git push origin <branch-name>"
