import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { ArrowLeft, Calendar, User, Volume2, Video, Image } from 'lucide-react'

const PostView = ({ post, onBack }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getCategoryColor = (category) => {
    const colors = {
      'review': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'news': 'bg-green-500/20 text-green-400 border-green-500/30',
      'tutorial': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      'general': 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
    return colors[category] || colors.general
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-4">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Voltar
        </Button>
      </div>

      <Card className="game-card">
        <CardHeader>
          <CardTitle className="text-2xl font-bold neon-text mb-4">
            {post.title}
          </CardTitle>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <User size={16} />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar size={16} />
              <span>{formatDate(post.created_at)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-3">
            <Badge className={getCategoryColor(post.category)}>
              {post.category}
            </Badge>
            {post.tags && post.tags.length > 0 && (
              <div className="flex gap-1 flex-wrap">
                {post.tags.map((tag, index) => (
                  <Badge key={index} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Resumo */}
          {post.summary && (
            <div className="p-4 bg-muted/50 rounded-lg border-l-4 border-primary">
              <p className="text-muted-foreground italic">{post.summary}</p>
            </div>
          )}

          {/* Imagem */}
          {post.image_url && (
            <div className="rounded-lg overflow-hidden">
              <img 
                src={`http://localhost:5000${post.image_url}`}
                alt={post.title}
                className="w-full max-h-96 object-cover"
              />
            </div>
          )}

          {/* Conteúdo */}
          <div className="prose prose-invert max-w-none">
            <div className="whitespace-pre-wrap text-foreground leading-relaxed">
              {post.content}
            </div>
          </div>

          {/* Mídia */}
          <div className="space-y-4">
            {/* Áudio */}
            {post.audio_url && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-primary">
                  <Volume2 size={20} />
                  <span className="font-semibold">Áudio</span>
                </div>
                <audio 
                  controls 
                  className="w-full"
                  src={`http://localhost:5000${post.audio_url}`}
                >
                  Seu navegador não suporta o elemento de áudio.
                </audio>
              </div>
            )}

            {/* Vídeo */}
            {post.video_url && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-primary">
                  <Video size={20} />
                  <span className="font-semibold">Vídeo</span>
                </div>
                <video 
                  controls 
                  className="w-full max-h-96 rounded-lg"
                  src={`http://localhost:5000${post.video_url}`}
                >
                  Seu navegador não suporta o elemento de vídeo.
                </video>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default PostView

