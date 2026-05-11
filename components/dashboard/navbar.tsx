import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface NavbarProps {
  title: string
}

export function Navbar({ title }: NavbarProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-4 sm:px-6">
      <h1 className="text-xl font-semibold text-foreground">{title}</h1>

      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-medium text-foreground">Rahul Kumar</p>
          <p className="text-xs text-muted-foreground">rahul@example.com</p>
        </div>
        <Avatar className="size-9">
          <AvatarImage src="/placeholder-avatar.jpg" alt="User avatar" />
          <AvatarFallback className="bg-blue-100 text-blue-700 text-sm font-medium">
            RK
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
