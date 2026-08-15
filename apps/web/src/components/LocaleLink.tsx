'use client';

import Link, { type LinkProps } from 'next/link';
import { type AnchorHTMLAttributes, type ReactNode } from 'react';
import { useLocale, withLocale } from '@/hooks/useLocale';

interface LocaleLinkProps extends Omit<LinkProps, 'href'>, Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  href: string;
  children?: ReactNode;
}

/** next/link wrapper that auto-prefixes internal app paths with the current locale. */
export function LocaleLink({ href, ...props }: LocaleLinkProps) {
  const locale = useLocale();
  return <Link href={withLocale(locale, href)} {...props} />;
}
