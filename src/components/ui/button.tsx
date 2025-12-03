import type { ComponentProps } from 'react';
import { tv, type VariantProps } from 'tailwind-variants';

const buttonVariants = tv({
  base: 'rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 disabled:pointer-events-none disabled:opacity-50',
  variants: {
    size: {
      default: 'px-3 py-2',
      icon: 'p-2',
      'icon-sm': 'p-1',
    },
  },
  defaultVariants: {},
});

export function Button({
  size,
  className,
  ...props
}: ComponentProps<'button'> & VariantProps<typeof buttonVariants>) {
  return (
    <button {...props} className={buttonVariants({ size, className })}>
      {props.children}
    </button>
  );
}
