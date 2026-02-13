import { useEffect, useRef } from 'react'
import { createChart, type IChartApi, type ISeriesApi, ColorType } from 'lightweight-charts'
import type { Candle } from '../../types'
import { lineColor, gradientTopColor, gradientBottomColor, COLORS } from '../../utils/colors'

interface PriceChartProps {
  candles: Candle[]
  loading: boolean
}

export function PriceChart({ candles, loading }: PriceChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<IChartApi | null>(null)
  const seriesRef = useRef<ISeriesApi<'Area'> | null>(null)

  // Create chart once
  useEffect(() => {
    if (!containerRef.current) return

    const chart = createChart(containerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: COLORS.background },
        textColor: COLORS.textSecondary,
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
      },
      grid: {
        vertLines: { visible: false },
        horzLines: { visible: false },
      },
      crosshair: {
        vertLine: { color: 'rgba(255,255,255,0.2)', width: 1, style: 3 },
        horzLine: { color: 'rgba(255,255,255,0.2)', width: 1, style: 3 },
      },
      rightPriceScale: {
        borderVisible: false,
        scaleMargins: { top: 0.1, bottom: 0.05 },
      },
      timeScale: {
        borderVisible: false,
        timeVisible: true,
        secondsVisible: false,
      },
      handleScroll: { vertTouchDrag: false },
      handleScale: { axisPressedMouseMove: false },
    })

    const series = chart.addAreaSeries({
      lineWidth: 2,
      crosshairMarkerRadius: 4,
      crosshairMarkerBorderWidth: 1,
      crosshairMarkerBorderColor: '#FFFFFF',
    })

    chartRef.current = chart
    seriesRef.current = series

    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect
        chart.resize(width, height)
      }
    })
    resizeObserver.observe(containerRef.current)

    return () => {
      resizeObserver.disconnect()
      chart.remove()
      chartRef.current = null
      seriesRef.current = null
    }
  }, [])

  // Update data
  useEffect(() => {
    if (!seriesRef.current || candles.length === 0) return

    const firstClose = candles[0].close
    const lastClose = candles[candles.length - 1].close
    const change = lastClose - firstClose

    const data = candles.map(c => ({
      time: c.time as any,
      value: c.close,
    }))

    seriesRef.current.setData(data)
    seriesRef.current.applyOptions({
      lineColor: lineColor(change),
      topColor: gradientTopColor(change),
      bottomColor: gradientBottomColor(change),
      crosshairMarkerBackgroundColor: lineColor(change),
    })

    chartRef.current?.timeScale().fitContent()
  }, [candles])

  return (
    <div className="relative w-full" style={{ height: '40vh', minHeight: '250px' }}>
      {loading && candles.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="w-8 h-8 border-2 border-[#34C759] border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      <div ref={containerRef} className="w-full h-full" />
    </div>
  )
}
