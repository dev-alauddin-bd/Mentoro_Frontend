import * as React from "react"
import { cn } from "@/lib/utils"

// Extend input props to include onCheckedChange callback
type CheckboxProps = React.ComponentProps<"input"> & {
  onCheckedChange?: (checked: boolean) => void
}

function Checkbox({ className, onCheckedChange, ...props }: CheckboxProps) {
  // Preserve any existing onChange from props while also calling onCheckedChange
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onCheckedChange?.(e.target.checked)
    props.onChange?.(e)
  }

  return (
    <input
      type="checkbox"
      data-slot="checkbox"
      checked={props.checked}
      onChange={handleChange}
      className={cn(
        "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
        className
      )}
      {...props}
    />
  )
}


export { Checkbox }
