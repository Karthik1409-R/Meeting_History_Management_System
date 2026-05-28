"use client";

import Link from "next/link";

const footerLinks = [
  {
    heading: "Product",
    links: ["Features", "Pricing", "Download"],
  },
  {
    heading: "Company",
    links: ["About", "Blog", "Careers"],
  },
  {
    heading: "Support",
    links: ["Help Center", "Privacy", "Terms"],
  },
];

const LogoIcon = () => {
  return (
    <div className="text-sm font-bold text-white">
      M
    </div>
  );
};

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 px-5 py-10 transition-colors duration-300">
      <div className="mx-auto max-w-6xl">
        
        {/* Top Section */}
        <div className="mb-8 flex flex-col items-center justify-between gap-8 md:flex-row md:items-start">
          
          {/* Logo */}
          <div className="flex flex-col items-center gap-2 md:items-start">
            <Link
              href="/"
              className="flex items-center gap-2"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 shadow-sm">
                <LogoIcon />
              </div>

              <span className="text-base font-bold text-gray-900">
                Meeting App
              </span>
            </Link>

            <p className="max-w-[200px] text-center text-xs text-gray-400 md:text-left">
              Video meetings built for everyone.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-x-10 gap-y-4 text-sm md:justify-end">
            {footerLinks.map(({ heading, links }) => (
              <div key={heading}>
                
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-900">
                  {heading}
                </p>

                <ul className="space-y-2">
                  {links.map((link) => (
                    <li key={link}>
                      <Link
                        href="#"
                        className="text-xs text-gray-500 transition-colors hover:text-blue-600"
                      >
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col items-center justify-between gap-2 border-t border-gray-200 pt-6 sm:flex-row">
          
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} MeetNow Inc.
            All rights reserved.
          </p>

          <p className="text-xs text-gray-400">
            Built with Next.js + Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
}