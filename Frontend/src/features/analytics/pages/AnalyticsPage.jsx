import { motion } from 'framer-motion'
import { Eye, Users, Clock, Globe } from 'lucide-react'
import StatsCard from '@features/dashboard/components/StatsCard'
import AreaChart from '@components/charts/AreaChart'
import BarChart from '@components/charts/BarChart'
import PieChart from '@components/charts/PieChart'
import { GlassCard } from '@components/ui/Card'

// Sample analytics data
const pageViewsData = [
  { name: 'Jan', value: 12000 },
  { name: 'Feb', value: 19000 },
  { name: 'Mar', value: 15000 },
  { name: 'Apr', value: 22000 },
  { name: 'May', value: 18000 },
  { name: 'Jun', value: 25000 },
]

const deviceData = [
  { name: 'Desktop', value: 65 },
  { name: 'Mobile', value: 30 },
  { name: 'Tablet', value: 5 },
]

const trafficSourceData = [
  { name: 'Organic', value: 45 },
  { name: 'Direct', value: 25 },
  { name: 'Social', value: 20 },
  { name: 'Referral', value: 10 },
]

const bounceRateData = [
  { name: 'Mon', value: 35 },
  { name: 'Tue', value: 42 },
  { name: 'Wed', value: 38 },
  { name: 'Thu', value: 45 },
  { name: 'Fri', value: 32 },
  { name: 'Sat', value: 28 },
  { name: 'Sun', value: 40 },
]

const AnalyticsPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold gradient-text mb-2">Analytics</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Detailed insights into your website performance and user behavior.
        </p>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Page Views"
          value="125,432"
          change="+15.3%"
          changeType="positive"
          icon={Eye}
        />
        <StatsCard
          title="Unique Visitors"
          value="45,678"
          change="+8.7%"
          changeType="positive"
          icon={Users}
        />
        <StatsCard
          title="Avg. Session"
          value="3m 24s"
          change="+12.1%"
          changeType="positive"
          icon={Clock}
        />
        <StatsCard
          title="Bounce Rate"
          value="34.2%"
          change="-5.4%"
          changeType="positive"
          icon={Globe}
        />
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AreaChart
          data={pageViewsData}
          title="Page Views Trend"
          dataKey="value"
          height={350}
        />
        <BarChart
          data={bounceRateData}
          title="Bounce Rate by Day"
          dataKey="value"
          height={350}
        />
      </div>

      {/* Secondary Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PieChart
          data={deviceData}
          title="Device Usage"
          height={300}
        />
        <PieChart
          data={trafficSourceData}
          title="Traffic Sources"
          height={300}
        />
      </div>

      {/* Real-time Analytics */}
      <GlassCard className="p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            Real-time Analytics
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <motion.div
                className="text-3xl font-bold text-green-500 mb-2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
              >
                247
              </motion.div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Active Users</p>
            </div>
            
            <div className="text-center">
              <motion.div
                className="text-3xl font-bold text-blue-500 mb-2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6, type: "spring" }}
              >
                1,234
              </motion.div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Page Views Today</p>
            </div>
            
            <div className="text-center">
              <motion.div
                className="text-3xl font-bold text-purple-500 mb-2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.7, type: "spring" }}
              >
                89%
              </motion.div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Server Uptime</p>
            </div>
          </div>
        </motion.div>
      </GlassCard>
    </motion.div>
  )
}

export default AnalyticsPage