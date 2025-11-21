import { useState, useMemo, useCallback, memo } from 'react'
import { motion } from 'framer-motion'

const VirtualScrollList = memo(({
  items = [],
  itemHeight = 50,
  containerHeight = 400,
  renderItem,
  overscan = 5,
  className = '',
  onScroll,
  ...props
}) => {
  const [scrollTop, setScrollTop] = useState(0)
  const [containerRef, setContainerRef] = useState(null)

  const totalHeight = useMemo(() => items.length * itemHeight, [items.length, itemHeight])
  
  const visibleItemsCount = useMemo(() => 
    Math.ceil(containerHeight / itemHeight), 
    [containerHeight, itemHeight]
  )

  const startIndex = useMemo(() => 
    Math.max(0, Math.floor(scrollTop / itemHeight) - overscan),
    [scrollTop, itemHeight, overscan]
  )

  const endIndex = useMemo(() => 
    Math.min(items.length - 1, startIndex + visibleItemsCount + overscan * 2),
    [items.length, startIndex, visibleItemsCount, overscan]
  )

  const visibleItems = useMemo(() => 
    items.slice(startIndex, endIndex + 1),
    [items, startIndex, endIndex]
  )

  const offsetY = useMemo(() => startIndex * itemHeight, [startIndex, itemHeight])

  const handleScroll = useCallback((e) => {
    const newScrollTop = e.target.scrollTop
    setScrollTop(newScrollTop)
    onScroll?.(e)
  }, [onScroll])

  const scrollToIndex = useCallback((index) => {
    if (containerRef) {
      const scrollTop = index * itemHeight
      containerRef.scrollTop = scrollTop
      setScrollTop(scrollTop)
    }
  }, [containerRef, itemHeight])

  const scrollToTop = useCallback(() => {
    scrollToIndex(0)
  }, [scrollToIndex])

  const scrollToBottom = useCallback(() => {
    scrollToIndex(items.length - 1)
  }, [scrollToIndex, items.length])

  return (
    <div className={`relative ${className}`} {...props}>
      <div
        ref={setContainerRef}
        className="overflow-auto"
        style={{ height: containerHeight }}
        onScroll={handleScroll}
      >
        <div style={{ height: totalHeight, position: 'relative' }}>
          <div
            style={{
              transform: `translateY(${offsetY}px)`,
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
            }}
          >
            {visibleItems.map((item, index) => {
              const actualIndex = startIndex + index
              return (
                <motion.div
                  key={actualIndex}
                  style={{ height: itemHeight }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.1 }}
                >
                  {renderItem(item, actualIndex)}
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
      
      {/* Scroll controls */}
      <div className="absolute top-2 right-2 flex flex-col gap-1">
        <button
          onClick={scrollToTop}
          className="p-1 bg-white dark:bg-gray-800 rounded shadow-md hover:shadow-lg transition-shadow"
          title="Scroll to top"
        >
          ↑
        </button>
        <button
          onClick={scrollToBottom}
          className="p-1 bg-white dark:bg-gray-800 rounded shadow-md hover:shadow-lg transition-shadow"
          title="Scroll to bottom"
        >
          ↓
        </button>
      </div>
    </div>
  )
})

VirtualScrollList.displayName = 'VirtualScrollList'

export default VirtualScrollList