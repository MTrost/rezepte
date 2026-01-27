import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useSession, signOut } from '../lib/auth-client'
import {
  ChefHat,
  Search,
  User,
  LogOut,
  Plus,
  Menu,
  X,
  Globe,
} from 'lucide-react'
import { useState } from 'react'

export default function Header() {
  const { t, i18n } = useTranslation()
  const { data: session } = useSession()
  const [menuOpen, setMenuOpen] = useState(false)

  const toggleLanguage = () => {
    const newLang = i18n.language === 'de' ? 'en' : 'de'
    i18n.changeLanguage(newLang)
  }

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-orange-600 hover:text-orange-700">
            <ChefHat className="w-8 h-8" />
            <span className="text-xl font-bold hidden sm:block">{t('common.appName')}</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/rezepte"
              className="text-gray-600 hover:text-orange-600 font-medium transition-colors"
            >
              {t('nav.recipes')}
            </Link>
            <Link
              to="/kategorien"
              className="text-gray-600 hover:text-orange-600 font-medium transition-colors"
            >
              {t('nav.categories')}
            </Link>
            {session?.user && (
              <>
                <Link
                  to="/favoriten"
                  className="text-gray-600 hover:text-orange-600 font-medium transition-colors"
                >
                  {t('nav.favorites')}
                </Link>
                <Link
                  to="/meine-rezepte"
                  className="text-gray-600 hover:text-orange-600 font-medium transition-colors"
                >
                  {t('nav.myRecipes')}
                </Link>
              </>
            )}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/suche"
              className="p-2 text-gray-600 hover:text-orange-600 transition-colors"
              aria-label={t('common.search')}
            >
              <Search className="w-5 h-5" />
            </Link>

            <button
              onClick={toggleLanguage}
              className="p-2 text-gray-600 hover:text-orange-600 transition-colors"
              aria-label="Toggle language"
            >
              <Globe className="w-5 h-5" />
              <span className="sr-only">{i18n.language.toUpperCase()}</span>
            </button>

            {session?.user ? (
              <>
                <Link
                  to="/rezept/neu"
                  className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>{t('nav.addRecipe')}</span>
                </Link>
                <div className="flex items-center gap-2">
                  <Link
                    to="/profil"
                    className="p-2 text-gray-600 hover:text-orange-600 transition-colors"
                  >
                    <User className="w-5 h-5" />
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                    aria-label={t('nav.logout')}
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </>
            ) : (
              <Link
                to="/anmelden"
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                {t('nav.login')}
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-orange-600"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {menuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col gap-4">
              <Link
                to="/rezepte"
                className="text-gray-600 hover:text-orange-600 font-medium"
                onClick={() => setMenuOpen(false)}
              >
                {t('nav.recipes')}
              </Link>
              <Link
                to="/kategorien"
                className="text-gray-600 hover:text-orange-600 font-medium"
                onClick={() => setMenuOpen(false)}
              >
                {t('nav.categories')}
              </Link>
              <Link
                to="/suche"
                className="text-gray-600 hover:text-orange-600 font-medium"
                onClick={() => setMenuOpen(false)}
              >
                {t('common.search')}
              </Link>

              {session?.user ? (
                <>
                  <Link
                    to="/favoriten"
                    className="text-gray-600 hover:text-orange-600 font-medium"
                    onClick={() => setMenuOpen(false)}
                  >
                    {t('nav.favorites')}
                  </Link>
                  <Link
                    to="/meine-rezepte"
                    className="text-gray-600 hover:text-orange-600 font-medium"
                    onClick={() => setMenuOpen(false)}
                  >
                    {t('nav.myRecipes')}
                  </Link>
                  <Link
                    to="/rezept/neu"
                    className="text-gray-600 hover:text-orange-600 font-medium"
                    onClick={() => setMenuOpen(false)}
                  >
                    {t('nav.addRecipe')}
                  </Link>
                  <button
                    onClick={() => {
                      signOut()
                      setMenuOpen(false)
                    }}
                    className="text-left text-gray-600 hover:text-red-600 font-medium"
                  >
                    {t('nav.logout')}
                  </button>
                </>
              ) : (
                <Link
                  to="/anmelden"
                  className="text-gray-600 hover:text-orange-600 font-medium"
                  onClick={() => setMenuOpen(false)}
                >
                  {t('nav.login')}
                </Link>
              )}

              <button
                onClick={() => {
                  toggleLanguage()
                  setMenuOpen(false)
                }}
                className="text-left text-gray-600 hover:text-orange-600 font-medium flex items-center gap-2"
              >
                <Globe className="w-4 h-4" />
                {i18n.language === 'de' ? 'English' : 'Deutsch'}
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
