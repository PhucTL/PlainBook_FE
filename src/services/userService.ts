/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * User Service - Authentication & User Management
 * Sử dụng useApiFactory để tạo React Query hooks
 */

import {
  createMainMutationHook,
  createMainQueryWithPathParamHook,
  mainApiHooks,
  updateMainMutationHook,
} from "@/hooks/useApiFactory";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/config/axios";
import axios from "axios";

// ============================================
// AUTHENTICATION SERVICES
// ============================================

/**
 * Hook đăng nhập
 * @returns UseMutationResult
 * @example
 * const loginMutation = useUserServices();
 * loginMutation.mutate({ email: "test@example.com", password: "123456" });
 */
export const useUserServices = () =>
  createMainMutationHook("user-login", API_ENDPOINTS.AUTH.LOGIN)();

/**
 * Hook đăng ký tài khoản
 * @returns UseMutationResult
 */
export const useRegisterService = () =>
  createMainMutationHook("user-register", API_ENDPOINTS.AUTH.REGISTER)();

/**
 * Hook đăng nhập bằng Google
 * @returns UseMutationResult
 */
export const useLoginGoogleService = () =>
  createMainMutationHook("user-login-google", API_ENDPOINTS.AUTH.LOGIN_GOOGLE)();

/**
 * Hook đăng xuất
 * @returns UseMutationResult
 * @example
 * const logoutMutation = useLogoutService();
 * logoutMutation.mutate({ refreshToken: "your-refresh-token" });
 */
export const useLogoutService = () =>
  createMainMutationHook("user-logout", API_ENDPOINTS.AUTH.LOGOUT)();

/**
 * Hook verify user với token
 * @param token - Token verify từ email
 * @returns UseQueryResult
 */
export const useVerifyUserService = (token?: string) => {
  return useQuery({
    queryKey: ["verify-user", token],
    queryFn: async () => {
      const response = await axios.get(API_ENDPOINTS.AUTH.VERIFY, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      return response.data;
    },
    enabled: !!token,
    retry: false,
  });
};

/**
 * Hook quên mật khẩu - gửi email reset
 * @returns UseMutationResult
 */
export const useForgotPasswordService = () =>
  createMainMutationHook("forgot-password", API_ENDPOINTS.AUTH.FORGOT_PASSWORD)();

/**
 * Hook reset mật khẩu với token
 * @param token - Token từ email reset password
 * @returns UseMutationResult
 */
export const useResetPasswordService = (token?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { password: string }) => {
      const response = await api.patch(
        API_ENDPOINTS.AUTH.RESET_PASSWORD,
        data,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reset-password"] });
    },
  });
};

// ============================================
// USER MANAGEMENT SERVICES
// ============================================

/**
 * Hook lấy danh sách tất cả users với query params động
 * @param dependencies - Array of dependencies cho query key
 * @param options - React Query options
 * @param params - Query parameters (page, limit, search, etc.)
 * @returns UseQueryResult
 * @example
 * const { data, isLoading } = useAllUsersService([], {}, { page: 1, limit: 10 });
 */
export const useAllUsersService = (
  dependencies?: any[],
  options?: any,
  params?: any
) =>
  mainApiHooks.createDynamicQueryHook(
    "all-users",
    API_ENDPOINTS.USERS_MANAGEMENT.BASE
  )(dependencies, options, params);

/**
 * Hook tạo user mới
 * @returns UseMutationResult
 */
export const useCreateUserService = () =>
  createMainMutationHook("all-users", API_ENDPOINTS.USERS_MANAGEMENT.BASE)();

/**
 * Hook cập nhật user (PUT method)
 * @returns UseMutationResult với params { id, data }
 * @example
 * const updateMutation = useUpdateProfileService();
 * updateMutation.mutate({ id: "user-id", data: { fullName: "New Name" } });
 */
export const useUpdateProfileService = () =>
  updateMainMutationHook("user-profile", API_ENDPOINTS.USERS_MANAGEMENT.BASE)();

/**
 * Hook lấy thông tin user theo ID
 * @param id - User ID
 * @param options - React Query options
 * @returns UseQueryResult
 */
export const useUserByIdService = (id?: string, options?: any) =>
  createMainQueryWithPathParamHook(
    "user-by-id",
    API_ENDPOINTS.USERS_MANAGEMENT.BASE
  )(id, options);

// ============================================
// DEPRECATED - Giữ lại để tương thích
// ============================================

/**
 * @deprecated Sử dụng useUpdateProfileService thay thế
 */
export const useUpdateUserStatusService = useUpdateProfileService;
