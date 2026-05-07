import * as React from "react"
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

type CarouselApi = UseEmblaCarouselType[1]
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>
type CarouselOptions = UseCarouselParameters[0]
type CarouselPlugin = UseCarouselParameters[1]

type CarouselProps = {
  opts?: CarouselOptions
  plugins?: CarouselPlugin
  orientation?: "horizontal" | "vertical"
  setApi?: (api: CarouselApi) => void
}

// Split the carousel context so scroll-state changes don't ripple through every consumer.
// - ApiContext holds values that are stable after Embla initializes (refs, api, callbacks, orientation).
// - CanScrollPrev/Next are primitive booleans in their own contexts so each Button only re-renders
//   when its specific edge-of-track flag flips.
type CarouselApiContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0]
  api: ReturnType<typeof useEmblaCarousel>[1]
  scrollPrev: () => void
  scrollNext: () => void
} & CarouselProps

const CarouselApiContext = React.createContext<CarouselApiContextProps | undefined>(
  undefined,
)
const CanScrollPrevContext = React.createContext(false)
const CanScrollNextContext = React.createContext(false)

function useCarouselApi() {
  const context = React.use(CarouselApiContext)

  if (!context) {
    throw new Error("useCarouselApi must be used within a <Carousel />")
  }

  return context
}

function Carousel({
  orientation = "horizontal",
  opts,
  setApi,
  plugins,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & CarouselProps) {
  const emblaOptions = React.useMemo(
    () => ({
      ...opts,
      axis: orientation === "horizontal" ? ("x" as const) : ("y" as const),
    }),
    [opts, orientation],
  )
  const [carouselRef, api] = useEmblaCarousel(emblaOptions, plugins)

  // Subscribe via useSyncExternalStore so canScrollPrev/Next don't go through React state-in-effect.
  // Each context holds a primitive boolean, so consumers only re-render when their specific flag flips.
  const subscribe = React.useCallback(
    (onChange: () => void) => {
      if (!api) return () => {}
      api.on("select", onChange)
      api.on("reInit", onChange)
      return () => {
        api.off("select", onChange)
        api.off("reInit", onChange)
      }
    },
    [api],
  )
  const getCanScrollPrev = React.useCallback(
    () => api?.canScrollPrev() ?? false,
    [api],
  )
  const getCanScrollNext = React.useCallback(
    () => api?.canScrollNext() ?? false,
    [api],
  )
  const getServerSnapshot = React.useCallback(() => false, [])

  const canScrollPrev = React.useSyncExternalStore(
    subscribe,
    getCanScrollPrev,
    getServerSnapshot,
  )
  const canScrollNext = React.useSyncExternalStore(
    subscribe,
    getCanScrollNext,
    getServerSnapshot,
  )

  const scrollPrev = React.useCallback(() => {
    api?.scrollPrev()
  }, [api])

  const scrollNext = React.useCallback(() => {
    api?.scrollNext()
  }, [api])

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault()
        scrollPrev()
      } else if (event.key === "ArrowRight") {
        event.preventDefault()
        scrollNext()
      }
    },
    [scrollPrev, scrollNext],
  )

  React.useEffect(() => {
    if (!api || !setApi) return
    setApi(api)
  }, [api, setApi])

  const apiContextValue = React.useMemo(
    () => ({
      carouselRef,
      api,
      opts,
      orientation,
      scrollPrev,
      scrollNext,
    }),
    [carouselRef, api, opts, orientation, scrollPrev, scrollNext],
  )

  return (
    <CarouselApiContext value={apiContextValue}>
      <CanScrollPrevContext value={canScrollPrev}>
        <CanScrollNextContext value={canScrollNext}>
          <section
            onKeyDownCapture={handleKeyDown}
            className={cn("relative", className)}
            aria-label="carousel"
            data-slot="carousel"
            {...props}
          >
            {children}
          </section>
        </CanScrollNextContext>
      </CanScrollPrevContext>
    </CarouselApiContext>
  )
}

function CarouselContent({ className, ...props }: React.ComponentProps<"div">) {
  const { carouselRef, orientation } = useCarouselApi()

  return (
    <div ref={carouselRef} className="overflow-hidden" data-slot="carousel-content">
      <div
        className={cn(
          "flex",
          orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
          className,
        )}
        {...props}
      />
    </div>
  )
}

function CarouselItem({ className, ...props }: React.ComponentProps<"div">) {
  const { orientation } = useCarouselApi()

  return (
    <div
      aria-roledescription="slide"
      data-slot="carousel-item"
      className={cn(
        "min-w-0 shrink-0 grow-0 basis-full",
        orientation === "horizontal" ? "pl-4" : "pt-4",
        className,
      )}
      {...props}
    />
  )
}

function CarouselPrevious({
  className,
  variant = "outline",
  size = "icon-sm",
  ...props
}: React.ComponentProps<typeof Button>) {
  const { orientation, scrollPrev } = useCarouselApi()
  const canScrollPrev = React.use(CanScrollPrevContext)

  return (
    <Button
      data-slot="carousel-previous"
      variant={variant}
      size={size}
      className={cn(
        "absolute touch-manipulation rounded-full",
        orientation === "horizontal"
          ? "top-1/2 -left-12 -translate-y-1/2"
          : "-top-12 left-1/2 -translate-x-1/2 rotate-90",
        className,
      )}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      <ChevronLeftIcon />
      <span className="sr-only">Previous slide</span>
    </Button>
  )
}

function CarouselNext({
  className,
  variant = "outline",
  size = "icon-sm",
  ...props
}: React.ComponentProps<typeof Button>) {
  const { orientation, scrollNext } = useCarouselApi()
  const canScrollNext = React.use(CanScrollNextContext)

  return (
    <Button
      data-slot="carousel-next"
      variant={variant}
      size={size}
      className={cn(
        "absolute touch-manipulation rounded-full",
        orientation === "horizontal"
          ? "top-1/2 -right-12 -translate-y-1/2"
          : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
        className,
      )}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      <ChevronRightIcon />
      <span className="sr-only">Next slide</span>
    </Button>
  )
}

export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  useCarouselApi,
}
