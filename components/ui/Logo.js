import Image from 'next/image';
import Link from 'next/link';
import { siteConfig } from '@/lib/site-config';
import { cx } from '@/lib/utils';

/**
 * The official logo. Rendered at a fixed HEIGHT with width derived from the
 * file's intrinsic aspect ratio, so it can never be distorted.
 */
export function LogoImage({ height = 64, priority = false, className, sizes }) {
  const { src, width: w, height: h } = siteConfig.logo;
  const width = Math.round((w / h) * height);
  return (
    <Image
      src={src}
      alt={`${siteConfig.name} logo`}
      width={width}
      height={height}
      priority={priority}
      sizes={sizes || `${width}px`}
      className={cx('logo-img', className)}
    />
  );
}

/** Compact lock-up for navigation bars: emblem + typeset wordmark. */
export function LogoLockup({ href = '/', onClick, className, label = true }) {
  return (
    <Link href={href} className={cx('lockup', className)} onClick={onClick} aria-label={`${siteConfig.name} — home`}>
      <Image src="/logo/emblem.png" alt="" width={48} height={45} className="lockup__mark" priority sizes="48px" />
      {label && (
        <span className="lockup__word" aria-hidden="true">
          <span className="lockup__name">Inked Whispers</span>
        </span>
      )}
    </Link>
  );
}
