
const OrbitalSpinner = () => (
  <div className="w-16 h-16 relative">
    <div className="absolute inset-0">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="absolute inset-0 rounded-full border-2 border-transparent animate-spin"
          style={{
            borderTopColor: '#E4ED64',
            animationDuration: `${1.5 + i * 0.5}s`,
            animationDelay: `${i * 0.2}s`,
            transform: `scale(${1 - i * 0.2})`,
            opacity: 1 - i * 0.3
          }}
        />
      ))}
    </div>
  </div>
);

export default OrbitalSpinner;
