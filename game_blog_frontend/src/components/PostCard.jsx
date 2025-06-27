import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Calendar, User, Play, Volume2, FileText, Eye } from 'lucide-react'

const PostCard = ({ post, onView }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const getMediaIcon = () => {
    if (post.video_url) return <Play size={16} className="text-primary" />
    if (post.audio_url) return <Volume2 size={16} className="text-primary" />
    return <FileText size={16} className="text-primary" />
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
    <Card className="game-card h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg font-bold text-foreground line-clamp-2 flex-1">
            {post.title}
          </CardTitle>
          <div className="flex items-center gap-1 flex-shrink-0">
            {getMediaIcon()}
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <User size={14} />
          <span>{post.author}</span>
          <Calendar size={14} />
          <span>{formatDate(post.created_at)}</span>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col">
        {post.image_url && (
          <div className="mb-3 rounded-lg overflow-hidden">
            <img 
              src={`http://localhost:5000${post.image_url}`}
              alt={post.title}
              className="w-full h-32 object-cover"
            />
          </div>
        )}

        <p className="text-muted-foreground text-sm mb-4 line-clamp-3 flex-1">
          {post.summary || post.content.substring(0, 150) + '...'}
        </p>

        <div className="flex items-center justify-between gap-2 mt-auto">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className={getCategoryColor(post.category)}>
              {post.category}
            </Badge>
            {post.tags && post.tags.length > 0 && (
              <div className="flex gap-1 flex-wrap">
                {post.tags.slice(0, 2).map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {post.tags.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{post.tags.length - 2}
                  </Badge>
                )}
              </div>
            )}
          </div>

          <Button 
            size="sm" 
            onClick={() => onView(post)}
            className="cyber-button flex items-center gap-1"
          >
            <Eye size={14} />
            Ver
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default PostCard

