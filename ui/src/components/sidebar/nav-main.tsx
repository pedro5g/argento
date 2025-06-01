import { type LucideIcon } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router";

interface NavMainProps {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
  }[];
}

export const NavMain = ({ items }: NavMainProps) => {
  const { pathname } = useLocation();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Features</SidebarGroupLabel>
      <SidebarMenu>
        {items.map(({ title, url, icon: Icon }) => {
          const isActive = pathname.endsWith(url);

          return (
            <SidebarMenuItem key={title} className="group/collapsible">
              <SidebarMenuButton
                asChild
                isActive={isActive}
                tooltip={title}
                className="data-[active=true]:bg-gradient-to-r to-blue-50 from-blue-100">
                <Link to={url} viewTransition>
                  {Icon && <Icon />}
                  <span>{title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
};
