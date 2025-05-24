"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookAIcon,
  Command,
  Frame,
  GalleryVerticalEnd,
  LayoutDashboard,
  Map,
  PieChart,
  Settings2,
  UsersIcon,
} from "lucide-react"

import { NavMain } from "@/components/layouts/nav-main"
import { NavUser } from "@/components/layouts/nav-user"
import { TeamSwitcher } from "@/components/layouts/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useAuthProviderContext } from "@/contexts/auth-provider"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Bipros",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    }
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: LayoutDashboard,
      isActive: true,
      roles: ['Super Admin' , 'student'],
      items: [
        {
          title: "History",
          url: "#",
        },
        {
          title: "Starred",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "Courses",
      url: "/courses",
      roles: ['student'],
      icon: BookAIcon,
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: "My Learning",
      url: "/my-learning",
      roles: ['student'],
      icon: BookAIcon,
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: "Configuration",
      url: "/configuration",
      icon: Settings2,
      roles: ['Super Admin'],
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    
  ],
}

// const getAuthorizedMenu = ()=> {
//   debugger;

//   return data.navMain.filter((item)=> !item.roles || item.roles.includes(process.env.NEXT_PUBLIC_ROLE))
// }

// const menus = getAuthorizedMenu();

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  const {principal} = useAuthProviderContext();

  if (!principal || !principal.role?.roleName) {
    return null;
  }

  const userRole = principal.role.roleName;

  const menus = data.navMain.filter((item) => {
    return !item.roles || item.roles.map(r => r.toUpperCase()).includes((userRole || '').toUpperCase());  
  });

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={menus} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
