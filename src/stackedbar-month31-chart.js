import React from 'react'
import { View } from 'react-native'
import { G, Rect, Svg, Text } from 'react-native-svg'
import AbstractChart from './abstract-chart'

const barWidth = 32

class StackedMonth31BarChart extends AbstractChart {
  getBarPercentage = () => {
    const { barPercentage = 1 } = this.props.chartConfig
    return barPercentage
  }

  getBarRadius = (ret, x) => {
    return this.props.chartConfig.barRadius && ret.length === x.length - 1
      ? this.props.chartConfig.barRadius
      : 0
  }

  renderBars = config => {
    const {
      data,
      width,
      height,
      paddingTop,
      paddingRight,
      border,
      colors
    } = config
    return data.map((x, i) => {
      const barWidth = 30 * this.getBarPercentage()
      const ret = []
      let h = 0
      let st = paddingTop
      for (let z = 0; z < x.length; z++) {
        h = (height - 55) * (x[z] / 35)
        const y = (height / 4) * 3 - h + st
        const xC =
          (paddingRight / 2 +
            (i * (width - paddingRight)) / data.length +
            barWidth / 2) *
          0.88
        ret.push(
          <Rect
            key={Math.random()}
            x={xC}
            y={y}
            rx={this.getBarRadius(ret, x)}
            ry={this.getBarRadius(ret, x)}
            width={barWidth}
            height={h}
            fill={colors[z]}
          />
        )
        if (!this.props.hideLegend) {
          if (x[z] > 1) {
            ret.push(
              <Text
                style={{ fontSize: 2 }}
                key={Math.random()}
                x={x[z] > 9 ? (xC + 7 + barWidth / 2) : (xC + 4 + barWidth / 2)}
                textAnchor="end"
                y={h > 15 ? y + 14 : y + 5}
                {...this.getPropsForLabels()}
              >
                {x[z]}
              </Text>
            )
          }
        }

        st -= h
      }

      return ret
    })
  }

  renderLegend = config => {
    const { legend, colors, width, height } = config
    return legend.map((x, i) => {
      return (
        <G key={Math.random()}>
          <Rect
            width="16px"
            height="16px"
            fill={colors[i]}
            rx={8}
            ry={8}
            x={width * 0.86}
            y={height * 0.68 - i * 50}
          />
          <Text
            x={width * 0.91}
            y={height * 0.72 - i * 50}
            {...this.getPropsForLabels()}
          >
            {x}
          </Text>
        </G>
      )
    })
  }

  render() {
    const paddingTop = 15
    const paddingRight = 32
    const {
      width,
      height,
      style = {},
      data,
      withHorizontalLabels = true,
      withVerticalLabels = true,
      segments = 4,
      decimalPlaces
    } = this.props
    const { borderRadius = 0 } = style
    const config = {
      width,
      height
    }
    let border = 0
    for (let i = 0; i < data.data.length; i++) {
      const actual = data.data[i].reduce((pv, cv) => pv + cv, 0)
      if (actual > border) {
        border = actual
      }
    }
    return (
      <View style={style}>
        <Svg height={height} width={width}>
          {this.renderDefs({
            ...config,
            ...this.props.chartConfig
          })}
          <Rect
            width="100%"
            height={height}
            rx={borderRadius}
            ry={borderRadius}
            fill="url(#backgroundGradient)"
          />
          <G>
            {this.renderHorizontalLines({
              ...config,
              count: segments,
              paddingTop,
              width,
              height,
              paddingRight
            })}
          </G>
          <G>
            {withHorizontalLabels
              ? this.renderHorizontalLabels({
                ...config,
                count: segments,
                data: [0, 32],
                paddingTop: paddingTop,
                paddingRight,
                decimalPlaces
              })
              : null}
          </G>
          <G>
            {withVerticalLabels
              ? this.renderVerticalLabels({
                ...config,
                labels: data.labels,
                paddingRight: paddingRight + 27,
                stackedBar: true,
                paddingTop,
                horizontalOffset: barWidth
              })
              : null}
          </G>
          <G>
            {this.renderBars({
              ...config,
              data: data.data,
              border,
              colors: this.props.data.barColors,
              paddingTop,
              paddingRight: paddingRight + 27
            })}
          </G>
          {this.renderLegend({
            ...config,
            legend: data.legend,
            colors: this.props.data.barColors
          })}
        </Svg>
      </View>
    )
  }
}

export default StackedMonth31BarChart
