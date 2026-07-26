export function HeroShape({ className = '', ...props }) {
  return (
    <div
      {...props}
      className={`absolute inset-0 z-0 ${className}`.trim()}
      style={{
        backgroundColor: 'hsl(var(--background))',
        backgroundImage: 'radial-gradient(circle at center, rgba(59, 130, 246, 0.18) 0%, transparent 70%)',
        opacity: 1,
        mixBlendMode: 'normal',
        ...props.style,
      }}
    />
  );
}
