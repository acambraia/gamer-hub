import { useState } from 'react'
import Header from './components/Header.jsx'
import Home from './components/Home.jsx'
import CreatePost from './components/CreatePost.jsx'
import PostView from './components/PostView.jsx'
import './App.css'

function App() {
  const [currentView, setCurrentView] = useState('home')
  const [selectedPost, setSelectedPost] = useState(null)

  const handleViewPost = (post) => {
    setSelectedPost(post)
    setCurrentView('view')
  }

  const handlePostCreated = (newPost) => {
    setCurrentView('home')
    // Aqui você poderia atualizar a lista de posts se necessário
  }

  const handleBackToHome = () => {
    setSelectedPost(null)
    setCurrentView('home')
  }

  const renderContent = () => {
    switch (currentView) {
      case 'home':
        return <Home onViewPost={handleViewPost} />
      case 'create':
        return <CreatePost onPostCreated={handlePostCreated} />
      case 'view':
        return <PostView post={selectedPost} onBack={handleBackToHome} />
      case 'search':
        return <Home onViewPost={handleViewPost} />
      default:
        return <Home onViewPost={handleViewPost} />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header currentView={currentView} setCurrentView={setCurrentView} />
      <main className="pt-20">
        {renderContent()}
      </main>
    </div>
  )
}

export default App
