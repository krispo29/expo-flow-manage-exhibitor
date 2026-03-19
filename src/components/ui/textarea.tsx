import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, onInput, ...props }: React.ComponentProps<"textarea">) {
  const handleInput = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const target = e.currentTarget
    const cleaned = target.value.replaceAll(/[^\x20-\x7E\n\r]/g, "")
    if (cleaned !== target.value) {
      target.value = cleaned
    }
    onInput?.(e as React.ComponentProps<"textarea">["onInput"] extends ((e: infer E) => void) | undefined ? E : never)
  }

  return (
    <textarea
      data-slot="textarea"
      onInput={handleInput}
      className={cn(
        "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
