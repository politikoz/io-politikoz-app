import { useMutation } from '@tanstack/react-query';
import api from '@/app/lib/api';
import { CreateUserResponse } from '@/types/user';
import { useCallback } from "react";

export function useCreateUser() {
  const createUserMutation = useMutation({
    mutationFn: async (stakeAddress: string) => {
      const response = await api.post<CreateUserResponse>(
        `/connect?stakeAddress=${stakeAddress}`,
        {}
      );
      return response.data;
    }
  });

  const createUser = useCallback(async (stakeAddress: string) => {
    try {
      await createUserMutation.mutateAsync(stakeAddress);
      return true;
    } catch (error) {      
      return false;
    }
  }, [createUserMutation]);

  return {
    createUser,
    isCreating: createUserMutation.isPending,
    error: createUserMutation.error
  };
}