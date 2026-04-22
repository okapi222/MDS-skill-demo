import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react"
import {
  ArrowRight,
  ArrowUp,
  Bell,
  ChevronDown,
  ChevronRight,
  Loader2,
  Menu,
  PanelLeftClose,
  Search,
} from "lucide-react"
import { toast, Toaster } from "sonner"
import heroImg from "./assets/hero.png"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

type ProjectId = "alpha" | "beta"
type StatusKey = "on-track" | "at-risk" | "blocked" | "complete"
type RiskKey = "low" | "medium" | "high" | "critical"

type Workstream = {
  id: string
  name: string
  lead: string
  status: StatusKey
  hours: number
  budget: string
  risk: RiskKey
}

const WORKSTREAMS: Workstream[] = [
  {
    id: "1",
    name: "Operating model",
    lead: "AK",
    status: "on-track",
    hours: 420,
    budget: "62%",
    risk: "low",
  },
  {
    id: "2",
    name: "Data migration",
    lead: "LM",
    status: "complete",
    hours: 180,
    budget: "48%",
    risk: "low",
  },
  {
    id: "3",
    name: "Change management",
    lead: "JR",
    status: "at-risk",
    hours: 310,
    budget: "81%",
    risk: "medium",
  },
  {
    id: "4",
    name: "Technology architecture",
    lead: "ST",
    status: "blocked",
    hours: 96,
    budget: "34%",
    risk: "critical",
  },
  {
    id: "5",
    name: "Capability building",
    lead: "MN",
    status: "on-track",
    hours: 240,
    budget: "55%",
    risk: "medium",
  },
  {
    id: "6",
    name: "Value assurance",
    lead: "DH",
    status: "on-track",
    hours: 128,
    budget: "41%",
    risk: "low",
  },
]

const TEAM = [
  {
    name: "Alex Kim",
    role: "Engagement manager",
    location: "New York",
    bio: "Leads client relationships and shapes the overall engagement narrative.",
  },
  {
    name: "Jordan Rivera",
    role: "Associate",
    location: "Chicago",
    bio: "Coordinates workstreams and keeps milestones visible for Firm members.",
  },
  {
    name: "Sam Patel",
    role: "Analyst",
    location: "London",
    bio: "Builds analytical views and supports quality reviews with colleagues.",
  },
  {
    name: "Taylor Brooks",
    role: "Expert",
    location: "Singapore",
    bio: "Provides deep domain expertise for client workshops and leadership forums.",
  },
  {
    name: "Morgan Lee",
    role: "Analyst",
    location: "Toronto",
    bio: "Prepares materials and tracks decisions across client steering meetings.",
  },
  {
    name: "Riley Chen",
    role: "Associate",
    location: "San Francisco",
    bio: "Aligns delivery cadence with client priorities and escalation paths.",
  },
]

const DOCUMENTS = [
  { name: "Executive readout", type: "Deck", uploaded: "Apr 2, 2026", by: "Alex Kim" },
  { name: "Financial model v3", type: "Spreadsheet", uploaded: "Mar 28, 2026", by: "Sam Patel" },
  { name: "Risk register", type: "Report", uploaded: "Mar 22, 2026", by: "Jordan Rivera" },
  { name: "Workshop synthesis", type: "Report", uploaded: "Mar 18, 2026", by: "Taylor Brooks" },
  { name: "Stakeholder map", type: "Deck", uploaded: "Mar 12, 2026", by: "Alex Kim" },
  { name: "Implementation plan", type: "Report", uploaded: "Mar 9, 2026", by: "Riley Chen" },
  { name: "Benchmark pack", type: "Spreadsheet", uploaded: "Mar 4, 2026", by: "Morgan Lee" },
  { name: "Client Q&A log", type: "Report", uploaded: "Feb 26, 2026", by: "Sam Patel" },
]

function statusBadge(status: StatusKey) {
  const map: Record<
    StatusKey,
    { label: string; className: string }
  > = {
    "on-track": {
      label: "On track",
      className: "border-transparent bg-[#E6FEE8] text-[#117E1A]",
    },
    "at-risk": {
      label: "At risk",
      className: "border-transparent bg-[#FFF9D6] text-[#66541F]",
    },
    blocked: {
      label: "Blocked",
      className: "border-transparent bg-[#FEEBEB] text-[#CD3030]",
    },
    complete: {
      label: "Complete",
      className: "border-border bg-neutral-5 text-neutral-80",
    },
  }
  const s = map[status]
  return (
    <Badge variant="outline" className={cn("rounded-full font-medium", s.className)}>
      {s.label}
    </Badge>
  )
}

function riskBadge(risk: RiskKey) {
  const label =
    risk === "low" ? "Low" : risk === "medium" ? "Medium" : risk === "high" ? "High" : "Critical"
  return (
    <span className="inline-flex rounded-full border border-neutral-20 bg-white px-2 py-0.5 text-xs font-medium text-neutral-80">
      {label}
    </span>
  )
}

function Avatar({ label, photoUrl }: { label: string; photoUrl?: string }) {
  return (
    <span className="relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-neutral-10 text-xs font-medium text-neutral-80 ring-1 ring-neutral-20">
      {photoUrl ? (
        <img src={photoUrl} alt="" className="size-full object-cover" />
      ) : (
        label
      )}
    </span>
  )
}

