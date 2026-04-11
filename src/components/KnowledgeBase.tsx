import React, { useState } from 'react';
import { KnowledgeArticle } from '../types';
import { BookOpen, Search, Plus, Tag, Clock } from 'lucide-react';
import Modal from './Modal';

interface KnowledgeBaseProps {
  articles: KnowledgeArticle[];
  onAddArticle: (article: Omit<KnowledgeArticle, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

const KnowledgeBase: React.FC<KnowledgeBaseProps> = ({ articles, onAddArticle }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // New article state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<KnowledgeArticle['category']>('Methodology');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === 'All' || article.category === categoryFilter;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddArticle({
      title,
      category,
      content,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean)
    });
    setIsModalOpen(false);
    setTitle('');
    setContent('');
    setTags('');
    setCategory('Methodology');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-full min-h-[600px]">
      <div className="p-6 border-b border-gray-100 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              Knowledge Base
            </h2>
            <p className="text-sm text-gray-500 mt-1">Lessons learned, methodology, and payloads</p>
          </div>
          
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Article
          </button>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative w-full sm:flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search articles, lessons, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm bg-gray-50"
          >
            <option value="All">All Categories</option>
            <option value="NA Lesson">NA Lesson</option>
            <option value="Methodology">Methodology</option>
            <option value="Payloads">Payloads</option>
            <option value="Recon">Recon</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <div className="flex-1 p-6 overflow-y-auto bg-gray-50/50">
        {filteredArticles.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900">No articles found</h3>
            <p className="text-gray-500 text-sm mt-1">Try adjusting your search or add a new article.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map(article => (
              <div key={article.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow flex flex-col h-full">
                <div className="flex justify-between items-start mb-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                    article.category === 'NA Lesson' ? 'bg-red-100 text-red-800' :
                    article.category === 'Payloads' ? 'bg-purple-100 text-purple-800' :
                    article.category === 'Methodology' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {article.category}
                  </span>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(article.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{article.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-4 flex-1 mb-4 whitespace-pre-wrap">{article.content}</p>
                
                {article.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-gray-100">
                    {article.tags.map(tag => (
                      <span key={tag} className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                        <Tag className="w-3 h-3" />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Knowledge Article">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="kb-title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              id="kb-title"
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder="e.g. Why IDOR on /api/user failed"
            />
          </div>
          <div>
            <label htmlFor="kb-category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              id="kb-category"
              value={category}
              onChange={e => setCategory(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="NA Lesson">NA Lesson (Not Applicable)</option>
              <option value="Methodology">Methodology</option>
              <option value="Payloads">Payloads</option>
              <option value="Recon">Recon</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label htmlFor="kb-content" className="block text-sm font-medium text-gray-700 mb-1">Content</label>
            <textarea
              id="kb-content"
              required
              rows={6}
              value={content}
              onChange={e => setContent(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder="Write your notes, payload examples, or methodology here..."
            />
          </div>
          <div>
            <label htmlFor="kb-tags" className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
            <input
              id="kb-tags"
              type="text"
              value={tags}
              onChange={e => setTags(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder="e.g. xss, bypass, cloudflare"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t mt-6">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
            >
              Save Article
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default KnowledgeBase;
