
import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-stone-900 text-stone-300 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">

          {/* Brand */}
          <div>
            <Link
              href="/"
              className="flex items-center gap-3 mb-3 w-fit"
              aria-label="Bean to Leaf home"
            >
              <Image
                src="/logo.jpg"
                alt="Bean to Leaf logo"
                width={40}
                height={40}
                className="h-10 w-10 rounded-lg object-cover"
                priority
              />

              <span className="font-bold text-white text-lg">
                Bean to Leaf
              </span>
            </Link>

            <p className="text-xs text-stone-400 leading-relaxed max-w-xs">
              Discover specialty coffee, trusted roasters, origins, and
              exceptional coffees worth brewing.
            </p>
          </div>

          {/* Explore Coffee */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">
              Explore Coffee
            </h4>

            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  href="/catalog"
                  className="hover:text-amber-400 transition-colors"
                >
                  All Specialty Coffees
                </Link>
              </li>

              <li>
                <Link
                  href="/catalog?process=Washed"
                  className="hover:text-amber-400 transition-colors"
                >
                  Washed Process Coffee
                </Link>
              </li>

              <li>
                <Link
                  href="/catalog?process=Natural"
                  className="hover:text-amber-400 transition-colors"
                >
                  Natural Process Coffee
                </Link>
              </li>

              <li>
                <Link
                  href="/catalog?roastLevel=Light"
                  className="hover:text-amber-400 transition-colors"
                >
                  Light Roast Coffee
                </Link>
              </li>

              <li>
                <Link
                  href="/roasters"
                  className="hover:text-amber-400 transition-colors font-medium text-amber-400/90"
                >
                  Coffee Roasters Directory
                </Link>
              </li>

              <li>
                <Link
                  href="/equipment"
                  className="hover:text-amber-400 transition-colors"
                >
                  Coffee Equipment & Grinders
                </Link>
              </li>

              <li>
                <Link
                  href="/coffee-subscriptions"
                  className="hover:text-amber-400 transition-colors"
                >
                  Coffee Subscriptions
                </Link>
              </li>
            </ul>
          </div>

          {/* Why Bean to Leaf */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">
              Why Bean to Leaf
            </h4>

            <ul className="space-y-2 text-xs text-stone-400">
              <li>🏆 Compare coffee prices</li>
              <li>📦 Compare delivered costs</li>
              <li>📊 Price per 100g comparison</li>
              <li>☕ Cost per cup insights</li>
            </ul>
          </div>

          {/* Administration */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">
              Administration
            </h4>

            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  href="/admin"
                  className="hover:text-amber-400 transition-colors"
                >
                  Roaster Dashboard
                </Link>
              </li>

              <li>
                <a
                  href="/api/roasters"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-400 transition-colors"
                >
                  Roaster API
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-stone-800 pt-6 text-center text-xs text-stone-500">
          <p>
            &copy; {new Date().getFullYear()} Bean to Leaf. Discover specialty
            coffee and compare coffees from independent roasters.
          </p>

          <p className="mt-2">
            External brand names, logos, and coffee names belong to their
            respective roasters.
          </p>
        </div>
      </div>
    </footer>
  );
}