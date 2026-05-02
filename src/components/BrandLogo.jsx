export default function BrandLogo({ className = '', compact = false }) {
  return (
    <img
      className={`brand-logo ${compact ? 'brand-logo-compact' : ''} ${className}`.trim()}
      src="/verlix-ai-logo-white.svg"
      alt="Verlix AI"
    />
  );
}
