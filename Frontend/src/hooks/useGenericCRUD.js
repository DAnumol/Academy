import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'

export const useGenericCRUD = (config) => {
  const {
    queryKey,
    service,
    messages = {
      create: 'Item created successfully!',
      update: 'Item updated successfully!',
      delete: 'Item deleted successfully!',
      createError: 'Failed to create item',
      updateError: 'Failed to update item',
      deleteError: 'Failed to delete item'
    }
  } = config

  const queryClient = useQueryClient()

  // Fetch data
  const useList = (filters = {}) => {
    return useQuery({
      queryKey: [queryKey, 'list', filters],
      queryFn: () => service.getAll(filters),
      staleTime: 0,
      retry: 2,
    })
  }

  // Create mutation
  const useCreate = () => {
    return useMutation({
      mutationFn: service.create,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [queryKey] })
        toast.success(messages.create)
      },
      onError: () => {
        toast.error(messages.createError)
      },
    })
  }

  // Update mutation
  const useUpdate = () => {
    return useMutation({
      mutationFn: ({ id, ...data }) => service.update(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [queryKey] })
        toast.success(messages.update)
      },
      onError: () => {
        toast.error(messages.updateError)
      },
    })
  }

  // Delete mutation
  const useDelete = () => {
    return useMutation({
      mutationFn: service.delete,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [queryKey] })
        toast.success(messages.delete)
      },
      onError: () => {
        toast.error(messages.deleteError)
      },
    })
  }

  return {
    useList,
    useCreate,
    useUpdate,
    useDelete
  }
}