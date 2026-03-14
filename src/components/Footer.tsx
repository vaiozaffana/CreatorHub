import Link from "next/link";
import { Zap } from "lucide-react";

const footerLinks = {
  Product: [
    { label: "Features", href: "/#features" },
    { label: "How It Works", href: "/#how-it-works" },
    { label: "Changelog", href: "#" },
  ],
  Company: [
    { label: "About", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Contact", href: "#" },
  ],
  Legal: [
    { label: "Privacy", href: "#" },
    { label: "Terms", href: "#" },
    { label: "Refunds", href: "#" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-16 lg:py-20 grid grid-cols-2 md:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 bg-linear-to-br from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-sm shadow-violet-500/20">
                <Zap className="w-4.5 h-4.5 text-white" />
              </div>
              <span className="font-display text-xl font-bold text-gray-900 dark:text-white tracking-tight">
                Creator<span className="text-violet-600 dark:text-violet-400">Hub</span>
              </span>
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-xs mb-6">
              The easiest way to sell your digital products online. Built for
              creators, by creators.
            </p>
            <div className="flex items-center gap-4">
              {["Twitter", "GitHub", "Discord"].map((social) => (
                <Link
                  key={social}
                  href="#"
                  className="text-xs font-medium text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-1.5 rounded-lg transition-all duration-200"
                >
                  {social}
                </Link>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-[0.15em] mb-5">
                {category}
              </h3>
              <ul className="space-y-3.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-100 dark:border-gray-800 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            &copy; {new Date().getFullYear()} CreatorHub. All rights reserved.
          </p>
          <p className="text-xs text-gray-300 dark:text-gray-600">
            Built with ♥ for creators everywhere
          </p>
        </div>
      </div>
    </footer>
  );
}
