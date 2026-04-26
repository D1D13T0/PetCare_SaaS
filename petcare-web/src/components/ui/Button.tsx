import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	children: ReactNode;
	fullWidth?: boolean;
}

export default function Button({
	children,
	fullWidth = false,
	className = '',
	...props
}: ButtonProps) {
	return (
		<button
			{...props}
			className={`
        ${fullWidth ? 'w-full' : 'w-auto'}
        bg-emerald-600
        hover:bg-emerald-700
        text-white
        font-semibold
        py-2.5
        px-5
        rounded-lg
        transition
        cursor-pointer
        disabled:opacity-50
        disabled:cursor-not-allowed
        ${className}
      `}
		>
			{children}
		</button>
	);
}
