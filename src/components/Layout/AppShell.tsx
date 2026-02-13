import type { ReactNode } from 'react'

interface AppShellProps {
  sidebar: ReactNode
  main: ReactNode
}

export function AppShell({ sidebar, main }: AppShellProps) {
  return (
    <div className="flex flex-col md:flex-row h-screen bg-black text-white overflow-hidden">
      {/* Sidebar / Watchlist */}
      <aside className="md:w-[340px] md:min-w-[340px] md:border-r md:border-[#38383A] order-2 md:order-1 flex-1 md:flex-none overflow-y-auto">
        {sidebar}
      </aside>
      {/* Main / Chart */}
      <main className="order-1 md:order-2 flex-1 overflow-y-auto">
        {main}
      </main>
    </div>
  )
}
