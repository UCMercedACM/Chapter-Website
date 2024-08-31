import React from 'react'
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarMenuToggle,
  NavbarItem,
  Link,
  NavbarMenu,
  NavbarMenuItem,
} from '@nextui-org/react'
import ACMLogo from '../assets/acm_logo_v2.png'
function GlobalNavbar() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)

  const UCMACMLogo = () => <img src={ACMLogo} width={76} height={76} />
  // Come back later for the others
  const menuItems = [
    {
      title: 'SIGs',
      path: '/sigs',
    },
    {
      title: 'Events',
      path: '/events',
    },
  ]
  return (
    <>
      <Navbar
        onMenuOpenChange={setIsMenuOpen}
        className="bg-landing opacity-80 "
        position="static"
      >
        <NavbarContent>
          <NavbarMenuToggle
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            className="lg:hidden"
          />
          <NavbarBrand>
            <Link href="/">
              <UCMACMLogo />
            </Link>
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent className="hidden sm:flex gap-6" justify="center">
          {menuItems.map((item, index) => (
            <NavbarItem key={`${item}-${index}`}>
              <Link
                color="foreground"
                className="w-full"
                href={item.path}
                size="lg"
              >
                {item.title}
              </Link>
            </NavbarItem>
          ))}
        </NavbarContent>
        <NavbarMenu>
          {menuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                color="foreground"
                className="w-full"
                href={item.path}
                size="lg"
              >
                {item.title}
              </Link>
            </NavbarMenuItem>
          ))}
        </NavbarMenu>
      </Navbar>
    </>
  )
}

export default GlobalNavbar
