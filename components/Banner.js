'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { banner, resume ,assignment,creative} from '@/public/assets/index.js'

const bannerData = [
  {
    src: banner,
    srcLight: resume,
    link: '',
    title: 'Notes Mates',
    description: 'Download web app now if not installed',
    tag: 'Popular',
    buttonName: 'Download',
  },
  {
    src: resume,
    srcLight: resume,
    link: 'https://resume-builder-404b5.web.app',
    title: 'Resume Maker',
    description:
      'This is a free tool to create, preview, and export resumes easily.',
    tag: 'Hot',
    buttonName: 'Click here',
  },
  {
    src: creative,
    srcLight: resume,
    link: 'https://chat.whatsapp.com/KBHOXfCGB9DJPGsHUKpMRs',
    title: 'Assignment Help',
    description:
      'Feeling bored with assignments? Let us take the load and write them for you!',
    tag: 'Ongoing',
    buttonName: 'Join Us',
  },
]

export default function Banner() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === bannerData.length - 1 ? 0 : prev + 1))
  }, [])

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? bannerData.length - 1 : prev - 1))
  }, [])

  useEffect(() => {
    if (isHovered) return
    const interval = setInterval(nextSlide, 5000)
    return () => clearInterval(interval)
  }, [nextSlide, isHovered])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const matchMediaDark = window.matchMedia('(prefers-color-scheme: dark)')
      setIsDarkMode(matchMediaDark.matches)

      const handleThemeChange = (e) => setIsDarkMode(e.matches)
      matchMediaDark.addEventListener('change', handleThemeChange)

      return () => {
        matchMediaDark.removeEventListener('change', handleThemeChange)
      }
    }
  }, [])

  return (
    <div
      className="relative w-full max-w-6xl mx-auto"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main Banner Container */}
      <div className="relative w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden rounded-xl bg-base-300 mt-2">
        {/* Banner Images */}
        <div
          className="absolute inset-0 w-full h-full transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {bannerData.map((item, index) => (
            <div
              key={index}
              className="absolute inset-0 w-full h-full group"
              style={{ left: `${index * 100}%` }}
            >
              {/* Image */}
              <Image
                src={isDarkMode ? item.src : item.srcLight || item.src}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                priority
                quality={90}
              />

              {/* Gradient Overlay */}
              <div
                className={`absolute inset-0
    bg-gradient-to-r
    from-black/80 via-black/60 to-transparent
    dark:from-black/70 dark:via-black/50 dark:to-transparent
    transition-opacity duration-300
    group-hover:opacity-90
  `}
              />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-center p-6 md:p-12 z-10">
                {/* Tag */}
                <span
                  className={`w-fit px-3 py-1 mb-2 text-xs font-medium rounded-full
      bg-primary/30 text-white
      dark:bg-primary/30 dark:text-white
    `}
                >
                  {item.tag}
                </span>

                {/* Title */}
                <h2
                  className={`text-xl md:text-3xl lg:text-4xl font-bold mb-2
      text-white drop-shadow-md
    `}
                >
                  {item.title}
                </h2>

                {/* Description */}
                <p
                  className={`text-sm md:text-base max-w-md
      text-white/90 drop-shadow
      dark:text-white/80
    `}
                >
                  {item.description}
                </p>

                {/* CTA Button */}
                <Link
                  href={item.link}
                  target="_blank "
                  className={`mt-4 w-fit px-4 py-2 text-sm font-medium rounded-lg
          bg-primary text-primary-content
          hover:bg-primary/90
          dark:bg-primary/90 dark:hover:bg-primary/80
          transition-colors shadow-md`}
                >
                  <button className=''>{item.buttonName}</button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className=" inset-0 flex items-center justify-between p-4">
          <button
            onClick={(e) => {
              e.preventDefault()
              prevSlide()
            }}
            className=" top-[50%] left-0 absolute  btn btn-circle btn-sm md:btn-md bg-base-200/50 hover:bg-base-200/80 border-0"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={(e) => {
              e.preventDefault()
              nextSlide()
            }}
            className="top-[50%] right-0  absolute  btn btn-circle btn-sm md:btn-md bg-base-200/50 hover:bg-base-200/80 border-0"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
          {bannerData.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.preventDefault()
                setCurrentIndex(index)
              }}
              className={`
                w-2 h-2 rounded-full transition-all duration-300
                ${
                  index === currentIndex
                    ? 'w-6 bg-primary'
                    : 'bg-base-content/30 hover:bg-base-content/50'
                }
              `}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
