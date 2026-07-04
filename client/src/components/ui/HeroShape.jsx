export function HeroShape({ className = '', ...props }) {
  return (
    <div
      {...props}
      className={`absolute inset-0 z-0 ${className}`.trim()}
      style={{
        backgroundColor: '#ffffff',
        backgroundImage: `radial-gradient(circle at center, #FFF991 0%, transparent 70%)`,
        opacity: 0.6,
        mixBlendMode: 'multiply',
        ...props.style,
      }}
    />
  );
}
