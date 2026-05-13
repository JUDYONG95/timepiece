"use client"

import { signOut, useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useEffect, useState } from "react"

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  brand: z.string().min(1, "Brand is required"),
  year: z.string().regex(/^\d{4}$/, "Year must be a 4-digit number"),
  description: z.string().min(1, "Description is required"),
  imageSrc: z.string().url("Image URL must be valid"),
})

type WatchFormValues = z.infer<typeof formSchema>

interface Watch {
  id: string
  name: string
  brand: string
  year: string
  description: string
  imageSrc: string
}

export default function AdminPage() {
  // All hooks must be called first, before any conditional logic
  const { data: session, status } = useSession()
  const [watches, setWatches] = useState<Watch[]>([])
  const [loadingWatches, setLoadingWatches] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const form = useForm<WatchFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      brand: "",
      year: "",
      description: "",
      imageSrc: "",
    },
  })

  const editForm = useForm<WatchFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      brand: "",
      year: "",
      description: "",
      imageSrc: "",
    },
  })

  // Fetch watches when component mounts
  useEffect(() => {
    const fetchWatches = async () => {
      setLoadingWatches(true)
      try {
        const res = await fetch("/api/watches")
        if (!res.ok) {
          throw new Error("Failed to fetch watches")
        }
        const data: Watch[] = await res.json()
        setWatches(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoadingWatches(false)
      }
    }

    fetchWatches()
  }, [])

  const fetchWatches = async () => {
    setLoadingWatches(true)
    try {
      const res = await fetch("/api/watches")
      if (!res.ok) {
        throw new Error("Failed to fetch watches")
      }
      const data: Watch[] = await res.json()
      setWatches(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoadingWatches(false)
    }
  }

  const onSubmit = async (values: WatchFormValues) => {
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch("/api/watches", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || "Failed to add watch")
      }

      form.reset()
      await fetchWatches()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const onEditSubmit = async (values: WatchFormValues) => {
    if (!editingId) return

    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch(`/api/watches/${editingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || "Failed to update watch")
      }

      setEditingId(null)
      editForm.reset()
      await fetchWatches()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this watch?")) return

    setDeletingId(id)
    setError(null)
    try {
      const res = await fetch(`/api/watches/${id}`, {
        method: "DELETE",
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || "Failed to delete watch")
      }

      await fetchWatches()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setDeletingId(null)
    }
  }

  const startEditing = (watch: Watch) => {
    setEditingId(watch.id)
    editForm.reset({
      name: watch.name,
      brand: watch.brand,
      year: watch.year,
      description: watch.description,
      imageSrc: watch.imageSrc,
    })
  }

  const cancelEditing = () => {
    setEditingId(null)
    editForm.reset()
  }

  const handleSignOut = async () => {
    await signOut({ redirectTo: "/" })
  }

  // Now we can do conditional returns AFTER all hooks are called
  if (status === "loading") {
    return <p>Loading authentication...</p>
  }

  if (!session) {
    redirect("/login")
    return null
  }

  return (
    <main className="min-h-screen px-6 lg:px-16 xl:px-24 py-16">
      <div className="max-w-5xl">
        <div className="flex items-center justify-between mb-12">
          <div>
            <p className="text-xs tracking-[0.4em] uppercase text-muted-foreground mb-2">
              Admin Dashboard
            </p>
            <h1 className="font-serif text-4xl lg:text-5xl text-foreground">
              Manage Watches
            </h1>
            <p className="text-sm text-muted-foreground mt-2">
              Signed in as {session.user?.email}
            </p>
          </div>
          <button
            onClick={handleSignOut}
            className="text-sm text-muted-foreground underline hover:text-foreground"
          >
            Sign out
          </button>
        </div>

        {/* Add New Watch Form */}
        <section className="mb-12 border border-border p-6">
          <h2 className="font-serif text-2xl text-foreground mb-4">Add New Watch</h2>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="name" className="text-sm text-foreground block mb-1">Name</label>
              <input
                id="name"
                {...form.register("name")}
                className="w-full border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
              {form.formState.errors.name && (
                <p className="text-sm text-destructive mt-1">{form.formState.errors.name.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="brand" className="text-sm text-foreground block mb-1">Brand</label>
              <input
                id="brand"
                {...form.register("brand")}
                className="w-full border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
              {form.formState.errors.brand && (
                <p className="text-sm text-destructive mt-1">{form.formState.errors.brand.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="year" className="text-sm text-foreground block mb-1">Year</label>
              <input
                id="year"
                {...form.register("year")}
                className="w-full border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
              {form.formState.errors.year && (
                <p className="text-sm text-destructive mt-1">{form.formState.errors.year.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="description" className="text-sm text-foreground block mb-1">Description</label>
              <textarea
                id="description"
                {...form.register("description")}
                rows={3}
                className="w-full border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
              {form.formState.errors.description && (
                <p className="text-sm text-destructive mt-1">{form.formState.errors.description.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="imageSrc" className="text-sm text-foreground block mb-1">Image URL</label>
              <input
                id="imageSrc"
                {...form.register("imageSrc")}
                className="w-full border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
              {form.formState.errors.imageSrc && (
                <p className="text-sm text-destructive mt-1">{form.formState.errors.imageSrc.message}</p>
              )}
            </div>
            {error && <p className="text-sm text-destructive mt-4">{error}</p>}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-foreground text-background py-2 text-sm tracking-wide hover:opacity-90 disabled:opacity-50"
            >
              {submitting ? "Adding Watch..." : "Add Watch"}
            </button>
          </form>
        </section>

        {/* Existing Watches List */}
        <section>
          <h2 className="font-serif text-2xl text-foreground mb-4">Existing Watches</h2>
          {loadingWatches ? (
            <p className="text-muted-foreground">Loading watches...</p>
          ) : (
            <div className="space-y-6">
              {watches.length === 0 ? (
                <p className="text-muted-foreground">No watches added yet.</p>
              ) : (
                watches.map((watch) => (
                  <div
                    key={watch.id}
                    className="border border-border p-6"
                  >
                    {editingId === watch.id ? (
                      // Edit Mode
                      <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
                        <div>
                          <label className="text-sm text-foreground block mb-1">Name</label>
                          <input
                            {...editForm.register("name")}
                            className="w-full border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                          />
                          {editForm.formState.errors.name && (
                            <p className="text-sm text-destructive mt-1">{editForm.formState.errors.name.message}</p>
                          )}
                        </div>
                        <div>
                          <label className="text-sm text-foreground block mb-1">Brand</label>
                          <input
                            {...editForm.register("brand")}
                            className="w-full border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                          />
                          {editForm.formState.errors.brand && (
                            <p className="text-sm text-destructive mt-1">{editForm.formState.errors.brand.message}</p>
                          )}
                        </div>
                        <div>
                          <label className="text-sm text-foreground block mb-1">Year</label>
                          <input
                            {...editForm.register("year")}
                            className="w-full border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                          />
                          {editForm.formState.errors.year && (
                            <p className="text-sm text-destructive mt-1">{editForm.formState.errors.year.message}</p>
                          )}
                        </div>
                        <div>
                          <label className="text-sm text-foreground block mb-1">Description</label>
                          <textarea
                            {...editForm.register("description")}
                            rows={3}
                            className="w-full border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                          />
                          {editForm.formState.errors.description && (
                            <p className="text-sm text-destructive mt-1">{editForm.formState.errors.description.message}</p>
                          )}
                        </div>
                        <div>
                          <label className="text-sm text-foreground block mb-1">Image URL</label>
                          <input
                            {...editForm.register("imageSrc")}
                            className="w-full border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                          />
                          {editForm.formState.errors.imageSrc && (
                            <p className="text-sm text-destructive mt-1">{editForm.formState.errors.imageSrc.message}</p>
                          )}
                        </div>
                        <div className="flex gap-4">
                          <button
                            type="submit"
                            disabled={submitting}
                            className="flex-1 bg-foreground text-background py-2 text-sm tracking-wide hover:opacity-90 disabled:opacity-50"
                          >
                            {submitting ? "Saving..." : "Save Changes"}
                          </button>
                          <button
                            type="button"
                            onClick={cancelEditing}
                            className="flex-1 border border-border py-2 text-sm text-foreground hover:bg-muted"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      // View Mode
                      <>
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <span className="text-xs tracking-[0.3em] uppercase text-muted-foreground">
                              {watch.brand}
                            </span>
                            <h2 className="font-serif text-2xl text-foreground mt-1">
                              {watch.name}
                            </h2>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            Est. {watch.year}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                          {watch.description}
                        </p>
                        {watch.imageSrc && (
                          <img src={watch.imageSrc} alt={watch.name} className="mt-4 max-w-full h-auto object-cover" />
                        )}
                        <div className="flex gap-4 mt-6">
                          <button
                            onClick={() => startEditing(watch)}
                            className="text-sm text-foreground underline hover:opacity-70"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(watch.id)}
                            disabled={deletingId === watch.id}
                            className="text-sm text-destructive underline hover:opacity-70 disabled:opacity-50"
                          >
                            {deletingId === watch.id ? "Deleting..." : "Delete"}
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
