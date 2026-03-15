import type { FC } from 'react'

import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js'
import { Radar } from 'react-chartjs-2'

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

type Props = {
  acidity: number
  flavor: number
  body: number
  bitterness: number
  sweetness: number
}

export const BeanTasteChart: FC<Props> = (props) => {
  const { acidity, flavor, body, bitterness, sweetness } = props

  // データの設定
  const data = {
    //  各項目のラベル(上から時計回り)
    labels: ['酸味', 'フレーバー', 'ボディ', '苦味', '甘味'],
    datasets: [
      {
        // 数値
        data: [acidity, flavor, body, bitterness, sweetness],
        // 塗りつぶし
        fill: true,
        // 背景色
        backgroundColor: 'rgba(99, 102, 241, 0.2)', // indigo-500
        // 枠線色
        borderColor: 'rgb(99, 102, 241)',
        // ポイントを塗りつぶす色
        pointBackgroundColor: 'rgb(99, 102, 241)',
        // ポイントの枠線色
        pointBorderColor: '#fff',
        // ホバー時のポイントの背景色
        pointHoverBackgroundColor: '#fff',
        // ホバー時のポイントの枠線色
        pointHoverBorderColor: 'rgb(99, 102, 241)',
      },
    ],
  }

  // オプションの設定
  const options = {
    // 凡例の設定
    plugins: {
      legend: {
        display: false,
      },
    },
    // メモリの設定
    scales: {
      r: {
        angleLines: {
          display: false,
        },
        max: 5,
        min: 0,
        ticks: {
          stepSize: 1,
        },
      },
    },
    elements: {
      line: {
        /* 枠線の太さ */
        borderWidth: 2,
      },
    },
  }
  return <Radar data={data} options={options} />
}
