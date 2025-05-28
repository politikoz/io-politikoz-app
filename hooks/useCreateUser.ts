import { useMutation } from '@tanstack/react-query';
import api from '@/app/lib/api';
import { CreateUserRequest, CreateUserResponse } from '@/types/user';

export function useCreateUser() {
  const createUserMutation = useMutation({
    mutationFn: async (stakeAddress: string) => {
      const response = await api.post<CreateUserResponse>(
        `/api/v1/connect/connect?stakeAddress=${stakeAddress}`,
        {} // empty body since we're using query parameter
      );
      return response.data;
    }
  });

  const createUser = async (stakeAddress: string) => {
    try {
      await createUserMutation.mutateAsync(stakeAddress);
      return true;
    } catch (error) {
      console.error('Failed to create user:', error);
      return false;
    }
  };

  return {
    createUser,
    isCreating: createUserMutation.isPending,
    error: createUserMutation.error
  };
}