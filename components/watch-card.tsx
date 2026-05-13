"use client"

import Image from "next/image"
import { useState } from "react"

interface WatchCardProps {
  name: string
  brand: string
  year: string
  description: string
  imageSrc: string
  index: number
}

export function WatchCard({ name, brand, year, description, imageSrc, index }: WatchCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <article 
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-16 py-12 lg:py-20 border-b border-border">
        {/* Index number */}
        <div className="hidden lg:block w-16 shrink-0">
          <span className="font-serif text-6xl text-muted-foreground/40">
            {String(index).padStart(2, '0')}
          </span>
        </div>

        {/* Image */}
        <div className="relative w-full lg:w-[400px] h-[400px] lg:h-[500px] shrink-0 overflow-hidden bg-card">
          <Image
            src={imageSrc}
            alt={`${brand} ${name}`}
            fill
            className={`object-cover transition-transform duration-700 ease-out ${
              isHovered ? 'scale-105' : 'scale-100'
            }`}
          />
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-center">
          <div className="mb-4 lg:mb-6">
            <span className="text-xs tracking-[0.3em] uppercase text-muted-foreground">
              {brand}
            </span>
          </div>
          
          <h2 className="font-serif text-4xl lg:text-6xl xl:text-7xl text-foreground mb-4 lg:mb-6 text-balance">
            {name}
          </h2>
          
          <p className="text-base lg:text-lg text-muted-foreground leading-relaxed max-w-xl mb-6 lg:mb-8">
            {description}
          </p>
          
          <div className="flex items-center gap-6">
            <span className="text-sm tracking-wide text-muted-foreground">
              Est. {year}
            </span>
            <div className={`h-px bg-accent transition-all duration-500 ${
              isHovered ? 'w-16' : 'w-8'
            }`} />
          </div>
        </div>
      </div>
    </article>
  )
}
