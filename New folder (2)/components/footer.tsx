import Link from "next/link"
import { Phone, Mail, MessageSquare } from "lucide-react"

export default function Footer() {
  const whatsappNumber = "+254702728935"

  return (
    <footer className="py-12 border-t">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-black rounded-md flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-medium">Investor</span>
                <span className="text-sm font-medium">Freddie</span>
              </div>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              Connecting innovative projects with investment opportunities to help bring great ideas to life.
            </p>
          </div>

          <div>
            <h3 className="font-medium text-lg mb-4">Quick Links</h3>
            <nav className="flex flex-col gap-2">
              <Link href="/projects" className="text-sm text-muted-foreground hover:text-foreground">
                Projects
              </Link>
              <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground">
                About
              </Link>
              <Link href="/community" className="text-sm text-muted-foreground hover:text-foreground">
                Community
              </Link>
              <Link href="/faq" className="text-sm text-muted-foreground hover:text-foreground">
                FAQ
              </Link>
            </nav>
          </div>

          <div>
            <h3 className="font-medium text-lg mb-4">Contact</h3>
            <div className="space-y-2">
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-accent"
              >
                <MessageSquare className="h-4 w-4" />
                <span>WhatsApp: {whatsappNumber}</span>
              </a>
              <a
                href="tel:+254702728935"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-accent"
              >
                <Phone className="h-4 w-4" />
                <span>Call: +254 702 728 935</span>
              </a>
              <a
                href="mailto:funditnow@gmail.com"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-accent"
              >
                <Mail className="h-4 w-4" />
                <span>funditnow@gmail.com</span>
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-lg mb-4">Legal</h3>
            <nav className="flex flex-col gap-2">
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
                Terms of Service
              </Link>
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
                Privacy Policy
              </Link>
              <Link href="/investment-terms" className="text-sm text-muted-foreground hover:text-foreground">
                Investment Terms
              </Link>
            </nav>
          </div>
        </div>

        <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Freddie Investments. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground mt-2 md:mt-0">Based in Nairobi, Kenya</p>
        </div>
      </div>
    </footer>
  )
}
