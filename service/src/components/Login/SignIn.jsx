export default function Sig() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* This is your centered, padded container */}
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center my-8">
          Welcome to Vite + React + Tailwind!
        </h1>
        <p className="text-lg leading-relaxed">
          This container will automatically adjust its max-width at each Tailwind breakpoint,
          and has 1rem (px-4) of horizontal padding.
        </p>
      </div>
    </div>
  );
}