import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export const useGSAP = (animation, dependencies = []) => {
  const ref = useRef()

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const ctx = gsap.context(() => {
      animation(element)
    }, element)

    return () => ctx.revert()
  }, dependencies)

  return ref
}

export const useFadeIn = (options = {}) => {
  const { delay = 0, duration = 0.6, y = 20 } = options
  
  return useGSAP((element) => {
    gsap.fromTo(element, 
      { opacity: 0, y },
      { 
        opacity: 1, 
        y: 0, 
        duration, 
        delay,
        ease: "power2.out"
      }
    )
  })
}

export const useSlideIn = (direction = 'left', options = {}) => {
  const { delay = 0, duration = 0.8, distance = 100 } = options
  
  return useGSAP((element) => {
    const fromProps = { opacity: 0 }
    const toProps = { opacity: 1, duration, delay, ease: "power3.out" }
    
    switch (direction) {
      case 'left':
        fromProps.x = -distance
        toProps.x = 0
        break
      case 'right':
        fromProps.x = distance
        toProps.x = 0
        break
      case 'up':
        fromProps.y = distance
        toProps.y = 0
        break
      case 'down':
        fromProps.y = -distance
        toProps.y = 0
        break
    }
    
    gsap.fromTo(element, fromProps, toProps)
  })
}

export const useScrollAnimation = (animation, options = {}) => {
  const { trigger, start = "top 80%", end = "bottom 20%", scrub = false } = options
  
  return useGSAP((element) => {
    ScrollTrigger.create({
      trigger: trigger || element,
      start,
      end,
      scrub,
      animation: animation(element),
      ...options
    })
  })
}

export const useParallax = (speed = 0.5) => {
  return useGSAP((element) => {
    gsap.to(element, {
      yPercent: -50 * speed,
      ease: "none",
      scrollTrigger: {
        trigger: element,
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    })
  })
}

export const useStagger = (selector, options = {}) => {
  const { delay = 0.1, duration = 0.6, y = 30 } = options
  
  return useGSAP((element) => {
    const items = element.querySelectorAll(selector)
    
    gsap.fromTo(items,
      { opacity: 0, y },
      {
        opacity: 1,
        y: 0,
        duration,
        stagger: delay,
        ease: "power2.out"
      }
    )
  })
}

export const useHover = (scaleValue = 1.05) => {
  return useGSAP((element) => {
    const handleMouseEnter = () => {
      gsap.to(element, { scale: scaleValue, duration: 0.3, ease: "power2.out" })
    }
    
    const handleMouseLeave = () => {
      gsap.to(element, { scale: 1, duration: 0.3, ease: "power2.out" })
    }
    
    element.addEventListener('mouseenter', handleMouseEnter)
    element.addEventListener('mouseleave', handleMouseLeave)
    
    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter)
      element.removeEventListener('mouseleave', handleMouseLeave)
    }
  })
}