export function ClientEngagementTracker() {
  const [booting, setBooting] = useState(true)
  const [project, setProject] = useState<ProjectId>("alpha")
  const [mobileNav, setMobileNav] = useState(false)
  const [showBackTop, setShowBackTop] = useState(false)

  const [draftSearch, setDraftSearch] = useState("")
  const [draftStatus, setDraftStatus] = useState<string>("all")
  const [draftStart, setDraftStart] = useState("")
  const [draftEnd, setDraftEnd] = useState("")
  const [draftQuick, setDraftQuick] = useState<"all" | "active" | "at-risk">("all")
  const [draftRisk, setDraftRisk] = useState({
    low: false,
    medium: false,
    high: true,
    critical: false,
  })
  const [draftShowCompleted, setDraftShowCompleted] = useState(false)
  const [draftMinHours, setDraftMinHours] = useState([120] as number[])

  const [applied, setApplied] = useState({
    search: "",
    status: "all",
    start: "",
    end: "",
    quick: "all" as "all" | "active" | "at-risk",
    risk: { low: false, medium: false, high: true, critical: false },
    showCompleted: false,
    minHours: 120,
  })

  const [applyBusy, setApplyBusy] = useState(false)
  const [sort, setSort] = useState<{ key: keyof Workstream | "lead"; dir: "asc" | "desc" }>({
    key: "name",
    dir: "asc",
  })

  const [rows, setRows] = useState(WORKSTREAMS)

  const [editOpen, setEditOpen] = useState(false)
  const [removeOpen, setRemoveOpen] = useState(false)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [editName, setEditName] = useState("")
  const [editStatus, setEditStatus] = useState<StatusKey>("on-track")
  const [editNotes, setEditNotes] = useState("")
  const [editHours, setEditHours] = useState("")
  const [editErrors, setEditErrors] = useState<{ name?: string; hours?: string }>({})

  const [teamRole, setTeamRole] = useState("all")

  const [docTags, setDocTags] = useState<Record<number, string[]>>(
    () =>
      Object.fromEntries(
        DOCUMENTS.map((_, i) => [i, i % 3 === 0 ? ["Client review"] : i % 3 === 1 ? ["Internal"] : []])
      ) as Record<number, string[]>
  )

  useEffect(() => {
    const t = window.setTimeout(() => setBooting(false), 1200)
    return () => window.clearTimeout(t)
  }, [])

  useEffect(() => {
    const onScroll = () => setShowBackTop(window.scrollY > 360)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const filtered = useMemo(() => {
    let list = [...rows]
    if (applied.search.trim()) {
      const q = applied.search.toLowerCase()
      list = list.filter((w) => w.name.toLowerCase().includes(q))
    }
    if (applied.status !== "all") {
      list = list.filter((w) => w.status === applied.status)
    }
    if (applied.quick === "active") {
      list = list.filter((w) => w.status !== "complete")
    }
    if (applied.quick === "at-risk") {
      list = list.filter((w) => w.status === "at-risk" || w.status === "blocked")
    }
    if (!applied.showCompleted) {
      list = list.filter((w) => w.status !== "complete")
    }
    list = list.filter((w) => {
      const okRisk =
        (w.risk === "low" && applied.risk.low) ||
        (w.risk === "medium" && applied.risk.medium) ||
        (w.risk === "high" && applied.risk.high) ||
        (w.risk === "critical" && applied.risk.critical)
      return okRisk && w.hours >= applied.minHours
    })
    list.sort((a, b) => {
      const av = a[sort.key as keyof Workstream]
      const bv = b[sort.key as keyof Workstream]
      if (typeof av === "number" && typeof bv === "number") {
        return sort.dir === "asc" ? av - bv : bv - av
      }
      const as = String(av)
      const bs = String(bv)
      return sort.dir === "asc" ? as.localeCompare(bs) : bs.localeCompare(as)
    })
    return list
  }, [rows, applied, sort])

  const toggleSort = (key: typeof sort.key) => {
    setSort((s) =>
      s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" }
    )
  }

  const onApply = () => {
    setApplyBusy(true)
    window.setTimeout(() => {
      setApplied({
        search: draftSearch,
        status: draftStatus,
        start: draftStart,
        end: draftEnd,
        quick: draftQuick,
        risk: { ...draftRisk },
        showCompleted: draftShowCompleted,
        minHours: draftMinHours[0] ?? 0,
      })
      setApplyBusy(false)
    }, 900)
  }

  const onClearFilters = () => {
    setDraftSearch("")
    setDraftStatus("all")
    setDraftStart("")
    setDraftEnd("")
    setDraftQuick("all")
    setDraftRisk({ low: false, medium: false, high: true, critical: false })
    setDraftShowCompleted(false)
    setDraftMinHours([0])
    setApplied({
      search: "",
      status: "all",
      start: "",
      end: "",
      quick: "all",
      risk: { low: false, medium: false, high: true, critical: false },
      showCompleted: false,
      minHours: 0,
    })
  }

  const openEdit = (row: Workstream) => {
    setActiveId(row.id)
    setEditName(row.name)
    setEditStatus(row.status)
    setEditNotes("Capture decisions, dependencies, and next steps for colleagues.")
    setEditHours(String(row.hours))
    setEditErrors({})
    setEditOpen(true)
  }

  const saveEdit = () => {
    const next: typeof editErrors = {}
    if (!editName.trim()) {
      next.name = "Enter a workstream name so colleagues can find this in the system."
    }
    const h = Number(editHours)
    if (Number.isNaN(h) || h < 0) {
      next.hours = "Enter a zero or positive number. Use hours as whole numbers for this summary."
    }
    setEditErrors(next)
    if (Object.keys(next).length) return
    setRows((prev) =>
      prev.map((r) =>
        r.id === activeId
          ? { ...r, name: editName.trim(), status: editStatus, hours: h }
          : r
      )
    )
    setEditOpen(false)
    toast.success("Workstream updated successfully.")
  }

  const teamFiltered = useMemo(() => {
    if (teamRole === "all") return TEAM
    const map: Record<string, string> = {
      "engagement-manager": "engagement manager",
      associate: "associate",
      analyst: "analyst",
      expert: "expert",
    }
    const needle = map[teamRole] ?? teamRole
    return TEAM.filter((m) => m.role.toLowerCase() === needle)
  }, [teamRole])

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" })

  const dismissDocTag = useCallback((docIndex: number, tag: string) => {
    setDocTags((prev) => ({
      ...prev,
      [docIndex]: (prev[docIndex] ?? []).filter((t) => t !== tag),
    }))
  }, [])

  const title = project === "alpha" ? "Project Alpha" : "Project Beta"

  return (
    <TooltipProvider delayDuration={200}>
      <a
        href="#main-content"
        className="focus-visible:ring-electric-blue-500 sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:rounded focus:bg-white focus:px-4 focus:py-2 focus:ring-2 focus:ring-offset-2"
      >
        Skip to main content
      </a>

      {booting ? (
        <div
          className="fixed top-0 right-0 left-0 z-[60] h-1 bg-electric-blue-500 motion-safe:animate-pulse"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuetext="Loading engagement data"
        />
      ) : null}

      <div className="flex min-h-dvh flex-col bg-neutral-5 text-neutral-80">
        <header className="sticky top-0 z-50 border-b border-neutral-10 bg-deep-blue-900 text-white shadow-panel">
          <div className="mx-auto flex h-14 max-w-[1440px] items-center gap-4 px-4">
            <button
              type="button"
              className="inline-flex size-11 items-center justify-center rounded text-white hover:bg-white/10 lg:hidden"
              aria-label="Open navigation"
              onClick={() => setMobileNav(true)}
            >
              <Menu className="size-5" />
            </button>
            <div className="flex items-center gap-2 pr-4">
              <span className="font-display text-lg font-bold tracking-tight text-white">McKinsey</span>
              <span className="hidden text-sm text-white sm:inline">Design System</span>
            </div>
            <nav className="hidden flex-1 items-center gap-6 text-sm font-medium md:flex">
              <a className="text-white hover:text-cyan-500 hover:underline" href="#">
                Engagements
              </a>
              <a className="text-white hover:text-cyan-500 hover:underline" href="#">
                Clients
              </a>
              <a className="text-white hover:text-cyan-500 hover:underline" href="#">
                Team
              </a>
              <a className="text-white hover:text-cyan-500 hover:underline" href="#">
                Reports
              </a>
            </nav>
            <div className="ml-auto flex items-center gap-2">
              <button
                type="button"
                className="inline-flex size-11 items-center justify-center rounded text-white hover:bg-white/10"
                aria-label="Search"
              >
                <Search className="size-5" />
              </button>
              <Tooltip>
                <TooltipTrigger
                  className="relative inline-flex size-11 items-center justify-center rounded border border-transparent bg-transparent text-white hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-electric-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-deep-blue-900"
                  aria-label="Notifications, 5 unread"
                >
                  <Bell className="size-5" />
                  <span className="absolute -top-0.5 -right-0.5 flex min-w-5 items-center justify-center rounded-full bg-crimson-red-500 px-1 text-[10px] font-medium text-white">
                    5
                  </span>
                </TooltipTrigger>
                <TooltipContent>5 unread updates</TooltipContent>
              </Tooltip>
              <span className="flex size-9 items-center justify-center rounded-full bg-white/10 text-xs font-medium text-white ring-1 ring-white/30">
                DH
              </span>
            </div>
          </div>
        </header>

        <div className="mx-auto flex w-full max-w-[1440px] flex-1">
          <aside
            className={cn(
              "w-72 shrink-0 flex-col border-r border-neutral-10 bg-white shadow-panel",
              "lg:sticky lg:top-14 lg:z-0 lg:flex lg:h-[calc(100dvh-3.5rem)]",
              mobileNav
                ? "fixed top-14 bottom-0 left-0 z-40 flex max-lg:shadow-modal"
                : "max-lg:hidden"
            )}
          >
            <div className="flex items-center justify-between border-b border-neutral-10 p-3 lg:hidden">
              <span className="text-sm font-medium text-neutral-80">Navigation</span>
              <button
                type="button"
                className="inline-flex size-9 items-center justify-center rounded hover:bg-neutral-5"
                aria-label="Close navigation"
                onClick={() => setMobileNav(false)}
              >
                <PanelLeftClose className="size-5" />
              </button>
            </div>
            <div className="p-3">
              <Label htmlFor="sidebar-search" className="sr-only">
                Search sidebar
              </Label>
              <div className="relative">
                <Search className="pointer-events-none absolute top-2.5 left-2 size-4 text-neutral-54" />
                <Input id="sidebar-search" className="pl-8" placeholder="Search…" />
              </div>
            </div>
            <nav className="flex-1 space-y-1 overflow-y-auto px-2 pb-6 text-sm">
              <NavRow label="All engagements" />
              <NavRow label="My engagements" expandable defaultOpen>
                <NavRow label="Active" expandable defaultOpen nested>
                  <NavRow label="Project Alpha" selected={project === "alpha"} onClick={() => setProject("alpha")} nested />
                  <NavRow label="Project Beta" selected={project === "beta"} onClick={() => setProject("beta")} nested />
                  <NavRow label="Project Gamma" nested />
                </NavRow>
                <NavRow label="Pipeline" nested />
                <NavRow label="Completed" nested />
              </NavRow>
              <NavRow label="Favorites" />
              <NavRow label="Archive" />
            </nav>
          </aside>

          {mobileNav ? (
            <button
              type="button"
              className="fixed inset-0 z-30 bg-black/40 lg:hidden"
              aria-label="Close menu overlay"
              onClick={() => setMobileNav(false)}
            />
          ) : null}

          <main id="main-content" className="min-w-0 flex-1 bg-white">
            <div className="border-b border-neutral-10 px-4 py-3 text-xs text-neutral-54">
              <nav aria-label="Breadcrumb">
                <ol className="flex flex-wrap items-center gap-2">
                  <li>
                    <a className="text-electric-blue-500 hover:underline" href="#">
                      Home
                    </a>
                  </li>
                  <li aria-hidden>›</li>
                  <li>
                    <a className="text-electric-blue-500 hover:underline" href="#">
                      My engagements
                    </a>
                  </li>
                  <li aria-hidden>›</li>
                  <li>
                    <a className="text-electric-blue-500 hover:underline" href="#">
                      Active
                    </a>
                  </li>
                  <li aria-hidden>›</li>
                  <li className="font-medium text-neutral-80" aria-current="page">
                    {title}
                  </li>
                </ol>
              </nav>
            </div>

            <div className="relative -mx-0 min-h-[220px] overflow-hidden bg-neutral-10 md:min-h-[280px]">
              <img src={heroImg} alt="" className="absolute inset-0 size-full object-cover" />
              {/* MDS: image backgrounds require Deep Blue #051C2C scrim at ≥60% opacity — never place text on an unscrimmed image */}
              <div className="absolute inset-0 bg-deep-blue-900/60" aria-hidden />
              <div className="relative mx-auto flex max-w-4xl flex-col gap-4 px-4 py-10 md:py-14">
                <p className="text-xs font-medium tracking-wide text-white uppercase">
                  Active engagement
                </p>
                <h1 className="text-[2.5rem] leading-tight font-medium text-white sm:text-display-2 sm:leading-[4.5rem]">
                  {title}
                </h1>
                <p className="max-w-2xl text-body-lg font-normal text-white">
                  Track delivery health, align colleagues on priorities, and keep clients informed with a single
                  engagement view built for Firm members.
                </p>
                <div className="flex flex-wrap items-center gap-4">
                  <a
                    className="inline-flex items-center gap-2 text-sm font-medium text-cyan-500 underline decoration-cyan-500 underline-offset-4 hover:text-cyan-500 hover:underline"
                    href="#"
                  >
                    View full proposal
                    <ArrowRight className="size-4 shrink-0 text-cyan-500" aria-hidden />
                  </a>
                  <Button type="button" variant="secondary" className="bg-white text-deep-blue-900 hover:bg-neutral-5">
                    Export summary
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-8 px-4 py-8">
              <div className="max-w-xl space-y-2">
                <div className="flex items-center justify-between gap-4 text-sm font-medium text-neutral-80">
                  <span>Engagement progress — 72%</span>
                  <span className="text-neutral-54">Determinate</span>
                </div>
                <Progress value={72} className="h-2 rounded-full bg-neutral-10" />
              </div>

              <Tabs defaultValue="overview" className="gap-6">
                <TabsList variant="line">
                  {(
                    [
                      ["overview", "Overview"],
                      ["milestones", "Milestones"],
                      ["team", "Team"],
                      ["documents", "Docs"],
                    ] as const
                  ).map(([v, label]) => (
                    <TabsTrigger key={v} value={v}>
                      {label}
                    </TabsTrigger>
                  ))}
                </TabsList>

                <TabsContent value="overview" className="space-y-8">
                  <section aria-labelledby="kpi-heading">
                    <h2 id="kpi-heading" className="sr-only">
                      Key performance indicators
                    </h2>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      {(booting
                        ? (["a", "b", "c", "d"] as const)
                        : (["hours", "budget", "satisfaction", "days"] as const)
                      ).map((k) =>
                        booting ? (
                          <Card key={k} className="min-h-[140px] shadow-card">
                            <CardHeader>
                              <Skeleton className="h-4 w-24" />
                              <Skeleton className="h-8 w-32" />
                            </CardHeader>
                            <CardContent>
                              <Skeleton className="h-3 w-full" />
                            </CardContent>
                            <CardFooter>
                              <Skeleton className="h-3 w-28" />
                            </CardFooter>
                          </Card>
                        ) : (
                          <Card key={k} className="flex min-h-full flex-col shadow-card">
                            <CardHeader>
                              <CardTitle className="text-sm font-medium text-neutral-54">
                                {k === "hours" && "Total hours"}
                                {k === "budget" && "Budget utilization"}
                                {k === "satisfaction" && "Client satisfaction"}
                                {k === "days" && "Days remaining"}
                              </CardTitle>
                              <div className="pt-2 text-3xl font-medium text-neutral-80">
                                {k === "hours" && "1,584"}
                                {k === "budget" && "72%"}
                                {k === "satisfaction" && "4.6"}
                                {k === "days" && "38"}
                              </div>
                            </CardHeader>
                            <CardContent className="text-sm text-neutral-54">
                              {k === "hours" && "Trending 6% ahead of plan week over week."}
                              {k === "budget" && "Within corridor; watch third-party spend."}
                              {k === "satisfaction" && "Latest pulse from client steering committee."}
                              {k === "days" && "Target completion window stays achievable."}
                            </CardContent>
                            <CardFooter>
                              <button type="button" className="text-sm font-medium text-electric-blue-500 hover:underline">
                                View breakdown
                              </button>
                            </CardFooter>
                          </Card>
                        )
                      )}
                    </div>
                  </section>

                  <section className="space-y-4" aria-labelledby="filters-heading">
                    <h2 id="filters-heading" className="text-base font-medium text-black">
                      Filters
                    </h2>
                    <Card className="shadow-card">
                      <CardContent className="grid gap-6 pt-6 md:grid-cols-2">
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="ws-search">Search workstreams</Label>
                          <Input
                            id="ws-search"
                            value={draftSearch}
                            onChange={(e) => setDraftSearch(e.target.value)}
                            autoComplete="off"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="status-filter">Filter by status</Label>
                          <Select value={draftStatus} onValueChange={setDraftStatus}>
                            <SelectTrigger id="status-filter" className="w-full min-w-0">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All statuses</SelectItem>
                              <SelectItem value="on-track">On track</SelectItem>
                              <SelectItem value="at-risk">At risk</SelectItem>
                              <SelectItem value="blocked">Blocked</SelectItem>
                              <SelectItem value="complete">Complete</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="date-start">Date range — start</Label>
                            <Input
                              id="date-start"
                              type="date"
                              value={draftStart}
                              onChange={(e) => setDraftStart(e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="date-end">Date range — end</Label>
                            <Input id="date-end" type="date" value={draftEnd} onChange={(e) => setDraftEnd(e.target.value)} />
                          </div>
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <span className="text-sm font-medium text-neutral-80">Quick filters</span>
                          <div className="flex flex-wrap gap-2">
                            {(
                              [
                                ["all", "All"],
                                ["active", "Active"],
                                ["at-risk", "At risk"],
                              ] as const
                            ).map(([val, lab]) => (
                              <button
                                key={val}
                                type="button"
                                onClick={() => setDraftQuick(val)}
                                className={cn(
                                  "rounded-full border px-3 py-1 text-sm font-medium transition-colors",
                                  draftQuick === val
                                    ? "border-electric-blue-500 bg-electric-blue-500 text-white"
                                    : "border-neutral-20 bg-white text-neutral-80 hover:bg-neutral-5"
                                )}
                              >
                                {lab}
                              </button>
                            ))}
                          </div>
                        </div>
                        <fieldset className="space-y-2 md:col-span-2">
                          <legend className="text-sm font-medium text-neutral-80">Risk level</legend>
                          <div className="grid gap-3 sm:grid-cols-2">
                            {(
                              [
                                ["low", "Low"],
                                ["medium", "Medium"],
                                ["high", "High"],
                                ["critical", "Critical"],
                              ] as const
                            ).map(([key, lab]) => (
                              <label key={key} className="flex items-center gap-2 text-sm">
                                <Checkbox
                                  checked={draftRisk[key]}
                                  onCheckedChange={(v) =>
                                    setDraftRisk((r) => ({ ...r, [key]: v === true }))
                                  }
                                />
                                {lab}
                              </label>
                            ))}
                          </div>
                        </fieldset>
                        <div className="flex items-center justify-between gap-4 md:col-span-2">
                          <div>
                            <Label htmlFor="show-completed" className="text-sm font-medium">
                              Show completed workstreams
                            </Label>
                            <p className="text-xs text-neutral-54">Includes workstreams marked complete for archive review.</p>
                          </div>
                          <Switch
                            id="show-completed"
                            checked={draftShowCompleted}
                            onCheckedChange={(v) => setDraftShowCompleted(Boolean(v))}
                          />
                        </div>
                        <div className="space-y-3 md:col-span-2">
                          <Label>Minimum hours threshold — {draftMinHours[0]}</Label>
                          <Slider
                            min={0}
                            max={500}
                            step={10}
                            value={draftMinHours}
                            onValueChange={(v) => setDraftMinHours(v)}
                            className="max-w-md"
                          />
                        </div>
                        <div className="flex flex-wrap items-center gap-3 md:col-span-2">
                          <Button type="button" onClick={onApply} disabled={applyBusy} className="min-w-[120px]">
                            {applyBusy ? (
                              <span className="inline-flex items-center gap-2">
                                <Loader2 className="size-8 animate-spin text-white/80" aria-hidden />
                                <span className="sr-only">Applying filters</span>
                                <span aria-hidden>Apply</span>
                              </span>
                            ) : (
                              "Apply"
                            )}
                          </Button>
                          <button
                            type="button"
                            onClick={onClearFilters}
                            className="text-sm font-medium text-electric-blue-500 hover:underline"
                          >
                            Clear all
                          </button>
                        </div>
                      </CardContent>
                    </Card>
                  </section>

                  <section className="space-y-3" aria-label="Engagement alerts">
                    <AlertRow tone="info" text="Quarterly review scheduled for May 15th." />
                    <AlertRow tone="success" text={"Workstream 'Data migration' marked complete."} />
                    <AlertRow tone="warning" text="Budget utilization exceeds 80% threshold." />
                    <AlertRow tone="danger" text="2 workstreams blocked — escalation required." />
                  </section>

                  <section aria-labelledby="health-table-heading">
                    <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                      <h2 id="health-table-heading" className="text-base font-medium text-black">
                        Engagement health
                      </h2>
                      <p className="text-sm text-neutral-54">Sort columns to compare workstreams.</p>
                    </div>
                    <div className="overflow-x-auto rounded-xl border border-neutral-10 shadow-card">
                      <Table className="min-w-[720px]">
                        <TableHeader>
                          <TableRow className="bg-neutral-5">
                            <TableHead className="w-52">
                              <button type="button" className="font-medium hover:text-electric-blue-500" onClick={() => toggleSort("name")}>
                                Workstream
                              </button>
                            </TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>
                              <button type="button" className="font-medium hover:text-electric-blue-500" onClick={() => toggleSort("hours")}>
                                Hours
                              </button>
                            </TableHead>
                            <TableHead>
                              <button type="button" className="font-medium hover:text-electric-blue-500" onClick={() => toggleSort("budget")}>
                                Budget
                              </button>
                            </TableHead>
                            <TableHead>Risk level</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {booting
                            ? Array.from({ length: 6 }).map((_, i) => (
                                <TableRow key={i}>
                                  <TableCell colSpan={6} className="p-4">
                                    <div className="flex items-center gap-3">
                                      <Skeleton className="size-12 rounded-full" />
                                      <div className="flex-1 space-y-2">
                                        <Skeleton className="h-4 w-40" />
                                        <Skeleton className="h-3 w-24" />
                                      </div>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))
                            : null}
                          {!booting && filtered.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={6} className="p-10 text-center text-sm text-neutral-54">
                                No workstreams match these filters. Clear filters or widen the risk selection to see
                                results again.
                              </TableCell>
                            </TableRow>
                          ) : null}
                          {!booting &&
                            filtered.map((row, idx) => (
                              <TableRow key={row.id}>
                                <TableCell>
                                  <div className="flex items-center gap-3">
                                    <Avatar label={row.lead} />
                                    <span className="font-medium text-neutral-80">{row.name}</span>
                                  </div>
                                </TableCell>
                                <TableCell>{statusBadge(row.status)}</TableCell>
                                <TableCell>{row.hours}</TableCell>
                                <TableCell>{row.budget}</TableCell>
                                <TableCell>{riskBadge(row.risk)}</TableCell>
                                <TableCell className="text-right">
                                  <button
                                    type="button"
                                    className="mr-3 text-sm font-medium text-electric-blue-500 hover:underline"
                                    onClick={() => openEdit(row)}
                                  >
                                    Edit
                                  </button>
                                  <button
                                    type="button"
                                    disabled={idx === 0}
                                    className={cn(
                                      "text-sm font-medium hover:underline",
                                      idx === 0 ? "cursor-not-allowed text-neutral-30" : "text-[#CD3030]"
                                    )}
                                    onClick={() => {
                                      setActiveId(row.id)
                                      setRemoveOpen(true)
                                    }}
                                  >
                                    Remove
                                  </button>
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </div>
                    <nav className="mt-4 flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between" aria-label="Table pagination">
                      <span className="text-neutral-54">Page 1 of 4</span>
                      <div className="flex flex-wrap items-center gap-2">
                        <Button type="button" variant="outline" size="sm" disabled>
                          Previous
                        </Button>
                        {[1, 2, 3, 4].map((p) => (
                          <Button
                            key={p}
                            type="button"
                            variant={p === 1 ? "default" : "outline"}
                            size="sm"
                            className="min-w-9"
                          >
                            {p}
                          </Button>
                        ))}
                        <Button type="button" variant="outline" size="sm">
                          Next
                        </Button>
                      </div>
                    </nav>
                  </section>
                </TabsContent>

                <TabsContent value="milestones" className="max-w-2xl space-y-4 text-sm text-neutral-80">
                  <p>
                    Milestones for this engagement stay aligned with client governance. Add dated milestones in your
                    delivery tool of record; this view highlights the next three checkpoints for colleagues.
                  </p>
                  <ul className="list-disc space-y-2 pl-5">
                    <li>Steering committee readout — scheduled</li>
                    <li>Pilot cutover — in planning</li>
                    <li>Benefits tracking — not started</li>
                  </ul>
                </TabsContent>

                <TabsContent value="team" className="space-y-8">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {teamFiltered.map((m) => (
                      <Card key={m.name} className="flex h-full flex-col shadow-card">
                        <CardHeader className="items-start gap-4">
                          <Avatar label={m.name.slice(0, 2).toUpperCase()} />
                          <div>
                            <CardTitle>{m.name}</CardTitle>
                            <CardDescription>
                              {m.role} · {m.location}
                            </CardDescription>
                          </div>
                        </CardHeader>
                        <CardContent className="flex-1 text-sm text-neutral-80">
                          <p>{m.bio}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  <fieldset>
                    <legend className="mb-3 text-sm font-medium text-neutral-80">Filter by role</legend>
                    <RadioGroup value={teamRole} onValueChange={setTeamRole} className="max-w-md gap-3">
                      {[
                        ["engagement-manager", "Engagement manager"],
                        ["associate", "Associate"],
                        ["analyst", "Analyst"],
                        ["expert", "Expert"],
                        ["all", "All"],
                      ].map(([val, lab]) => (
                        <label key={val} className="flex cursor-pointer items-center gap-3 rounded-lg border border-neutral-10 p-3 hover:bg-neutral-5">
                          <RadioGroupItem value={val} id={`role-${val}`} />
                          <span className="text-sm">{lab}</span>
                        </label>
                      ))}
                    </RadioGroup>
                  </fieldset>
                </TabsContent>

                <TabsContent value="documents">
                  <div className="overflow-x-auto rounded-xl border border-neutral-10">
                    <table className="w-full min-w-[640px] text-left text-sm">
                      <thead className="border-b border-neutral-10 bg-neutral-5">
                        <tr>
                          <th className="p-3 font-medium">Name</th>
                          <th className="p-3 font-medium">Type</th>
                          <th className="p-3 font-medium">Date uploaded</th>
                          <th className="p-3 font-medium">Uploaded by</th>
                          <th className="p-3 font-medium">Labels</th>
                        </tr>
                      </thead>
                      <tbody>
                        {DOCUMENTS.map((d, i) => (
                          <tr key={d.name} className={i % 2 === 1 ? "bg-neutral-5/80" : "bg-white"}>
                            <td className="p-3 font-medium text-neutral-80">{d.name}</td>
                            <td className="p-3">
                              <TypeTag label={d.type} />
                            </td>
                            <td className="p-3 text-neutral-54">{d.uploaded}</td>
                            <td className="p-3">{d.by}</td>
                            <td className="p-3">
                              <div className="flex flex-wrap gap-2">
                                {(docTags[i] ?? []).map((tag) => (
                                  <span
                                    key={tag}
                                    className="inline-flex items-center gap-1 rounded-full border border-neutral-20 bg-white px-2 py-0.5 text-xs text-neutral-80"
                                  >
                                    {tag}
                                    <button
                                      type="button"
                                      className="rounded p-0.5 hover:bg-neutral-5"
                                      aria-label={`Remove label ${tag}`}
                                      onClick={() => dismissDocTag(i, tag)}
                                    >
                                      ×
                                    </button>
                                  </span>
                                ))}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex flex-col items-start justify-between gap-4 border-t border-neutral-10 pt-8 sm:flex-row sm:items-center">
                <p className="text-sm text-neutral-54">Switch active engagement context for this workspace.</p>
                <div className="flex flex-wrap gap-2">
                  <Button type="button" variant={project === "alpha" ? "default" : "outline"} onClick={() => setProject("alpha")}>
                    Project Alpha
                  </Button>
                  <Button type="button" variant={project === "beta" ? "default" : "outline"} onClick={() => setProject("beta")}>
                    Project Beta
                  </Button>
                </div>
              </div>
            </div>

            <footer className="border-t border-neutral-10 bg-deep-blue-900 px-4 py-10 text-sm text-white">
              <div className="mx-auto flex max-w-4xl flex-col gap-6 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="font-display text-lg font-bold text-white">McKinsey</p>
                  <p className="mt-2 max-w-sm text-white">
                    © {new Date().getFullYear()} McKinsey &amp; Company. All rights reserved.
                  </p>
                </div>
                <ul className="flex flex-col gap-2 md:text-right">
                  <li>
                    <a className="text-cyan-500 underline decoration-cyan-500 underline-offset-4 hover:underline" href="#">
                      Contact
                    </a>
                  </li>
                  <li>
                    <a className="text-cyan-500 underline decoration-cyan-500 underline-offset-4 hover:underline" href="#">
                      Privacy policy
                    </a>
                  </li>
                  <li>
                    <a className="text-cyan-500 underline decoration-cyan-500 underline-offset-4 hover:underline" href="#">
                      Terms of use
                    </a>
                  </li>
                </ul>
              </div>
            </footer>
          </main>
        </div>
      </div>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="min-w-[260px] sm:max-w-lg" showCloseButton>
          <DialogHeader>
            <DialogTitle>Edit workstream</DialogTitle>
            <DialogDescription>
              Update how this workstream appears to colleagues on the engagement health table. Changes save to this
              preview workspace only.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Workstream name</Label>
              <Input
                id="edit-name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                aria-invalid={Boolean(editErrors.name)}
                aria-describedby={editErrors.name ? "edit-name-error" : undefined}
              />
              {editErrors.name ? (
                <p id="edit-name-error" className="text-sm text-[#CD3030]">
                  {editErrors.name}
                </p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-status">Status</Label>
              <Select value={editStatus} onValueChange={(v) => setEditStatus(v as StatusKey)}>
                <SelectTrigger id="edit-status" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="on-track">On track</SelectItem>
                  <SelectItem value="at-risk">At risk</SelectItem>
                  <SelectItem value="blocked">Blocked</SelectItem>
                  <SelectItem value="complete">Complete</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-notes">Notes</Label>
              <Textarea id="edit-notes" className="min-w-[260px]" value={editNotes} onChange={(e) => setEditNotes(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-hours">Estimated hours</Label>
              <Input
                id="edit-hours"
                type="number"
                min={0}
                inputMode="numeric"
                value={editHours}
                onChange={(e) => setEditHours(e.target.value)}
                aria-invalid={Boolean(editErrors.hours)}
                aria-describedby={editErrors.hours ? "edit-hours-error" : undefined}
              />
              {editErrors.hours ? (
                <p id="edit-hours-error" className="text-sm text-[#CD3030]">
                  {editErrors.hours}
                </p>
              ) : null}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" className="text-electric-blue-500" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={saveEdit}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={removeOpen} onOpenChange={setRemoveOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove workstream</AlertDialogTitle>
            <AlertDialogDescription>
              Removing a workstream hides it from this engagement view for all Firm members. Client-facing materials
              that reference the workstream will need a manual refresh. This action cannot be undone from this
              prototype.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-neutral-20 bg-white text-neutral-80 hover:bg-neutral-5">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="inline-flex h-8 items-center justify-center rounded-lg bg-[#CD3030] px-3 text-sm font-medium text-white hover:bg-[#BC4747]"
              onClick={() => {
                if (activeId) setRows((r) => r.filter((x) => x.id !== activeId))
                setRemoveOpen(false)
              }}
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {showBackTop ? (
        <button
          type="button"
          onClick={scrollTop}
          className="fixed right-4 bottom-6 z-50 inline-flex size-12 items-center justify-center rounded-full bg-deep-blue-900 text-white shadow-modal hover:bg-deep-blue-800 focus-visible:ring-2 focus-visible:ring-electric-blue-500 focus-visible:ring-offset-2"
          aria-label="Back to top"
        >
          <ArrowUp className="size-5" />
        </button>
      ) : null}
      <Toaster theme="light" position="top-right" duration={4000} richColors closeButton />
    </TooltipProvider>
  )
}

function NavRow({
  label,
  nested,
  expandable,
  defaultOpen,
  selected,
  onClick,
  children,
}: {
  label: string
  nested?: boolean
  expandable?: boolean
  defaultOpen?: boolean
  selected?: boolean
  onClick?: () => void
  children?: ReactNode
}) {
  const [open, setOpen] = useState(Boolean(defaultOpen))
  const padding = nested ? "pl-6" : "pl-3"
  if (expandable) {
    return (
      <div>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className={cn(
            "flex w-full items-center gap-2 rounded-md py-2 pr-2 text-left text-neutral-80 hover:bg-neutral-5",
            padding
          )}
        >
          {open ? <ChevronDown className="size-4 shrink-0" /> : <ChevronRight className="size-4 shrink-0" />}
          <span className="font-medium">{label}</span>
        </button>
        {open ? <div className="mt-1 space-y-1 border-l border-neutral-10 pl-2">{children}</div> : null}
      </div>
    )
  }
  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "flex w-full rounded-md py-2 text-left text-sm hover:bg-neutral-5",
          padding,
          selected ? "bg-electric-blue-500/10 font-medium text-electric-blue-500" : "text-neutral-80"
        )}
      >
        {label}
      </button>
    )
  }
  return (
    <div className={cn("rounded-md py-2 text-sm text-neutral-80 hover:bg-neutral-5", padding)}>{label}</div>
  )
}

function AlertRow({ tone, text }: { tone: "info" | "success" | "warning" | "danger"; text: string }) {
  const styles = {
    info: "border-[#E5F0FF] bg-[#E5F0FF] text-deep-blue-900",
    success: "border-[#E6FEE8] bg-[#E6FEE8] text-[#117E1A]",
    warning: "border-[#FFF9D6] bg-[#FFF9D6] text-[#66541F]",
    danger: "border-[#FEEBEB] bg-[#FEEBEB] text-[#CD3030]",
  } as const
  return (
    <div className={cn("rounded-lg border px-4 py-3 text-sm", styles[tone])} role="status">
      {text}
    </div>
  )
}

function TypeTag({ label }: { label: string }) {
  const variant =
    label === "Deck" ? "bg-[#E5F0FF] text-deep-blue-900" : label === "Spreadsheet" ? "bg-neutral-5 text-neutral-80" : "bg-[#E6FEE8] text-[#117E1A]"
  return (
    <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", variant)}>{label}</span>
  )
}
