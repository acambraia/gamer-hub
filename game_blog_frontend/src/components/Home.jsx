import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Search, Filter, Gamepad2, Loader2 } from 'lucide-react'
import PostCard from './PostCard.jsx'

const Home = ({ onViewPost }) => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [categories, setCategories] = useState([])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:5000/api/posts')
      if (response.ok) {
        const data = await response.json()
        setPosts(data.posts || [])
      }
    } catch (error) {
      console.error('Erro ao carregar posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      }
    } catch (error) {
      console.error('Erro ao carregar categorias:', error)
    }
  }

  useEffect(() => {
    fetchPosts()
    fetchCategories()
  }, [])

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (post.tags && post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
    
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2 text-primary">
          <Loader2 size={24} className="animate-spin" />
          <span>Carregando posts...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Hero Section */}
      <div className="text-center mb-8 py-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Gamepad2 size={48} className="text-primary glow-effect" />
          <h1 className="text-4xl md:text-6xl font-bold neon-text">
            GameHub Blog
          </h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Seu portal definitivo para notícias, reviews e conteúdo sobre games. 
          Descubra os últimos lançamentos e mergulhe no universo gamer.
        </p>
      </div>

      {/* Filtros */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar posts, tags ou conteúdo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-muted-foreground" />
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Todas as categorias" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as categorias</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Posts Grid */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-12">
          <Gamepad2 size={64} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">
            {posts.length === 0 ? 'Nenhum post encontrado' : 'Nenhum resultado encontrado'}
          </h3>
          <p className="text-muted-foreground">
            {posts.length === 0 
              ? 'Seja o primeiro a criar um post!' 
              : 'Tente ajustar os filtros ou termos de busca.'
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map(post => (
            <PostCard 
              key={post.id} 
              post={post} 
              onView={onViewPost}
            />
          ))}
        </div>
      )}

      {/* Stats */}
      {posts.length > 0 && (
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-4 px-6 py-3 bg-card/50 rounded-lg border border-border">
            <span className="text-sm text-muted-foreground">
              Mostrando {filteredPosts.length} de {posts.length} posts
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

export default Home

