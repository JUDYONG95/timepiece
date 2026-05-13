export function Footer() {
  return (
    <footer className="py-16 lg:py-24 px-6 lg:px-16 xl:px-24 border-t border-border">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
        <div>
          <p className="font-serif text-2xl lg:text-3xl text-foreground mb-2">
            More to come...
          </p>
          <p className="text-sm text-muted-foreground">
            This collection is ever-evolving.
          </p>
        </div>
        
        <div className="text-sm text-muted-foreground">
          <p>A personal curation of horological excellence</p>
        </div>
      </div>
    </footer>
  )
}
