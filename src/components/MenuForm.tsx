'use client'

import React, { useState, useEffect } from 'react'
import { Menu } from '@/types/menu'
import { Item } from '@/types/item'
import { Save, Eye } from 'lucide-react'

type MenuFormData = Omit<Menu, 'id' | 'isActive' | 'createdAt' | 'updatedAt'>

interface MenuFormProps {
  menu?: Menu
  onSave: (menuData: MenuFormData) => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onPreview?: (menuData: any) => void
}

const MenuForm: React.FC<MenuFormProps> = ({ menu, onSave, onPreview }) => {
  const [formData, setFormData] = useState({
    deliveryTax: menu?.deliveryTax ? menu.deliveryTax.toFixed(2).replace('.', ',') : '0,00',
    deliveryDay: menu?.deliveryDay || '',
    whatsappOrderDay: menu?.whatsappOrderDay || '',
    whatsappOrderTime: menu?.whatsappOrderTime || '',
  })

  const [items, setItems] = useState<Item[]>([])
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([])

  // Carregar itens disponíveis
  useEffect(() => {
    fetchItems()
  }, [])

  // Atualizar itens selecionados quando o menu muda
  useEffect(() => {
    if (menu?.menuItems) {
      // Extrair os itemIds dos menuItems que têm referência aos items originais
      const itemIds = menu.menuItems
        .map(menuItem => menuItem.itemId)
        .filter((id): id is string => id != null)
      setSelectedItemIds(itemIds)
    }
  }, [menu])

  const fetchItems = async () => {
    try {
      const response = await fetch('/api/items')
      if (response.ok) {
        const data = await response.json()
        // Mostrar todos os itens, não apenas os ativos
        setItems(data)
      }
    } catch (error) {
      console.error('Erro ao buscar itens:', error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    
    // Máscara para taxa de entrega
    if (name === 'deliveryTax') {
      // Remove tudo que não for número ou vírgula/ponto
      let cleanValue = value.replace(/[^\d,.]/g, '')
      
      // Substitui ponto por vírgula para manter a formatação brasileira
      cleanValue = cleanValue.replace('.', ',')
      
      // Limita a 2 casas decimais
      const parts = cleanValue.split(',')
      if (parts.length > 2) {
        cleanValue = parts[0] + ',' + parts[1]
      }
      if (parts[1] && parts[1].length > 2) {
        cleanValue = parts[0] + ',' + parts[1].substring(0, 2)
      }
      
      setFormData(prev => ({
        ...prev,
        [name]: cleanValue
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleItemToggle = (itemId: string) => {
    const item = items.find(i => i.id === itemId)
    
    // Não permitir seleção de itens inativos
    if (!item?.isActive) {
      alert('Este item está inativo e não pode ser selecionado para o cardápio.')
      return
    }
    
    setSelectedItemIds(prev => {
      if (prev.includes(itemId)) {
        return prev.filter(id => id !== itemId)
      } else if (prev.length < 10) {
        return [...prev, itemId]
      } else {
        alert('Máximo de 10 itens permitidos no cardápio.')
        return prev
      }
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (selectedItemIds.length === 0) {
      alert('Selecione pelo menos um item para o cardápio.')
      return
    }

    const selectedItems = items.filter(item => selectedItemIds.includes(item.id))
    
    // Converte a taxa de entrega de string para número
    const deliveryTaxValue = parseFloat(formData.deliveryTax.replace(',', '.')) || 0
    
    const menuData = {
      ...formData,
      name: 'Cardápio Digital',
      whatsappNumber: '(11) 99999-9999',
      deliveryTax: deliveryTaxValue,
      menuItems: selectedItems.map((item, index) => ({
        id: item.id,
        menuId: '', // Será preenchido pela API
        itemId: item.id, // Referência ao item original
        name: item.name,
        description: item.description,
        price: item.price,
        order: index,
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    }
    onSave(menuData)
  }

  const handlePreview = () => {
    if (onPreview && selectedItemIds.length > 0) {
      const selectedItems = items.filter(item => selectedItemIds.includes(item.id))
      
      // Converte a taxa de entrega de string para número
      const deliveryTaxValue = parseFloat(formData.deliveryTax.replace(',', '.')) || 0
      
      const menuData = {
        ...formData,
        name: 'Cardápio Digital',
        whatsappNumber: '(11) 99999-9999',
        deliveryTax: deliveryTaxValue,
        menuItems: selectedItems.map((item, index) => ({
          id: item.id,
          menuId: '', // Será preenchido pela API
          itemId: item.id, // Referência ao item original
          name: item.name,
          description: item.description,
          price: item.price,
          order: index,
          createdAt: new Date(),
          updatedAt: new Date()
        }))
      }
      onPreview(menuData)
    } else {
      alert('Selecione pelo menos um item para pré-visualizar.')
    }
  }

  const selectedItems = items.filter(item => selectedItemIds.includes(item.id))

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-xl border-2 border-gray-300">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b-2 border-gray-300 pb-3">
        {menu ? 'Editar Cardápio' : 'Criar Novo Cardápio'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informações básicas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="deliveryTax" className="block text-sm font-bold text-gray-800 mb-3">
              Taxa de Entrega (R$)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-700 font-bold">R$</span>
              <input
                id="deliveryTax"
                type="text"
                name="deliveryTax"
                value={formData.deliveryTax}
                onChange={handleInputChange}
                placeholder="0,00"
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-400 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-gray-900 font-medium placeholder-gray-600 shadow-sm"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="deliveryDay" className="block text-sm font-bold text-gray-800 mb-3">
              Dia da Entrega
            </label>
            <select
              id="deliveryDay"
              name="deliveryDay"
              value={formData.deliveryDay}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border-2 border-gray-400 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-gray-900 font-medium shadow-sm"
              required
            >
              <option value="" className="text-gray-600">Selecione o dia</option>
              <option value="Segunda-feira">Segunda-feira</option>
              <option value="Terça-feira">Terça-feira</option>
              <option value="Quarta-feira">Quarta-feira</option>
              <option value="Quinta-feira">Quinta-feira</option>
              <option value="Sexta-feira">Sexta-feira</option>
              <option value="Sábado">Sábado</option>
              <option value="Domingo">Domingo</option>
            </select>
          </div>

          <div>
            <label htmlFor="whatsappOrderDay" className="block text-sm font-bold text-gray-800 mb-3">
              Dia dos Pedidos WhatsApp
            </label>
            <select
              id="whatsappOrderDay"
              name="whatsappOrderDay"
              value={formData.whatsappOrderDay}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border-2 border-gray-400 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-gray-900 font-medium shadow-sm"
              required
            >
              <option value="" className="text-gray-600">Selecione o dia</option>
              <option value="Segunda-feira">Segunda-feira</option>
              <option value="Terça-feira">Terça-feira</option>
              <option value="Quarta-feira">Quarta-feira</option>
              <option value="Quinta-feira">Quinta-feira</option>
              <option value="Sexta-feira">Sexta-feira</option>
              <option value="Sábado">Sábado</option>
              <option value="Domingo">Domingo</option>
            </select>
          </div>

          <div>
            <label htmlFor="whatsappOrderTime" className="block text-sm font-bold text-gray-800 mb-3">
              Horário Limite Pedidos
            </label>
            <input
              id="whatsappOrderTime"
              type="time"
              name="whatsappOrderTime"
              value={formData.whatsappOrderTime}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border-2 border-gray-400 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-gray-900 font-medium shadow-sm"
              required
            />
          </div>
        </div>

        {/* Seleção de Itens */}
        <div className="border-t-2 border-gray-200 pt-8">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-800">Selecionar Itens do Cardápio</h3>
            <p className="text-sm font-bold text-gray-800 mt-2">
              {selectedItemIds.length}/10 itens selecionados • {items.filter(item => item.isActive).length} itens ativos disponíveis • {items.length} itens no total
              {selectedItemIds.length >= 10 && ' (Máximo atingido)'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
            {items.length === 0 ? (
              <div className="col-span-2 text-center py-8 text-gray-700 font-medium">
                Nenhum item cadastrado. Cadastre itens primeiro na aba Gerenciar Itens.
              </div>
            ) : (
              items.toSorted((a, b) => b.price - a.price).map((item) => {
                let cardStyle = 'border-gray-400 bg-white hover:border-gray-500 hover:shadow-md'
                
                if (!item.isActive) {
                  cardStyle = 'border-gray-300 bg-gray-100 opacity-60 cursor-not-allowed'
                } else if (selectedItemIds.includes(item.id)) {
                  cardStyle = 'border-blue-600 bg-blue-50 shadow-lg ring-1 ring-blue-200'
                }

                return (
                <button
                  key={item.id}
                  type="button"
                  className={`w-full text-left border-2 rounded-lg p-4 transition-all duration-200 shadow-sm ${cardStyle} ${
                    item.isActive ? 'cursor-pointer hover:shadow-lg' : 'cursor-not-allowed'
                  }`}
                  onClick={() => item.isActive && handleItemToggle(item.id)}
                  disabled={!item.isActive}
                  aria-label={`${selectedItemIds.includes(item.id) ? 'Remover' : 'Adicionar'} ${item.name} do cardápio`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex items-center justify-center p-1 m-1 rounded-md hover:bg-blue-50 transition-colors">
                      <input
                        type="checkbox"
                        checked={selectedItemIds.includes(item.id)}
                        onChange={(e) => {
                          e.stopPropagation() // Impede propagação do evento
                          if (item.isActive) {
                            handleItemToggle(item.id)
                          }
                        }}
                        onClick={(e) => {
                          e.stopPropagation() // Impede propagação do evento
                        }}
                        disabled={!item.isActive}
                        className="mt-1 w-5 h-5 text-blue-600 bg-white border-2 border-gray-400 rounded-md focus:ring-blue-500 focus:ring-2 disabled:opacity-50 cursor-pointer hover:border-blue-500 transition-all duration-200 hover:scale-110"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center space-x-2">
                          <h4 className={`font-bold ${!item.isActive ? 'text-gray-500' : 'text-gray-800'}`}>
                            {item.name}
                          </h4>
                          {!item.isActive && (
                            <span className="px-2 py-1 text-xs font-semibold bg-red-100 text-red-800 rounded-full">
                              INATIVO
                            </span>
                          )}
                        </div>
                        <span className={`font-bold text-sm text-nowrap ${!item.isActive ? 'text-gray-500' : 'text-green-700'}`}>
                          {`R$ ${item.price.toFixed(2)}`}
                        </span>
                      </div>
                      <p className={`text-sm ${!item.isActive ? 'text-gray-400' : 'text-gray-700'} font-medium`}>
                        {item.description}
                      </p>
                    </div>
                  </div>
                </button>
                )
              })
            )}
          </div>

          {/* Itens Selecionados */}
          {selectedItems.length > 0 && (
            <div className="mt-6 p-4 bg-gray-100 rounded-lg border-2 border-gray-300">
              <h4 className="font-bold text-gray-800 mb-3">Itens Selecionados ({selectedItems.length}):</h4>
              <div className="flex flex-wrap gap-2">
                {selectedItems.toSorted((a, b) => b.price - a.price).map((item) => (
                  <span
                    key={item.id}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-blue-200 text-blue-800"
                  >
                    {item.name} - R$ {item.price.toFixed(2)}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Botões de ação */}
        <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t-2 border-gray-200">
          {onPreview && (
            <button
              type="button"
              onClick={handlePreview}
              className="flex items-center justify-center space-x-2 px-8 py-4 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-all duration-200 font-semibold border-2 border-purple-600 hover:border-purple-700 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              <Eye size={18} />
              <span>Pré-visualizar</span>
            </button>
          )}
          
          <button
            type="submit"
            className="flex items-center justify-center space-x-2 px-8 py-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-200 font-semibold border-2 border-blue-600 hover:border-blue-700 shadow-md hover:shadow-lg transform hover:scale-105"
          >
            <Save size={18} />
            <span>Salvar Cardápio</span>
          </button>
        </div>
      </form>
    </div>
  )
}

export default MenuForm
