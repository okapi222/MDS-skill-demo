import * as React from "react"
import { cva } from "class-variance-authority"
import { Tabs as TabsPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

function Tabs({
  className,
  orientation = "horizontal",
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      data-orientation={orientation}
      className={cn("group/tabs flex gap-2 data-horizontal:flex-col", className)}
      {...props}
    />
  )
}

const tabsListVariants = cva(
  "group/tabs-list inline-flex w-fit items-center justify-center rounded-lg p-[3px] text-muted-foreground group-data-horizontal/tabs:h-8 group-data-vertical/tabs:h-fit group-data-vertical/tabs:flex-col data-[variant=line]:rounded-none",
  {
    variants: {
      variant: {
        default: "bg-muted",
        line: "h-auto w-full items-end justify-start gap-8 border-0 border-b border-[#E6E6E6] bg-transparent p-0 shadow-none",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function TabsList({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List> & {
  variant?: "default" | "line"
}) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant}
      className={cn(tabsListVariants({ variant: variant as "default" | "line" }), className)}
      {...props}
    />
  )
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        // Default (legacy) tab row — compact control strip
        "group-data-[variant=default]/tabs-list:relative group-data-[variant=default]/tabs-list:inline-flex group-data-[variant=default]/tabs-list:h-[calc(100%-1px)] group-data-[variant=default]/tabs-list:flex-1 group-data-[variant=default]/tabs-list:items-center group-data-[variant=default]/tabs-list:justify-center group-data-[variant=default]/tabs-list:gap-1.5 group-data-[variant=default]/tabs-list:rounded-md group-data-[variant=default]/tabs-list:border group-data-[variant=default]/tabs-list:border-transparent group-data-[variant=default]/tabs-list:px-1.5 group-data-[variant=default]/tabs-list:py-0.5 group-data-[variant=default]/tabs-list:text-sm group-data-[variant=default]/tabs-list:font-medium group-data-[variant=default]/tabs-list:whitespace-nowrap group-data-[variant=default]/tabs-list:text-foreground/60 group-data-[variant=default]/tabs-list:transition-colors group-data-[variant=default]/tabs-list:hover:text-foreground group-data-[variant=default]/tabs-list:focus-visible:border-ring group-data-[variant=default]/tabs-list:focus-visible:ring-[3px] group-data-[variant=default]/tabs-list:focus-visible:ring-ring/50 group-data-[variant=default]/tabs-list:disabled:pointer-events-none group-data-[variant=default]/tabs-list:disabled:opacity-50 group-data-[variant=default]/tabs-list:data-[state=active]:bg-background group-data-[variant=default]/tabs-list:data-[state=active]:text-foreground group-data-[variant=default]/tabs-list:data-[state=active]:shadow-sm",
        // Line variant — plain text links; 2px active indicator over 1px bar (see TabsList border-b)
        "group-data-[variant=line]/tabs-list:relative group-data-[variant=line]/tabs-list:-mb-px group-data-[variant=line]/tabs-list:inline-flex group-data-[variant=line]/tabs-list:cursor-pointer group-data-[variant=line]/tabs-list:items-center group-data-[variant=line]/tabs-list:border-0 group-data-[variant=line]/tabs-list:border-b-2 group-data-[variant=line]/tabs-list:border-transparent group-data-[variant=line]/tabs-list:bg-transparent group-data-[variant=line]/tabs-list:px-0 group-data-[variant=line]/tabs-list:py-3 group-data-[variant=line]/tabs-list:text-sm group-data-[variant=line]/tabs-list:font-normal group-data-[variant=line]/tabs-list:whitespace-nowrap group-data-[variant=line]/tabs-list:text-[#757575] group-data-[variant=line]/tabs-list:shadow-none group-data-[variant=line]/tabs-list:outline-none group-data-[variant=line]/tabs-list:ring-0 group-data-[variant=line]/tabs-list:transition-colors group-data-[variant=line]/tabs-list:hover:bg-transparent group-data-[variant=line]/tabs-list:hover:text-[#333333] group-data-[variant=line]/tabs-list:data-[state=active]:border-[#2251FF] group-data-[variant=line]/tabs-list:data-[state=active]:bg-transparent group-data-[variant=line]/tabs-list:data-[state=active]:text-[#2251FF] group-data-[variant=line]/tabs-list:data-[state=active]:shadow-none group-data-[variant=line]/tabs-list:focus-visible:outline-none group-data-[variant=line]/tabs-list:focus-visible:ring-2 group-data-[variant=line]/tabs-list:focus-visible:ring-[#2251FF] group-data-[variant=line]/tabs-list:focus-visible:ring-offset-2",
        "group-data-vertical/tabs:w-full group-data-vertical/tabs:justify-start",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  )
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 text-sm outline-none", className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants }
