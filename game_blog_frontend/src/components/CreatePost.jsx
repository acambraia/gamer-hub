import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Upload, FileText, Volume2, Video, Image, Send, Loader2 } from 'lucide-react'

const CreatePost = ({ onPostCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    summary: '',
    category: 'general',
    tags: '',
    author: 'Admin'
  })
  
  const [files, setFiles] = useState({
    image: null,
    audio: null,
    video: null
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)

  const categories = [
    { value: 'general', label: 'Geral' },
    { value: 'review', label: 'Review' },
    { value: 'news', label: 'Notícias' },
    { value: 'tutorial', label: 'Tutorial' },
    { value: 'esports', label: 'E-Sports' },
    { value: 'indie', label: 'Indie Games' }
  ]

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleFileChange = (type, file) => {
    setFiles(prev => ({
      ...prev,
      [type]: file
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const submitData = new FormData()
      
      // Adicionar dados do formulário
      Object.keys(formData).forEach(key => {
        submitData.append(key, formData[key])
      })
      
      // Adicionar arquivos
      Object.keys(files).forEach(type => {
        if (files[type]) {
          submitData.append(type, files[type])
        }
      })

      const response = await fetch('http://localhost:5000/api/posts', {
        method: 'POST',
        body: submitData
      })

      if (response.ok) {
        const newPost = await response.json()
        onPostCreated(newPost)
        
        // Limpar formulário
        setFormData({
          title: '',
          content: '',
          summary: '',
          category: 'general',
          tags: '',
          author: 'Admin'
        })
        setFiles({
          image: null,
          audio: null,
          video: null
        })
        
        // Limpar inputs de arquivo
        const fileInputs = document.querySelectorAll('input[type="file"]')
        fileInputs.forEach(input => input.value = '')
        
        alert('Post criado com sucesso!')
      } else {
        throw new Error('Erro ao criar post')
      }
    } catch (error) {
      console.error('Erro:', error)
      alert('Erro ao criar post. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const FileUploadSection = ({ type, icon: Icon, label, accept }) => (
    <div className="space-y-2">
      <Label className="flex items-center gap-2">
        <Icon size={16} />
        {label}
      </Label>
      <div className="flex items-center gap-2">
        <Input
          type="file"
          accept={accept}
          onChange={(e) => handleFileChange(type, e.target.files[0])}
          className="flex-1"
        />
        {files[type] && (
          <span className="text-sm text-primary">{files[type].name}</span>
        )}
      </div>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card className="game-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 neon-text">
            <FileText size={24} />
            Criar Novo Post
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informações básicas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Digite o título do post"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Categoria</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="summary">Resumo</Label>
              <Textarea
                id="summary"
                value={formData.summary}
                onChange={(e) => handleInputChange('summary', e.target.value)}
                placeholder="Breve resumo do post (opcional)"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Conteúdo *</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => handleInputChange('content', e.target.value)}
                placeholder="Escreva o conteúdo do seu post aqui..."
                rows={8}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => handleInputChange('tags', e.target.value)}
                  placeholder="tag1, tag2, tag3"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="author">Autor</Label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={(e) => handleInputChange('author', e.target.value)}
                  placeholder="Nome do autor"
                />
              </div>
            </div>

            {/* Upload de arquivos */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Upload size={20} />
                Arquivos de Mídia
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FileUploadSection
                  type="image"
                  icon={Image}
                  label="Imagem"
                  accept="image/*"
                />
                
                <FileUploadSection
                  type="audio"
                  icon={Volume2}
                  label="Áudio"
                  accept="audio/*"
                />
                
                <FileUploadSection
                  type="video"
                  icon={Video}
                  label="Vídeo"
                  accept="video/*"
                />
              </div>
            </div>

            {/* Botão de envio */}
            <div className="flex justify-end">
              <Button 
                type="submit" 
                disabled={isSubmitting || !formData.title || !formData.content}
                className="cyber-button flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Publicando...
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Publicar Post
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default CreatePost

