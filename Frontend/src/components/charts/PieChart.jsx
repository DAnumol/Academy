import { motion } from 'framer-motion'
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/Card'
import { CHART_COLORS } from '@utils/constants'

const COLORS = [
  CHART_COLORS.primary,
  CHART_COLORS.secondary,
  CHART_COLORS.accent,
  CHART_COLORS.success,
  CHART_COLORS.warning,
  CHART_COLORS.error
]

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0]
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
      >
        <p className="font-medium">{data.name}</p>
        <p style={{ color: data.color }} className="text-sm">
          Value: {data.value}
        </p>
        <p className="text-xs text-gray-500">
          {((data.value / data.payload.total) * 100).toFixed(1)}%
        </p>
      </motion.div>
    )
  }
  return null
}

const PieChart = ({ 
  data, 
  title, 
  height = 300,
  className = ""
}) => {
  // Calculate total for percentage
  const dataWithTotal = data.map(item => ({
    ...item,
    total: data.reduce((sum, d) => sum + d.value, 0)
  }))

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <ResponsiveContainer width="100%" height={height}>
            <RechartsPieChart>
              <Pie
                data={dataWithTotal}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                animationBegin={0}
                animationDuration={800}
              >
                {dataWithTotal.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ fontSize: '12px' }}
                iconType="circle"
              />
            </RechartsPieChart>
          </ResponsiveContainer>
        </motion.div>
      </CardContent>
    </Card>
  )
}

export default PieChart