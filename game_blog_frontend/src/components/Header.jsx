import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Menu, X, Home, PlusCircle, Search, User } from 'lucide-react'

const Header = ({ currentView, setCurrentView }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const menuItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'create', label: 'Criar Post', icon: PlusCircle },
    { id: 'search', label: 'Buscar', icon: Search },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">G</span>
            </div>
            <h1 className="text-xl font-bold neon-text">GameHub Blog</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            {menuItems.map((item) => {
              const Icon = item.icon
              return (
                <Button
                  key={item.id}
                  variant={currentView === item.id ? "default" : "ghost"}
                  onClick={() => setCurrentView(item.id)}
                  className={`flex items-center space-x-2 ${
                    currentView === item.id ? 'cyber-button' : ''
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </Button>
              )
            })}
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-border pt-4">
            <div className="flex flex-col space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon
                return (
                  <Button
                    key={item.id}
                    variant={currentView === item.id ? "default" : "ghost"}
                    onClick={() => {
                      setCurrentView(item.id)
                      setIsMenuOpen(false)
                    }}
                    className={`flex items-center justify-start space-x-2 w-full ${
                      currentView === item.id ? 'cyber-button' : ''
                    }`}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </Button>
                )
              })}
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}

export default Header

