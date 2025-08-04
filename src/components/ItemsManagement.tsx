'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Item } from '@/types/item'
import { Plus, Trash2, Save, Edit3, X } from 'lucide-react'

// Tipo para o formulário com preço como string para máscara
interface ItemFormState {
  name: string
  description: string
  price: string  // String para permitir máscara de dinheiro
  isActive: boolean
}

const INITIAL_FORM_DATA: ItemFormState = {
  name: '',
  description: '',
  price: '0,00',  // Formato brasileiro
  isActive: true
}

const ItemsManagement: React.FC = () => {
  const [items, setItems] = useState<Item[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Item | null>(null)
  const [formData, setFormData] = useState<ItemFormState>(INITIAL_FORM_DATA)

  const fetchItems = useCallback(async () => {
    try {
      const response = await fetch('/api/items')
      if (response.ok) {
        const data = await response.json()
        setItems(data)
      }
    } catch (error) {
      console.error('Erro ao buscar itens:', error)
    }
  }, [])

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => b.price - a.price)
  }, [items])

  // Função para limpar e formatar valor de dinheiro (mesmo que MenuForm)
  const cleanValue = useCallback((value: string): string => {
    return value.replace(/[^\d]/g, '')
  }, [])

  const formatCurrency = useCallback((value: string): string => {
    const cleanedValue = cleanValue(value)
    if (cleanedValue === '') return '0,00'
    
    const intValue = parseInt(cleanedValue, 10)
    const formattedValue = (intValue / 100).toFixed(2).replace('.', ',')
    return formattedValue
  }, [cleanValue])

  // Função para converter string formatada para número
  const parsePrice = useCallback((priceString: string): number => {
    const cleaned = cleanValue(priceString)
    return cleaned ? parseInt(cleaned, 10) / 100 : 0
  }, [cleanValue])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    
    if (name === 'price') {
      const formattedPrice = formatCurrency(value)
      setFormData(prev => ({
        ...prev,
        [name]: formattedPrice
      }))
    } else if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }, [formatCurrency])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const submitData = {
        ...formData,
        price: parsePrice(formData.price) // Converter string formatada para número
      }

      let response
      if (editingItem) {
        // Atualizar item existente
        response = await fetch(`/api/items/${editingItem.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(submitData)
        })
      } else {
        // Criar novo item
        response = await fetch('/api/items', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(submitData)
        })
      }

      if (response.ok) {
        await fetchItems()
        closeModal()
        alert(editingItem ? 'Item atualizado com sucesso!' : 'Item criado com sucesso!')
      } else {
        throw new Error('Erro ao salvar item')
      }
    } catch (error) {
      console.error('Erro ao salvar item:', error)
      alert('Erro ao salvar item. Tente novamente.')
    }
  }

  const openEditModal = (item: Item) => {
    setEditingItem(item)
    setFormData({
      name: item.name,
      description: item.description,
      price: formatCurrency((item.price * 100).toString()), // Converter para formato de moeda
      isActive: item.isActive
    })
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este item?')) {
      try {
        const response = await fetch(`/api/items/${id}`, {
          method: 'DELETE'
        })
        
        if (response.ok) {
          await fetchItems()
          alert('Item excluído com sucesso!')
        } else {
          throw new Error('Erro ao excluir item')
        }
      } catch (error) {
        console.error('Erro ao excluir item:', error)
        alert('Erro ao excluir item. Tente novamente.')
      }
    }
  }

  const openCreateModal = () => {
    setEditingItem(null)
    setFormData({
      name: '',
      description: '',
      price: '0,00',
      isActive: true
    })
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingItem(null)
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Gerenciar Itens</h1>
        <button
          onClick={openCreateModal}
          className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-all duration-200 font-semibold border-2 border-green-600 hover:border-green-700 shadow-md hover:shadow-lg transform hover:scale-105"
        >
          <Plus size={20} />
          <span>Novo Item</span>
        </button>
      </div>

      {/* Lista de Itens */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-300">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b-2 border-gray-300">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-800 uppercase tracking-wider">
                  Nome
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-800 uppercase tracking-wider">
                  Descrição
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-800 uppercase tracking-wider">
                  Preço
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-800 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-800 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-300">
              {sortedItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-100 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-800">{item.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-700 max-w-xs truncate font-medium">{item.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-green-700">
                      R$ {item.price.toFixed(2).replace('.', ',')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      item.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {item.isActive ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openEditModal(item)}
                        className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-all duration-200 border border-transparent hover:border-blue-200 shadow-sm hover:shadow-md transform hover:scale-105"
                        title="Editar"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-all duration-200 border border-transparent hover:border-red-200 shadow-sm hover:shadow-md transform hover:scale-105"
                        title="Excluir"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Criação/Edição */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header do Modal */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                  {editingItem ? 'Editar Item' : 'Novo Item'}
                </h2>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Formulário */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Nome */}
                <div>
                  <label htmlFor="item-name" className="block text-sm font-bold text-gray-800 mb-3">
                    Nome do Item
                  </label>
                  <input
                    id="item-name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-400 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-gray-900 font-medium placeholder-gray-600 shadow-sm"
                    placeholder="Ex: Hambúrguer Clássico"
                    required
                  />
                </div>

                {/* Descrição */}
                <div>
                  <label htmlFor="item-description" className="block text-sm font-bold text-gray-800 mb-3">
                    Descrição
                  </label>
                  <textarea
                    id="item-description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-400 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none bg-white text-gray-900 font-medium placeholder-gray-600 shadow-sm"
                    placeholder="Descreva os ingredientes e características do item..."
                    required
                  />
                </div>

                {/* Preço com Máscara */}
                <div>
                  <label htmlFor="item-price" className="block text-sm font-bold text-gray-800 mb-3">
                    Preço
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-700 font-bold">R$</span>
                    <input
                      id="item-price"
                      type="text"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-400 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-gray-900 font-medium placeholder-gray-600 shadow-sm"
                      placeholder="0,00"
                      required
                    />
                  </div>
                </div>

                {/* Status Ativo */}
                <div className="flex items-center space-x-3">
                  <input
                    id="item-active"
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-400 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <label htmlFor="item-active" className="text-sm font-bold text-gray-800">
                    Item Ativo
                  </label>
                </div>

                {/* Botões do Modal */}
                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-6 py-3 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-all duration-200 font-semibold border-2 border-gray-500 hover:border-gray-600 shadow-md hover:shadow-lg transform hover:scale-105"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-200 font-semibold border-2 border-blue-600 hover:border-blue-700 shadow-md hover:shadow-lg transform hover:scale-105"
                  >
                    <Save size={18} />
                    <span>{editingItem ? 'Atualizar' : 'Salvar'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ItemsManagement