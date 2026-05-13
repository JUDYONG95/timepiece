export function Hero() {
  return (
    <header className="relative min-h-[70vh] lg:min-h-[80vh] flex flex-col justify-center px-6 lg:px-16 xl:px-24">
      <div className="max-w-5xl">
        <p className="text-xs tracking-[0.4em] uppercase text-muted-foreground mb-6 lg:mb-8">
          A Personal Collection
        </p>
        
        <h1 className="font-serif text-5xl sm:text-6xl lg:text-8xl xl:text-9xl text-foreground leading-[0.9] mb-8 lg:mb-12 text-balance">
          Timepieces
          <br />
          <span className="italic">I Love</span>
        </h1>
        
        <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl leading-relaxed">
          A curated showcase of iconic watches that have captured my imagination — 
          each one a masterpiece of design and craftsmanship.
        </p>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-12 left-6 lg:left-16 xl:left-24 flex items-center gap-4">
        <div className="w-px h-16 bg-border" />
        <span className="text-xs tracking-[0.2em] uppercase text-muted-foreground rotate-0">
          Scroll
        </span>
      </div>
    </header>
  )
}
