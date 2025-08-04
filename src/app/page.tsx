'use client'

import React, { useState, useEffect } from 'react'
import MenuForm from '@/components/MenuForm'
import MenuCanvas from '@/components/MenuCanvas'
import ItemsManagement from '@/components/ItemsManagement'
import { Menu } from '@/types/menu'

export default function Home() {
  const [currentMenu, setCurrentMenu] = useState<Menu | null>(null)
  const [previewMenu, setPreviewMenu] = useState<Menu | null>(null)
  const [activeTab, setActiveTab] = useState('create')
  const [isLoading, setIsLoading] = useState(true)
  const [notification, setNotification] = useState<string | null>(null)

  const loadMenu = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/menus')
      if (response.ok) {
        const menu = await response.json()
        
        // Converter datas de string para Date se necessário
        if (menu) {
          const menuWithDates = {
            ...menu,
            createdAt: new Date(menu.createdAt),
            updatedAt: new Date(menu.updatedAt),
            menuItems: menu.menuItems?.map((item: { id: string; menuId: string; name: string; description: string; price: number; order: number; isActive: boolean; createdAt: string | Date; updatedAt: string | Date }) => ({
              ...item,
              createdAt: new Date(item.createdAt),
              updatedAt: new Date(item.updatedAt)
            })) || []
          }
          setCurrentMenu(menuWithDates)
          
          // Define o cardápio como preview
          setPreviewMenu(menuWithDates)
          setActiveTab('preview') // Começa na aba de preview se houver cardápio
        } else {
          setCurrentMenu(null)
        }
      }
    } catch (error) {
      console.log('API não disponível', error)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    loadMenu()
  }, [])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSaveMenu = async (menuData: any) => {
    try {
      const response = await fetch('/api/menus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(menuData),
      })

      if (response.ok) {
        const savedMenu = await response.json()
        
        // Atualiza o cardápio atual
        await loadMenu()
        
        setActiveTab('preview')
        setPreviewMenu(savedMenu)
        
        // Mostra notificação de sucesso
        setNotification('Cardápio salvo com sucesso!')
        setTimeout(() => setNotification(null), 3000)
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao salvar na API')
      }
      
    } catch (error) {
      console.error('Erro ao salvar menu:', error)
      alert('Erro ao salvar o cardápio. Tente novamente.')
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handlePreviewMenu = (menuData: any) => {
    const previewData: Menu = {
      id: 'preview',
      ...menuData,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      menuItems: menuData.menuItems.map((item: any, index: number) => ({
        ...item,
        id: `preview-${index}`
      }))
    }
    setPreviewMenu(previewData)
    setActiveTab('preview')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-800 font-medium">Carregando cardápios...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-md border-b-2 border-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-800 py-6">
            Gerador de Cardápio Digital
          </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Notificação */}
        {notification && (
          <div className="fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in border border-green-700">
            <div className="flex items-center space-x-2">
              <span>✅</span>
              <span className="font-bold">{notification}</span>
            </div>
          </div>
        )}
        
        <div className="w-full">
          <div className="flex space-x-1 rounded-xl bg-blue-700 p-1 mb-6 shadow-lg border border-blue-800">
            <button
              onClick={() => setActiveTab('items')}
              className={`w-full rounded-lg py-2.5 text-sm font-bold leading-5 transition-all duration-200 ${
                activeTab === 'items'
                  ? 'bg-white text-blue-800 shadow-md transform scale-105 border border-blue-300'
                  : 'text-blue-100 hover:bg-white/[0.15] hover:text-white hover:scale-105'
              }`}
            >
              📦 Gerenciar Itens
            </button>
            <button
              onClick={() => setActiveTab('create')}
              className={`w-full rounded-lg py-2.5 text-sm font-bold leading-5 transition-all duration-200 ${
                activeTab === 'create'
                  ? 'bg-white text-blue-800 shadow-md transform scale-105 border border-blue-300'
                  : 'text-blue-100 hover:bg-white/[0.15] hover:text-white hover:scale-105'
              }`}
            >
              {currentMenu ? '✏️ Editar Cardápio' : '🆕 Criar Cardápio'}
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`w-full rounded-lg py-2.5 text-sm font-bold leading-5 transition-all duration-200 ${
                activeTab === 'preview'
                  ? 'bg-white text-blue-800 shadow-md transform scale-105 border border-blue-300'
                  : 'text-blue-100 hover:bg-white/[0.15] hover:text-white hover:scale-105'
              }`}
            >
              👁️ Pré-visualização
            </button>
          </div>

          {activeTab === 'items' && (
            <ItemsManagement />
          )}

          {activeTab === 'create' && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  {currentMenu ? 'Editar Cardápio' : 'Criar Novo Cardápio'}
                </h2>
                {currentMenu && (
                  <p className="text-gray-700 mt-1 font-medium">
                    Última atualização: {new Date(currentMenu.updatedAt).toLocaleDateString('pt-BR')} às {new Date(currentMenu.updatedAt).toLocaleTimeString('pt-BR')}
                  </p>
                )}
              </div>
              <MenuForm
                menu={currentMenu || undefined}
                onSave={handleSaveMenu}
                onPreview={handlePreviewMenu}
              />
            </div>
          )}

          {activeTab === 'preview' && (
            <div className="flex flex-col items-center space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800">Pré-visualização do Cardápio</h2>
                {previewMenu && (
                  <p className="text-gray-600 mt-2">
                    {previewMenu.id === 'preview' ? 'Pré-visualização' : 'Último cardápio salvo'}
                  </p>
                )}
              </div>
              {previewMenu ? (
                <MenuCanvas menu={previewMenu} />
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">
                    Nenhum cardápio para visualizar. 
                    <br />
                    Crie um cardápio primeiro na aba &quot;Criar Cardápio&quot;.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
