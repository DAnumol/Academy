import { motion } from 'framer-motion';
import FeeManagementTable from '../components/FeeManagementTable';

const FeeManagementPage = () => {
   return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* User Table */}
      <FeeManagementTable />
    </motion.div>
  )
}
export default FeeManagementPage;
