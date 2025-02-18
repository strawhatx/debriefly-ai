'use client'

import { useState } from 'react'
import { Dialog, DialogPanel } from '@headlessui/react'
import { Brain, XIcon, ArrowLeftToLine } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from './ui/button'
import { Separator } from './ui/separator'

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-background">
      <nav aria-label="Global" className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
        <div className="flex lg:flex-1">
          <Link to="/" className="-m-1.5 p-1.5 flex">
            <span className="sr-only">TradeMind AI</span>
            <Brain className="text-primary mr-2" />
            
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Trademind ai
            </span>
          </Link>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-muted-foreground"
          >
            <span className="sr-only">Open main menu</span>
            <ArrowLeftToLine aria-hidden="true" className="size-6" />
          </button>
        </div>

        <div className="hidden items-center gap-6 lg:flex lg:flex-1 lg:justify-end">
          <Link
            to="/blog"
            className="text-gray-400 hover:text-muted-foreground transition-colors"
          >
            Blog
          </Link>
          <Link
            to="/pricing"
            className="text-gray-400 hover:text-muted-foreground transition-colors"
          >
            Pricing
          </Link>
          <Link
            to="/contact"
            className="text-gray-400 hover:text-muted-foreground transition-colors"
          >
            Contact
          </Link>

          <Button variant='default' className="hover:bg-emerald-300" asChild>
            <Link to="/login">Login <span aria-hidden="true">&rarr;</span></Link>
          </Button>
        </div>
      </nav>
      <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
        <div className="fixed inset-0 z-10" />
        <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full bg-card overflow-y-auto px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Link to="/" className="-m-1.5 p-1.5 flex">
              <span className="sr-only">TradeMind AI</span>
              <Brain className="mr-2 text-primary" />
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Trademind ai
              </span>
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-destructive"
            >
              <span className="sr-only">Close menu</span>
              <XIcon aria-hidden="true" className="size-6" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                <Link
                  to="/blog"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-400 hover:text-muted-foreground  hover:bg-background"
                >
                  Blog
                </Link>
                <Link
                  to="/pricing"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-400 hover:text-muted-foreground  hover:bg-background"
                >
                  Pricing
                </Link>
                <Link
                  to="/contact"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-400 hover:text-muted-foreground  hover:bg-background"
                >
                  Contact
                </Link>
              </div>

              <Separator className="my-4" />

              <Button className="w-full hover: bg-emerald-500" asChild>
                <Link to="/login">Login <span aria-hidden="true">&rarr;</span></Link>
              </Button>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  )
}
