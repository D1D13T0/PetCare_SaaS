import type { ReactNode } from 'react';
import { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

export default function Layout({ children }: { children: ReactNode }) {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	return (
		<div className="flex bg-[#f4f7f5] min-h-screen">
			{isSidebarOpen && (
				<div
					className="fixed inset-0 bg-black/40 z-30 lg:hidden"
					onClick={() => setIsSidebarOpen(false)}
				/>
			)}

			<Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

			<div className="flex-1 flex flex-col min-w-0">
				<Navbar onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)} />
				<main className="p-4 md:p-8">
					{children}
				</main>
			</div>
		</div>
	);
}
