'use client'

import React, { useRef, useEffect } from 'react'
import { Menu } from '@/types/menu'

interface MenuCanvasProps {
  menu: Menu
}

const MenuCanvas: React.FC<MenuCanvasProps> = ({ menu }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Configurações do canvas - mantendo proporção original da imagem
  const canvasWidth = 1280
  const canvasHeight = 1277
  
  // Posições dos elementos
  const contentStartX = canvasWidth * 0.28 // 5% da largura da esquerda
  const contentWidth = canvasWidth * 0.7 // 90% da largura total
  const menuStartY = 80
  const footerHeight = 140
  const footerStartY = canvasHeight - footerHeight

  useEffect(() => {
    const formatPrice = (price: number) => {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(price)
    }

    const drawMenu = () => {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      // Limpar canvas
      ctx.clearRect(0, 0, canvasWidth, canvasHeight)

      // Carregar e desenhar imagem de fundo
      const backgroundImg = new Image()
      backgroundImg.onload = () => {
        // Aplica a imagem de fundo no canvas
        ctx.drawImage(backgroundImg, 0, 0, canvasWidth, canvasHeight)
        
        // Continuar com o resto do desenho após carregar a imagem
        drawMenuContent(ctx)
      }
      backgroundImg.onerror = () => {
        // Se falhar ao carregar, usar fundo gradient como fallback
        const gradient = ctx.createLinearGradient(0, 0, 0, canvasHeight)
        gradient.addColorStop(0, '#f8f9fa')
        gradient.addColorStop(1, '#e9ecef')
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, canvasWidth, canvasHeight)
        
        // Continuar com o resto do desenho
        drawMenuContent(ctx)
      }
      backgroundImg.src = '/fundo.jpg'
    }

    const drawMenuContent = (ctx: CanvasRenderingContext2D) => {
      
      // Desenhar múltiplas camadas de outline para criar efeito arredondado
      ctx.strokeStyle = '#000000'
      ctx.lineJoin = 'round'
      ctx.lineCap = 'round'

      // Calcular área disponível para os itens do menu
      const menuAreaStart = menuStartY + 120
      const menuAreaEnd = footerStartY - 30 // 30px de margem antes do rodapé
      const availableHeight = menuAreaEnd - menuAreaStart
      
      // Calcular altura dinâmica dos itens baseada no espaço disponível
      const totalItems = menu.menuItems.length
      const baseItemHeight = 60
      const minItemSpacing = 15
      const maxItemSpacing = 35
      
      // Calcular altura total necessária com altura base
      let totalRequiredHeight = 0
      
      // Primeiro, calcular altura de cada item baseado na descrição
      menu.menuItems.forEach((item) => {
        const words = item.description.split(' ')
        const maxWidth = contentWidth - 250
        let line = ''
        let lineCount = 0
        
        ctx.font = '16px Arial, sans-serif'
        
        for (let n = 0; n < words.length && lineCount < 2; n++) {
          const testLine = line + words[n] + ' '
          const metrics = ctx.measureText(testLine)
          const testWidth = metrics.width
          
          if (testWidth > maxWidth && n > 0 && lineCount < 1) {
            line = words[n] + ' '
            lineCount++
          } else {
            line = testLine
          }
        }
        
        if (line.trim() && lineCount < 2) {
          lineCount++
        }
        
        const itemHeight = baseItemHeight + (lineCount > 1 ? 20 : 0)
        totalRequiredHeight += itemHeight
      })
      
      // Calcular espaçamento adaptativo
      const totalSpacingNeeded = (totalItems - 1) * minItemSpacing
      const totalContentHeight = totalRequiredHeight + totalSpacingNeeded
      
      const finalItemSpacing = totalContentHeight <= availableHeight 
        ? Math.min(maxItemSpacing, (availableHeight - totalRequiredHeight) / (totalItems - 1))
        : minItemSpacing

      // Calcular a altura total real do conteúdo com o espaçamento final
      const finalContentHeight = totalRequiredHeight + ((totalItems - 1) * finalItemSpacing)
      
      // Calcular offset para centralizar verticalmente
      const verticalOffset = (availableHeight - finalContentHeight) / 2
      const centeredStartY = menuAreaStart + Math.max(0, verticalOffset)

      // Itens do menu com posicionamento responsivo e centralizado
      let currentY = centeredStartY
      
      // Ordenar itens por preço em ordem decrescente (maior para menor)
      const sortedMenuItems = [...menu.menuItems].sort((a, b) => b.price - a.price)
      
      sortedMenuItems.forEach((item) => {
        const baseItemHeight = 60
        const itemY = currentY

        // Calcular quantas linhas a descrição terá (máximo 2)
        const words = item.description.split(' ')
        const maxWidth = contentWidth - 250
        let line = ''
        let lineCount = 0
        const descriptionLines: string[] = []
        
        ctx.font = '16px Arial, sans-serif'
        
        for (let n = 0; n < words.length && lineCount < 2; n++) {
          const testLine = line + words[n] + ' '
          const metrics = ctx.measureText(testLine)
          const testWidth = metrics.width
          
          if (testWidth > maxWidth && n > 0 && lineCount < 1) {
            descriptionLines.push(line.trim())
            line = words[n] + ' '
            lineCount++
          } else {
            line = testLine
          }
        }
        
        if (line.trim() && lineCount < 2) {
          descriptionLines.push(line.trim())
        }
        
        // Calcular altura do item baseado no número de linhas da descrição
        const itemHeight = baseItemHeight + (descriptionLines.length > 1 ? 20 : 0)

        // Fundo branco com 80% de transparência para cada item com cantos arredondados
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'
        ctx.beginPath()
        ctx.roundRect(contentStartX - 10, itemY - 15, contentWidth + 10, itemHeight + 10, 50)
        ctx.fill()

        // Nome do prato
        ctx.font = 'bold 22px Arial, sans-serif'
        ctx.fillStyle = '#000000'
        ctx.textAlign = 'left'
        ctx.fillText(item.name, contentStartX + 25, itemY + 20)

        // Descrição do prato com máximo de 2 linhas
        ctx.font = '16px Arial, sans-serif'
        ctx.fillStyle = '#333333'
        
        for (let i = 0; i < descriptionLines.length; i++) {
          ctx.fillText(descriptionLines[i], contentStartX + 25, itemY + 45 + (i * 18))
        }

        // Preço
        ctx.font = 'bold 20px Arial, sans-serif'
        ctx.fillStyle = '#d32f2f'
        ctx.textAlign = 'right'
        ctx.fillText(formatPrice(item.price), contentStartX + contentWidth - 25, itemY + 25)

        currentY += itemHeight + finalItemSpacing
      })

      // Rodapé com informações - altura de 140px começando de baixo
      ctx.fillStyle = 'rgba(0, 0, 0, 0)' // Fundo muito sutil apenas para separação
      ctx.fillRect(0, footerStartY, canvasWidth, footerHeight)

      // Informações do rodapé com letras brancas e destaques coloridos
      ctx.textAlign = 'center'
      
      // Taxa de entrega
      ctx.font = 'bold 30px Arial, sans-serif'
      ctx.fillStyle = '#ffffff'
      ctx.fillText('Taxa de entrega', canvasWidth / 1.7, footerStartY + 85)
      
      ctx.font = 'bold 30px Arial, sans-serif'
      ctx.fillStyle = '#ffd700' // Dourado para destaque
      ctx.fillText(formatPrice(menu.deliveryTax), canvasWidth / 1.7, footerStartY + 115)

      // Entregas
      ctx.font = 'bold 30px Arial, sans-serif'
      ctx.fillStyle = '#ffffff'
      ctx.fillText('Dia das entregas', canvasWidth / 7, footerStartY + 85)
      
      ctx.font = 'bold 30px Arial, sans-serif'
      ctx.fillStyle = '#4caf50' // Verde para destaque
      ctx.fillText(menu.deliveryDay, canvasWidth / 7, footerStartY + 115)

      // Pedidos WhatsApp
      ctx.font = 'bold 30px Arial, sans-serif'
      ctx.fillStyle = '#ffffff'
      ctx.fillText('Pedidos até', canvasWidth / 2.7, footerStartY + 85)
      
      ctx.font = 'bold 30px Arial, sans-serif'
      ctx.fillStyle = '#ff9800' // Laranja para destaque
      ctx.fillText(`${menu.whatsappOrderDay} ${menu.whatsappOrderTime}`, canvasWidth / 2.7, footerStartY + 115)
    }
    
    drawMenu()
  }, [menu, contentStartX, contentWidth, footerStartY, footerHeight, canvasWidth, canvasHeight])

  const handleDownloadImage = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement('a')
    link.download = `cardapio-${menu.createdAt.toISOString().split('T')[0]}.png`
    link.href = canvas.toDataURL('image/png', 1.0)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
        className="border border-gray-300 shadow-lg rounded-lg"
        style={{ maxWidth: '100%', height: 'auto' }}
      />

      <button
        onClick={handleDownloadImage}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:scale-105 hover:-translate-y-1"
      >
        📥 Baixar Imagem PNG
      </button>
    </div>
  )
}

export default MenuCanvas
